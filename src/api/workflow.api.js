import client from './client'

export const workflowApi = {
  getStages: (projectId) =>
    client.get(`/projects/${projectId}/workflow/stages`),

  assignStage: (projectId, stageName, data) =>
    client.post(`/projects/${projectId}/workflow/stages/${stageName}/assign`, data),

  advanceStage: (projectId, data) =>
    client.post(`/projects/${projectId}/workflow/advance`, data),

  rejectStage: (projectId, data) =>
    client.post(`/projects/${projectId}/workflow/reject`, data),
}
