import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { onRequestGet } from '../../functions/api/refuges/nearby.js'

const bindings = {
  SUPABASE_URL: 'https://example.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'test-publishable-key',
}
const validQuery = 'lat=-37.8136&lng=144.9631&minutes=10'
let fetchMock

function search(query = validQuery, env = bindings) {
  return onRequestGet({
    request: new Request(`https://example.test/api/refuges/nearby?${query}`),
    env,
  })
}

beforeEach(() => {
  fetchMock = vi.fn().mockResolvedValue(Response.json([]))
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => vi.unstubAllGlobals())

describe('nearby refuge API', () => {
  it.each([
    ['missing latitude', 'lng=144.9631'],
    ['blank latitude', 'lat=&lng=144.9631'],
    ['whitespace latitude', 'lat=%20&lng=144.9631'],
    ['invalid latitude', 'lat=unknown&lng=144.9631'],
    ['out-of-range latitude', 'lat=91&lng=144.9631'],
    ['missing longitude', 'lat=-37.8136'],
    ['blank longitude', 'lat=-37.8136&lng='],
    ['whitespace longitude', 'lat=-37.8136&lng=%20'],
    ['invalid longitude', 'lat=-37.8136&lng=unknown'],
    ['out-of-range longitude', 'lat=-37.8136&lng=181'],
  ])('rejects %s before querying Supabase', async (_label, query) => {
    const response = await search(query)
    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({ error: expect.any(String) })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    {},
    { SUPABASE_URL: bindings.SUPABASE_URL },
    { SUPABASE_PUBLISHABLE_KEY: bindings.SUPABASE_PUBLISHABLE_KEY },
  ])('returns JSON 503 when Supabase bindings are incomplete', async (env) => {
    const response = await search(validQuery, env)
    expect(response.status).toBe(503)
    expect(await response.json()).toEqual({ error: 'Refuge data is temporarily unavailable.' })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('returns a generic JSON error for a rejected upstream request', async () => {
    fetchMock.mockRejectedValue(new Error('private upstream details'))
    const response = await search()
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Refuge data is temporarily unavailable.' })
  })

  it('handles an upstream HTML error without attempting to parse it as JSON', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Bad gateway</html>', { status: 502 }))
    const response = await search()
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Refuge data is temporarily unavailable.' })
  })

  it('handles a successful status with a non-JSON upstream body', async () => {
    fetchMock.mockResolvedValue(new Response('<html>Unexpected response</html>'))
    const response = await search()
    expect(response.status).toBe(502)
    expect(await response.json()).toEqual({ error: 'Refuge data is temporarily unavailable.' })
  })

  it.each([
    ['lat=0&lng=0', { user_lat: 0, user_lng: 0, max_distance_m: 800, requested_type: null }],
    ['lat=-37.8136&lng=144.9631&minutes=20&type=library', {
      user_lat: -37.8136, user_lng: 144.9631, max_distance_m: 1600, requested_type: 'library',
    }],
  ])('preserves valid coordinates and search filters', async (query, body) => {
    const refuges = [{ id: 'refuge-1', name: 'Example refuge' }]
    fetchMock.mockResolvedValue(Response.json(refuges))
    const response = await search(query)
    expect(response.status).toBe(200)
    expect(await response.json()).toEqual({ data: refuges })
    expect(fetchMock).toHaveBeenCalledWith(
      `${bindings.SUPABASE_URL}/rest/v1/rpc/nearby_refuges`,
      expect.objectContaining({ method: 'POST', body: JSON.stringify(body) }),
    )
  })
})
