import { Box, Typography, Breadcrumbs, Link } from '@mui/material'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { useNavigate } from 'react-router-dom'

export default function PageHeader({ title, subtitle, breadcrumbs = [], actions, sx = {} }) {
  const navigate = useNavigate()

  return (
    <Box sx={{ mb: 3, ...sx }}>
      {breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          sx={{ mb: 1, '& .MuiBreadcrumbs-separator': { color: '#97A0AF' } }}
        >
          {breadcrumbs.map((crumb, idx) =>
            idx < breadcrumbs.length - 1 ? (
              <Link
                key={idx}
                underline="hover"
                color="text.secondary"
                fontSize="0.8rem"
                sx={{ cursor: 'pointer' }}
                onClick={() => crumb.path && navigate(crumb.path)}
              >
                {crumb.label}
              </Link>
            ) : (
              <Typography key={idx} fontSize="0.8rem" color="text.primary" fontWeight={500}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>{actions}</Box>}
      </Box>
    </Box>
  )
}
