import { Box } from '@mui/material'
import LoginForm from './LoginForm'
import logo from '../../assets/book.jpg'

export default function LoginPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left panel – branding */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1,
        background: 'linear-gradient(145deg, #0A1929 0%, #0D2137 45%, #0047B3 100%)',
        flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[420, 280, 160].map((size, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(255,255,255,${0.03 + i * 0.02})`,
            top: `${5 + i * 12}%`, right: `${-15 + i * 8}%`,
            pointerEvents: 'none',
          }} />
        ))}

        {/* Bottom glow */}
        <Box sx={{
          position: 'absolute', bottom: -80, left: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,82,204,0.25) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 460 }}>
          {/* Logo + Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 7 }}>
            <Box sx={{
              width: 56, height: 56, borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              flexShrink: 0,
            }}>
              <img src={logo} alt="ProTrack" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box>
              <Box component="span" sx={{ color: '#FFFFFF', fontWeight: 800, fontSize: '1.6rem', display: 'block', letterSpacing: '-0.02em' }}>
                ProTrack
              </Box>
              <Box component="span" sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Workflow Manager
              </Box>
            </Box>
          </Box>

          <Box component="h1" sx={{ color: '#FFFFFF', fontSize: '2.3rem', fontWeight: 800, lineHeight: 1.2, m: 0, mb: 2.5 }}>
            Track projects from brief to final delivery
          </Box>
          <Box component="p" sx={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', lineHeight: 1.75, m: 0, mb: 5.5 }}>
            One platform for your entire production team — assign stages, monitor progress, and deliver on time.
          </Box>

          {/* Feature list */}
          {[
            '8-Stage Workflow Tracking',
            'Multi-role Team Collaboration',
            'File & Version Management',
            'Real-time Activity Timeline',
          ].map((feature) => (
            <Box key={feature} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.75 }}>
              <Box sx={{
                width: 22, height: 22, borderRadius: '50%',
                bgcolor: 'rgba(87,217,163,0.15)',
                border: '1px solid rgba(87,217,163,0.35)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Box component="span" sx={{ color: '#57D9A3', fontSize: '0.7rem', fontWeight: 800 }}>✓</Box>
              </Box>
              <Box component="span" sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '0.92rem' }}>{feature}</Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel – form */}
      <Box sx={{
        width: { xs: '100%', md: 500 },
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        bgcolor: '#FFFFFF', p: { xs: 3, sm: 5 },
      }}>
        <LoginForm />
      </Box>
    </Box>
  )
}
