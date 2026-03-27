// src/composition.ts
// Composition type definitions and registerRoot.
// Mirrors Remotion's composition API for static graphics.

import type React from 'react'

export type OutputFormat = 'png' | 'jpg' | 'webp' | 'tiff' | 'svg' | 'pdf' | 'pdf-vector'

export interface CompositionEntry<P extends Record<string, unknown> = Record<string, unknown>> {
  id: string
  component: React.ComponentType<P>
  width: number
  height: number
  defaultProps: P
}

// Global registry — populated by registerRoot()
let _compositions: CompositionEntry[] = []
let _rootRegistered = false

export function registerRoot(rootFn: () => CompositionEntry[]): void {
  if (_rootRegistered) {
    throw new Error('registerRoot() called more than once.')
  }
  _compositions = rootFn()
  _rootRegistered = true
}

export function getCompositions(): CompositionEntry[] {
  return _compositions
}

export function getComposition(id: string): CompositionEntry | undefined {
  return _compositions.find((c) => c.id === id)
}

// Composition helper — used in Root.tsx to declare compositions
// Same interface as Remotion's <Composition> tag, but returns a plain object
export function Composition<P extends Record<string, unknown>>(
  entry: CompositionEntry<P>
): CompositionEntry<P> {
  return entry
}
