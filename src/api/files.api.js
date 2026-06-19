import client from './client'

export const filesApi = {
  upload: (projectId, formData, onUploadProgress) =>
    client.post(`/projects/${projectId}/files`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),

  getByProject: (projectId) =>
    client.get(`/projects/${projectId}/files`),

  download: (fileId) =>
    client.get(`/files/${fileId}/download`, { responseType: 'blob' }),

  delete: (fileId) =>
    client.delete(`/files/${fileId}`),
}
