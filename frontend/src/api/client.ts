import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach API key to every request if it exists
client.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('crumbs_api_key')
  if (apiKey) {
    config.headers.Authorization = `Bearer ${apiKey}`
  }
  return config
})

// If 401 on a protected request, clear stored key and redirect to login.
// Skip the redirect on auth pages so the form can display the error itself.
const AUTH_PATHS = ['/login', '/forgot-password', '/reset-password']

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !AUTH_PATHS.some((p) => window.location.pathname.startsWith(p))
    ) {
      localStorage.removeItem('crumbs_api_key')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
