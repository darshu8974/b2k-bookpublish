import { Box, Typography, Button, Menu, MenuItem, Chip, Divider } from '@mui/material'
import EditIcon from '@mui/icons-material/EditOutlined'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import CalendarIcon from '@mui/icons-material/CalendarTodayOutlined'
import BusinessIcon from '@mui/icons-material/BusinessOutlined'
import { useState } from 'react'
import StatusChip from '../../components/common/StatusChip'
import PriorityBadge from '../../components/common/PriorityBadge'
import { UserAvatarWithName } from '../../components/common/UserAvatar'
import { formatDate, getDaysLeft } from '../../utils/dateFormatter'
import { WORKFLOW_STAGES } from '../../utils/constants'

export default function ProjectHeader({ project, onStatusChange, onEdit, canEdit }) {
  const [menuAnchor, setMenuAnchor] = useState(null)

  const stageLabel = WORKFLOW_STAGES.find((s) => s.key === project.currentStage)?.label || project.currentStage
  const daysLeft = getDaysLeft(project.dueDate)

  return (
    <Box sx={{ mb: 3 }}>
      {/* Top row */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, mb: 2 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Chip
              label={project.projectCode}
              size="small"
              sx={{ bgcolor: '#E9F2FF', color: '#0052CC', fontWeight: 700, fontSize: '0.72rem', borderRadius: '4px', height: 22 }}
            />
            <StatusChip status={project.status} />
            <PriorityBadge priority={project.priority} />
          </Box>
          <Typography variant="h5" fontWeight={800} color="text.primary" lineHeight={1.3} mb={0.5}>
            {project.title}
          </Typography>
          {project.description && (
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 700 }}>
              {project.description}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
          {canEdit && (
            <Button variant="outlined" size="small" startIcon={<EditIcon fontSize="small" />} onClick={onEdit}>
              Edit
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            sx={{ minWidth: 36, p: '5px' }}
            onClick={(e) => setMenuAnchor(e.currentTarget)}
          >
            <MoreVertIcon fontSize="small" />
          </Button>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            PaperProps={{ elevation: 2, sx: { borderRadius: 2, minWidth: 180, border: '1px solid #DFE1E6' } }}
          >
            {['ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED'].map((s) => (
              <MenuItem
                key={s}
                onClick={() => { onStatusChange && onStatusChange(s); setMenuAnchor(null) }}
                disabled={s === project.status}
                sx={{ fontSize: '0.875rem', py: 1 }}
              >
                Set to {s.replace('_', ' ')}
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Box>

      {/* Meta row */}
      <Box sx={{
        display: 'flex', flexWrap: 'wrap', gap: 3,
        p: 2, bgcolor: '#FAFBFC', borderRadius: 2, border: '1px solid #EBECF0',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <BusinessIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
          <Box>
            <Typography fontSize="0.7rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em">Client</Typography>
            <Typography fontSize="0.875rem" fontWeight={600}>{project.customer?.name || '—'}</Typography>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#EBECF0' }} />

        <Box>
          <Typography fontSize="0.7rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={0.5}>Project Manager</Typography>
          {project.projectManager
            ? <UserAvatarWithName user={project.projectManager} size={26} />
            : <Typography fontSize="0.875rem" color="text.disabled">Unassigned</Typography>
          }
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#EBECF0' }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <CalendarIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
          <Box>
            <Typography fontSize="0.7rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em">Due Date</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography fontSize="0.875rem" fontWeight={600} color={daysLeft !== null && daysLeft < 0 ? 'error.main' : daysLeft !== null && daysLeft <= 3 ? 'warning.dark' : 'text.primary'}>
                {formatDate(project.dueDate)}
              </Typography>
              {daysLeft !== null && daysLeft < 7 && (
                <Chip
                  label={daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? 'Today' : `${daysLeft}d left`}
                  size="small"
                  sx={{
                    bgcolor: daysLeft < 0 ? '#FFEBE6' : '#FFFAE6',
                    color: daysLeft < 0 ? '#BF2600' : '#172B4D',
                    fontWeight: 600, fontSize: '0.65rem', height: 18, borderRadius: '4px',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#EBECF0' }} />

        <Box>
          <Typography fontSize="0.7rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em">Current Stage</Typography>
          <Typography fontSize="0.875rem" fontWeight={600} color="primary.main">{stageLabel}</Typography>
        </Box>

        <Divider orientation="vertical" flexItem sx={{ borderColor: '#EBECF0' }} />

        <Box>
          <Typography fontSize="0.7rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em">Started</Typography>
          <Typography fontSize="0.875rem" fontWeight={500}>{formatDate(project.startedAt)}</Typography>
        </Box>
      </Box>
    </Box>
  )
}
