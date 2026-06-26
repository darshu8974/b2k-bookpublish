import client from './client'

export const qcApi = {
  getChecklist: (projectId) =>
    client.get(`/projects/${projectId}/qc-checklist`),

  submit: (projectId, responses) =>
    client.post(`/projects/${projectId}/qc-checklist/submit`, { responses }),
}
