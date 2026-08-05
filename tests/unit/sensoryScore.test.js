import { describe, it, expect } from 'vitest'
import { scoreSegment } from '../../server/sensoryLogic.js'

describe('sensoryScore', () => {
  it('scaffold test: default segment returns a pressure score', () => {
    const result = scoreSegment({ noise: 50, crowd: 30 })
    expect(result).toHaveProperty('pressure')
    expect(result.pressure).toBeGreaterThanOrEqual(0)
    expect(result.pressure).toBeLessThanOrEqual(100)
  })
})
