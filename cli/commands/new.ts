// cli/commands/new.ts
// Scaffolds a new composition: TSX stub, Root.tsx registration, graphics/ batch job.
//
// Usage:
//   emgine new <CompositionId> [width] [height]
//   emgine new <CompositionId>              ← prompts with size presets
//
// Examples:
//   emgine new HeroCard                     ← interactive size picker
//   emgine new HeroCard 1200 630            ← explicit dimensions

import fs from 'fs'
import path from 'path'
import readline from 'readline'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..', '..')

// ── Size presets ──────────────────────────────────────────────────────────────
// Subset of SIZES from emgine.config.ts — most relevant for portfolio work.
// Keep in sync with emgine.config.ts if you add presets there.
const PRESETS = [
  { key: '1', name: 'THUMBNAIL',       width: 432,  height: 324,  label: 'Upwork / portfolio thumbnail' },
  { key: '2', name: 'OG_IMAGE',        width: 1200, height: 630,  label: 'Open Graph / link preview' },
  { key: '3', name: 'UI_MOCKUP',       width: 1200, height: 2950, label: 'Full UI mockup / screenshot compilation' },
  { key: '4', name: 'STORY',           width: 1080, height: 1920, label: 'Instagram / TikTok story' },
  { key: '5', name: 'INSTAGRAM_SQ',    width: 1080, height: 1080, label: 'Instagram square post' },
  { key: '6', name: 'INSTAGRAM_PORT',  width: 1080, height: 1350, label: 'Instagram portrait post' },
  { key: '7', name: 'YOUTUBE_THUMB',   width: 1280, height: 720,  label: 'YouTube thumbnail' },
  { key: '8', name: 'LINKEDIN',        width: 1200, height: 627,  label: 'LinkedIn post image' },
  { key: '9', name: 'BANNER_HALF',     width: 300,  height: 250,  label: 'Display ad — medium rectangle (IAB)' },
] as const

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise(resolve => rl.question(question, answer => { rl.close(); resolve(answer.trim()) }))
}

async function pickSize(): Promise<{ width: number; height: number }> {
  console.log('\nWhich size?\n')
  for (const p of PRESETS) {
    console.log(`  ${p.key}.  ${p.name.padEnd(16)} ${String(p.width).padStart(4)}×${String(p.height).padEnd(4)}  ${p.label}`)
  }
  console.log(`  c.  custom           enter your own width × height\n`)

  const answer = await prompt('Enter number or "c": ')

  if (answer === 'c' || answer === 'C') {
    const w = await prompt('Width (px):  ')
    const h = await prompt('Height (px): ')
    const width  = parseInt(w, 10)
    const height = parseInt(h, 10)
    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
      console.error('\nInvalid dimensions. Must be positive integers.\n')
      process.exit(1)
    }
    return { width, height }
  }

  const preset = PRESETS.find(p => p.key === answer)
  if (!preset) {
    console.error(`\nInvalid choice: "${answer}"\n`)
    process.exit(1)
  }
  return { width: preset.width, height: preset.height }
}

export async function commandNew(args: string[]) {
  // ── Arg parsing ────────────────────────────────────────────────────────────
  const id = args[0]

  if (!id) {
    console.error('\nUsage: emgine new <CompositionId> [width] [height]\n')
    console.error('  CompositionId must be PascalCase (e.g. HeroCard, InstagramPost)\n')
    process.exit(1)
  }

  // ── Validate ID ────────────────────────────────────────────────────────────
  if (!/^[A-Z][A-Za-z0-9]+$/.test(id)) {
    console.error(`\nInvalid id: "${id}"`)
    console.error('  CompositionId must be PascalCase (e.g. HeroCard, not heroCard or hero-card)\n')
    process.exit(1)
  }

  const srcFile      = path.join(ROOT, 'src', `${id}.tsx`)
  const graphicsFile = path.join(ROOT, 'graphics', `${id}.json`)
  const rootFile     = path.join(ROOT, 'src', 'Root.tsx')

  if (fs.existsSync(srcFile)) {
    console.error(`\nComposition already exists: src/${id}.tsx`)
    console.error('  Choose a different name or delete the existing file first.\n')
    process.exit(1)
  }

  // ── Resolve dimensions ─────────────────────────────────────────────────────
  let width: number
  let height: number

  if (args[1] && args[2]) {
    // Explicit dimensions passed
    width  = parseInt(args[1], 10)
    height = parseInt(args[2], 10)
    if (isNaN(width) || width <= 0 || isNaN(height) || height <= 0) {
      console.error(`\nInvalid dimensions: ${args[1]} × ${args[2]}`)
      console.error('  Width and height must be positive integers.\n')
      process.exit(1)
    }
  } else {
    // Interactive size picker
    const size = await pickSize()
    width  = size.width
    height = size.height
  }

  // ── 1. Generate src/<id>.tsx ───────────────────────────────────────────────
  const tsxContent = `// src/${id}.tsx
import React from 'react'
import { brand } from '../brand.config.js'

interface Props {
  title?: string
}

export function ${id}({ title = '${id}' }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        backgroundColor: brand.colors.bg,
        padding: brand.spacing.xl,
        gap: brand.spacing.md,
      }}
    >
      {/* Accent bar */}
      <div
        style={{
          display: 'flex',
          width: 48,
          height: 3,
          backgroundColor: brand.colors.primary,
          borderRadius: brand.radii.full,
        }}
      />

      {/* Title */}
      <div
        style={{
          display: 'flex',
          color: brand.colors.text,
          fontSize: 48,
          fontFamily: brand.fonts.heading,
          fontWeight: 700,
          lineHeight: 1.2,
        }}
      >
        {title}
      </div>

      {/* Subtitle placeholder */}
      <div
        style={{
          display: 'flex',
          color: brand.colors.textMuted,
          fontSize: 18,
          fontFamily: brand.fonts.body,
          fontWeight: 400,
        }}
      >
        Edit src/${id}.tsx to build this composition
      </div>
    </div>
  )
}
`

  fs.writeFileSync(srcFile, tsxContent, 'utf8')
  console.log(`\n  created  src/${id}.tsx`)

  // ── 2. Patch src/Root.tsx ──────────────────────────────────────────────────
  let rootContent = fs.readFileSync(rootFile, 'utf8')

  const lastImportMatch = rootContent.match(/^import .+$/gm)
  if (!lastImportMatch) {
    console.error('\nCould not find import statements in src/Root.tsx — patch skipped.')
  } else {
    const lastImport = lastImportMatch[lastImportMatch.length - 1]
    rootContent = rootContent.replace(lastImport, `${lastImport}\nimport { ${id} } from './${id}.js'`)
  }

  const compositionEntry = `
    // ── ${id} ─────────────────────────────────────────────────────────────────
    Composition({
      id: '${id}',
      component: ${id},
      width: ${width},
      height: ${height},
      defaultProps: {
        title: '${id}',
      },
    }),`

  rootContent = rootContent.replace(/(\n  \]\n\})\s*$/, `${compositionEntry}\n  ]\n}\n`)

  fs.writeFileSync(rootFile, rootContent, 'utf8')
  console.log(`  patched  src/Root.tsx`)

  // ── 3. Generate graphics/<id>.json ────────────────────────────────────────
  const graphicsDir = path.join(ROOT, 'graphics')
  if (!fs.existsSync(graphicsDir)) {
    fs.mkdirSync(graphicsDir, { recursive: true })
  }

  const batchJob = JSON.stringify({ id, format: 'png' }, null, 2)
  fs.writeFileSync(graphicsFile, batchJob, 'utf8')
  console.log(`  created  graphics/${id}.json`)

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log(`
Composition "${id}" scaffolded at ${width}×${height}px.

Next steps:
  1. Edit src/${id}.tsx       — build your design
  2. npm run preview ${id}    — draft render (with DRAFT watermark)
  3. npm run render ${id}     — final render to out/${id}.png
  4. npm run batch            — renders all jobs in graphics/
`)
}
