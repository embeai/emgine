// src/index.ts
// Entry point — registers the Root composition registry.
// Mirrors Remotion's src/index.ts + registerRoot() pattern.

import { registerRoot } from './composition.js'
import { Root } from './Root.js'

registerRoot(Root)
