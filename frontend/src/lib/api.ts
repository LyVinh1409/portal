const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

export async function apiFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) throw data || { status: res.status }
  return data
}

export type User = { id: number; email: string; created_at: string }

export const Users = {
  list: (limit = 20, offset = 0) => apiFetch(`/api/users?limit=${limit}&offset=${offset}`),
  get: (id: number) => apiFetch(`/api/users/${id}`),
  create: (payload: { email: string; password: string }) => apiFetch(`/api/users`, { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: number, payload: any) => apiFetch(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id: number) => apiFetch(`/api/users/${id}`, { method: 'DELETE' }),
  delete: (id: number) => apiFetch(`/api/users/${id}`, { method: 'DELETE' }),
}

export const Categories = {
  list: (limit = 100, offset = 0) => apiFetch(`/api/categories?limit=${limit}&offset=${offset}`),
  get: (id: number) => apiFetch(`/api/categories/${id}`),
  create: (payload: { name: string; slug: string; parent_id?: number | null }) => apiFetch(`/api/categories`, { method: 'POST', body: JSON.stringify(payload)}),
  update: (id: number, payload: any) => apiFetch(`/api/categories/${id}`, { method: 'PUT', body: JSON.stringify(payload)}),
  remove: (id: number) => apiFetch(`/api/categories/${id}`, { method: 'DELETE' }),
  delete: (id: number) => apiFetch(`/api/categories/${id}`, { method: 'DELETE' }),
  children: (id: number) => apiFetch(`/api/categories/${id}/children`),
}

export const NewsAPI = {
  list: (limit = 20, offset = 0) => apiFetch(`/api/news?limit=${limit}&offset=${offset}`),
  getByID: (id: number) => apiFetch(`/api/news/${id}`),
  getBySlug: (slug: string) => apiFetch(`/api/news/slug/${slug}`),
  create: (payload: any) => apiFetch(`/api/news`, { method: 'POST', body: JSON.stringify(payload)}),
  update: (id: number, payload: any) => apiFetch(`/api/news/${id}`, { method: 'PUT', body: JSON.stringify(payload)}),
  remove: (id: number) => apiFetch(`/api/news/${id}`, { method: 'DELETE' }),
  delete: (id: number) => apiFetch(`/api/news/${id}`, { method: 'DELETE' }),
  addComment: (id: number, payload: any) => apiFetch(`/api/news/${id}/comments`, { method: 'POST', body: JSON.stringify(payload)}),
}

export const Uploads = {
  uploadFile: async (file: File) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`${API_URL}/api/upload`, { method: 'POST', body: fd })
    if (!res.ok) throw await res.json()
    return res.json()
  }
}

export const Banners = {
  list: (limit = 50, offset = 0) => apiFetch(`/api/banners?limit=${limit}&offset=${offset}`),
  get: (id: number) => apiFetch(`/api/banners/${id}`),
  create: (payload: any) => apiFetch(`/api/banners`, { method: 'POST', body: JSON.stringify(payload)}),
  update: (id: number, payload: any) => apiFetch(`/api/banners/${id}`, { method: 'PUT', body: JSON.stringify(payload)}),
  remove: (id: number) => apiFetch(`/api/banners/${id}`, { method: 'DELETE' }),
  delete: (id: number) => apiFetch(`/api/banners/${id}`, { method: 'DELETE' }),
}
export const BannersAPI = Banners

export const MediaAPI = {
  list: (folder = 'root', limit = 50, offset = 0) => apiFetch(`/api/media?folder=${encodeURIComponent(folder)}&limit=${limit}&offset=${offset}`),
  uploadForm: async (form: FormData) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'
    const res = await fetch(`${API_URL}/api/media/upload`, { method: 'POST', body: form })
    if (!res.ok) throw await res.json()
    return res.json()
  },
  get: (id: number) => apiFetch(`/api/media/${id}`),
  remove: (id: number) => apiFetch(`/api/media/${id}`, { method: 'DELETE' }),
  folders: () => apiFetch(`/api/media/folders`),
}
