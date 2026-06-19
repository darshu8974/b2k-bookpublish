import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box, Stepper, Step, StepLabel, Button, TextField, Select, MenuItem,
  FormControl, InputLabel, Typography, Card, CardContent, Grid,
  Alert, Divider, Chip,
} from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { customersApi } from '../../api/customers.api'
import { usersApi } from '../../api/users.api'
import { PROJECT_PRIORITY } from '../../utils/constants'
import { UserAvatar } from '../../components/common/UserAvatar'
import useProjects from '../../hooks/useProjects'
import { useSnackbar } from 'notistack'

const STEPS = ['Project Details', 'Team Assignment', 'Review & Create']

function StepOne({ data, onChange, errors, customers }) {
  return (
    <Box>
      <Typography fontWeight={700} fontSize="1.1rem" mb={0.5}>Project Details</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Provide the basic information about this project.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
        <TextField
          fullWidth
          label="Project Title *"
          placeholder="e.g. Oxford Science Textbook Series Vol. 4"
          value={data.title || ''}
          onChange={(e) => onChange({ ...data, title: e.target.value })}
          error={!!errors.title}
          helperText={errors.title}
        />

        <TextField
          fullWidth
          multiline
          rows={3}
          label="Description"
          placeholder="Brief description of the project scope and requirements..."
          value={data.description || ''}
          onChange={(e) => onChange({ ...data, description: e.target.value })}
        />

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <FormControl fullWidth error={!!errors.customerId}>
            <InputLabel>Client / Customer *</InputLabel>
            <Select
              value={data.customerId || ''}
              label="Client / Customer *"
              onChange={(e) => onChange({ ...data, customerId: e.target.value })}
            >
              {customers.map((c) => (
                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
              ))}
            </Select>
            {errors.customerId && (
              <Typography fontSize="0.75rem" color="error.main" mt={0.5} ml={1.5}>{errors.customerId}</Typography>
            )}
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Priority</InputLabel>
            <Select
              value={data.priority || 'MEDIUM'}
              label="Priority"
              onChange={(e) => onChange({ ...data, priority: e.target.value })}
            >
              {Object.keys(PROJECT_PRIORITY).map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <TextField
          fullWidth
          type="date"
          label="Due Date *"
          InputLabelProps={{ shrink: true }}
          value={data.dueDate || ''}
          onChange={(e) => onChange({ ...data, dueDate: e.target.value })}
          error={!!errors.dueDate}
          helperText={errors.dueDate}
        />
      </Box>
    </Box>
  )
}

function StepTwo({ data, onChange, users }) {
  const managers = users.filter((u) => u.role === 'PROJECT_MANAGER' || u.role === 'ADMIN')

  return (
    <Box>
      <Typography fontWeight={700} fontSize="1.1rem" mb={0.5}>Team Assignment</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Assign a Project Manager. Stage-level assignments can be done after project creation.
      </Typography>

      <FormControl fullWidth>
        <InputLabel>Project Manager *</InputLabel>
        <Select
          value={data.projectManagerId || ''}
          label="Project Manager *"
          onChange={(e) => onChange({ ...data, projectManagerId: e.target.value })}
        >
          {managers.map((u) => (
            <MenuItem key={u.id} value={u.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <UserAvatar user={u} size={28} showTooltip={false} />
                <Box>
                  <Typography fontSize="0.875rem">{u.fullName}</Typography>
                  <Typography fontSize="0.72rem" color="text.secondary">{u.role.replace(/_/g, ' ')}</Typography>
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Alert severity="info" sx={{ mt: 3 }}>
        After creating the project, you can assign individual team members to each workflow stage from the Project Detail page.
      </Alert>
    </Box>
  )
}

function StepThree({ data, customers, users }) {
  const customer = customers.find((c) => c.id === data.customerId)
  const manager = users.find((u) => u.id === data.projectManagerId)

  const rows = [
    { label: 'Title', value: data.title },
    { label: 'Description', value: data.description || '—' },
    { label: 'Client', value: customer?.name || '—' },
    { label: 'Priority', value: data.priority || 'MEDIUM' },
    { label: 'Due Date', value: data.dueDate || 'Not set' },
    { label: 'Project Manager', value: manager?.fullName || '—' },
  ]

  return (
    <Box>
      <Typography fontWeight={700} fontSize="1.1rem" mb={0.5}>Review & Confirm</Typography>
      <Typography variant="body2" color="text.secondary" mb={3}>
        Review the project details before creating. 8 workflow stages will be automatically initialized.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {rows.map((row) => (
          <Box key={row.label} sx={{ display: 'flex', gap: 2, py: 1.25, borderBottom: '1px solid #EBECF0' }}>
            <Typography fontSize="0.82rem" color="text.secondary" sx={{ width: 140, flexShrink: 0 }}>{row.label}</Typography>
            <Typography fontSize="0.875rem" fontWeight={500}>{row.value}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 3, p: 2, bgcolor: '#E3FCEF', borderRadius: 2, border: '1px solid #57D9A3' }}>
        <Typography fontSize="0.875rem" fontWeight={600} color="success.dark" mb={1}>
          Upon creation, the following will be auto-generated:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {['Customer Input', 'Sample Creation', 'Sample Review', 'Approval', 'Typesetting', 'Pagination', 'Quality Check', 'Final Delivery'].map((s) => (
            <Chip key={s} label={s} size="small" icon={<CheckCircleIcon sx={{ fontSize: '0.75rem !important' }} />}
              sx={{ bgcolor: '#FFFFFF', color: '#006644', fontWeight: 600, fontSize: '0.7rem', height: 22 }} />
          ))}
        </Box>
      </Box>
    </Box>
  )
}

export default function CreateProjectForm() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const { createProject } = useProjects()
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState({ priority: 'MEDIUM' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [customers, setCustomers] = useState([])
  const [users, setUsers] = useState([])

  useEffect(() => {
    customersApi.getAll({ size: 100 })
      .then((r) => setCustomers(r.data.data.content ?? r.data.data))
      .catch(() => {})
    usersApi.getAll({ size: 100 })
      .then((r) => setUsers(r.data.data.content ?? r.data.data))
      .catch(() => {})
  }, [])

  const validate = () => {
    const newErrors = {}
    if (!formData.title?.trim()) newErrors.title = 'Project title is required'
    if (!formData.customerId) newErrors.customerId = 'Please select a customer'
    if (!formData.dueDate) newErrors.dueDate = 'Due date is required'
    if (activeStep === 1 && !formData.projectManagerId) newErrors.projectManagerId = 'Please assign a project manager'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (!validate()) return
    setActiveStep((s) => s + 1)
  }

  const handleBack = () => setActiveStep((s) => s - 1)

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const project = await createProject(formData)
      enqueueSnackbar('Project created successfully!', { variant: 'success' })
      navigate(`/projects/${project.id}`)
    } catch (error) {
      const resp = error.response?.data
      if (resp?.data && typeof resp.data === 'object') {
        const fieldErrors = Object.entries(resp.data).map(([k, v]) => `${k}: ${v}`).join(', ')
        enqueueSnackbar(`Validation error — ${fieldErrors}`, { variant: 'error' })
      } else {
        enqueueSnackbar(resp?.message || error.message || 'Failed to create project.', { variant: 'error' })
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 680, mx: 'auto' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {STEPS.map((label, idx) => (
          <Step key={label} completed={idx < activeStep}>
            <StepLabel
              StepIconProps={{
                sx: {
                  '&.Mui-completed': { color: '#00875A' },
                  '&.Mui-active': { color: '#0052CC' },
                }
              }}
            >
              <Typography fontSize="0.875rem" fontWeight={activeStep === idx ? 700 : 400}>
                {label}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card>
        <CardContent sx={{ p: 3 }}>
          {activeStep === 0 && <StepOne data={formData} onChange={setFormData} errors={errors} customers={customers} />}
          {activeStep === 1 && <StepTwo data={formData} onChange={setFormData} users={users} />}
          {activeStep === 2 && <StepThree data={formData} customers={customers} users={users} />}
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button
          variant="outlined"
          onClick={activeStep === 0 ? () => navigate('/projects') : handleBack}
          startIcon={<ArrowBackIcon />}
        >
          {activeStep === 0 ? 'Cancel' : 'Back'}
        </Button>

        {activeStep < STEPS.length - 1 ? (
          <Button variant="contained" onClick={handleNext} endIcon={<ArrowForwardIcon />}>
            Continue
          </Button>
        ) : (
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit}
            disabled={submitting}
            startIcon={<CheckCircleIcon />}
          >
            {submitting ? 'Creating...' : 'Create Project'}
          </Button>
        )}
      </Box>
    </Box>
  )
}
