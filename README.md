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
├── emgine.config.ts         ← render config (output dir, format, DPI)
├── brand.config.ts          ← brand tokens (colors, fonts, spacing)
├── src/
│   ├── index.ts             ← entry point
│   ├── Root.tsx             ← composition registry
│   └── *.tsx                ← approved compositions (one file per graphic)
├── public/
│   ├── fonts/               ← TTF / OTF / WOFF font files (shared)
│   └── images/
│       └── <project-slug>/  ← assets organized by project
├── active/
│   └── <project-slug>/      ← per-project workbench (brief, design, assets)
├── prompts/                 ← blank brief templates
├── graphics/                ← batch props files (*.json)
├── out/                     ← final renders
│   └── preview/             ← draft renders
├── docs/
│   ├── RENDER.md            ← Satori CSS allowlist + pipeline rules
│   ├── SIZES.md             ← preset size map (OG, Story, A4, etc.)
│   ├── DESIGN.md            ← design spec reference template
│   └── BRAND.md             ← how to use brand.config.ts
└── cli/                     ← CLI commands
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

## With Claude (AI-Assisted Workflow)

Emgine is designed to work with Claude as a composition author. Instead of writing TSX manually, you brief Claude and it handles the design work.

### Folder roles

| Folder | Role |
|---|---|
| `prompts/` | Blank brief templates — never filled directly |
| `active/<project-slug>/` | Per-project workbench — brief, design spec, asset prompts |
| `public/images/<project-slug>/` | Project image assets |
| `public/fonts/` | Shared fonts (all compositions) |
| `src/` | Approved, render-ready compositions only |
| `out/` | Final renders |

### 6-step workflow

**Step 1 — Fill the brief**
Give Claude your project details and ask it to fill `prompts/emgine.md`. Claude creates `active/<project-slug>/` and writes:
- `brief.md` — filled project brief
- `design.md` — visual design spec for this project

Review both and approve before moving on.

**Step 2 — Asset checklist**
Claude reviews the brief and produces a checklist:
- Lists every asset needed (backgrounds, screenshots, logos)
- Flags what you provide vs. what Claude can generate or substitute
- Writes any AI image prompts to `active/<project-slug>/assets.md`
- Outputs ready-to-run scaffold commands — no memorizing sizes needed

**Step 3 — Scaffold**
Run the commands Claude gave you:
```bash
npm run new ProjectThumbnail 432 324
npm run new ProjectUI 1200 2950
```

**Step 4 — Work session**
Paste the SYSTEM PROMPT block from `active/<project-slug>/brief.md` as your first message.
Claude reads `docs/RENDER.md` and `active/<project-slug>/design.md` before writing any TSX.

**Step 5 — Render & review**
```bash
npm run preview ProjectName    # DRAFT watermark — quick check
npm run render ProjectName     # Final PNG to out/
```

**Step 6 — Ship**
PNGs in `out/` are ready to upload.

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
