// brand.config.ts
// Client brand tokens — update this for every new client project.
// All compositions import from this file.
// See docs/BRAND.md for instructions on how to fill this in.

export const brand = {
  colors: {
    primary:   '#7C3AED',   // main accent — CTAs, highlights
    secondary: '#A78BFA',   // supporting accent
    bg:        '#0F0F1A',   // default background
    surface:   '#1A1A2E',   // card / panel background
    text:      '#FFFFFF',   // primary text
    textMuted: '#94A3B8',   // secondary / caption text
    border:    '#2D2D44',   // dividers, outlines
    danger:    '#EF4444',   // error states
    success:   '#22C55E',   // confirmation states
  },

  fonts: {
    heading:     'Inter',                      // must match loaded font name exactly
    body:        'Inter',
    mono:        'JetBrains Mono',
    headingFile: 'Inter-Bold.ttf',             // file must exist in public/fonts/
    bodyFile:    'Inter-Regular.ttf',
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
