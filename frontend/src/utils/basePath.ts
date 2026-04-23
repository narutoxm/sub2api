/**
 * Helpers for deploying the frontend under a sub-path (e.g. /sub2api/).
 *
 * Vite sets `import.meta.env.BASE_URL` from the build `base` option/flag.
 * When we reverse proxy Sub2API under a path prefix, both API calls and
 * hard redirects should respect that base path.
 */

function normalizeBasePath(value: string): string {
  let base = String(value || '').trim()
  if (!base) {
    base = '/'
  }

  if (!base.startsWith('/')) {
    base = `/${base}`
  }

  // Vite's BASE_URL normally ends with "/", keep that convention.
  if (!base.endsWith('/')) {
    base = `${base}/`
  }

  // Collapse accidental double slashes (keep leading single slash).
  base = base.replace(/\/{2,}/g, '/')

  return base
}

export function getBasePath(): string {
  return normalizeBasePath(import.meta.env.BASE_URL || '/')
}

export function withBasePath(path: string): string {
  const base = getBasePath()
  const clean = String(path || '').trim().replace(/^\/+/, '')
  return `${base}${clean}`
}

export function resolveHTTPOrBasePath(raw: string | undefined, fallbackPath: string): string {
  const trimmed = String(raw || '').trim()
  if (!trimmed) {
    return withBasePath(fallbackPath)
  }

  // Allow pointing to a different origin for advanced deployments.
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }

  return withBasePath(trimmed)
}

