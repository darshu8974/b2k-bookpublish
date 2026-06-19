import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Popover, Box, Typography, List, ListItem, ListItemText,
  ListItemIcon, Button, Divider, IconButton, Tooltip, Badge,
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined'
import CircleIcon from '@mui/icons-material/Circle'
import AssignmentIcon from '@mui/icons-material/AssignmentOutlined'
import ChatBubbleIcon from '@mui/icons-material/ChatBubbleOutlineOutlined'
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import { formatRelative } from '../../utils/dateFormatter'

function notifIcon(type) {
  const iconProps = { fontSize: 'small' }
  if (type === 'STAGE_ADVANCED' || type === 'STAGE_ASSIGNED') return <AssignmentIcon {...iconProps} sx={{ color: '#0052CC' }} />
  if (type === 'COMMENT_ADDED') return <ChatBubbleIcon {...iconProps} sx={{ color: '#6554C0' }} />
  if (type === 'FILE_UPLOADED') return <CloudUploadIcon {...iconProps} sx={{ color: '#00875A' }} />
  return <CheckCircleIcon {...iconProps} sx={{ color: '#FF991F' }} />
}

export default function NotificationDropdown({ notifications, onMarkRead, onMarkAllRead }) {
  const [anchor, setAnchor] = useState(null)
  const navigate = useNavigate()
  const unread = notifications.filter((n) => !n.isRead).length

  const handleOpen = (e) => setAnchor(e.currentTarget)
  const handleClose = () => setAnchor(null)

  const handleClick = (notif) => {
    if (!notif.isRead) onMarkRead(notif.id)
    if (notif.referenceEntityType === 'PROJECT' && notif.referenceEntityId) {
      navigate(`/projects/${notif.referenceEntityId}`)
    }
    handleClose()
  }

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton onClick={handleOpen} sx={{ color: '#5E6C84' }}>
          <Badge badgeContent={unread} color="error" max={99}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          elevation: 3,
          sx: { width: 380, borderRadius: 2, mt: 1, border: '1px solid #DFE1E6' },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography fontWeight={700} fontSize="0.95rem">Notifications</Typography>
            {unread > 0 && (
              <Typography fontSize="0.75rem" color="text.secondary">{unread} unread</Typography>
            )}
          </Box>
          {unread > 0 && (
            <Tooltip title="Mark all as read">
              <IconButton size="small" onClick={onMarkAllRead}>
                <DoneAllIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ py: 5, textAlign: 'center' }}>
            <NotificationsIcon sx={{ fontSize: 40, color: '#DFE1E6', mb: 1 }} />
            <Typography fontSize="0.875rem" color="text.secondary">No notifications yet</Typography>
          </Box>
        ) : (
          <List disablePadding sx={{ maxHeight: 380, overflowY: 'auto' }}>
            {notifications.map((notif, idx) => (
              <Box key={notif.id}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleClick(notif)}
                  sx={{
                    px: 2, py: 1.5, cursor: 'pointer',
                    bgcolor: notif.isRead ? 'transparent' : '#F0F4FF',
                    '&:hover': { bgcolor: notif.isRead ? '#F4F5F7' : '#E8EEFF' },
                    transition: 'background 0.15s',
                  }}
                >
                  <ListItemIcon sx={{ mt: 0.5, minWidth: 36 }}>
                    {notifIcon(notif.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography fontSize="0.85rem" fontWeight={notif.isRead ? 400 : 600} sx={{ flex: 1 }}>
                          {notif.title}
                        </Typography>
                        {!notif.isRead && (
                          <CircleIcon sx={{ fontSize: 8, color: '#0052CC', flexShrink: 0 }} />
                        )}
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography fontSize="0.8rem" color="text.secondary" sx={{ display: 'block', mb: 0.25 }}>
                          {notif.message}
                        </Typography>
                        <Typography fontSize="0.72rem" color="#97A0AF">
                          {formatRelative(notif.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {idx < notifications.length - 1 && <Divider sx={{ mx: 2 }} />}
              </Box>
            ))}
          </List>
        )}
      </Popover>
    </>
  )
}
