import { Chip } from '@mui/material'
import { projectStatusColors, stageStatusColors } from '../../utils/statusColors'

const STATUS_LABELS = {
  DRAFT: 'Draft', ACTIVE: 'Active', ON_HOLD: 'On Hold', COMPLETED: 'Completed', CANCELLED: 'Cancelled',
  PENDING: 'Pending', IN_PROGRESS: 'In Progress', REVIEW_PENDING: 'Review Pending',
  APPROVED: 'Approved', REJECTED: 'Rejected', SKIPPED: 'Skipped',
}

export default function StatusChip({ status, type = 'project', size = 'small', sx = {} }) {
  const palette = type === 'stage' ? stageStatusColors : projectStatusColors
  const colors = palette[status] || { bg: '#F4F5F7', text: '#5E6C84', border: '#DFE1E6' }
  const label = STATUS_LABELS[status] || status

  return (
    <Chip
      label={label}
      size={size}
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        fontWeight: 600,
        fontSize: size === 'small' ? '0.72rem' : '0.8rem',
        height: size === 'small' ? 22 : 28,
        borderRadius: '4px',
        ...sx,
      }}
    />
  )
}
