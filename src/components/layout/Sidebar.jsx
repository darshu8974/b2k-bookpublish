import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Collapse, Divider, Tooltip,
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/DashboardOutlined'
import FolderIcon from '@mui/icons-material/FolderOpenOutlined'
import AddCircleIcon from '@mui/icons-material/AddCircleOutline'
import PeopleIcon from '@mui/icons-material/PeopleOutlined'
import BarChartIcon from '@mui/icons-material/BarChartOutlined'
import SecurityIcon from '@mui/icons-material/SecurityOutlined'
import logo from '../../assets/book.jpg'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExpandLess from '@mui/icons-material/ExpandLess'
import useAuth from '../../auth/useAuth'
import { SIDEBAR_WIDTH } from '../../theme/theme'
import { ROLE_LABELS } from '../../utils/constants'
import { canManageUsers, canViewReports, canViewAuditLogs } from '../../utils/roleHelpers'

const NAV_SECTIONS = (role) => [
  {
    title: 'Main',
    items: [
      { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      { label: 'Projects', icon: <FolderIcon />, path: '/projects' },
      { label: 'New Project', icon: <AddCircleIcon />, path: '/projects/new', hide: !['ADMIN','PROJECT_MANAGER'].includes(role) },
    ],
  },
  {
    title: 'Management',
    items: [
      { label: 'Users', icon: <PeopleIcon />, path: '/users', hide: !canManageUsers(role) },
      { label: 'Reports', icon: <BarChartIcon />, path: '/reports', hide: !canViewReports(role) },
      { label: 'Audit Logs', icon: <SecurityIcon />, path: '/audit-logs', hide: !canViewAuditLogs(role) },
    ].filter((i) => !i.hide),
  },
]

function NavItem({ item, collapsed }) {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path))

  return (
    <Tooltip title={collapsed ? item.label : ''} placement="right">
      <ListItem disablePadding sx={{ mb: 0.25 }}>
        <ListItemButton
          onClick={() => navigate(item.path)}
          sx={{
            borderRadius: '6px',
            mx: collapsed ? 0.5 : 1,
            px: collapsed ? 1 : 1.5,
            py: 1,
            backgroundColor: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: isActive ? '#FFFFFF' : '#B8C7E0',
            '&:hover': {
              backgroundColor: isActive ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
              color: '#FFFFFF',
            },
            justifyContent: collapsed ? 'center' : 'flex-start',
            transition: 'all 0.15s ease',
          }}
        >
          <ListItemIcon
            sx={{
              color: 'inherit',
              minWidth: collapsed ? 0 : 36,
              '& svg': { fontSize: '1.2rem' },
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 400,
                lineHeight: 1.4,
              }}
            />
          )}
          {!collapsed && item.badge && (
            <Box sx={{
              bgcolor: '#FF5630',
              color: '#fff',
              borderRadius: 10,
              px: 0.75,
              py: 0.1,
              fontSize: '0.65rem',
              fontWeight: 700,
              minWidth: 18,
              textAlign: 'center',
            }}>
              {item.badge}
            </Box>
          )}
        </ListItemButton>
      </ListItem>
    </Tooltip>
  )
}

export default function Sidebar({ open }) {
  const { user } = useAuth()
  const sections = NAV_SECTIONS(user?.role || '')

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#0A1929' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 34, height: 34, borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
            <img src={logo} alt="PublishFlow logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
          {open && (
            <Box>
              <Typography sx={{ color: '#FFFFFF', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>
                ProTrack
              </Typography>
              <Typography sx={{ color: '#6B8CAE', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Workflow Manager
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Navigation */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, '&::-webkit-scrollbar': { width: 0 } }}>
        {sections.map((section) => (
          <Box key={section.title} sx={{ mb: 1 }}>
            {open && (
              <Typography sx={{
                px: 2.5, mb: 0.5, fontSize: '0.65rem', fontWeight: 700,
                letterSpacing: '0.1em', textTransform: 'uppercase', color: '#3D5A7A',
              }}>
                {section.title}
              </Typography>
            )}
            <List disablePadding>
              {section.items.filter(i => !i.hide).map((item) => (
                <NavItem key={item.path} item={item} collapsed={!open} />
              ))}
            </List>
            {section.title !== sections[sections.length - 1].title && (
              <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mx: 2, my: 1 }} />
            )}
          </Box>
        ))}
      </Box>

      {/* User footer */}
      {open && user && (
        <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1.5, py: 1, borderRadius: '8px', bgcolor: 'rgba(255,255,255,0.04)' }}>
            <Box sx={{
              width: 32, height: 32, borderRadius: '50%',
              bgcolor: '#0052CC', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.75rem', fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>
              {user.fullName.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()}
            </Box>
            <Box sx={{ overflow: 'hidden' }}>
              <Typography sx={{ color: '#E0E7F0', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.fullName}
              </Typography>
              <Typography sx={{ color: '#6B8CAE', fontSize: '0.68rem' }}>
                {ROLE_LABELS[user.role]}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  )

  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        width: open ? SIDEBAR_WIDTH : 64,
        flexShrink: 0,
        transition: 'width 0.2s ease',
        '& .MuiDrawer-paper': {
          width: open ? SIDEBAR_WIDTH : 64,
          overflowX: 'hidden',
          border: 'none',
          transition: 'width 0.2s ease',
          bgcolor: '#0A1929',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}
