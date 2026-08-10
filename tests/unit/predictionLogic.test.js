import { describe, expect, it } from 'vitest'
import {
  buildCrowdForecast,
  classifyCrowdRisk,
  sortCrowdForecasts,
} from '../../server/predictionLogic.js'

describe('predictionLogic', () => {
  it('classifies a forecast above the busy-hour threshold as high risk', () => {
    const result = classifyCrowdRisk({
      predictedCount: 900,
      mediumThreshold: 500,
      highThreshold: 800,
    })

    expect(result.riskLevel).toBe('high')
    expect(result.shouldAlert).toBe(true)
  })

  it('classifies a forecast around the usual level as medium risk', () => {
    const result = classifyCrowdRisk({
      predictedCount: 600,
      mediumThreshold: 500,
      highThreshold: 800,
    })

    expect(result.riskLevel).toBe('medium')
    expect(result.shouldAlert).toBe(false)
  })

  it('classifies a forecast below the usual level as low risk', () => {
    const result = classifyCrowdRisk({
      predictedCount: 400,
      mediumThreshold: 500,
      highThreshold: 800,
    })

    expect(result.riskLevel).toBe('low')
  })

  it('combines the next-hour historical pattern with the current count', () => {
    const result = buildCrowdForecast({
      sensor: {
        locationId: 3,
        areaName: 'Melbourne Central',
        lat: -37.811,
        lng: 144.964,
        distanceMeters: 300,
        averageCount: 1000,
        mediumThreshold: 700,
        highThreshold: 1200,
        sampleCount: 90,
      },
      currentCount: 1500,
    })

    expect(result.predictedCount).toBe(1150)
    expect(result.currentCount).toBe(1500)
    expect(result.areaName).toBe('Melbourne Central')
  })

  it('uses the historical pattern when current data is unavailable', () => {
    const result = buildCrowdForecast({
      sensor: {
        locationId: 3,
        areaName: 'Melbourne Central',
        lat: -37.811,
        lng: 144.964,
        distanceMeters: 300,
        averageCount: 1000,
        mediumThreshold: 700,
        highThreshold: 1200,
        sampleCount: 90,
      },
      currentCount: null,
    })

    expect(result.predictedCount).toBe(1000)
    expect(result.currentCount).toBeNull()
  })

  it('shows high-risk areas before lower-risk areas', () => {
    const result = sortCrowdForecasts([
      { riskLevel: 'low', distanceMeters: 100 },
      { riskLevel: 'high', distanceMeters: 500 },
      { riskLevel: 'medium', distanceMeters: 200 },
    ])

    expect(result.map((item) => item.riskLevel)).toEqual(['high', 'medium', 'low'])
  })
})
