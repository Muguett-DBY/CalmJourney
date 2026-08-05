// Sensory-friendly scoring core logic.
// Input: route segment features (noise / crowd / greenery / refuges).
// Output: 0-100 sensory pressure score (higher = more stressful).
// Weights and formula are v1 and will evolve with data.

const WEIGHTS = {
  noise: 0.45, // noise level 0-100
  crowd: 0.35, // crowd density 0-100
  greenery: 0.2, // greenery / nature level 0-100 (higher = more calming, inverted)
}

export function scoreSegment(segment) {
  const noise = clamp(segment.noise ?? 0, 0, 100)
  const crowd = clamp(segment.crowd ?? 0, 0, 100)
  const greenery = clamp(segment.greenery ?? 0, 0, 100)

  const raw =
    noise * WEIGHTS.noise +
    crowd * WEIGHTS.crowd +
    (100 - greenery) * WEIGHTS.greenery

  return {
    pressure: Math.round(clamp(raw, 0, 100)),
    factors: [
      { key: 'noise', value: noise, weight: WEIGHTS.noise },
      { key: 'crowd', value: crowd, weight: WEIGHTS.crowd },
      { key: 'greenery', value: greenery, weight: WEIGHTS.greenery },
    ],
  }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}
