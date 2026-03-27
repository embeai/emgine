# Emgine — Size Presets

Use these names in compositions and CLI commands.
All dimensions are in pixels.

---

## Social Media

| Name | Width | Height | Use Case |
|---|---|---|---|
| `OG_IMAGE` | 1200 | 630 | Open Graph / social share / link preview |
| `TWITTER_CARD` | 1200 | 675 | Twitter/X large card |
| `LINKEDIN` | 1200 | 627 | LinkedIn post image |
| `INSTAGRAM_SQ` | 1080 | 1080 | Instagram square post |
| `INSTAGRAM_PORT` | 1080 | 1350 | Instagram portrait post (4:5) |
| `INSTAGRAM_LAND` | 1080 | 566 | Instagram landscape post (1.91:1) |
| `STORY` | 1080 | 1920 | Instagram / TikTok / Facebook story |
| `FACEBOOK_POST` | 1200 | 630 | Facebook post image |
| `FACEBOOK_COVER` | 820 | 312 | Facebook page cover |
| `TWITTER_HEADER` | 1500 | 500 | Twitter/X profile header |
| `LINKEDIN_COVER` | 1584 | 396 | LinkedIn profile/company cover |
| `YOUTUBE_THUMB` | 1280 | 720 | YouTube thumbnail |
| `PINTEREST` | 1000 | 1500 | Pinterest pin (2:3) |

---

## Display Advertising (IAB Standard)

| Name | Width | Height | Use Case |
|---|---|---|---|
| `BANNER_LB` | 728 | 90 | Leaderboard banner |
| `BANNER_HALF` | 300 | 250 | Medium rectangle / half page |
| `BANNER_WIDE` | 160 | 600 | Wide skyscraper |
| `BANNER_MOBILE` | 320 | 50 | Mobile leaderboard |
| `BANNER_LARGE_MOBILE` | 320 | 100 | Large mobile banner |
| `BANNER_BILLBOARD` | 970 | 250 | Billboard |
| `BANNER_SQUARE` | 250 | 250 | Square button |

---

## Print (at 96 DPI — increase sharp.density for print quality)

| Name | Width | Height | Use Case |
|---|---|---|---|
| `A4_PORT` | 794 | 1123 | A4 portrait (96 DPI) |
| `A4_LAND` | 1123 | 794 | A4 landscape (96 DPI) |
| `LETTER_PORT` | 816 | 1056 | US Letter portrait (96 DPI) |
| `LETTER_LAND` | 1056 | 816 | US Letter landscape (96 DPI) |
| `A3_PORT` | 1123 | 1587 | A3 portrait (96 DPI) |

> For print output set `sharp.density: 300` in `emgine.config.ts`

---

## Web / App UI

| Name | Width | Height | Use Case |
|---|---|---|---|
| `HERO_WIDE` | 1440 | 600 | Full-width hero banner |
| `HERO_STD` | 1200 | 500 | Standard hero |
| `CARD_WIDE` | 800 | 450 | Blog / article card (16:9) |
| `CARD_SQ` | 600 | 600 | Square card |
| `EMAIL_HEADER` | 600 | 200 | Email header banner |
| `FAVICON` | 512 | 512 | High-res favicon / app icon |
| `OG_SQUARE` | 400 | 400 | Small square preview |

---

## Usage in Compositions

```typescript
import { SIZES } from '../emgine.config'

// Reference by name
const { width, height } = SIZES.OG_IMAGE  // { width: 1200, height: 630 }
```

Or pass directly via `defaultProps` on the `<Composition>` tag in `Root.tsx`:

```tsx
<Composition
  id="Hero"
  component={Hero}
  width={1200}
  height={630}
  defaultProps={{ ... }}
/>
```
