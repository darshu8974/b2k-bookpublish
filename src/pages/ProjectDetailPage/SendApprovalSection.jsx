import { useState, useEffect, useCallback } from 'react'
import {
  Box, Button, Typography, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Chip, IconButton, Tooltip,
  Table, TableHead, TableRow, TableCell, TableBody, Skeleton, Alert,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import { authorTokenApi } from '../../api/authorToken.api'
import { useSnackbar } from 'notistack'
import { formatDate, formatDateTime } from '../../utils/dateFormatter'

const STATUS_CONFIG = {
  PENDING:  { label: 'Pending',  bg: '#FFF0B3', color: '#172B4D' },
  APPROVED: { label: 'Approved', bg: '#E3FCEF', color: '#006644' },
  REJECTED: { label: 'Rejected', bg: '#FFEBE6', color: '#BF2600' },
  EXPIRED:  { label: 'Expired',  bg: '#F4F5F7', color: '#5E6C84' },
}

const EMPTY_FORM = { authorEmail: '', authorName: '', expiryDays: '7' }

export default function SendApprovalSection({ projectId, canSend }) {
  const { enqueueSnackbar } = useSnackbar()
  const [tokens, setTokens] = useState([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [generatedLink, setGeneratedLink] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await authorTokenApi.list(projectId)
      setTokens(res.data.data ?? [])
    } catch {
      enqueueSnackbar('Failed to load approval history', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { load() }, [load])

  const handleOpen = () => { setForm(EMPTY_FORM); setGeneratedLink(null); setDialogOpen(true) }
  const handleClose = () => { setDialogOpen(false); setGeneratedLink(null) }

  const handleSend = async () => {
    if (!form.authorEmail.trim()) return
    setSaving(true)
    try {
      const res = await authorTokenApi.generate(projectId, {
        authorEmail: form.authorEmail.trim(),
        authorName: form.authorName.trim() || null,
        expiryDays: parseInt(form.expiryDays, 10) || 7,
      })
      setGeneratedLink(res.data.data.reviewUrl)
      enqueueSnackbar('Approval link generated', { variant: 'success' })
      load()
    } catch {
      enqueueSnackbar('Failed to generate approval link', { variant: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const copyLink = (link) => {
    navigator.clipboard.writeText(link)
    enqueueSnackbar('Link copied to clipboard', { variant: 'success' })
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
        <Box>
          <Typography fontWeight={700} fontSize="0.95rem">Author Approval</Typography>
          <Typography fontSize="0.8rem" color="text.secondary">
            Generate a secure link and share it with the author to approve or reject the proof.
          </Typography>
        </Box>
        {canSend && (
          <Button variant="contained" startIcon={<SendIcon />} onClick={handleOpen} sx={{ flexShrink: 0 }}>
            Send for Approval
          </Button>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[1, 2].map((i) => <Skeleton key={i} variant="rectangular" height={52} sx={{ borderRadius: 1.5 }} />)}
        </Box>
      ) : tokens.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 5, color: 'text.secondary' }}>
          <HowToRegIcon sx={{ fontSize: '2.5rem', mb: 1, opacity: 0.3 }} />
          <Typography fontSize="0.9rem">No approval requests sent yet.</Typography>
        </Box>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Sent To</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expires</TableCell>
              <TableCell>Decided At</TableCell>
              <TableCell align="right">Link</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((t) => {
              const s = STATUS_CONFIG[t.status] || STATUS_CONFIG.PENDING
              return (
                <TableRow key={t.id}>
                  <TableCell>
                    <Typography fontSize="0.85rem" fontWeight={600}>{t.authorName || t.authorEmail}</Typography>
                    {t.authorName && <Typography fontSize="0.75rem" color="text.secondary">{t.authorEmail}</Typography>}
                    {t.comment && (
                      <Typography fontSize="0.75rem" color="text.secondary" sx={{ mt: 0.25, fontStyle: 'italic' }}>
                        "{t.comment}"
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip label={s.label} size="small"
                      sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="0.8rem" color="text.secondary">{formatDate(t.expiresAt)}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="0.8rem" color="text.secondary">
                      {t.decidedAt ? formatDateTime(t.decidedAt) : '—'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    {t.status === 'PENDING' && (
                      <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                        <Tooltip title="Copy link">
                          <IconButton size="small" onClick={() => copyLink(t.reviewUrl)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Open portal">
                          <IconButton size="small" onClick={() => window.open(t.reviewUrl, '_blank')}>
                            <OpenInNewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      {/* Send for Approval Dialog */}
      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Send for Author Approval</DialogTitle>
        <DialogContent>
          {generatedLink ? (
            <Box sx={{ pt: 1 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Approval link generated! Share this link with the author.
              </Alert>
              <Box sx={{
                p: 2, bgcolor: '#F4F5F7', borderRadius: 2, border: '1px solid #DFE1E6',
                display: 'flex', alignItems: 'center', gap: 1, wordBreak: 'break-all',
              }}>
                <Typography fontSize="0.8rem" sx={{ flex: 1, fontFamily: 'monospace' }}>
                  {generatedLink}
                </Typography>
                <Tooltip title="Copy link">
                  <IconButton size="small" onClick={() => copyLink(generatedLink)}>
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Open in new tab">
                  <IconButton size="small" onClick={() => window.open(generatedLink, '_blank')}>
                    <OpenInNewIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField
                fullWidth
                label="Author Email *"
                type="email"
                placeholder="author@publisher.com"
                value={form.authorEmail}
                onChange={(e) => setForm((f) => ({ ...f, authorEmail: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Author Name (optional)"
                placeholder="Dr. Jane Smith"
                value={form.authorName}
                onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Link valid for (days)"
                type="number"
                inputProps={{ min: 1, max: 30 }}
                value={form.expiryDays}
                onChange={(e) => setForm((f) => ({ ...f, expiryDays: e.target.value }))}
                helperText="Author must respond within this many days. Default is 7."
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {generatedLink ? (
            <Button onClick={handleClose} variant="contained">Done</Button>
          ) : (
            <>
              <Button onClick={handleClose} color="inherit">Cancel</Button>
              <Button
                onClick={handleSend}
                variant="contained"
                startIcon={<SendIcon />}
                disabled={saving || !form.authorEmail.trim()}
              >
                {saving ? 'Generating...' : 'Generate Link'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}
