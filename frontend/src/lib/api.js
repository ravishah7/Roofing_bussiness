import axios from 'axios'

// Base Axios instance for the admin/backend API.
// Point VITE_API_URL at your backend; falls back to a relative /api path.
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('roofco-auth-token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      window.localStorage.removeItem('roofco-auth-token')
    }
    return Promise.reject(error)
  }
)
