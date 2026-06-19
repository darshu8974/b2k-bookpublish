import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Table, TableBody, TableCell, TableHead, TableRow, TableSortLabel,
  Box, Typography, IconButton, Tooltip, Skeleton, Chip,
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import StatusChip from '../../components/common/StatusChip'
import PriorityBadge from '../../components/common/PriorityBadge'
import { UserAvatar } from '../../components/common/UserAvatar'
import EmptyState from '../../components/common/EmptyState'
import { formatDate, getDaysLeft } from '../../utils/dateFormatter'
import { WORKFLOW_STAGES } from '../../utils/constants'
import FolderOpenIcon from '@mui/icons-material/FolderOpenOutlined'

const PRIORITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }

const COLUMNS = [
  { id: 'title',              label: 'Project',       sortKey: 'title' },
  { id: 'customer',           label: 'Customer',      sortKey: 'customer' },
  { id: 'currentStage',       label: 'Current Stage', sortKey: 'currentStage' },
  { id: 'priority',           label: 'Priority',      sortKey: 'priority' },
  { id: 'status',             label: 'Status',        sortKey: 'status' },
  { id: 'projectManagerName', label: 'Manager',       sortKey: 'projectManagerName' },
  { id: 'dueDate',            label: 'Due Date',      sortKey: 'dueDate' },
]

function DueDateCell({ date }) {
  if (!date) return <Typography fontSize="0.8rem" color="text.disabled">—</Typography>
  const days = getDaysLeft(date)
  if (days === null) return null
  const color = days < 0 ? 'error.main' : days <= 3 ? 'warning.dark' : 'text.secondary'
  const label = days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Today' : formatDate(date)
  return (
    <Box>
      <Typography fontSize="0.82rem" color={color} fontWeight={days <= 3 ? 600 : 400}>{label}</Typography>
      {days >= 0 && days <= 3 && days !== 0 && (
        <Typography fontSize="0.7rem" color={color}>{days}d left</Typography>
      )}
    </Box>
  )
}

export default function ProjectsTable({ projects, loading }) {
  const navigate = useNavigate()
  const [sortBy, setSortBy] = useState('title')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = (key) => {
    if (sortBy === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortDir('asc')
    }
  }

  const sorted = useMemo(() => {
    if (!projects.length) return projects
    return [...projects].sort((a, b) => {
      let av, bv
      if (sortBy === 'customer') {
        av = a.customer?.name || ''
        bv = b.customer?.name || ''
      } else if (sortBy === 'priority') {
        av = PRIORITY_ORDER[a.priority] ?? 99
        bv = PRIORITY_ORDER[b.priority] ?? 99
      } else if (sortBy === 'dueDate') {
        av = a.dueDate || '9999'
        bv = b.dueDate || '9999'
      } else {
        av = (a[sortBy] || '').toString().toLowerCase()
        bv = (b[sortBy] || '').toString().toLowerCase()
      }
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }, [projects, sortBy, sortDir])

  const stageLabel = (key) => WORKFLOW_STAGES.find((s) => s.key === key)?.label || key

  if (!loading && projects.length === 0) {
    return (
      <EmptyState
        icon={FolderOpenIcon}
        title="No projects found"
        description="Try adjusting your filters or create a new project to get started."
      />
    )
  }

  return (
    <Table size="small" stickyHeader>
      <TableHead>
        <TableRow>
          {COLUMNS.map((col) => (
            <TableCell key={col.id}>
              <TableSortLabel
                active={sortBy === col.sortKey}
                direction={sortBy === col.sortKey ? sortDir : 'asc'}
                onClick={() => handleSort(col.sortKey)}
              >
                {col.label}
              </TableSortLabel>
            </TableCell>
          ))}
          <TableCell align="right">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <TableRow key={i}>
              {Array.from({ length: 8 }).map((_, j) => (
                <TableCell key={j}><Skeleton variant="text" height={20} /></TableCell>
              ))}
            </TableRow>
          ))
          : sorted.map((project) => (
            <TableRow
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              sx={{ cursor: 'pointer', '&:hover': { bgcolor: '#F4F5F7' } }}
            >
              <TableCell sx={{ maxWidth: 280 }}>
                <Box>
                  <Typography fontSize="0.875rem" fontWeight={600} color="text.primary" lineHeight={1.3}>
                    {project.title.length > 48 ? `${project.title.slice(0, 48)}…` : project.title}
                  </Typography>
                  <Typography fontSize="0.72rem" color="primary.main" fontWeight={500}>{project.projectCode}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography fontSize="0.82rem" color="text.secondary" noWrap sx={{ maxWidth: 140 }}>
                  {project.customer?.name || '—'}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={stageLabel(project.currentStage)}
                  size="small"
                  sx={{ bgcolor: '#E9F2FF', color: '#0052CC', fontWeight: 600, fontSize: '0.7rem', borderRadius: '4px', height: 22 }}
                />
              </TableCell>
              <TableCell><PriorityBadge priority={project.priority} /></TableCell>
              <TableCell><StatusChip status={project.status} /></TableCell>
              <TableCell>
                {project.projectManager
                  ? <UserAvatar user={project.projectManager} size={28} />
                  : <Typography fontSize="0.8rem" color="text.disabled">—</Typography>
                }
              </TableCell>
              <TableCell><DueDateCell date={project.dueDate} /></TableCell>
              <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                <Tooltip title="Open project">
                  <IconButton size="small" onClick={() => navigate(`/projects/${project.id}`)}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))
        }
      </TableBody>
    </Table>
  )
}
