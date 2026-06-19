import { useState, useEffect } from 'react'
import {
  Box, Paper, Button, Table, TableHead, TableRow, TableCell,
  TableBody, Typography, Chip, IconButton, Tooltip, Switch,
  TableContainer, Avatar, TextField, InputAdornment, Skeleton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/EditOutlined'
import PageHeader from '../../components/common/PageHeader'
import CreateUserDialog from './CreateUserDialog'
import { usersApi } from '../../api/users.api'
import { ROLE_LABELS } from '../../utils/constants'
import { roleColors, getAvatarColor } from '../../utils/statusColors'
import { formatDate } from '../../utils/dateFormatter'
import { useSnackbar } from 'notistack'

export default function UsersPage() {
  const { enqueueSnackbar } = useSnackbar()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [editUser, setEditUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [editSaving, setEditSaving] = useState(false)

  useEffect(() => {
    usersApi.getAll({ size: 100 })
      .then((resp) => setUsers(resp.data.data.content ?? resp.data.data))
      .catch(() => enqueueSnackbar('Failed to load users', { variant: 'error' }))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    )
  })

  const handleCreate = async (data) => {
    const resp = await usersApi.create(data)
    const newUser = resp.data.data
    setUsers((prev) => [...prev, newUser])
    enqueueSnackbar(`User ${newUser.fullName} created`, { variant: 'success' })
  }

  const handleEditOpen = (user) => {
    setEditUser(user)
    setEditForm({ fullName: user.fullName, email: user.email, role: user.role })
  }

  const handleEditSave = async () => {
    setEditSaving(true)
    try {
      const resp = await usersApi.update(editUser.id, editForm)
      const updated = resp.data.data
      setUsers((prev) => prev.map((u) => u.id === updated.id ? updated : u))
      setEditUser(null)
      enqueueSnackbar('User updated', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to update user', { variant: 'error' })
    } finally {
      setEditSaving(false)
    }
  }

  const handleToggleActive = async (userId, current) => {
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: !current } : u))
    try {
      await usersApi.updateStatus(userId, !current)
    } catch {
      setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, isActive: current } : u))
      enqueueSnackbar('Failed to update user status', { variant: 'error' })
    }
  }

  return (
    <Box>
      <PageHeader
        title="User Management"
        subtitle={`${users.length} users registered`}
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Users' }]}
        actions={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Add User
          </Button>
        }
      />

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #EBECF0', bgcolor: '#FAFBFC' }}>
          <TextField
            placeholder="Search by name, email, or role..."
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 320 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading
                ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}><Skeleton variant="text" /></TableCell>
                    ))}
                  </TableRow>
                ))
                : filtered.map((user) => {
                  const initials = user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
                  const bg = getAvatarColor(user.fullName)
                  const roleCols = roleColors[user.role] || { bg: '#F4F5F7', text: '#5E6C84' }

                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, bgcolor: bg, fontSize: '0.78rem', fontWeight: 700 }}>
                            {initials}
                          </Avatar>
                          <Typography fontSize="0.875rem" fontWeight={600}>{user.fullName}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.82rem" color="text.secondary">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ROLE_LABELS[user.role]}
                          size="small"
                          sx={{ bgcolor: roleCols.bg, color: roleCols.text, fontWeight: 600, fontSize: '0.72rem', height: 22, borderRadius: '4px' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography fontSize="0.8rem" color="text.secondary">{formatDate(user.createdAt)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Switch
                            size="small"
                            checked={user.isActive}
                            onChange={() => handleToggleActive(user.id, user.isActive)}
                            color="success"
                          />
                          <Typography fontSize="0.8rem" color={user.isActive ? 'success.dark' : 'text.disabled'}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="Edit user">
                          <IconButton size="small" onClick={() => handleEditOpen(user)}>
                            <EditIcon fontSize="small" />
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

      <CreateUserDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />

      {/* Edit User Dialog */}
      <Dialog open={!!editUser} onClose={() => setEditUser(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              label="Full Name"
              value={editForm.fullName || ''}
              onChange={(e) => setEditForm((f) => ({ ...f, fullName: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={editForm.email || ''}
              onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={editForm.role || ''}
                label="Role"
                onChange={(e) => setEditForm((f) => ({ ...f, role: e.target.value }))}
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditUser(null)} color="inherit">Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            disabled={editSaving || !editForm.fullName?.trim() || !editForm.email?.trim()}
          >
            {editSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
