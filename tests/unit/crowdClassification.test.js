import { describe, it, expect } from 'vitest'
import { predictCrowding } from '../../server/predictionLogic.js'

describe('crowdClassification', () => {
  it('scaffold test: returns level and confidence', () => {
    const result = predictCrowding([], 'sunny', '12:00')
    expect(result).toHaveProperty('level')
    expect(result).toHaveProperty('confidence')
  })
})
