// cli/commands/batch.ts
// emgine batch [dir] [--format png] [--out path]
// Reads all *.json files in graphics/ (or specified dir), renders each sequentially.
//
// Each JSON file format:
// {
//   "id": "Hero",
//   "props": { "headline": "...", "accentColor": "#7C3AED" },
//   "format": "png",           (optional — falls back to config.defaultFormat)
//   "outPath": "out/hero.png"  (optional — auto-generated from filename if omitted)
// }

import fs from 'fs'
import path from 'path'
import { renderComposition } from '../../src/render.js'
import { config } from '../../emgine.config.js'
import type { OutputFormat } from '../../emgine.config.js'

interface BatchJob {
  id: string
  props?: Record<string, unknown>
  format?: OutputFormat
  outPath?: string
}

export async function commandBatch(args: string[]): Promise<void> {
  const dir = args[0] && !args[0].startsWith('--')
    ? path.resolve(args[0])
    : path.resolve(config.graphicsDir)

  const globalFormat  = getFlagValue(args, '--format') as OutputFormat | undefined
  const globalOutDir  = getFlagValue(args, '--out')

  if (!fs.existsSync(dir)) {
    console.error(`\n❌ Batch directory not found: ${dir}\n`)
    process.exit(1)
  }

  const jsonFiles = fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()

  if (jsonFiles.length === 0) {
    console.log(`\nNo .json files found in ${dir}\n`)
    return
  }

  console.log(`\n🎬 Batch render — ${jsonFiles.length} job(s) from ${dir}\n`)

  type BatchResult = {
    file: string
    status: 'ok' | 'fail'
    outPath?: string
    format?: string
    width?: number
    height?: number
    sizeBytes?: number
    durationMs?: number
    error?: string
  }

  const results: BatchResult[] = []

  for (const file of jsonFiles) {
    const filePath = path.join(dir, file)
    let job: BatchJob

    try {
      job = JSON.parse(fs.readFileSync(filePath, 'utf8')) as BatchJob
    } catch {
      console.error(`  ❌ ${file} — invalid JSON, skipping`)
      results.push({ file, status: 'fail', error: 'Invalid JSON' })
      continue
    }

    if (!job.id) {
      console.error(`  ❌ ${file} — missing "id" field, skipping`)
      results.push({ file, status: 'fail', error: 'Missing "id" field' })
      continue
    }

    const format  = globalFormat ?? job.format ?? config.defaultFormat
    const outPath = job.outPath
      ? path.resolve(job.outPath)
      : path.join(globalOutDir ? path.resolve(globalOutDir) : path.resolve(config.outDir),
          `${path.basename(file, '.json')}.${format === 'pdf-vector' ? 'pdf' : format}`)

    process.stdout.write(`  ⏳ ${job.id} (${file})...`)

    try {
      const result = await renderComposition({
        id: job.id,
        props: job.props,
        format,
        outPath,
        preview: false,
      })

      console.log(` ✅ ${result.outPath} (${formatBytes(result.sizeBytes)}, ${result.durationMs}ms)`)
      results.push({
        file,
        status: 'ok',
        outPath: result.outPath,
        format: result.format,
        width: result.width,
        height: result.height,
        sizeBytes: result.sizeBytes,
        durationMs: result.durationMs,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      console.log(` ❌ ${message}`)
      results.push({ file, status: 'fail', error: message })
    }
  }

  const ok   = results.filter((r) => r.status === 'ok').length
  const fail = results.filter((r) => r.status === 'fail').length

  console.log(`\n─────────────────────────────────────────`)
  console.log(`Batch complete: ${ok} rendered, ${fail} failed`)
  if (fail > 0) {
    console.log('\nFailed jobs:')
    results.filter((r) => r.status === 'fail').forEach((r) => {
      console.log(`  ❌ ${r.file}: ${r.error}`)
    })
  }
  console.log('')
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined
}

function formatBytes(bytes: number): string {
  if (!bytes) return '?'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
