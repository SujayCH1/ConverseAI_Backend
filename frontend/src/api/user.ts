import { apiRequest } from './client'

type ApiResult<T = any> = { status: number; data?: T }

export const onBoardUser = () => apiRequest<ApiResult>('/v1/me/bootstrap', { method: 'POST' })
export const onBoardUsername = () => apiRequest<ApiResult>('/v1/me')
export const onUserInfo = () => apiRequest<ApiResult>('/v1/me')
export const userFormStatus = () => apiRequest<ApiResult>('/v1/me/setup-status')

export const onSubscribe = (sessionId: string) =>
  apiRequest<ApiResult>('/v1/billing/checkout/complete', {
    method: 'POST',
    body: { sessionId },
  })

export const createCheckout = () =>
  apiRequest<ApiResult<{ session_url: string }>>('/v1/billing/checkout', {
    method: 'POST',
  })
