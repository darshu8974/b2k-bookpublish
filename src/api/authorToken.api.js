import client from './client'

export const authorTokenApi = {
  getPortalInfo: (token) => client.get('/author/review', { params: { token } }),
  approve: (token, comment) => client.post('/author/review/approve', { token, comment }),
  reject: (token, comment) => client.post('/author/review/reject', { token, comment }),
  generate: (projectId, data) => client.post(`/projects/${projectId}/author-token`, data),
  list: (projectId) => client.get(`/projects/${projectId}/author-token`),
}
