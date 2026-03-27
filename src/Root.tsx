// src/Root.tsx
// Composition registry — mirrors Remotion's Root.tsx exactly.
//
// To add a new composition:
//   1. Create src/YourComposition.tsx
//   2. Import it here
//   3. Add a Composition() entry to the array below
//
// The id must be PascalCase, unique, and match the filename.

import { Composition } from './composition.js'

// --- Import compositions below this line ---
// import { Hero } from './Hero.js'
// import { Banner } from './Banner.js'

export function Root() {
  return [
    // --- Register compositions below this line ---
    // Composition({
    //   id: 'Hero',
    //   component: Hero,
    //   width: 1200,
    //   height: 630,
    //   defaultProps: {
    //     headline: 'Your Headline Here',
    //     subline: 'Supporting text goes here',
    //   },
    // }),
  ]
}
