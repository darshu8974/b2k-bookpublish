import { Card, CardContent, CardHeader, Box, Typography } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { WORKFLOW_STAGES, PHASE_COLORS } from '../../utils/constants'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: '#172B4D', color: '#fff', px: 1.5, py: 1, borderRadius: 1.5, boxShadow: 3 }}>
      <Typography fontSize="0.8rem" fontWeight={600}>{label}</Typography>
      <Typography fontSize="0.75rem" color="#B8C7E0">{payload[0].value} project{payload[0].value !== 1 ? 's' : ''}</Typography>
    </Box>
  )
}

export default function StageDistributionChart({ projects }) {
  const data = WORKFLOW_STAGES.map((s) => ({
    stage: s.label,
    key: s.key,
    count: projects.filter((p) => p.currentStage === s.key).length,
  }))

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title={
          <Box>
            <Typography fontWeight={700} fontSize="0.95rem">Projects by Stage</Typography>
            <Typography fontSize="0.78rem" color="text.secondary">Pipeline distribution snapshot</Typography>
          </Box>
        }
        sx={{ pb: 0, '& .MuiCardHeader-content': { flex: 1 } }}
      />
      <CardContent sx={{ pt: 1.5 }}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
            <XAxis
              dataKey="stage"
              tick={{ fontSize: 10, fill: '#5E6C84' }}
              angle={-35}
              textAnchor="end"
              interval={0}
              height={55}
            />
            <YAxis tick={{ fontSize: 11, fill: '#5E6C84' }} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(9,30,66,0.04)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((d, idx) => (
                <Cell key={idx} fill={PHASE_COLORS[d.key]?.main || '#4C9AFF'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
