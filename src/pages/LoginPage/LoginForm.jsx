import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Box, TextField, Button, Typography, InputAdornment, IconButton, Alert, Divider,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/EmailOutlined'
import LockIcon from '@mui/icons-material/LockOutlined'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import useAuth from '../../auth/useAuth'

const DEMO_ACCOUNTS = [
  { label: 'Admin', email: 'admin@publishflow.com', role: 'Full access' },
  { label: 'Project Manager', email: 'pm@publishflow.com', role: 'Manage projects' },
  { label: 'Production', email: 'production@publishflow.com', role: 'Stage work' },
  { label: 'QC Team', email: 'qc@publishflow.com', role: 'Quality checks' },
]

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (acc) => { setEmail(acc.email); setPassword('Admin@1234'); setError('') }

  return (
    <Box sx={{ width: '100%', maxWidth: 390 }}>
      {/* Header */}
      <Box sx={{ mb: 4.5 }}>
        <Typography variant="h4" fontWeight={800} mb={0.5} letterSpacing="-0.02em">
          Welcome back
        </Typography>
        <Typography variant="body2" color="text.secondary" fontSize="0.9rem">
          Sign in to your ProTrack account to continue.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Box sx={{ mb: 2.5 }}>
          <Typography fontSize="0.82rem" fontWeight={600} mb={0.75} color="text.primary">
            Email address
          </Typography>
          <TextField
            fullWidth
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Box sx={{ mb: 3.5 }}>
          <Typography fontSize="0.82rem" fontWeight={600} mb={0.75} color="text.primary">
            Password
          </Typography>
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setShowPassword((v) => !v)} edge="end">
                    {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Button
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          disabled={loading}
          sx={{ py: 1.5, fontSize: '0.95rem', fontWeight: 700, borderRadius: 2, boxShadow: '0 4px 14px rgba(0,82,204,0.35)' }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Box>

      <Divider sx={{ my: 3.5 }}>
        <Typography fontSize="0.73rem" color="text.disabled" letterSpacing="0.05em">QUICK ACCESS</Typography>
      </Divider>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.25 }}>
        {DEMO_ACCOUNTS.map((acc) => (
          <Box
            key={acc.email}
            onClick={() => fillDemo(acc)}
            sx={{
              p: 1.5, borderRadius: 2, cursor: 'pointer',
              border: '1.5px solid',
              borderColor: email === acc.email ? '#0052CC' : '#EBECF0',
              bgcolor: email === acc.email ? '#F0F4FF' : '#FAFBFC',
              transition: 'all 0.15s',
              '&:hover': { bgcolor: '#F0F4FF', borderColor: '#4C9AFF' },
            }}
          >
            <Typography fontSize="0.82rem" fontWeight={700} color={email === acc.email ? 'primary.main' : 'text.primary'}>
              {acc.label}
            </Typography>
            <Typography fontSize="0.7rem" color="text.secondary" mt={0.25}>{acc.role}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
