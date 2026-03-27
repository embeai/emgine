// cli/utils/loadConfig.ts
// Loads emgine.config.ts and brand.config.ts from the project root.

import { config, SIZES } from '../../emgine.config.js'
import { brand } from '../../brand.config.js'

export function loadConfig() {
  return { config, SIZES, brand }
}
