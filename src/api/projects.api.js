import client from './client'

export const projectsApi = {
  getAll: (params) =>
    client.get('/projects', { params }),

  getById: (id) =>
    client.get(`/projects/${id}`),

  create: (data) =>
    client.post('/projects', data),

  update: (id, data) =>
    client.put(`/projects/${id}`, data),

  updateStatus: (id, status) =>
    client.patch(`/projects/${id}/status`, { status }),

  delete: (id) =>
    client.delete(`/projects/${id}`),

  getActivity: (id) =>
    client.get(`/projects/${id}/activity`),
}
