import { supabase } from '@/lib/supabase'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const headers = new Headers(options.headers)
  headers.set('Accept', 'application/json')

  if (options.body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  if (session?.access_token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${session.access_token}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? `API request failed (${response.status})`)
  }

  return payload as T
}
