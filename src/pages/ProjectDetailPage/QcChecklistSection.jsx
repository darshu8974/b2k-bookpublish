import { useState, useEffect, useCallback } from 'react'
import {
  Box, Typography, Checkbox, FormControlLabel, TextField, Button,
  Chip, LinearProgress, Divider, CircularProgress, Alert,
  Accordion, AccordionSummary, AccordionDetails,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import { qcApi } from '../../api/qc.api'
import { useSnackbar } from 'notistack'

export default function QcChecklistSection({ projectId }) {
  const { enqueueSnackbar } = useSnackbar()
  const [checklist, setChecklist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [localItems, setLocalItems] = useState([])

  const load = useCallback(async () => {
    try {
      setLoading(true)
      const res = await qcApi.getChecklist(projectId)
      const data = res.data.data
      setChecklist(data)
      setLocalItems(data.items.map((item) => ({
        itemId: item.itemId,
        checked: item.checked,
        note: item.note || '',
      })))
    } catch {
      setError('Failed to load QC checklist')
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { load() }, [load])

  const handleCheck = (itemId, checked) => {
    setLocalItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, checked } : i))
    )
  }

  const handleNote = (itemId, note) => {
    setLocalItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, note } : i))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await qcApi.submit(projectId, localItems)
      setChecklist(res.data.data)
      enqueueSnackbar('QC checklist saved', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to save checklist', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}><CircularProgress /></Box>
  if (error) return <Alert severity="error">{error}</Alert>
  if (!checklist) return null

  const progress = checklist.totalItems > 0
    ? Math.round((checklist.checkedItems / checklist.totalItems) * 100)
    : 0

  const categories = [...new Set(checklist.items.map((i) => i.category).filter(Boolean))]

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography fontWeight={700} fontSize="0.95rem">
          QC Checklist
          <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 1 }}>
            ({checklist.checkedItems}/{checklist.totalItems} complete)
          </Box>
        </Typography>
        <Chip
          icon={<CheckCircleIcon />}
          label={`${progress}%`}
          color={progress === 100 ? 'success' : progress >= 50 ? 'warning' : 'default'}
          size="small"
          variant="outlined"
        />
      </Box>

      {/* Progress bar */}
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 3, height: 6, borderRadius: 3,
          bgcolor: '#EEF2FF',
          '& .MuiLinearProgress-bar': { bgcolor: progress === 100 ? '#22c55e' : '#4f46e5' }
        }}
      />

      {/* Items grouped by category */}
      {categories.map((category) => {
        const items = checklist.items.filter((i) => i.category === category)
        const local = localItems.filter((i) => items.some((ci) => ci.itemId === i.itemId))
        const catChecked = local.filter((i) => i.checked).length

        return (
          <Accordion key={category} defaultExpanded sx={{ mb: 1, boxShadow: 'none', border: '1px solid #E5E7EB', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography fontWeight={600} fontSize="0.875rem">{category}</Typography>
                <Chip label={`${catChecked}/${items.length}`} size="small"
                  color={catChecked === items.length ? 'success' : 'default'} variant="outlined" />
              </Box>
            </AccordionSummary>
            <AccordionDetails sx={{ pt: 0 }}>
              {items.map((item, idx) => {
                const local = localItems.find((l) => l.itemId === item.itemId) || {}
                return (
                  <Box key={item.itemId}>
                    {idx > 0 && <Divider sx={{ my: 1 }} />}
                    <FormControlLabel
                      sx={{ alignItems: 'flex-start', width: '100%', mr: 0 }}
                      control={
                        <Checkbox
                          checked={local.checked || false}
                          onChange={(e) => handleCheck(item.itemId, e.target.checked)}
                          sx={{ pt: 0.5 }}
                        />
                      }
                      label={
                        <Box sx={{ flex: 1 }}>
                          <Typography fontSize="0.875rem" sx={{ mt: 0.5 }}>{item.label}</Typography>
                          {local.checked && (
                            <TextField
                              size="small"
                              placeholder="Optional note..."
                              value={local.note || ''}
                              onChange={(e) => handleNote(item.itemId, e.target.value)}
                              sx={{ mt: 1, width: '100%' }}
                              multiline
                              maxRows={3}
                            />
                          )}
                        </Box>
                      }
                    />
                  </Box>
                )
              })}
            </AccordionDetails>
          </Accordion>
        )
      })}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ minWidth: 120 }}
        >
          {saving ? 'Saving...' : 'Save Checklist'}
        </Button>
      </Box>
    </Box>
  )
}
