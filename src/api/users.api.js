import client from './client'

export const usersApi = {
  getAll: (params) =>
    client.get('/users', { params }),

  getById: (id) =>
    client.get(`/users/${id}`),

  create: (data) =>
    client.post('/users', data),

  update: (id, data) =>
    client.put(`/users/${id}`, data),

  updateStatus: (id, isActive) =>
    client.patch(`/users/${id}/status`, { isActive }),

  delete: (id) =>
    client.delete(`/users/${id}`),
}
