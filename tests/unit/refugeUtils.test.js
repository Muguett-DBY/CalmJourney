import { describe, expect, it } from 'vitest'
import {
  estimateWalkingMinutes,
  formatDistance,
  formatRefugeType,
  nextWalkingMinutes,
} from '../../src/utils/refuges.js'

describe('refuge display helpers', () => {
  it('cycles through the supported walking distances', () => {
    expect(nextWalkingMinutes(10)).toBe(20)
    expect(nextWalkingMinutes(20)).toBe(30)
    expect(nextWalkingMinutes(30)).toBe(10)
  })

  it('formats distance and walking time for nearby results', () => {
    expect(formatDistance(420)).toBe('420 m')
    expect(formatDistance(1250)).toBe('1.3 km')
    expect(estimateWalkingMinutes(420)).toBe(6)
  })

  it('formats database refuge types for the interface', () => {
    expect(formatRefugeType('park')).toBe('Park')
    expect(formatRefugeType('library')).toBe('Library')
    expect(formatRefugeType('quiet_public_space')).toBe('Quiet public space')
  })
})
