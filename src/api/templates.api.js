import client from './client'

export const templatesApi = {
  getAll: (params) => client.get('/templates', { params }),
  getById: (id) => client.get(`/templates/${id}`),
  create: (data) => client.post('/templates', data),
  update: (id, data) => client.put(`/templates/${id}`, data),
  delete: (id) => client.delete(`/templates/${id}`),
}
