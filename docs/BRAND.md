# Emgine — Brand Config Guide

How to populate and use `brand.config.ts` for each client project.

---

## What brand.config.ts Is

`brand.config.ts` is the single source of truth for a client's visual identity.
It holds all design tokens — colors, fonts, spacing, radii, and logo.

Every composition imports from it. When the client's brand changes, you update
one file and all compositions automatically reflect the change.

---

## How to Fill It In (Per Client)

When starting a new client project:

1. Get the client's brand guidelines (PDF, Figma file, or brief)
2. Open `brand.config.ts`
3. Replace every placeholder value with the client's actual values
4. Add font files (TTF/OTF/WOFF) to `public/fonts/`
5. Add logo file to `public/images/`

---

## Color Tokens

```typescript
colors: {
  primary:    // Main brand color — buttons, CTAs, accents
  secondary:  // Supporting accent — highlights, secondary CTAs
  bg:         // Default background (usually darkest or lightest)
  surface:    // Card/panel background — slightly offset from bg
  text:       // Primary body text color
  textMuted:  // Secondary/caption text — lower contrast than text
  border:     // Dividers, outlines, input borders
  danger:     // Error states, warnings (red family)
  success:    // Confirmation states (green family)
}
```

**All color values are hex strings:** `"#7C3AED"`, `"#FFFFFF"`, `"#1A1A2E"`

---

## Font Tokens

```typescript
fonts: {
  heading:      // Display name used in fontFamily CSS (e.g. "Inter")
  body:         // Body font display name (e.g. "Inter")
  mono:         // Monospace font display name (e.g. "JetBrains Mono")
  headingFile:  // Filename in public/fonts/ (e.g. "Inter-Bold.ttf")
  bodyFile:     // Filename in public/fonts/ (e.g. "Inter-Regular.ttf")
  monoFile:     // Filename in public/fonts/ (e.g. "JetBrainsMono-Regular.ttf")
}
```

**Font rules:**
- Files must exist in `public/fonts/` before running any render
- Only TTF, OTF, WOFF accepted — WOFF2 will break Satori silently
- The `heading`/`body`/`mono` name strings must exactly match what you use
  in `fontFamily` inside compositions

---

## Spacing Tokens

```typescript
spacing: {
  xs:  4,   // tight spacing — badges, tags
  sm:  8,   // small gaps — icon + label
  md:  16,  // standard padding — cards
  lg:  24,  // section padding
  xl:  40,  // large section gaps
  xxl: 64,  // hero padding
}
```

Values are numbers (pixels). Use them in `padding`, `margin`, `gap` props.

---

## Radius Tokens

```typescript
radii: {
  sm:   4,   // subtle rounding — inputs, tags
  md:   8,   // standard — cards, buttons
  lg:   16,  // large — modals, featured cards
  full: 9999 // pill / circle — avatars, badges
}
```

---

## Logo Token

```typescript
logo: {
  path:   // Filename in public/images/ (e.g. "logo.png")
  width:  // Display width in pixels
  height: // Display height in pixels
}
```

In compositions, load the logo as a base64 data URI (Satori cannot read file paths):

```typescript
import fs from 'fs'
import path from 'path'
import { brand } from '../brand.config'

const logoBuffer = fs.readFileSync(path.join('public/images', brand.logo.path))
const logoSrc = `data:image/png;base64,${logoBuffer.toString('base64')}`
// Pass logoSrc as a prop to the composition
```

---

## Using Brand Tokens in Compositions

```typescript
import { brand } from '../brand.config'

export function Hero({ headline, subline, logoSrc }: HeroProps) {
  return (
    <div style={{
      display: 'flex',
      backgroundColor: brand.colors.bg,
      padding: brand.spacing.xxl,
      borderRadius: brand.radii.lg,
    }}>
      <h1 style={{
        fontFamily: brand.fonts.heading,
        color: brand.colors.text,
        fontSize: 64,
      }}>
        {headline}
      </h1>
    </div>
  )
}
```

---

## Missing or Undefined Tokens

If a brand token is missing or undefined:
- Fall back to the `defaultProps` value in the composition
- Never hardcode a color or font that should come from brand tokens
- Report the missing token before attempting a render

---

## Per-Client Workflow

```
New client project
  → copy/clone emgine repo
  → fill brand.config.ts with client values
  → add font files to public/fonts/
  → add logo to public/images/
  → write compositions (they import from brand.config.ts automatically)
  → run emgine render
```
