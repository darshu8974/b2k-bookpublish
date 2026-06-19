import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AppBar, Toolbar, Box, IconButton, Typography, Avatar, Menu, MenuItem,
  Tooltip, Divider, ListItemIcon, ListItemText,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/PersonOutlined'
import SettingsIcon from '@mui/icons-material/SettingsOutlined'
import useAuth from '../../auth/useAuth'
import NotificationDropdown from './NotificationDropdown'
import { ROLE_LABELS } from '../../utils/constants'
import { getAvatarColor } from '../../utils/statusColors'
import { SIDEBAR_WIDTH } from '../../theme/theme'
import useNotifications from '../../hooks/useNotifications'

export default function Topbar({ sidebarOpen, onToggleSidebar }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const { notifications, markRead, markAllRead } = useNotifications()

  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const avatarBg = getAvatarColor(user?.fullName || '')

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget)
  const handleMenuClose = () => setAnchorEl(null)
  const handleLogout = async () => { handleMenuClose(); await logout(); navigate('/login') }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: '#FFFFFF',
        borderBottom: '1px solid #DFE1E6',
        zIndex: (theme) => theme.zIndex.drawer + 1,
        ml: sidebarOpen ? `${SIDEBAR_WIDTH}px` : '64px',
        width: sidebarOpen ? `calc(100% - ${SIDEBAR_WIDTH}px)` : 'calc(100% - 64px)',
        transition: 'margin 0.2s ease, width 0.2s ease',
      }}
    >
      <Toolbar sx={{ minHeight: '60px !important', px: 2, gap: 1 }}>
        <IconButton onClick={onToggleSidebar} size="small" sx={{ color: '#5E6C84', mr: 1 }}>
          <MenuIcon />
        </IconButton>

        <Box sx={{ flex: 1 }} />

        <NotificationDropdown
          notifications={notifications}
          onMarkRead={markRead}
          onMarkAllRead={markAllRead}
        />

        {/* User Avatar */}
        <Tooltip title={`${user?.fullName} · ${ROLE_LABELS[user?.role] || ''}`}>
          <Box
            onClick={handleMenuOpen}
            sx={{
              display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer',
              px: 1, py: 0.5, borderRadius: 2,
              '&:hover': { bgcolor: '#F4F5F7' }, transition: 'background 0.15s',
            }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: avatarBg, fontSize: '0.78rem', fontWeight: 700 }}>
              {initials}
            </Avatar>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Typography fontSize="0.82rem" fontWeight={600} color="text.primary" lineHeight={1.2}>
                {user?.fullName?.split(' ')[0]}
              </Typography>
              <Typography fontSize="0.7rem" color="text.secondary">
                {ROLE_LABELS[user?.role]}
              </Typography>
            </Box>
          </Box>
        </Tooltip>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{ elevation: 2, sx: { mt: 1, minWidth: 200, borderRadius: 2, border: '1px solid #DFE1E6' } }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography fontWeight={600} fontSize="0.875rem">{user?.fullName}</Typography>
            <Typography fontSize="0.75rem" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.25 }}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>My Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ py: 1.25 }}>
            <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Settings</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ py: 1.25, color: '#DE350B' }}>
            <ListItemIcon><LogoutIcon fontSize="small" sx={{ color: '#DE350B' }} /></ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Sign out</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
