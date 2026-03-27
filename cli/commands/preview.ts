// cli/commands/preview.ts
// emgine preview <id> [--format png] [--props '{"k":"v"}']
// Renders to out/preview/ with DRAFT watermark. Does not write to out/.

import { renderComposition } from '../../src/render.js'
import type { OutputFormat } from '../../emgine.config.js'

export async function commandPreview(args: string[]): Promise<void> {
  const id = args[0]
  if (!id) {
    console.error('Usage: emgine preview <id> [--format png] [--props \'{"k":"v"}\']')
    process.exit(1)
  }

  const format   = getFlagValue(args, '--format') as OutputFormat | undefined
  const propsRaw = getFlagValue(args, '--props')

  let props: Record<string, unknown> | undefined
  if (propsRaw) {
    try {
      props = JSON.parse(propsRaw)
    } catch {
      console.error('--props must be valid JSON.')
      process.exit(1)
    }
  }

  try {
    const result = await renderComposition({
      id,
      format,
      props,
      preview: true,
    })

    console.log(`\n🔍 Preview: ${result.outPath}`)
    console.log(`   Format:  ${result.format.toUpperCase()}`)
    console.log(`   Size:    ${result.width} × ${result.height}px`)
    console.log(`   File:    ${formatBytes(result.sizeBytes)}`)
    console.log(`   Time:    ${result.durationMs}ms`)
    console.log(`\n   Run "emgine render ${id}" to produce the final output.\n`)
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
