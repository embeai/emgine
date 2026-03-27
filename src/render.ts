// src/render.ts
// Core render pipeline: JSX composition → SVG → PNG / JPG / WebP / TIFF / SVG / PDF
// Stack: Satori (JSX→SVG) + Sharp (SVG→raster) + pdfkit (raster PDF) + jsPDF/svg2pdf (vector PDF)

import satori from 'satori'
import sharp from 'sharp'
import PDFDocument from 'pdfkit'
import { jsPDF } from 'jspdf'
import fs from 'fs'
import path from 'path'
import { createElement } from 'react'
import { getComposition } from './composition.js'
import { config } from '../emgine.config.js'
import type { OutputFormat } from '../emgine.config.js'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RenderOptions {
  id: string
  props?: Record<string, unknown>
  format?: OutputFormat
  outPath?: string
  preview?: boolean
  quality?: number
}

export interface RenderResult {
  outPath: string
  format: OutputFormat
  width: number
  height: number
  durationMs: number
  sizeBytes: number
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------

export class CompositionNotFoundError extends Error {
  constructor(id: string, available: string[]) {
    super(
      `Composition "${id}" not found.\nAvailable: ${available.length ? available.join(', ') : '(none registered)'}`
    )
    this.name = 'CompositionNotFoundError'
  }
}

export class FontLoadError extends Error {
  constructor(filePath: string) {
    super(`Font file not found: ${filePath}\nAdd the font to public/fonts/ before rendering.`)
    this.name = 'FontLoadError'
  }
}

export class SatoriRenderError extends Error {
  constructor(message: string) {
    super(`Satori render failed: ${message}`)
    this.name = 'SatoriRenderError'
  }
}

export class SharpOutputError extends Error {
  constructor(message: string) {
    super(`Sharp output failed: ${message}`)
    this.name = 'SharpOutputError'
  }
}

// ---------------------------------------------------------------------------
// Font cache — loaded once per process
// ---------------------------------------------------------------------------

const fontCache = new Map<string, Buffer>()

function loadFont(filePath: string): Buffer {
  if (fontCache.has(filePath)) return fontCache.get(filePath)!
  if (!fs.existsSync(filePath)) throw new FontLoadError(filePath)
  const data = fs.readFileSync(filePath)
  fontCache.set(filePath, data)
  return data
}

function loadProjectFonts(): satori.Font[] {
  const fontsDir = path.resolve(config.fontsDir)
  if (!fs.existsSync(fontsDir)) return []

  const fontFiles = fs.readdirSync(fontsDir).filter((f) =>
    /\.(ttf|otf|woff)$/i.test(f)   // WOFF2 excluded — Satori does not support it
  )

  return fontFiles.map((file) => {
    const filePath = path.join(fontsDir, file)
    const data = loadFont(filePath)
    // Derive font name from filename: "Inter-Bold.ttf" → "Inter"
    const name = file.replace(/[-_](regular|bold|italic|light|medium|semibold|extrabold|black).*/i, '').replace(/\.(ttf|otf|woff)$/i, '')
    const isBold = /bold/i.test(file)
    const isItalic = /italic/i.test(file)
    return {
      name,
      data: data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength),
      weight: isBold ? 700 : 400,
      style: isItalic ? 'italic' : 'normal',
    } as satori.Font
  })
}

// ---------------------------------------------------------------------------
// Image encoding helper
// ---------------------------------------------------------------------------

export function encodeImageAsDataUri(filePath: string): string {
  const resolved = path.resolve(filePath)
  if (!fs.existsSync(resolved)) throw new Error(`Image file not found: ${resolved}`)
  const buffer = fs.readFileSync(resolved)
  const ext = path.extname(filePath).toLowerCase().replace('.', '')
  const mime = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`
  return `data:${mime};base64,${buffer.toString('base64')}`
}

// ---------------------------------------------------------------------------
// DRAFT watermark
// ---------------------------------------------------------------------------

async function applyDraftWatermark(
  inputBuffer: Buffer,
  width: number,
  height: number
): Promise<Buffer> {
  const fontSize = Math.floor(Math.min(width, height) * 0.08)
  const svgWatermark = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <text
        x="50%"
        y="50%"
        text-anchor="middle"
        dominant-baseline="middle"
        font-family="sans-serif"
        font-size="${fontSize}"
        font-weight="bold"
        fill="rgba(255,255,255,0.15)"
        transform="rotate(-30, ${width / 2}, ${height / 2})"
      >DRAFT</text>
    </svg>`

  return sharp(inputBuffer)
    .composite([{ input: Buffer.from(svgWatermark), blend: 'over' }])
    .toBuffer()
}

// ---------------------------------------------------------------------------
// PDF helpers
// ---------------------------------------------------------------------------

async function renderRasterPdf(pngBuffer: Buffer, outPath: string, width: number, height: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: [width, height], margin: 0, autoFirstPage: true })
    const stream = fs.createWriteStream(outPath)
    doc.pipe(stream)
    doc.image(pngBuffer, 0, 0, { width, height })
    doc.end()
    stream.on('finish', resolve)
    stream.on('error', reject)
  })
}

async function renderVectorPdf(svgString: string, outPath: string, width: number, height: number): Promise<void> {
  // jsPDF + svg2pdf.js — produces a true vector PDF editable in Illustrator/Affinity
  // svg2pdf.js requires a DOM environment — use a lightweight DOM shim
  const { JSDOM } = await import('jsdom').catch(() => {
    throw new Error(
      'jsdom is required for vector PDF output.\nRun: npm install jsdom @types/jsdom'
    )
  })
  const dom = new JSDOM(svgString, { contentType: 'image/svg+xml' })
  const svgElement = dom.window.document.querySelector('svg') as unknown as SVGElement
  if (!svgElement) throw new Error('Could not parse SVG element for vector PDF.')

  const doc = new jsPDF({
    unit: 'px',
    format: [width, height],
    orientation: width > height ? 'landscape' : 'portrait',
  })

  const { default: svg2pdf } = await import('svg2pdf.js')
  await svg2pdf(svgElement, doc, { x: 0, y: 0, width, height })
  const pdfBuffer = Buffer.from(doc.output('arraybuffer'))
  fs.writeFileSync(outPath, pdfBuffer)
}

// ---------------------------------------------------------------------------
// Main render function
// ---------------------------------------------------------------------------

export async function renderComposition(options: RenderOptions): Promise<RenderResult> {
  const startMs = Date.now()

  const {
    id,
    props: propOverrides = {},
    format = config.defaultFormat,
    preview = false,
    quality = config.defaultQuality,
  } = options

  // 1. Resolve composition
  const { getCompositions, getComposition: _getComposition } = await import('./composition.js')
  const entry = _getComposition(id)
  if (!entry) {
    const all = getCompositions().map((c) => c.id)
    throw new CompositionNotFoundError(id, all)
  }

  const { component, width, height, defaultProps } = entry
  const mergedProps = { ...defaultProps, ...propOverrides }

  // 2. Determine output path
  const dir = preview ? path.resolve(config.previewDir) : path.resolve(config.outDir)
  fs.mkdirSync(dir, { recursive: true })

  const ext = format === 'pdf-vector' ? 'pdf' : format
  const outPath = options.outPath ?? path.join(dir, `${id}${preview ? '-preview' : ''}.${ext}`)

  // 3. Load fonts
  let fonts: satori.Font[]
  try {
    fonts = loadProjectFonts()
  } catch (err) {
    throw err instanceof FontLoadError ? err : new FontLoadError(String(err))
  }

  // 4. Render JSX → SVG via Satori
  let svgString: string
  try {
    svgString = await satori(
      createElement(component as React.ComponentType, mergedProps),
      { width, height, fonts }
    )
  } catch (err) {
    throw new SatoriRenderError(err instanceof Error ? err.message : String(err))
  }

  // 5. Branch by format
  if (format === 'svg') {
    fs.writeFileSync(outPath, svgString, 'utf8')
    const sizeBytes = Buffer.byteLength(svgString, 'utf8')
    return { outPath, format, width, height, durationMs: Date.now() - startMs, sizeBytes }
  }

  if (format === 'pdf-vector') {
    await renderVectorPdf(svgString, outPath, width, height)
    const sizeBytes = fs.statSync(outPath).size
    return { outPath, format, width, height, durationMs: Date.now() - startMs, sizeBytes }
  }

  // 6. Raster branch (PNG / JPG / WebP / TIFF / raster PDF)
  let sharpInstance = sharp(Buffer.from(svgString), {
    density: config.sharp.density,
  })

  try {
    let rasterBuffer: Buffer

    if (format === 'png') {
      rasterBuffer = await sharpInstance.png({ compressionLevel: config.pngCompression }).toBuffer()
    } else if (format === 'jpg') {
      rasterBuffer = await sharpInstance.jpeg({ quality }).toBuffer()
    } else if (format === 'webp') {
      rasterBuffer = await sharpInstance.webp({ quality }).toBuffer()
    } else if (format === 'tiff') {
      rasterBuffer = await sharpInstance.tiff().toBuffer()
    } else if (format === 'pdf') {
      // Raster PDF: PNG → pdfkit
      const pngBuffer = await sharpInstance.png({ compressionLevel: config.pngCompression }).toBuffer()
      const finalPng = preview && config.watermarkPreview
        ? await applyDraftWatermark(pngBuffer, width, height)
        : pngBuffer
      await renderRasterPdf(finalPng, outPath, width, height)
      const sizeBytes = fs.statSync(outPath).size
      return { outPath, format, width, height, durationMs: Date.now() - startMs, sizeBytes }
    } else {
      throw new SharpOutputError(`Unknown format: ${format}`)
    }

    // Apply DRAFT watermark for preview renders
    const finalBuffer = preview && config.watermarkPreview
      ? await applyDraftWatermark(rasterBuffer, width, height)
      : rasterBuffer

    fs.writeFileSync(outPath, finalBuffer)
    return { outPath, format, width, height, durationMs: Date.now() - startMs, sizeBytes: finalBuffer.length }

  } catch (err) {
    if (err instanceof SharpOutputError) throw err
    throw new SharpOutputError(err instanceof Error ? err.message : String(err))
  }
}
