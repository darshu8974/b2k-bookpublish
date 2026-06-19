import { useNavigate } from 'react-router-dom'
import {
  Card, CardContent, CardHeader, Table, TableBody, TableCell,
  TableHead, TableRow, Typography, Box, Button, Skeleton,
} from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import StatusChip from '../../components/common/StatusChip'
import PriorityBadge from '../../components/common/PriorityBadge'
import { UserAvatar } from '../../components/common/UserAvatar'
import { formatDate, getDaysLeft } from '../../utils/dateFormatter'
import { WORKFLOW_STAGES } from '../../utils/constants'

function DueLabel({ dueDate }) {
  if (!dueDate) return <Typography fontSize="0.8rem" color="text.disabled">—</Typography>
  const days = getDaysLeft(dueDate)
  if (days < 0) return <Typography fontSize="0.8rem" fontWeight={600} color="error.main">{Math.abs(days)}d overdue</Typography>
  if (days <= 3) return <Typography fontSize="0.8rem" fontWeight={600} color="warning.dark">{days === 0 ? 'Today' : `${days}d`}</Typography>
  return <Typography fontSize="0.8rem" color="text.secondary">{formatDate(dueDate)}</Typography>
}

export default function RecentProjectsTable({ projects, loading }) {
  const navigate = useNavigate()
  const recent = [...projects].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 8)

  const stageLabel = (key) => WORKFLOW_STAGES.find((s) => s.key === key)?.label || key

  return (
    <Card>
      <CardHeader
        title={<Typography fontWeight={700} fontSize="0.95rem">Recent Projects</Typography>}
        subheader={<Typography fontSize="0.78rem" color="text.secondary">Last updated first</Typography>}
        action={
          <Button size="small" endIcon={<ArrowForwardIcon fontSize="small" />} onClick={() => navigate('/projects')}>
            View all
          </Button>
        }
        sx={{ pb: 0 }}
      />
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Project</TableCell>
              <TableCell>Stage</TableCell>
              <TableCell>Priority</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Manager</TableCell>
              <TableCell>Due Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((_, j) => (
                    <TableCell key={j}><Skeleton variant="text" /></TableCell>
                  ))}
                </TableRow>
              ))
              : recent.map((project) => (
                <TableRow
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box>
                      <Typography fontSize="0.875rem" fontWeight={600} color="text.primary" lineHeight={1.3}>
                        {project.title.length > 45 ? `${project.title.slice(0, 45)}…` : project.title}
                      </Typography>
                      <Typography fontSize="0.72rem" color="text.disabled">{project.projectCode}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="0.8rem" color="text.secondary">
                      {stageLabel(project.currentStage)}
                    </Typography>
                  </TableCell>
                  <TableCell><PriorityBadge priority={project.priority} /></TableCell>
                  <TableCell><StatusChip status={project.status} /></TableCell>
                  <TableCell>
                    <Typography fontSize="0.8rem" color="text.secondary">
                      {project.projectManagerName || '—'}
                    </Typography>
                  </TableCell>
                  <TableCell><DueLabel dueDate={project.dueDate} /></TableCell>
                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
