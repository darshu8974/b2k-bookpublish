import { Box, Typography } from '@mui/material'
import FlagIcon from '@mui/icons-material/Flag'
import { priorityColors } from '../../utils/statusColors'

const LABELS = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High', URGENT: 'Urgent' }

export default function PriorityBadge({ priority, showLabel = true, size = 'small' }) {
  const colors = priorityColors[priority] || priorityColors.LOW
  const label = LABELS[priority] || priority
  const iconSize = size === 'small' ? '0.85rem' : '1rem'
  const fontSize = size === 'small' ? '0.72rem' : '0.8rem'

  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', gap: 0.5,
      bgcolor: colors.bg, color: colors.text,
      px: showLabel ? 1 : 0.5, py: 0.25,
      borderRadius: '4px',
    }}>
      <FlagIcon sx={{ fontSize: iconSize, color: colors.icon }} />
      {showLabel && (
        <Typography sx={{ fontSize, fontWeight: 600, color: colors.text, lineHeight: 1 }}>
          {label}
        </Typography>
      )}
    </Box>
  )
}
