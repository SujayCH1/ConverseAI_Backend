import { apiRequest } from './client'

type ApiResult<T = any> = { status: number; data?: T }

export function onOAuthInstagram(strategy: 'INSTAGRAM' | 'CRM') {
  if (strategy !== 'INSTAGRAM') return
  window.location.assign(
    `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'}/v1/integrations/instagram/oauth/start`
  )
}

export const onIntegrate = (code: string) =>
  apiRequest<ApiResult>('/v1/integrations/instagram/oauth/callback', {
    method: 'POST',
    body: { code },
  })
