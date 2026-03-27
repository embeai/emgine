#!/usr/bin/env tsx
// cli/index.ts
// Emgine CLI entry point.
// Mirrors Remotion's CLI: emgine render | preview | batch | list

import { commandRender }  from './commands/render.js'
import { commandPreview } from './commands/preview.js'
import { commandBatch }   from './commands/batch.js'
import { commandList }    from './commands/list.js'

const [,, command, ...args] = process.argv

const HELP = `
Emgine — static graphics renderer

Usage:
  emgine render  <id> [--format png|jpg|webp|tiff|svg|pdf|pdf-vector] [--props '{"k":"v"}'] [--out path] [--quality 90]
  emgine preview <id> [--format png] [--props '{"k":"v"}']
  emgine batch   [dir] [--format png] [--out path]
  emgine list

Commands:
  render   Render a composition to out/
  preview  Render a draft to out/preview/ with DRAFT watermark
  batch    Render all jobs from graphics/*.json sequentially
  list     List all registered compositions

Examples:
  emgine render Hero
  emgine render Hero --format pdf
  emgine render Hero --format pdf-vector
  emgine render Hero --props '{"headline":"Launch Day"}' --format webp
  emgine preview Hero
  emgine batch
  emgine batch ./graphics --format jpg
  emgine list
`

switch (command) {
  case 'render':
    await commandRender(args)
    break
  case 'preview':
    await commandPreview(args)
    break
  case 'batch':
    await commandBatch(args)
    break
  case 'list':
    commandList()
    break
  case undefined:
  case '--help':
  case '-h':
    console.log(HELP)
    break
  default:
    console.error(`\nUnknown command: "${command}"`)
    console.log(HELP)
    process.exit(1)
}
