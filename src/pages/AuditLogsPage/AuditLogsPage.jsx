import { useState, useEffect, useCallback } from 'react'
import {
  Box, Paper, Typography, Table, TableHead, TableRow, TableCell,
  TableBody, TableContainer, Chip, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Avatar, TablePagination,
  Skeleton,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import PageHeader from '../../components/common/PageHeader'
import { auditApi } from '../../api/audit.api'
import { formatDateTime } from '../../utils/dateFormatter'
import { getAvatarColor } from '../../utils/statusColors'

const ALL_ACTIONS = [
  'PROJECT_CREATED', 'PROJECT_UPDATED', 'PROJECT_DELETED',
  'STAGE_ADVANCED', 'STAGE_REJECTED', 'STAGE_ASSIGNED',
  'FILE_UPLOADED', 'FILE_DELETED',
  'COMMENT_ADDED', 'COMMENT_DELETED',
  'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
  'USER_LOGIN', 'USER_LOGOUT',
]

const ACTION_COLORS = {
  USER_LOGIN:       { bg: '#DEEBFF', color: '#0052CC' },
  USER_LOGOUT:      { bg: '#F4F5F7', color: '#5E6C84' },
  PROJECT_CREATED:  { bg: '#E3FCEF', color: '#006644' },
  PROJECT_UPDATED:  { bg: '#DEEBFF', color: '#0052CC' },
  PROJECT_DELETED:  { bg: '#FFEBE6', color: '#BF2600' },
  STAGE_ADVANCED:   { bg: '#E3FCEF', color: '#006644' },
  STAGE_REJECTED:   { bg: '#FFEBE6', color: '#BF2600' },
  STAGE_ASSIGNED:   { bg: '#EAE6FF', color: '#403294' },
  FILE_UPLOADED:    { bg: '#E3FCEF', color: '#006644' },
  FILE_DELETED:     { bg: '#FFEBE6', color: '#BF2600' },
  COMMENT_ADDED:    { bg: '#EAE6FF', color: '#403294' },
  COMMENT_DELETED:  { bg: '#FFEBE6', color: '#BF2600' },
  USER_CREATED:     { bg: '#FFF0B3', color: '#172B4D' },
  USER_UPDATED:     { bg: '#DEEBFF', color: '#0052CC' },
  USER_DELETED:     { bg: '#FFEBE6', color: '#BF2600' },
}

const ENTITY_TYPES = ['PROJECT', 'STAGE', 'FILE', 'COMMENT', 'USER']

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(50)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [entityFilter, setEntityFilter] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      const resp = await auditApi.getAll({
        action: actionFilter || undefined,
        entityType: entityFilter || undefined,
        page,
        size: rowsPerPage,
      })
      const paged = resp.data.data
      setLogs(paged.content ?? [])
      setTotal(paged.totalElements ?? 0)
    } catch {
      setLogs([])
    } finally {
      setLoading(false)
    }
  }, [actionFilter, entityFilter, page, rowsPerPage])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  // Client-side search on the current page (search by name, action, entity)
  const filtered = search
    ? logs.filter((log) => {
        const q = search.toLowerCase()
        return (
          log.action?.toLowerCase().replace(/_/g, ' ').includes(q) ||
          log.entityType?.toLowerCase().includes(q) ||
          log.actorName?.toLowerCase().includes(q)
        )
      })
    : logs

  const handleActionFilter = (val) => { setActionFilter(val); setPage(0) }
  const handleEntityFilter = (val) => { setEntityFilter(val); setPage(0) }

  return (
    <Box>
      <PageHeader
        title="Audit Logs"
        subtitle="Immutable record of all system actions and changes"
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Audit Logs' }]}
      />

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Filter bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid #EBECF0', bgcolor: '#FAFBFC', display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextField
            placeholder="Search by action, entity, or user..."
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
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Action</InputLabel>
            <Select value={actionFilter} label="Action" onChange={(e) => handleActionFilter(e.target.value)}>
              <MenuItem value="">All Actions</MenuItem>
              {ALL_ACTIONS.map((a) => (
                <MenuItem key={a} value={a}>{a.replace(/_/g, ' ')}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Entity</InputLabel>
            <Select value={entityFilter} label="Entity" onChange={(e) => handleEntityFilter(e.target.value)}>
              <MenuItem value="">All Entities</MenuItem>
              {ENTITY_TYPES.map((e) => (
                <MenuItem key={e} value={e}>{e}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Typography fontSize="0.8rem" color="text.secondary" sx={{ ml: 'auto' }}>
            {total.toLocaleString()} total entries
          </Typography>
        </Box>

        <TableContainer sx={{ maxHeight: 'calc(100vh - 340px)' }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Entity</TableCell>
                <TableCell>Performed By</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Timestamp</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
                : filtered.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6, color: 'text.secondary', fontSize: '0.875rem' }}>
                        No audit log entries found.
                      </TableCell>
                    </TableRow>
                  )
                  : filtered.map((log) => {
                    const colors = ACTION_COLORS[log.action] || { bg: '#F4F5F7', color: '#5E6C84' }
                    const initials = log.actorName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'
                    const bg = getAvatarColor(log.actorName || '')

                    let detailText = ''
                    if (log.details) {
                      try {
                        const parsed = JSON.parse(log.details)
                        detailText = Object.entries(parsed).map(([k, v]) => `${k}: ${v}`).join(' · ')
                      } catch {
                        detailText = log.details
                      }
                    }

                    return (
                      <TableRow key={log.id} sx={{ '&:hover': { bgcolor: '#F4F5F7' } }}>
                        <TableCell>
                          <Chip
                            label={log.action?.replace(/_/g, ' ')}
                            size="small"
                            sx={{ bgcolor: colors.bg, color: colors.color, fontWeight: 600, fontSize: '0.68rem', height: 20, borderRadius: '4px' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography fontSize="0.82rem" fontWeight={500}>{log.entityType || '—'}</Typography>
                            {log.entityId && (
                              <Typography fontSize="0.68rem" color="text.disabled" fontFamily="monospace">
                                {log.entityId.slice(0, 8)}…
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: bg, fontSize: '0.62rem', fontWeight: 700 }}>
                              {initials}
                            </Avatar>
                            <Typography fontSize="0.8rem">{log.actorName || '—'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 280 }}>
                          <Typography fontSize="0.72rem" color="text.secondary" noWrap title={detailText}>
                            {detailText || '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography fontSize="0.78rem" color="text.secondary" noWrap>
                            {formatDateTime(log.createdAt)}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })
              }
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          rowsPerPageOptions={[25, 50, 100]}
          sx={{ borderTop: '1px solid #EBECF0' }}
        />
      </Paper>
    </Box>
  )
}
