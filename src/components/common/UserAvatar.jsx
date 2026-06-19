import { Avatar, Tooltip, Box, Typography } from '@mui/material'
import { getAvatarColor } from '../../utils/statusColors'

export function UserAvatar({ user, size = 32, showTooltip = true }) {
  if (!user) return null
  const initials = user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const bg = getAvatarColor(user.fullName || '')

  const avatar = (
    <Avatar
      sx={{
        width: size, height: size,
        bgcolor: bg,
        fontSize: size < 30 ? '0.65rem' : size < 40 ? '0.75rem' : '0.9rem',
        fontWeight: 700,
        cursor: showTooltip ? 'default' : 'inherit',
      }}
    >
      {initials}
    </Avatar>
  )

  if (showTooltip) {
    return <Tooltip title={user.fullName}>{avatar}</Tooltip>
  }
  return avatar
}

export function UserAvatarWithName({ user, size = 32, subtitleText }) {
  if (!user) return null
  const bg = getAvatarColor(user.fullName || '')
  const initials = user.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Avatar sx={{ width: size, height: size, bgcolor: bg, fontSize: '0.75rem', fontWeight: 700 }}>
        {initials}
      </Avatar>
      <Box>
        <Typography fontSize="0.875rem" fontWeight={500} lineHeight={1.2}>
          {user.fullName}
        </Typography>
        {subtitleText && (
          <Typography fontSize="0.75rem" color="text.secondary">{subtitleText}</Typography>
        )}
      </Box>
    </Box>
  )
}

export default UserAvatar
