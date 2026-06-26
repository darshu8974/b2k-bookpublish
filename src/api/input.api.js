import client from './client'

export const inputApi = {
  getAll: () => client.get('/input'),
  moveFromIncoming: (incomingId) => client.post(`/input/move/${incomingId}`),
  download: (id) => client.get(`/input/${id}/download`, { responseType: 'blob' }),
  delete: (id) => client.delete(`/input/${id}`),
}
