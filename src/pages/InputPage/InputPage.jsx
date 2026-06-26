import { useState, useEffect, useCallback } from 'react'
import {
  Box, Paper, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Chip, IconButton, Tooltip, Skeleton, Avatar,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined'
import { useSnackbar } from 'notistack'
import PageHeader from '../../components/common/PageHeader'
import { inputApi } from '../../api/input.api'
import { formatDateTime } from '../../utils/dateFormatter'
import { getAvatarColor } from '../../utils/statusColors'

function formatBytes(bytes) {
  if (bytes == null) return '—'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function InputPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await inputApi.getAll()
      setItems(resp.data.data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleDownload = async (item) => {
    try {
      const resp = await inputApi.download(item.id)
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

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.originalFilename}" from Input? This cannot be undone.`)) return
    try {
      await inputApi.delete(item.id)
      setItems((prev) => prev.filter((i) => i.id !== item.id))
      enqueueSnackbar('Deleted', { variant: 'success' })
    } catch {
      enqueueSnackbar('Delete failed', { variant: 'error' })
    }
  }

  return (
    <Box>
      <PageHeader
        title="Input"
        subtitle="Shared repository of files the whole team works from"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Input' }]}
      />

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 280px)' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>File</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Added by</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Added</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
                : items.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary', fontSize: '0.875rem' }}>
                        No files yet. Move files here from the Incoming page.
                      </TableCell>
                    </TableRow>
                  )
                  : items.map((item) => {
                    const initials = item.addedByName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                    return (
                      <TableRow key={item.id} sx={{ '&:hover': { bgcolor: '#F4F5F7' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsertDriveFileIcon sx={{ fontSize: '1.1rem', color: '#5E6C84' }} />
                            <Typography fontSize="0.82rem" fontWeight={500} noWrap sx={{ maxWidth: 260 }} title={item.originalFilename}>
                              {item.originalFilename}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={item.source || 'EMAIL'}
                            size="small"
                            sx={{ bgcolor: '#EAE6FF', color: '#403294', fontWeight: 600, fontSize: '0.66rem', height: 20, borderRadius: '4px' }}
                          />
                        </TableCell>
                        <TableCell>
                          {item.addedByName ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar sx={{ width: 22, height: 22, bgcolor: getAvatarColor(item.addedByName), fontSize: '0.6rem', fontWeight: 700 }}>
                                {initials}
                              </Avatar>
                              <Typography fontSize="0.8rem">{item.addedByName}</Typography>
                            </Box>
                          ) : (
                            <Typography fontSize="0.8rem" color="text.secondary">—</Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.78rem" color="text.secondary">{formatBytes(item.fileSize)}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.78rem" color="text.secondary" noWrap>{formatDateTime(item.createdAt)}</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Tooltip title="Download">
                            <IconButton size="small" onClick={() => handleDownload(item)}>
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton size="small" onClick={() => handleDelete(item)}>
                              <DeleteIcon fontSize="small" sx={{ color: '#BF2600' }} />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  )
}
