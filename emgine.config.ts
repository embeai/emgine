// emgine.config.ts
// Project-level render configuration.
// Mirrors remotion.config.ts in structure and purpose.

export const config = {
  // Output directories
  outDir:     './out',
  previewDir: './out/preview',

  // Default output format
  // Options: "png" | "jpg" | "webp" | "tiff" | "svg" | "pdf" | "pdf-vector"
  defaultFormat: 'png' as OutputFormat,

  // Quality for lossy formats (jpg, webp) — 1 to 100
  defaultQuality: 90,

  // PNG compression level — 0 (none) to 9 (max)
  pngCompression: 6,

  // Asset directories
  fontsDir:    './public/fonts',
  imagesDir:   './public/images',
  graphicsDir: './graphics',

  // Stamp "DRAFT" watermark on preview renders
  watermarkPreview: true,

  // Sharp rasterization settings
  sharp: {
    // DPI for SVG → raster conversion
    // 96 = 1:1 pixel output, 144 = web quality, 300 = print quality
    density: 96,
  },

  // PDF settings (used for both raster and vector PDF)
  pdf: {
    // "A4" | "Letter" | "custom"
    pageSize: 'custom' as PdfPageSize,
    // Margin in pixels (0 = full bleed)
    margin: 0,
  },
} as const

// Preset size map — reference by name in compositions and CLI
export const SIZES = {
  // Social media
  OG_IMAGE:        { width: 1200, height: 630  },
  TWITTER_CARD:    { width: 1200, height: 675  },
  LINKEDIN:        { width: 1200, height: 627  },
  INSTAGRAM_SQ:    { width: 1080, height: 1080 },
  INSTAGRAM_PORT:  { width: 1080, height: 1350 },
  INSTAGRAM_LAND:  { width: 1080, height: 566  },
  STORY:           { width: 1080, height: 1920 },
  FACEBOOK_POST:   { width: 1200, height: 630  },
  FACEBOOK_COVER:  { width: 820,  height: 312  },
  TWITTER_HEADER:  { width: 1500, height: 500  },
  LINKEDIN_COVER:  { width: 1584, height: 396  },
  YOUTUBE_THUMB:   { width: 1280, height: 720  },
  PINTEREST:       { width: 1000, height: 1500 },

  // Display ads (IAB)
  BANNER_LB:           { width: 728,  height: 90  },
  BANNER_HALF:         { width: 300,  height: 250 },
  BANNER_WIDE:         { width: 160,  height: 600 },
  BANNER_MOBILE:       { width: 320,  height: 50  },
  BANNER_LARGE_MOBILE: { width: 320,  height: 100 },
  BANNER_BILLBOARD:    { width: 970,  height: 250 },
  BANNER_SQUARE:       { width: 250,  height: 250 },

  // Print (96 DPI — set sharp.density: 300 for print output)
  A4_PORT:    { width: 794,  height: 1123 },
  A4_LAND:    { width: 1123, height: 794  },
  LETTER_PORT:{ width: 816,  height: 1056 },
  LETTER_LAND:{ width: 1056, height: 816  },
  A3_PORT:    { width: 1123, height: 1587 },

  // Web / App UI
  HERO_WIDE:    { width: 1440, height: 600 },
  HERO_STD:     { width: 1200, height: 500 },
  CARD_WIDE:    { width: 800,  height: 450 },
  CARD_SQ:      { width: 600,  height: 600 },
  EMAIL_HEADER: { width: 600,  height: 200 },
  FAVICON:      { width: 512,  height: 512 },
  OG_SQUARE:    { width: 400,  height: 400 },
} as const

export type SizeName = keyof typeof SIZES
export type OutputFormat = 'png' | 'jpg' | 'webp' | 'tiff' | 'svg' | 'pdf' | 'pdf-vector'
export type PdfPageSize = 'A4' | 'Letter' | 'custom'
