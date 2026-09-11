import { apiRequest } from './client'

type ApiResult<T = unknown> = { status: number; data: T; res?: T }

export const createAutomations = (id?: string) =>
  apiRequest<ApiResult>('/v1/automations', { method: 'POST', body: { id } })

export const getAllAutomations = () =>
  apiRequest<ApiResult<any[]>>('/v1/automations')

export const getAutomationInfo = (id: string) =>
  apiRequest<ApiResult<any>>(`/v1/automations/${id}`)

export const updateAutomationName = (
  id: string,
  data: { name?: string; active?: boolean }
) => apiRequest<ApiResult>(`/v1/automations/${id}`, { method: 'PATCH', body: data })

export const saveListener = (
  id: string,
  listener: 'SMARTAI' | 'MESSAGE',
  prompt: string,
  reply?: string
) => apiRequest<ApiResult>(`/v1/automations/${id}/listener`, {
  method: 'PUT',
  body: { listener, prompt, reply },
})

export const saveTrigger = (id: string, trigger: string[]) =>
  apiRequest<ApiResult>(`/v1/automations/${id}/triggers`, {
    method: 'PUT',
    body: { trigger },
  })

export const saveKeyword = (id: string, keyword: string) =>
  apiRequest<ApiResult>(`/v1/automations/${id}/keywords`, {
    method: 'POST',
    body: { keyword },
  })

export const deleteKeyword = (id: string) =>
  apiRequest<ApiResult>(`/v1/keywords/${id}`, { method: 'DELETE' })

export const getProfilePosts = () =>
  apiRequest<ApiResult<{ data: any[] }>>('/v1/instagram/media')

export const savePosts = (id: string, posts: unknown[]) =>
  apiRequest<ApiResult>(`/v1/automations/${id}/posts`, {
    method: 'PUT',
    body: { posts },
  })

export const activateAutomation = (id: string, active: boolean) =>
  updateAutomationName(id, { active })
