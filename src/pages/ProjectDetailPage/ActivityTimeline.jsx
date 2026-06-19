import { Box, Typography, Avatar, Divider } from '@mui/material'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ChatBubbleIcon from '@mui/icons-material/ChatBubble'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import FolderIcon from '@mui/icons-material/Folder'
import UndoIcon from '@mui/icons-material/Undo'
import EmptyState from '../../components/common/EmptyState'
import TimelineIcon from '@mui/icons-material/Timeline'
import { formatRelative, formatDateTime } from '../../utils/dateFormatter'
import { getAvatarColor } from '../../utils/statusColors'

const EVENT_CONFIG = {
  STAGE_ADVANCED:  { icon: ArrowForwardIcon, bg: '#E3FCEF', color: '#00875A', label: 'Stage Advanced' },
  STAGE_REJECTED:  { icon: UndoIcon, bg: '#FFEBE6', color: '#DE350B', label: 'Stage Rejected' },
  STAGE_ASSIGNED:  { icon: PersonAddIcon, bg: '#DEEBFF', color: '#0052CC', label: 'Stage Assigned' },
  COMMENT_ADDED:   { icon: ChatBubbleIcon, bg: '#EAE6FF', color: '#6554C0', label: 'Comment Added' },
  FILE_UPLOADED:   { icon: CloudUploadIcon, bg: '#E3FCEF', color: '#00875A', label: 'File Uploaded' },
  PROJECT_CREATED: { icon: FolderIcon, bg: '#FFF0B3', color: '#FF8B00', label: 'Project Created' },
  PROJECT_UPDATED: { icon: FolderIcon, bg: '#DEEBFF', color: '#0052CC', label: 'Project Updated' },
}

function TimelineItem({ event, isLast }) {
  const cfg = EVENT_CONFIG[event.type] || EVENT_CONFIG.PROJECT_UPDATED
  const Icon = cfg.icon
  const actorBg = getAvatarColor(event.actor?.fullName || '')
  const actorInitials = event.actor?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <Box sx={{ display: 'flex', gap: 1.5, mb: isLast ? 0 : 0 }}>
      {/* Left: icon + line */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%',
          bgcolor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `2px solid ${cfg.color}22`,
          flexShrink: 0,
        }}>
          <Icon sx={{ fontSize: '0.9rem', color: cfg.color }} />
        </Box>
        {!isLast && (
          <Box sx={{ width: 2, flex: 1, bgcolor: '#EBECF0', my: 0.75, minHeight: 20 }} />
        )}
      </Box>

      {/* Right: content */}
      <Box sx={{ flex: 1, pb: isLast ? 0 : 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
            <Avatar sx={{ width: 22, height: 22, bgcolor: actorBg, fontSize: '0.6rem', fontWeight: 700 }}>
              {actorInitials}
            </Avatar>
            <Typography fontSize="0.875rem" fontWeight={600} color="text.primary">
              {event.actor?.fullName}
            </Typography>
            <Typography fontSize="0.875rem" color="text.secondary">
              {event.description}
            </Typography>
          </Box>
          <Typography
            fontSize="0.72rem"
            color="text.disabled"
            sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
            title={formatDateTime(event.timestamp)}
          >
            {formatRelative(event.timestamp)}
          </Typography>
        </Box>

        {/* Metadata preview */}
        {event.metadata && Object.keys(event.metadata).length > 0 && (
          <Box sx={{
            mt: 0.5, p: 1, bgcolor: '#F4F5F7', borderRadius: 1.5,
            border: '1px solid #EBECF0', display: 'inline-block',
          }}>
            {event.metadata.from && event.metadata.to && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                <Typography fontSize="0.78rem" sx={{
                  bgcolor: '#EBECF0', px: 0.75, py: 0.25, borderRadius: 1,
                  fontWeight: 600, color: '#5E6C84',
                }}>
                  {event.metadata.from?.replace(/_/g, ' ')}
                </Typography>
                <ArrowForwardIcon sx={{ fontSize: '0.7rem', color: '#97A0AF' }} />
                <Typography fontSize="0.78rem" sx={{
                  bgcolor: '#E3FCEF', px: 0.75, py: 0.25, borderRadius: 1,
                  fontWeight: 600, color: '#006644',
                }}>
                  {event.metadata.to?.replace(/_/g, ' ')}
                </Typography>
              </Box>
            )}
            {event.metadata.filename && (
              <Typography fontSize="0.78rem" color="text.secondary">{event.metadata.filename}</Typography>
            )}
            {event.metadata.assignee && (
              <Typography fontSize="0.78rem" color="text.secondary">Assigned to: <strong>{event.metadata.assignee}</strong></Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default function ActivityTimeline({ activity }) {
  if (!activity || activity.length === 0) {
    return (
      <EmptyState
        icon={TimelineIcon}
        title="No activity yet"
        description="Activity will appear here as the project progresses through stages."
        sx={{ py: 4 }}
      />
    )
  }

  return (
    <Box>
      <Typography fontWeight={700} fontSize="0.95rem" mb={2}>
        Activity Timeline <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>({activity.length} events)</Box>
      </Typography>
      <Box>
        {activity.map((event, idx) => (
          <TimelineItem key={event.id} event={event} isLast={idx === activity.length - 1} />
        ))}
      </Box>
    </Box>
  )
}
