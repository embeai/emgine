// cli/commands/list.ts
// emgine list
// Lists all registered compositions from Root.tsx with their dimensions and defaultProps keys.

import { listCompositions } from '../utils/resolveComposition.js'

export function commandList(): void {
  const compositions = listCompositions()

  if (compositions.length === 0) {
    console.log('\nNo compositions registered yet.')
    console.log('Add a composition to src/Root.tsx to get started.\n')
    return
  }

  console.log(`\n${'ID'.padEnd(30)} ${'SIZE'.padEnd(16)} DEFAULT PROPS`)
  console.log('─'.repeat(80))

  for (const comp of compositions) {
    const id    = comp.id.padEnd(30)
    const size  = `${comp.width}×${comp.height}`.padEnd(16)
    const props = Object.keys(comp.defaultProps).join(', ') || '(none)'
    console.log(`${id} ${size} ${props}`)
  }

  console.log(`\n${compositions.length} composition(s) registered.\n`)
}
