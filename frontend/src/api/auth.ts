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
  },

  forgotPassword: async (email: string): Promise<{ message: string }> => {
    const res = await client.post('/auth/forgot-password', { email })
    return res.data
  },

  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const res = await client.post('/auth/reset-password', {
      token,
      new_password: newPassword
    })
    return res.data
  }
}
