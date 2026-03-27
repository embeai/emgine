// cli/utils/resolveComposition.ts
// Imports Root, runs registerRoot, and resolves a composition by id.

import '../../src/index.js'
import { getComposition, getCompositions } from '../../src/composition.js'
import { CompositionNotFoundError } from '../../src/render.js'
import type { CompositionEntry } from '../../src/composition.js'

export function resolveComposition(id: string): CompositionEntry {
  const entry = getComposition(id)
  if (!entry) {
    const all = getCompositions().map((c) => c.id)
    throw new CompositionNotFoundError(id, all)
  }
  return entry
}

export function listCompositions(): CompositionEntry[] {
  return getCompositions()
}
