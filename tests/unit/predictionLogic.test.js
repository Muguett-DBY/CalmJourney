import { describe, expect, it } from 'vitest'
import {
  classifyCrowdRisk,
  predictSensoryAlert,
} from '../../server/predictionLogic.js'

describe('predictionLogic', () => {
  it('classifies high risk when current count exceeds the user threshold', () => {
    const result = classifyCrowdRisk({
      currentCount: 750,
      sevenDayAverage: 900,
      threshold: 700,
    })

    expect(result.riskLevel).toBe('high')
    expect(result.sensoryLoad).toBe('high')
    expect(result.shouldAlert).toBe(true)
  })

  it('classifies high risk when the current count is far above the seven-day average', () => {
    const result = classifyCrowdRisk({
      currentCount: 840,
      sevenDayAverage: 600,
      threshold: 1000,
    })

    expect(result.riskLevel).toBe('high')
    expect(result.ratio).toBe(1.4)
    expect(result.shouldAlert).toBe(true)
  })

  it('classifies medium risk when the count is moderately above baseline', () => {
    const result = classifyCrowdRisk({
      currentCount: 660,
      sevenDayAverage: 600,
      threshold: 1000,
    })

    expect(result.riskLevel).toBe('medium')
    expect(result.sensoryLoad).toBe('medium')
    expect(result.shouldAlert).toBe(false)
  })

  it('classifies low risk when the count is within the expected baseline', () => {
    const result = classifyCrowdRisk({
      currentCount: 500,
      sevenDayAverage: 600,
      threshold: 1000,
    })

    expect(result.riskLevel).toBe('low')
    expect(result.sensoryLoad).toBe('low')
    expect(result.shouldAlert).toBe(false)
  })

  it('handles a zero seven-day average without crashing', () => {
    const result = classifyCrowdRisk({
      currentCount: 50,
      sevenDayAverage: 0,
      threshold: 700,
    })

    expect(result.ratio).toBeNull()
    expect(result.riskLevel).toBe('low')
  })

  it('includes action options when a high sensory alert is generated', () => {
    const result = predictSensoryAlert({
      sensor: {
        locationId: 3,
        name: 'Melbourne Central',
        lat: -37.81101524,
        lng: 144.96429485,
        distanceMeters: 310,
      },
      currentCount: 900,
      sevenDayAverage: 600,
      threshold: 700,
    })

    expect(result.sensorId).toBe(3)
    expect(result.areaName).toBe('Melbourne Central')
    expect(result.shouldAlert).toBe(true)
    expect(result.recommendedActions.map((action) => action.type)).toEqual([
      'find_nearby_refuge',
      'reroute',
    ])
  })
})
