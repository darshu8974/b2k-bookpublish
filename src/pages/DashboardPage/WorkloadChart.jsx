import { Card, CardContent, CardHeader, Box, Typography } from '@mui/material'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const STATUS_COLORS = { ACTIVE: '#0052CC', COMPLETED: '#00875A', ON_HOLD: '#FF991F', DRAFT: '#97A0AF', CANCELLED: '#DE350B' }
const STATUS_ORDER = ['ACTIVE', 'COMPLETED', 'ON_HOLD', 'DRAFT', 'CANCELLED']

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: '#172B4D', color: '#fff', px: 1.5, py: 1, borderRadius: 1.5 }}>
      <Typography fontSize="0.8rem" fontWeight={600}>{payload[0].name}</Typography>
      <Typography fontSize="0.75rem" color="#B8C7E0">{payload[0].value} projects</Typography>
    </Box>
  )
}

function CustomLegend({ payload }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 1 }}>
      {payload.map((entry) => (
        <Box key={entry.value} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color, flexShrink: 0 }} />
            <Typography fontSize="0.8rem" color="text.secondary">{entry.value}</Typography>
          </Box>
          <Typography fontSize="0.8rem" fontWeight={600}>{entry.payload.count}</Typography>
        </Box>
      ))}
    </Box>
  )
}

export default function WorkloadChart({ projects = [] }) {
  const data = STATUS_ORDER.map((status) => ({
    name: status.charAt(0) + status.slice(1).toLowerCase().replace('_', ' '),
    count: projects.filter((p) => p.status === status).length,
    color: STATUS_COLORS[status],
  })).filter((d) => d.count > 0)

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box>
            <Typography fontWeight={700} fontSize="0.95rem">Project Status Overview</Typography>
            <Typography fontSize="0.78rem" color="text.secondary">All-time distribution</Typography>
          </Box>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ pt: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="count">
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <Box sx={{ flex: 1 }}>
            <CustomLegend payload={data.map((d) => ({ value: d.name, color: d.color, payload: d }))} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}
