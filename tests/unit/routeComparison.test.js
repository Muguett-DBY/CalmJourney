import { describe, it, expect } from 'vitest'
import { scoreSegment } from '../../server/sensoryLogic.js'

describe('routeComparison', () => {
  it('scaffold test: quiet route scores lower pressure than noisy route', () => {
    const quiet = scoreSegment({ noise: 20, crowd: 10 })
    const loud = scoreSegment({ noise: 90, crowd: 80 })
    expect(quiet.pressure).toBeLessThan(loud.pressure)
  })
})
