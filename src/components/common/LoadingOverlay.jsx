import { Box, CircularProgress, Skeleton, Stack } from '@mui/material'

export default function LoadingOverlay({ fullPage = false }) {
  if (fullPage) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
        <CircularProgress size={36} />
      </Box>
    )
  }
  return (
    <Stack spacing={1.5}>
      <Skeleton variant="rectangular" height={48} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
    </Stack>
  )
}
