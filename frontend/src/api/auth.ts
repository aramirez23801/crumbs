import client from './client'

export interface User {
  id: string
  email: string
  username: string
  created_at: string
}

export interface AuthResponse {
  api_key: string
  user: User
}

export const authApi = {
  register: async (
    email: string,
    username: string,
    password: string
  ): Promise<AuthResponse> => {
    const res = await client.post('/auth/register', {
      email,
      username,
      password
    })
    return res.data
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await client.post('/auth/login', { email, password })
    return res.data
  },

  me: async (): Promise<User> => {
    const res = await client.get('/auth/me')
    return res.data
  }
}
