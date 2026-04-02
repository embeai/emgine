// brand.config.ts
// Client brand tokens — update this for every new client project.
// All compositions import from this file.
// See docs/BRAND.md for instructions on how to fill this in.

export const brand = {
  colors: {
    primary:   '#00D4FF',   // electric cyan — Ad Creatives accent
    secondary: '#00A3C4',   // deeper cyan — supporting accent
    bg:        '#0D0D0D',   // near-black — base background
    surface:   '#161616',   // lifted surface — cards, panels
    text:      '#F5F5F5',   // crisp white — primary text
    textMuted: '#6B7280',   // neutral grey — captions, labels
    border:    '#2A2A2A',   // dark border — dividers, outlines
    danger:    '#EF4444',   // error states
    success:   '#22C55E',   // confirmation states
  },

  fonts: {
    heading:     'Inter',                      // must match loaded font name exactly
    body:        'Inter',
    mono:        'JetBrains Mono',
    headingFile: 'Inter-Bold.woff',             // file must exist in public/fonts/
    bodyFile:    'Inter-Regular.woff',
    monoFile:    'JetBrainsMono-Regular.ttf',
  },

  spacing: {
    xs:  4,
    sm:  8,
    md:  16,
    lg:  24,
    xl:  40,
    xxl: 64,
  },

  radii: {
    sm:   4,
    md:   8,
    lg:   16,
    full: 9999,
  },

  logo: {
    path:   'logo.png',   // file must exist in public/images/
    width:  160,
    height: 40,
  },
} as const

export type Brand = typeof brand
