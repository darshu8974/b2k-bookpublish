import client from './client'

export const authApi = {
  login: (email, password) =>
    client.post('/auth/login', { email, password }),

  logout: (refreshToken) =>
    client.post('/auth/logout', { refreshToken }),

  refresh: (refreshToken) =>
    client.post('/auth/refresh', { refreshToken }),

  getMe: () =>
    client.get('/auth/me'),
}
