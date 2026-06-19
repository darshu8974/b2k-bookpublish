import { Box, Card, CardContent, Typography, Divider, Skeleton } from '@mui/material'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, Legend, Cell,
} from 'recharts'
import PageHeader from '../../components/common/PageHeader'
import useReports from '../../hooks/useReports'

const STAGE_COLORS = ['#4C9AFF','#0052CC','#6554C0','#8777D9','#57D9A3','#00875A','#FF991F','#FF5630']
const PRIORITY_COLORS = { Urgent: '#FF5630', High: '#FF991F', Medium: '#0052CC', Low: '#57D9A3' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <Box sx={{ bgcolor: '#172B4D', color: '#fff', px: 1.5, py: 1, borderRadius: 1.5, boxShadow: 3 }}>
      <Typography fontSize="0.8rem" fontWeight={600}>{label}</Typography>
      {payload.map((p) => (
        <Typography key={p.name} fontSize="0.75rem" color="#B8C7E0">
          {p.name}: {p.value}
        </Typography>
      ))}
    </Box>
  )
}

function SectionTitle({ children }) {
  return <Typography fontWeight={700} fontSize="1rem" mb={0.5}>{children}</Typography>
}

function SectionSub({ children }) {
  return <Typography fontSize="0.78rem" color="text.secondary" mb={2}>{children}</Typography>
}

function ChartSkeleton({ height = 220 }) {
  return <Skeleton variant="rectangular" height={height} sx={{ borderRadius: 1 }} />
}

export default function ReportsPage() {
  const { data, loading, error } = useReports()

  return (
    <Box>
      <PageHeader
        title="Reports"
        subtitle="Project analytics and team performance overview"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Reports' }]}
      />

      {error && (
        <Box sx={{ p: 2, mb: 2, bgcolor: '#FFEBE6', borderRadius: 2, color: '#BF2600', fontSize: '0.875rem' }}>
          Failed to load report data: {error}
        </Box>
      )}

      {/* Row 1: Stage Distribution + Priority Breakdown */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2.5, mb: 2.5 }}>
        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <SectionTitle>Projects by Stage</SectionTitle>
            <SectionSub>Current pipeline snapshot</SectionSub>
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.projectsByStage || []} margin={{ top: 5, right: 10, left: -20, bottom: 25 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                  <XAxis dataKey="stage" tick={{ fontSize: 10, fill: '#5E6C84' }} angle={-35} textAnchor="end" height={60} interval={0} />
                  <YAxis tick={{ fontSize: 11, fill: '#5E6C84' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(9,30,66,0.04)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Projects">
                    {(data?.projectsByStage || []).map((_, i) => (
                      <Cell key={i} fill={STAGE_COLORS[i % STAGE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ p: 2.5 }}>
            <SectionTitle>Projects by Priority</SectionTitle>
            <SectionSub>Distribution of active project urgency levels</SectionSub>
            {loading ? <ChartSkeleton /> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data?.projectsByPriority || []} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                  <XAxis dataKey="priority" tick={{ fontSize: 11, fill: '#5E6C84' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#5E6C84' }} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(9,30,66,0.04)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Projects">
                    {(data?.projectsByPriority || []).map((entry) => (
                      <Cell key={entry.priority} fill={PRIORITY_COLORS[entry.priority] || '#0052CC'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Row 2: Monthly Trend */}
      <Card sx={{ mb: 2.5 }}>
        <CardContent sx={{ p: 2.5 }}>
          <SectionTitle>Monthly Project Trend</SectionTitle>
          <SectionSub>Projects started vs completed over the last 6 months</SectionSub>
          {loading ? <ChartSkeleton /> : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.monthlyTrend || []} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#EBECF0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#5E6C84' }} />
                <YAxis tick={{ fontSize: 11, fill: '#5E6C84' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '0.82rem' }} />
                <Line type="monotone" dataKey="started" stroke="#0052CC" strokeWidth={2.5} dot={{ r: 4, fill: '#0052CC' }} name="Started" />
                <Line type="monotone" dataKey="completed" stroke="#00875A" strokeWidth={2.5} dot={{ r: 4, fill: '#00875A' }} name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Row 3: Team Workload */}
      <Card>
        <CardContent sx={{ p: 2.5 }}>
          <SectionTitle>Project Manager Workload</SectionTitle>
          <SectionSub>Active projects and completions this month per manager</SectionSub>
          {loading ? (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1.5, mt: 1 }}>
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} variant="rectangular" height={90} sx={{ borderRadius: 2 }} />)}
            </Box>
          ) : !data?.teamWorkload?.length ? (
            <Typography fontSize="0.875rem" color="text.secondary" sx={{ mt: 1 }}>No project manager data available.</Typography>
          ) : (
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 1.5, mt: 1 }}>
              {data.teamWorkload.map((member) => (
                <Box key={member.name} sx={{ p: 1.75, border: '1px solid #DFE1E6', borderRadius: 2 }}>
                  <Typography fontSize="0.875rem" fontWeight={600} mb={0.25}>{member.name}</Typography>
                  <Divider sx={{ mb: 1.25 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography fontSize="1.4rem" fontWeight={800} color={member.openStages >= 3 ? 'warning.dark' : 'primary.main'}>
                        {member.openStages}
                      </Typography>
                      <Typography fontSize="0.7rem" color="text.secondary">Active Projects</Typography>
                    </Box>
                    <Divider orientation="vertical" flexItem />
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography fontSize="1.4rem" fontWeight={800} color="success.main">
                        {member.completedThisMonth}
                      </Typography>
                      <Typography fontSize="0.7rem" color="text.secondary">Done This Month</Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
