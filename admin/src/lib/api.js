import axios from 'axios'
 
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // send the httpOnly refresh cookie
  headers: { 'Content-Type': 'application/json' },
})
 
let accessToken = null
let onUnauthorized = () => {}
 
export function setAccessToken(token) {
  accessToken = token
}
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}
 
api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`
  if (config.data instanceof FormData) delete config.headers['Content-Type']
  return config
})
 
let isRefreshing = false
let queue = []
// Every caller (the response interceptor below AND AuthContext's initial
// mount-time refresh) shares this single in-flight promise, so at most one
// POST /auth/refresh is ever outstanding at a time — never two racing
// requests rotating the same refresh token cookie underneath each other.
let refreshPromise = null
 
function flushQueue(error, token) {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token)))
  queue = []
}
 
/**
 * Perform (or piggyback on an in-flight) token refresh. Safe to call from
 * multiple places concurrently — only one network request is ever made.
 * Resolves with the new access token, or throws on failure.
 */
export function refreshAccessToken() {
  if (refreshPromise) return refreshPromise
 
  isRefreshing = true
  refreshPromise = api
    .post('/auth/refresh')
    .then(({ data }) => {
      const newToken = data.data.accessToken
      setAccessToken(newToken)
      flushQueue(null, newToken)
      return newToken
    })
    .catch((err) => {
      flushQueue(err, null)
      setAccessToken(null)
      throw err
    })
    .finally(() => {
      isRefreshing = false
      refreshPromise = null
    })
 
  return refreshPromise
}
 
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error.response?.status
 
    if (status === 401 && !original._retry && !original.url?.includes('/auth/')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({ resolve, reject })
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`
          return api(original)
        })
      }
 
      original._retry = true
 
      try {
        const newToken = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch (refreshError) {
        onUnauthorized()
        return Promise.reject(refreshError)
      }
    }
 
    return Promise.reject(error)
  }
)
 
export default api
 