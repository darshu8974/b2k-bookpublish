import { Box, Typography, Button } from '@mui/material'
import InboxIcon from '@mui/icons-material/Inbox'

export default function EmptyState({ icon, title, description, actionLabel, onAction, sx = {} }) {
  const Icon = icon || InboxIcon
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 3, ...sx }}>
      <Box sx={{
        width: 72, height: 72, borderRadius: '50%', bgcolor: '#F4F5F7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        mx: 'auto', mb: 2,
      }}>
        <Icon sx={{ fontSize: 36, color: '#97A0AF' }} />
      </Box>
      <Typography fontWeight={600} fontSize="1rem" mb={0.75}>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" mb={2.5} maxWidth={360} mx="auto">
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction}>{actionLabel}</Button>
      )}
    </Box>
  )
}
