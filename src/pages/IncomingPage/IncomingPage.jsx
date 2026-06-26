import { useState, useEffect, useCallback } from 'react'
import {
  Box, Paper, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Chip, Button, IconButton, Tooltip, Skeleton,
} from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'
import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircleOutline'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined'
import DriveFileMoveIcon from '@mui/icons-material/DriveFileMoveOutlined'
import { useSnackbar } from 'notistack'
import PageHeader from '../../components/common/PageHeader'
import { incomingApi } from '../../api/incoming.api'
import { inputApi } from '../../api/input.api'
import { formatDateTime } from '../../utils/dateFormatter'

function formatBytes(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function IncomingPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [polling, setPolling] = useState(false)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await incomingApi.getAll()
      setItems(resp.data.data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleCheckInbox = async () => {
    setPolling(true)
    try {
      const resp = await incomingApi.pollNow()
      const imported = resp.data.data ?? 0
      enqueueSnackbar(
        imported > 0 ? `Imported ${imported} new file(s)` : 'No new files in the inbox',
        { variant: imported > 0 ? 'success' : 'info' }
      )
      await fetchItems()
    } catch {
      enqueueSnackbar('Could not check the inbox', { variant: 'error' })
    } finally {
      setPolling(false)
    }
  }

  const handleDownload = async (item) => {
    try {
      const resp = await incomingApi.download(item.id)
      const url = window.URL.createObjectURL(new Blob([resp.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = item.originalFilename || 'download'
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      enqueueSnackbar('Download failed', { variant: 'error' })
    }
  }

  const handleMoveToInput = async (item) => {
    try {
      await inputApi.moveFromIncoming(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      enqueueSnackbar(`Moved "${item.originalFilename}" to Input`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Could not move to Input', { variant: 'error' })
    }
  }

  const handleToggleHandled = async (item) => {
    try {
      await incomingApi.markHandled(item.id, !item.handled)
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, handled: !i.handled } : i)))
    } catch {
      enqueueSnackbar('Could not update status', { variant: 'error' })
    }
  }

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.originalFilename}"? This cannot be undone.`)) return
    try {
      await incomingApi.delete(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      enqueueSnackbar('Deleted', { variant: 'success' })
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' })
    }
  }

  return (
    <Box>
      <PageHeader
        title="Incoming"
        subtitle="Files and images received by email, waiting to be picked up"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Incoming' }]}
        actions={
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleCheckInbox}
            disabled={polling}
          >
            {polling ? 'Checking…' : 'Check inbox now'}
          </Button>
        }
      />

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>From</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Received</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 7 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
                : items.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary', fontSize: '0.875rem' }}>
                        Nothing here yet. Emailed-in files will appear automatically, or click “Check inbox now”.
                      </TableCell>
                    </TableRow>
                  )
                  : items.map((item) => (
                    <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#F4F5F7' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <InsertDriveFileIcon sx={{ fontSize: '1.1rem', color: '#5E6C84' }} />
                          <Typography fontSize="0.82rem" fontWeight={500} noWrap sx={{ maxWidth: 220 }} title={item.originalFilename}>
                            {item.originalFilename}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.8rem" noWrap sx={{ maxWidth: 180 }} title={item.sender}>
                          {item.sender || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.8rem" color="text.secondary" noWrap sx={{ maxWidth: 200 }} title={item.subject}>
                          {item.subject || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.78rem" color="text.secondary">{formatBytes(item.fileSize)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.78rem" color="text.secondary" noWrap>
                          {formatDateTime(item.receivedAt || item.createdAt)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.handled ? 'Handled' : 'New'}
                          size="small"
                          sx={{
                            bgcolor: item.handled ? '#E3FCEF' : '#DEEBFF',
                            color: item.handled ? '#006644' : '#0052CC',
                            fontWeight: 600, fontSize: '0.68rem', height: 20, borderRadius: '4px',
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Move to Input">
                          <IconButton size="small" onClick={() => handleMoveToInput(item)}>
                            <DriveFileMoveIcon fontSize="small" sx={{ color: '#0052CC' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Download">
                          <IconButton size="small" onClick={() => handleDownload(item)}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={item.handled ? 'Mark as new' : 'Mark as handled'}>
                          <IconButton size="small" onClick={() => handleToggleHandled(item)}>
                            <CheckCircleIcon fontSize="small" sx={{ color: item.handled ? '#006644' : '#97A0AF' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => handleDelete(item)}>
                            <DeleteIcon fontSize="small" sx={{ color: '#BF2600' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
