// cli/commands/render.ts
// emgine render <id> [--format png|jpg|webp|tiff|svg|pdf|pdf-vector] [--props '{"k":"v"}'] [--out path] [--quality 90]

import { renderComposition } from '../../src/render.js'
import type { OutputFormat } from '../../emgine.config.js'

export async function commandRender(args: string[]): Promise<void> {
  const id = args[0]
  if (!id) {
    console.error('Usage: emgine render <id> [--format png] [--props \'{"k":"v"}\'] [--out path]')
    process.exit(1)
  }

  const format   = getFlagValue(args, '--format') as OutputFormat | undefined
  const propsRaw = getFlagValue(args, '--props')
  const outPath  = getFlagValue(args, '--out')
  const quality  = getFlagValue(args, '--quality')

  let props: Record<string, unknown> | undefined
  if (propsRaw) {
    try {
      props = JSON.parse(propsRaw)
    } catch {
      console.error('--props must be valid JSON. Example: --props \'{"headline":"Hello"}\'')
      process.exit(1)
    }
  }

  try {
    const result = await renderComposition({
      id,
      format,
      props,
      outPath: outPath ?? undefined,
      quality: quality ? Number(quality) : undefined,
      preview: false,
    })

    console.log(`\n✅ Rendered: ${result.outPath}`)
    console.log(`   Format:   ${result.format.toUpperCase()}`)
    console.log(`   Size:     ${result.width} × ${result.height}px`)
    console.log(`   File:     ${formatBytes(result.sizeBytes)}`)
    console.log(`   Time:     ${result.durationMs}ms\n`)
  } catch (err) {
    console.error(`\n❌ ${(err as Error).message}\n`)
    process.exit(1)
  }
}

function getFlagValue(args: string[], flag: string): string | undefined {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : undefined
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}
