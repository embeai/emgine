# Emgine — Render Reference
## Satori CSS Allowlist + Pipeline Constraints

---

## Stack

```
JSX composition
  → satori()         → SVG string
  → Buffer.from()    → SVG Buffer
  → sharp()          → PNG / JPG / WebP / TIFF
  → pdfkit           → PDF (raster: PNG embedded)
  → jsPDF + svg2pdf  → PDF (vector: SVG embedded)
```

---

## Satori CSS — ALLOWED

### Layout
```
display: "flex"          ← REQUIRED on every root element
flexDirection
justifyContent
alignItems
alignSelf
alignContent
flexWrap
flex
flexGrow
flexShrink
flexBasis
gap
rowGap
columnGap
```

### Sizing
```
width                    ← numbers only (e.g. 400, not "400px")
height                   ← numbers only
minWidth / maxWidth
minHeight / maxHeight
padding / paddingTop / paddingRight / paddingBottom / paddingLeft
margin / marginTop / marginRight / marginBottom / marginLeft
```

### Position
```
position: "relative" | "absolute"
top / right / bottom / left
```

### Typography
```
fontSize                 ← number only
fontFamily               ← must match a loaded font name exactly
fontWeight               ← number (400, 700) or string ("bold")
fontStyle                ← "normal" | "italic"
lineHeight               ← number or string
letterSpacing
textAlign
textDecoration
textTransform
whiteSpace
wordBreak
overflow: "hidden"
lineClamp                ← Satori-specific prop (not standard CSS)
```

### Color & Background
```
color
backgroundColor
background                ← supports linear-gradient, radial-gradient
opacity
```

### Gradients (supported)
```
linear-gradient(...)
radial-gradient(...)
repeating-linear-gradient(...)
repeating-radial-gradient(...)
```

### Border
```
border
borderWidth
borderColor
borderStyle
borderRadius
borderTop / borderRight / borderBottom / borderLeft
```

### Image / Object
```
objectFit
objectPosition
```

### Transform (2D only)
```
transform: "rotate(...)" | "scale(...)" | "translateX(...)" | "translateY(...)"
```

### Overflow
```
overflow: "hidden"       ← only "hidden" is supported, not "scroll" or "auto"
```

---

## Satori CSS — PROHIBITED

These will silently break or error. Never use them:

```
❌ display: "grid"           — CSS Grid is NOT supported (Flexbox only)
❌ z-index                   — not supported (use element order for layering)
❌ text-shadow               — broken in Satori
❌ box-shadow                — not supported
❌ CSS variables (var())     — not supported
❌ calc()                    — not supported
❌ pseudo-classes (:hover)   — not applicable
❌ pseudo-elements (::before)— not applicable
❌ percentage heights        — % height on flex children is unreliable
❌ position: "fixed"         — not supported
❌ overflow: "scroll"        — not supported
❌ CSS Grid properties       — grid-template, grid-column, etc.
❌ transition / animation    — static output only
❌ cursor                    — not applicable
❌ pointer-events            — not applicable
```

---

## Font Rules

- **Accepted formats:** TTF, OTF, WOFF
- **WOFF2 is PROHIBITED** — silently produces broken renders, no error thrown
- Fonts must live in `public/fonts/`
- Fonts are loaded as `ArrayBuffer` and passed in the `fonts` array to `satori()`
- The `fontFamily` string in JSX must **exactly match** the `name` field in the fonts array
- Load fonts once per process and cache — do not reload on every render

```typescript
// Correct font loading pattern
const fontData = fs.readFileSync('public/fonts/Inter-Regular.ttf')
const fonts = [
  { name: 'Inter', data: fontData.buffer, weight: 400, style: 'normal' }
]
const svg = await satori(<Component />, { width, height, fonts })
```

---

## Image Rules

- **Satori cannot fetch URLs or file paths** — all images must be base64 data URIs
- Convert images before passing as props:
```typescript
const logo = fs.readFileSync('public/images/logo.png')
const logoDataUri = `data:image/png;base64,${logo.toString('base64')}`
// Pass logoDataUri as a prop to the composition
```
- Use `<img src={dataUri} />` in JSX — not file paths

---

## SVG Output Contract

- `satori()` returns a **string** — raw SVG markup, not a file path
- The SVG has explicit `width` and `height` attributes — Sharp uses these for rasterization
- Pass to Sharp as: `Buffer.from(svgString)`
- Pass to pdfkit/jsPDF as: `Buffer.from(svgString, 'utf8')`

---

## Sharp Output (PNG / JPG / WebP / TIFF)

```typescript
// PNG (lossless, default)
await sharp(Buffer.from(svgString)).png().toFile(outPath)

// JPG (lossy, smaller)
await sharp(Buffer.from(svgString)).jpeg({ quality: 90 }).toFile(outPath)

// WebP (modern web)
await sharp(Buffer.from(svgString)).webp({ quality: 90 }).toFile(outPath)

// TIFF (print/archival)
await sharp(Buffer.from(svgString)).tiff().toFile(outPath)
```

**Sharp CANNOT output PDF.** Use pdfkit or jsPDF instead.

---

## PDF Output

### Raster PDF (pdfkit) — for print + share
```typescript
import PDFDocument from 'pdfkit'
const pngBuffer = await sharp(Buffer.from(svgString)).png().toBuffer()
const doc = new PDFDocument({ size: [width, height], margin: 0 })
doc.image(pngBuffer, 0, 0, { width, height })
doc.pipe(fs.createWriteStream(outPath))
doc.end()
```

### Vector PDF (jsPDF + svg2pdf.js) — for Illustrator/Affinity editing
```typescript
import { jsPDF } from 'jspdf'
import svg2pdf from 'svg2pdf.js'
const doc = new jsPDF({ unit: 'px', format: [width, height] })
await svg2pdf(svgElement, doc, { x: 0, y: 0, width, height })
doc.save(outPath)
```

---

## Flex Root Rule

**Every composition's outermost element must have `display: "flex"`.**
Satori's layout engine is React Native's Yoga — it requires flex context at the root.

```tsx
// ✅ Correct
export function Hero({ headline }: HeroProps) {
  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      ...
    </div>
  )
}

// ❌ Wrong — will produce broken layout
export function Hero({ headline }: HeroProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      ...
    </div>
  )
}
```

---

## DPI / Density

- `emgine.config.ts` has a `sharp.density` setting (default: 144 DPI)
- Higher density = larger effective pixel output from the SVG
- For print: use 300 DPI
- For web: 144 DPI is sufficient
- This setting only affects Sharp rasterization — SVG output is unaffected
