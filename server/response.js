// Unified response format (scaffold)
export function ok(data) {
  return Response.json({ ok: true, data })
}

export function fail(status, message) {
  return Response.json({ ok: false, error: message }, { status })
}
