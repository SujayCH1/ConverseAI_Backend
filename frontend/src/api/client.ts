const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080'

type ApiOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.message ?? `API request failed (${response.status})`)
  }

  return payload as T
}
