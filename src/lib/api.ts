import type {
  ContactPayload,
  ContactResponse,
  Portfolio,
  Project,
} from './types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api/v1'

export const API_ORIGIN = API_BASE.startsWith('/')
  ? ''
  : API_BASE.replace(/\/api\/v1\/?$/, '')

export function resolveUrl(url: string): string {
  if (!url) return url
  if (/^https?:\/\//i.test(url)) return url
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`
  return url
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })

  const body: unknown = await res.json().catch(() => null)

  if (!res.ok) {
    const detail =
      (body as { detail?: string } | null)?.detail ?? `Request failed (${res.status})`
    throw new ApiError(detail, res.status)
  }

  return body as T
}

export function getPortfolio(): Promise<Portfolio> {
  return request<Portfolio>('/public/portfolio')
}

export function getProject(slug: string): Promise<Project> {
  return request<Project>(`/public/projects/${encodeURIComponent(slug)}`)
}

export function submitContact(
  payload: ContactPayload,
): Promise<ContactResponse> {
  return request<ContactResponse>('/public/contact', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}