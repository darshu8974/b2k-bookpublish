import { useState } from 'react'
import {
  Menu, MenuItem, IconButton, ListItemIcon, ListItemText,
  Tooltip, Divider,
} from '@mui/material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import UndoIcon from '@mui/icons-material/Undo'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import PauseCircleIcon from '@mui/icons-material/PauseCircleOutline'

export default function StageActionMenu({ stage, onAdvance, onReject, onAssign, onHold, canAdvance, canReject, canAssign }) {
  const [anchor, setAnchor] = useState(null)
  const open = Boolean(anchor)

  const actions = [
    canAdvance && {
      label: 'Mark Complete / Advance',
      icon: <ArrowForwardIcon fontSize="small" />,
      color: '#00875A',
      onClick: () => { onAdvance(stage); setAnchor(null) },
    },
    canReject && {
      label: 'Reject / Send Back',
      icon: <UndoIcon fontSize="small" />,
      color: '#DE350B',
      onClick: () => { onReject(stage); setAnchor(null) },
    },
    canAssign && {
      label: 'Assign to User',
      icon: <PersonAddIcon fontSize="small" />,
      color: '#0052CC',
      onClick: () => { onAssign(stage); setAnchor(null) },
    },
    onHold && {
      label: 'Put on Hold',
      icon: <PauseCircleIcon fontSize="small" />,
      color: '#FF991F',
      onClick: () => { onHold(stage); setAnchor(null) },
    },
  ].filter(Boolean)

  if (actions.length === 0) return null

  return (
    <>
      <Tooltip title="Stage actions">
        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setAnchor(e.currentTarget) }} sx={{ color: '#97A0AF' }}>
          <MoreVertIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchor}
        open={open}
        onClose={() => setAnchor(null)}
        PaperProps={{ elevation: 2, sx: { minWidth: 200, borderRadius: 2, border: '1px solid #DFE1E6' } }}
      >
        {actions.map((action, idx) => (
          <MenuItem key={idx} onClick={action.onClick} sx={{ py: 1 }}>
            <ListItemIcon sx={{ color: action.color }}>{action.icon}</ListItemIcon>
            <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', color: action.color, fontWeight: 500 }}>
              {action.label}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
