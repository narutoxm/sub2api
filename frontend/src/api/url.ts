const DEFAULT_API_BASE_URL = '/api/v1'
const BASE_PATH = normalizeBasePath(import.meta.env.BASE_URL || '/')
const API_BASE_URL = normalizeAPIBaseURL(import.meta.env.VITE_API_BASE_URL)

function normalizePath(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

function normalizeBasePath(value: string): string {
  let base = String(value || '').trim()
  if (!base) return '/'
  if (!base.startsWith('/')) base = `/${base}`
  if (!base.endsWith('/')) base = `${base}/`
  return base.replace(/\/{2,}/g, '/')
}

function withBasePath(path: string): string {
  const suffix = String(path || '').trim().replace(/^\/+/, '')
  return `${BASE_PATH}${suffix}`.replace(/\/{2,}/g, '/')
}

function normalizeAPIBaseURL(value: unknown): string {
  const raw = String(value || '').trim()
  if (!raw) return withBasePath(DEFAULT_API_BASE_URL)
  const withoutTrailingSlash = raw.replace(/\/+$/, '')
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(withoutTrailingSlash) || withoutTrailingSlash.startsWith('//')) {
    return withoutTrailingSlash
  }
  return withBasePath(withoutTrailingSlash)
}

export function getAPIBaseURL(): string {
  return API_BASE_URL
}

export function buildApiUrl(path: string): string {
  const base = getAPIBaseURL().replace(/\/+$/, '')
  let suffix = normalizePath(path)
  if (suffix === DEFAULT_API_BASE_URL) {
    suffix = ''
  } else if (suffix.startsWith(`${DEFAULT_API_BASE_URL}/`)) {
    suffix = suffix.slice(DEFAULT_API_BASE_URL.length)
  }
  return `${base}${suffix}`
}

export function buildGatewayUrl(path: string): string {
  const suffix = normalizePath(path)
  try {
    const apiBase =
      typeof window === 'undefined'
        ? new URL(getAPIBaseURL())
        : new URL(getAPIBaseURL(), window.location.origin)
    const prefix = apiBase.pathname.replace(/\/api\/v1\/?$/, '').replace(/\/+$/, '')
    return `${apiBase.origin}${prefix}${suffix}`
  } catch {
    return withBasePath(suffix)
  }
}
