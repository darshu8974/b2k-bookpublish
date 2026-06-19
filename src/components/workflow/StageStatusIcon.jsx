import { Box } from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import CloseIcon from '@mui/icons-material/Close'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import PauseCircleIcon from '@mui/icons-material/PauseCircleOutline'

const CONFIG = {
  COMPLETED:      { bg: '#00875A', border: '#00875A', icon: <CheckIcon sx={{ color: '#fff', fontSize: '0.9rem' }} />, pulse: false },
  IN_PROGRESS:    { bg: '#0052CC', border: '#0052CC', icon: <AccessTimeIcon sx={{ color: '#fff', fontSize: '0.85rem' }} />, pulse: true },
  REVIEW_PENDING: { bg: '#6554C0', border: '#6554C0', icon: <HourglassEmptyIcon sx={{ color: '#fff', fontSize: '0.85rem' }} />, pulse: false },
  APPROVED:       { bg: '#00875A', border: '#00875A', icon: <CheckIcon sx={{ color: '#fff', fontSize: '0.9rem' }} />, pulse: false },
  REJECTED:       { bg: '#DE350B', border: '#DE350B', icon: <CloseIcon sx={{ color: '#fff', fontSize: '0.9rem' }} />, pulse: false },
  PENDING:        { bg: '#FFFFFF', border: '#DFE1E6', icon: <RadioButtonUncheckedIcon sx={{ color: '#97A0AF', fontSize: '0.9rem' }} />, pulse: false },
  SKIPPED:        { bg: '#F4F5F7', border: '#DFE1E6', icon: <PauseCircleIcon sx={{ color: '#97A0AF', fontSize: '0.85rem' }} />, pulse: false },
}

export default function StageStatusIcon({ status, size = 28 }) {
  const cfg = CONFIG[status] || CONFIG.PENDING

  return (
    <Box sx={{ position: 'relative', flexShrink: 0 }}>
      <Box sx={{
        width: size, height: size,
        borderRadius: '50%',
        bgcolor: cfg.bg,
        border: `2px solid ${cfg.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', zIndex: 1,
      }}>
        {cfg.icon}
      </Box>
      {cfg.pulse && (
        <Box sx={{
          position: 'absolute', top: 0, left: 0,
          width: size, height: size, borderRadius: '50%',
          bgcolor: '#0052CC', opacity: 0.3,
          animation: 'pulse 1.8s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)', opacity: 0.3 },
            '70%': { transform: 'scale(1.6)', opacity: 0 },
            '100%': { transform: 'scale(1)', opacity: 0 },
          },
        }} />
      )}
    </Box>
  )
}
