import { useState, useEffect, useCallback } from 'react'
import {
  Box, Button, TextField, InputAdornment, Chip, Typography,
  Card, CardContent, CardActions, Grid, Select, MenuItem, FormControl,
  InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  Skeleton, IconButton, Tooltip,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import PageHeader from '../../components/common/PageHeader'
import EmptyState from '../../components/common/EmptyState'
import DescriptionIcon from '@mui/icons-material/DescriptionOutlined'
import { templatesApi } from '../../api/templates.api'
import { useSnackbar } from 'notistack'
import { formatDate } from '../../utils/dateFormatter'

const TYPE_OPTIONS = ['EMAIL', 'DOCUMENT', 'QC_REPORT', 'APPROVAL']
const TYPE_COLORS = {
  EMAIL: { bg: '#EFF8FF', text: '#0369A1' },
  DOCUMENT: { bg: '#F0FDF4', text: '#15803D' },
  QC_REPORT: { bg: '#FFF7ED', text: '#C2410C' },
  APPROVAL: { bg: '#F5F3FF', text: '#6D28D9' },
}

const EMPTY_FORM = { name: '', type: 'EMAIL', content: '', tags: '' }

export default function TemplatesPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editTemplate, setEditTemplate] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await templatesApi.getAll({ search, type: typeFilter || undefined, size: 100 })
      setTemplates(res.data.data.content ?? [])
    } catch {
      enqueueSnackbar('Failed to load templates', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter])

  useEffect(() => { load() }, [load])

  const openCreate = () => { setForm(EMPTY_FORM); setEditTemplate(null); setDialogOpen(true) }
  const openEdit = (t) => {
    setForm({ name: t.name, type: t.type, content: t.content, tags: t.tags?.join(', ') || '' })
    setEditTemplate(t)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!form.name.trim() || !form.content.trim()) return
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        type: form.type,
        content: form.content,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      }
      if (editTemplate) {
        await templatesApi.update(editTemplate.id, payload)
        enqueueSnackbar('Template updated', { variant: 'success' })
      } else {
        await templatesApi.create(payload)
        enqueueSnackbar('Template created', { variant: 'success' })
      }
      setDialogOpen(false)
      load()
    } catch {
      enqueueSnackbar('Failed to save template', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await templatesApi.delete(id)
      setTemplates((prev) => prev.filter((t) => t.id !== id))
      enqueueSnackbar('Template deleted', { variant: 'info' })
    } catch {
      enqueueSnackbar('Failed to delete template', { variant: 'error' })
    }
  }

  const handleCopy = (content) => {
    navigator.clipboard.writeText(content)
    enqueueSnackbar('Copied to clipboard', { variant: 'success' })
  }

  return (
    <Box>
      <PageHeader
        title="Template Library"
        subtitle={`${templates.length} template${templates.length !== 1 ? 's' : ''}`}
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Templates' }]}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New Template
          </Button>
        }
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search by name or tag..."
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 280 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
              </InputAdornment>
            ),
          }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Type</InputLabel>
          <Select value={typeFilter} label="Type" onChange={(e) => setTypeFilter(e.target.value)}>
            <MenuItem value="">All types</MenuItem>
            {TYPE_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t.replace('_', ' ')}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      {/* Grid */}
      {loading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={180} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : templates.length === 0 ? (
        <EmptyState
          icon={DescriptionIcon}
          title="No templates yet"
          description="Create your first email or document template to reuse across projects."
          actionLabel="New Template"
          onAction={openCreate}
        />
      ) : (
        <Grid container spacing={2}>
          {templates.map((t) => {
            const cols = TYPE_COLORS[t.type] || { bg: '#F4F5F7', text: '#5E6C84' }
            return (
              <Grid item xs={12} sm={6} md={4} key={t.id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 2, border: '1px solid #E5E7EB', boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.08)' } }}>
                  <CardContent sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Chip label={t.type.replace('_', ' ')} size="small"
                        sx={{ bgcolor: cols.bg, color: cols.text, fontWeight: 600, fontSize: '0.7rem', height: 20 }} />
                      <Typography fontSize="0.72rem" color="text.disabled">{formatDate(t.updatedAt)}</Typography>
                    </Box>
                    <Typography fontWeight={700} fontSize="0.95rem" mb={0.75} sx={{ cursor: 'pointer', '&:hover': { color: '#4f46e5' } }}
                      onClick={() => setPreviewTemplate(t)}>
                      {t.name}
                    </Typography>
                    <Typography fontSize="0.8rem" color="text.secondary" sx={{
                      display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1.5,
                    }}>
                      {t.content}
                    </Typography>
                    {t.tags?.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {t.tags.map((tag) => (
                          <Chip key={tag} label={tag} size="small" variant="outlined"
                            sx={{ height: 18, fontSize: '0.68rem', cursor: 'pointer' }}
                            onClick={() => setSearch(tag)} />
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions sx={{ px: 2, pb: 1.5, pt: 0, justifyContent: 'flex-end', gap: 0.5 }}>
                    <Tooltip title="Copy content">
                      <IconButton size="small" onClick={() => handleCopy(t.content)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(t)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" onClick={() => handleDelete(t.id)} sx={{ color: 'error.main' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      {/* Create / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editTemplate ? 'Edit Template' : 'New Template'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth label="Name *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <FormControl sx={{ minWidth: 160 }}>
                <InputLabel>Type</InputLabel>
                <Select value={form.type} label="Type" onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
                  {TYPE_OPTIONS.map((t) => <MenuItem key={t} value={t}>{t.replace('_', ' ')}</MenuItem>)}
                </Select>
              </FormControl>
            </Box>
            <TextField
              fullWidth multiline rows={10} label="Content *"
              value={form.content}
              onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
              placeholder="Write your template content here..."
              inputProps={{ style: { fontFamily: 'monospace', fontSize: '0.85rem' } }}
            />
            <TextField
              fullWidth label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              placeholder="e.g. approval, proof, chapter1"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={saving || !form.name.trim() || !form.content.trim()}
          >
            {saving ? 'Saving...' : editTemplate ? 'Save Changes' : 'Create Template'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewTemplate} onClose={() => setPreviewTemplate(null)} maxWidth="md" fullWidth>
        <DialogTitle>{previewTemplate?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2, border: '1px solid #E5E7EB', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.7 }}>
            {previewTemplate?.content}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleCopy(previewTemplate?.content)} startIcon={<ContentCopyIcon />}>Copy</Button>
          <Button onClick={() => { openEdit(previewTemplate); setPreviewTemplate(null) }} startIcon={<EditIcon />}>Edit</Button>
          <Button onClick={() => setPreviewTemplate(null)} color="inherit">Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
