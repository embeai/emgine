# Emgine

A graphics render engine for teams that live in code.

Write a JSX composition. Run one command. Get a production-ready PNG, PDF, or WebP — no design tools, no manual exports, no context switching.

---

## Stack

- [Satori](https://github.com/vercel/satori) — JSX → SVG
- [Sharp](https://sharp.pixelplumbing.com/) — SVG → PNG / JPG / WebP / TIFF
- [pdfkit](https://pdfkit.org/) — raster PDF (print + share)
- [jsPDF](https://github.com/parallax/jsPDF) + [svg2pdf.js](https://github.com/yWorks/svg2pdf.js) — vector PDF (Illustrator / Affinity editable)

---

## Setup

```bash
# Requires Node.js 18+
bash setup.sh

# Or manually:
npm install
```

---

## Usage

```bash
# Render a composition to out/
npx tsx cli/index.ts render Hero

# Preview (draft watermark, saves to out/preview/)
npx tsx cli/index.ts preview Hero

# Batch render all jobs in graphics/
npx tsx cli/index.ts batch

# List all registered compositions
npx tsx cli/index.ts list
```

Or use the npm scripts:

```bash
npm run render  -- Hero
npm run preview -- Hero
npm run batch
npm run list
```

---

## Output Formats

| Flag | Format | Use case |
|---|---|---|
| `--format png` | PNG | Default — lossless, web, social |
| `--format jpg` | JPG | Smaller file size, hero images |
| `--format webp` | WebP | Modern web delivery |
| `--format tiff` | TIFF | Print / archival |
| `--format svg` | SVG | Raw vector output |
| `--format pdf` | PDF (raster) | Print + share |
| `--format pdf-vector` | PDF (vector) | Illustrator / Affinity editable |

---

## File Structure

```
emgine/
├── emgine.config.ts     ← render config (output dir, format, DPI)
├── brand.config.ts      ← client brand tokens (colors, fonts, logo)
├── src/
│   ├── index.ts         ← entry point
│   ├── Root.tsx         ← composition registry
│   └── *.tsx            ← your compositions (one file per graphic)
├── public/
│   ├── fonts/           ← TTF / OTF / WOFF font files
│   └── images/          ← logos, photos, static assets
├── graphics/            ← batch props files (*.json)
├── out/                 ← final renders
│   └── preview/         ← draft renders
├── docs/
│   ├── RENDER.md        ← Satori CSS allowlist + pipeline rules
│   ├── SIZES.md         ← preset size map (OG, Story, A4, etc.)
│   └── BRAND.md         ← how to use brand.config.ts
└── cli/                 ← CLI commands
```

---

## Writing a Composition

**1. Create `src/Hero.tsx`**

```tsx
import { brand } from '../brand.config'

interface HeroProps {
  headline: string
  subline: string
}

export function Hero({ headline, subline }: HeroProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%',
      height: '100%',
      backgroundColor: brand.colors.bg,
      padding: brand.spacing.xxl,
    }}>
      <h1 style={{
        fontFamily: brand.fonts.heading,
        fontSize: 72,
        color: brand.colors.text,
        margin: 0,
      }}>
        {headline}
      </h1>
      <p style={{
        fontFamily: brand.fonts.body,
        fontSize: 32,
        color: brand.colors.textMuted,
        marginTop: brand.spacing.md,
      }}>
        {subline}
      </p>
    </div>
  )
}
```

**2. Register in `src/Root.tsx`**

```tsx
import { Composition } from './composition.js'
import { Hero } from './Hero.js'

export function Root() {
  return [
    Composition({
      id: 'Hero',
      component: Hero,
      width: 1200,
      height: 630,
      defaultProps: {
        headline: 'Your Headline Here',
        subline: 'Supporting text goes here',
      },
    }),
  ]
}
```

**3. Render**

```bash
npm run render -- Hero
# → out/Hero.png
```

---

## Batch Rendering

Create JSON files in `graphics/` — one per render job:

```json
{
  "id": "Hero",
  "props": {
    "headline": "Launch Week — Day 1",
    "subline": "New feature: instant deploys"
  },
  "format": "png"
}
```

Then run:

```bash
npm run batch
```

---

## Per-Client Workflow

```
1. Clone this repo for each client project
2. Fill in brand.config.ts  ← client colors, fonts, logo
3. Add fonts to public/fonts/  ← TTF / OTF / WOFF only (no WOFF2)
4. Add logo to public/images/
5. Write compositions in src/
6. Register them in src/Root.tsx
7. Run emgine render → assets land in out/
```

---

## Size Presets

See [docs/SIZES.md](docs/SIZES.md) for the full list.

Common ones:

| Name | Size | Use |
|---|---|---|
| `OG_IMAGE` | 1200×630 | Open Graph / social share |
| `STORY` | 1080×1920 | Instagram / TikTok story |
| `INSTAGRAM_SQ` | 1080×1080 | Instagram square |
| `YOUTUBE_THUMB` | 1280×720 | YouTube thumbnail |
| `A4_PORT` | 794×1123 | A4 portrait |
| `BANNER_LB` | 728×90 | Leaderboard ad |

---

## Requirements

- Node.js 18+
- Fonts must be TTF, OTF, or WOFF — WOFF2 is not supported
- All images passed to compositions must be base64 data URIs

---

## License

MIT
