/** Helpers for deployments where the frontend is served below a URL prefix. */
function normalizeBasePath(value: string): string {
  let base = String(value || '').trim() || '/'
  if (!base.startsWith('/')) base = `/${base}`
  if (!base.endsWith('/')) base = `${base}/`
  return base.replace(/\/{2,}/g, '/')
}

export function getBasePath(): string {
  return normalizeBasePath(import.meta.env.BASE_URL || '/')
}

export function withBasePath(path: string): string {
  const clean = String(path || '').trim().replace(/^\/+/, '')
  return `${getBasePath()}${clean}`
}

export function resolveHTTPOrBasePath(raw: string | undefined, fallbackPath: string): string {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return withBasePath(fallbackPath)
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return withBasePath(trimmed)
}
