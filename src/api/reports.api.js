import client from './client'

export const reportsApi = {
  getProjectStatus: () =>
    client.get('/reports/project-status'),

  getStageThroughput: () =>
    client.get('/reports/stage-throughput'),

  getTeamWorkload: () =>
    client.get('/reports/team-workload'),
}
