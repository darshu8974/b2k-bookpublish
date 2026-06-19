import { useState } from 'react'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, FormControl, InputLabel,
  Box, Typography, Alert,
} from '@mui/material'
import { ROLES, ROLE_LABELS } from '../../utils/constants'

const DEFAULT_FORM = { fullName: '', email: '', role: 'PRODUCTION_TEAM', password: '' }

export default function CreateUserDialog({ open, onClose, onSubmit }) {
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email is required'
    if (!form.password || form.password.length < 8) e.password = 'Password must be at least 8 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    try {
      await onSubmit(form)
      setForm(DEFAULT_FORM)
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: undefined }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New User</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 0.5 }}>
          <TextField
            fullWidth
            label="Full Name *"
            value={form.fullName}
            onChange={update('fullName')}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
          <TextField
            fullWidth
            label="Email Address *"
            type="email"
            value={form.email}
            onChange={update('email')}
            error={!!errors.email}
            helperText={errors.email}
          />
          <FormControl fullWidth>
            <InputLabel>Role</InputLabel>
            <Select value={form.role} label="Role" onChange={update('role')}>
              {Object.entries(ROLE_LABELS).map(([key, label]) => (
                <MenuItem key={key} value={key}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Password *"
            type="password"
            value={form.password}
            onChange={update('password')}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Alert severity="info" sx={{ py: 0.5 }}>
            The user will be able to change their password after first login.
          </Alert>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
