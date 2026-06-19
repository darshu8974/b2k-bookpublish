import { Box, Card, CardContent, Typography, Skeleton } from '@mui/material'
import FolderOpenIcon from '@mui/icons-material/FolderOpenOutlined'
import WarningIcon from '@mui/icons-material/WarningAmberOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

function StatCard({ icon: Icon, label, value, color, trend, trendLabel, loading }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        {loading ? (
          <>
            <Skeleton variant="circular" width={40} height={40} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="60%" height={40} sx={{ mb: 0.5 }} />
            <Skeleton variant="text" width="80%" height={20} />
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
              <Box sx={{
                width: 44, height: 44, borderRadius: 2,
                bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon sx={{ color, fontSize: '1.3rem' }} />
              </Box>
              {trend !== undefined && (
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 0.5,
                  bgcolor: trend >= 0 ? '#E3FCEF' : '#FFEBE6',
                  px: 0.75, py: 0.25, borderRadius: '4px',
                }}>
                  {trend >= 0
                    ? <TrendingUpIcon sx={{ fontSize: '0.8rem', color: '#00875A' }} />
                    : <TrendingDownIcon sx={{ fontSize: '0.8rem', color: '#DE350B' }} />}
                  <Typography fontSize="0.7rem" fontWeight={700} color={trend >= 0 ? '#006644' : '#BF2600'}>
                    {Math.abs(trend)}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography variant="h4" fontWeight={800} lineHeight={1} mb={0.5} color="text.primary">
              {value}
            </Typography>
            <Typography fontSize="0.82rem" color="text.secondary" fontWeight={500}>{label}</Typography>
            {trendLabel && (
              <Typography fontSize="0.72rem" color="text.disabled" mt={0.5}>{trendLabel}</Typography>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function StatsCards({ projects, loading }) {
  const active = projects.filter((p) => p.status === 'ACTIVE').length
  const completed = projects.filter((p) => p.status === 'COMPLETED').length
  const onHold = projects.filter((p) => p.status === 'ON_HOLD').length

  const dueThisWeek = projects.filter((p) => {
    if (!p.dueDate) return false
    const days = Math.ceil((new Date(p.dueDate) - new Date()) / 86400000)
    return days >= 0 && days <= 7
  }).length

  const cards = [
    { icon: FolderOpenIcon, label: 'Active Projects', value: active, color: '#0052CC', trend: 12, trendLabel: 'vs last month' },
    { icon: WarningIcon, label: 'Due This Week', value: dueThisWeek, color: '#FF991F', trend: dueThisWeek > 0 ? -5 : 8, trendLabel: 'vs last week' },
    { icon: AssignmentIcon, label: 'On Hold', value: onHold, color: '#6554C0', trend: undefined, trendLabel: 'Awaiting action' },
    { icon: CheckCircleIcon, label: 'Completed', value: completed, color: '#00875A', trend: 18, trendLabel: 'vs last month' },
  ]

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2.5, mb: 3 }}>
      {cards.map((card) => (
        <StatCard key={card.label} {...card} loading={loading} />
      ))}
    </Box>
  )
}
