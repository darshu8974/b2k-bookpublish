import client from './client'

export const incomingApi = {
  getAll: () => client.get('/incoming'),
  unreadCount: () => client.get('/incoming/unread-count'),
  pollNow: () => client.post('/incoming/poll'),
  markHandled: (id, handled = true) =>
    client.patch(`/incoming/${id}/handled`, null, { params: { handled } }),
  download: (id) => client.get(`/incoming/${id}/download`, { responseType: 'blob' }),
  delete: (id) => client.delete(`/incoming/${id}`),
}
