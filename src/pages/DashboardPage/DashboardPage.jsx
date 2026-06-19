import { Box, Grid, Card, CardContent, Typography, LinearProgress, Chip } from '@mui/material'
import PageHeader from '../../components/common/PageHeader'
import StatsCards from './StatsCards'
import StageDistributionChart from './StageDistributionChart'
import WorkloadChart from './WorkloadChart'
import RecentProjectsTable from './RecentProjectsTable'
import useProjects from '../../hooks/useProjects'
import useAuth from '../../auth/useAuth'
import { ROLE_LABELS } from '../../utils/constants'

function WorkQueueCard({ projects, user }) {
  const assigned = projects
    .filter((p) => p.status === 'ACTIVE')
    .map((p) => {
      const stage = p.stages?.find((s) => s.assignedTo === user?.id && s.status === 'IN_PROGRESS')
      return stage ? { project: p, stage } : null
    })
    .filter(Boolean)
    .slice(0, 5)

  if (assigned.length === 0) return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', py: 5 }}>
        <Typography fontSize="0.875rem" color="text.secondary">No stages assigned to you right now.</Typography>
      </CardContent>
    </Card>
  )

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2 }}>
        <Typography fontWeight={700} fontSize="0.95rem" mb={0.5}>My Work Queue</Typography>
        <Typography fontSize="0.78rem" color="text.secondary" mb={2}>Your active stage assignments</Typography>
        {assigned.map(({ project, stage }) => (
          <Box key={stage.id} sx={{ mb: 1.5, p: 1.25, border: '1px solid #DFE1E6', borderRadius: 2 }}>
            <Typography fontSize="0.8rem" fontWeight={600} noWrap mb={0.25}>{project.title}</Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip label={stage.stageName.replace('_', ' ')} size="small" sx={{ fontSize: '0.65rem', height: 18 }} />
              <Typography fontSize="0.72rem" color="text.secondary">In Progress</Typography>
            </Box>
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

function TeamWorkloadBar({ projects }) {
  const workloadMap = {}
  projects.forEach((p) => {
    (p.stages || []).forEach((s) => {
      if (s.status === 'IN_PROGRESS' && s.assignedTo) {
        if (!workloadMap[s.assignedTo]) {
          workloadMap[s.assignedTo] = { name: s.assignedToName || s.assignedTo, openStages: 0 }
        }
        workloadMap[s.assignedTo].openStages += 1
      }
    })
  })
  const data = Object.values(workloadMap)
  const max = Math.max(...data.map((d) => d.openStages), 1)

  if (data.length === 0) return (
    <Card>
      <CardContent sx={{ p: 2, textAlign: 'center', py: 4 }}>
        <Typography fontSize="0.875rem" color="text.secondary">No active stage assignments yet.</Typography>
      </CardContent>
    </Card>
  )

  return (
    <Card>
      <CardContent sx={{ p: 2 }}>
        <Typography fontWeight={700} fontSize="0.95rem" mb={0.5}>Team Workload</Typography>
        <Typography fontSize="0.78rem" color="text.secondary" mb={2}>Open stages per team member</Typography>
        {data.map((member) => (
          <Box key={member.name} sx={{ mb: 1.75 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
              <Typography fontSize="0.82rem" fontWeight={600}>{member.name}</Typography>
              <Typography fontSize="0.82rem" fontWeight={700} color="primary.main">{member.openStages}</Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={(member.openStages / max) * 100}
              sx={{
                bgcolor: '#F0F2F5',
                '& .MuiLinearProgress-bar': { bgcolor: member.openStages >= 3 ? '#FF991F' : '#0052CC' },
              }}
            />
          </Box>
        ))}
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const { projects, loading } = useProjects()

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <Box>
      <PageHeader
        title={`${greeting()}, ${ROLE_LABELS[user?.role] || user?.fullName?.split(' ')[0]} 👋`}
        subtitle={`Here's what's happening in PublishFlow today — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {/* KPI Cards */}
      <StatsCards projects={projects} loading={loading} />

      {/* Charts row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 380px' }, gap: 2.5, mb: 2.5 }}>
        <StageDistributionChart projects={projects} />
        <WorkloadChart projects={projects} />
      </Box>

      {/* Bottom row */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 360px' }, gap: 2.5 }}>
        <RecentProjectsTable projects={projects} loading={loading} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          <WorkQueueCard projects={projects} user={user} />
          <TeamWorkloadBar projects={projects} />
        </Box>
      </Box>
    </Box>
  )
}
