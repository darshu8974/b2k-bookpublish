import client from './client'

export const commentsApi = {
  getByProject: (projectId) =>
    client.get(`/projects/${projectId}/comments`),

  add: (projectId, data) =>
    client.post(`/projects/${projectId}/comments`, data),

  delete: (projectId, commentId) =>
    client.delete(`/projects/${projectId}/comments/${commentId}`),
}
