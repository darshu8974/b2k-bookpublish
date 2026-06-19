import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Paper, Button, Typography, TableContainer, TablePagination } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PageHeader from '../../components/common/PageHeader'
import ProjectFilters from './ProjectFilters'
import ProjectsTable from './ProjectsTable'
import useProjects from '../../hooks/useProjects'
import useAuth from '../../auth/useAuth'
import { canCreateProject } from '../../utils/roleHelpers'

const STATUS_TABS = [
  { label: 'All', value: undefined },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'On Hold', value: 'ON_HOLD' },
  { label: 'Completed', value: 'COMPLETED' },
]

export default function ProjectsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [filters, setFilters] = useState({})
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const { projects, loading, total } = useProjects({ ...filters, page, size: rowsPerPage })

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(0)
  }

  const handleClearFilters = () => {
    setFilters({})
    setPage(0)
  }

  return (
    <Box>
      <PageHeader
        title="Projects"
        subtitle={`${total} project${total !== 1 ? 's' : ''} total`}
        breadcrumbs={[{ label: 'Dashboard', path: '/dashboard' }, { label: 'Projects' }]}
        actions={
          canCreateProject(user?.role) && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/projects/new')}
            >
              New Project
            </Button>
          )
        }
      />

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
        {/* Filter bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid #EBECF0', bgcolor: '#FAFBFC' }}>
          <ProjectFilters filters={filters} onChange={handleFilterChange} onClear={handleClearFilters} />
        </Box>

        {/* Status quick-filter tabs */}
        <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #EBECF0', display: 'flex', gap: 2 }}>
          {STATUS_TABS.map((tab) => {
            const isActive = (filters.status || undefined) === tab.value
            return (
              <Box
                key={tab.label}
                onClick={() => handleFilterChange({ ...filters, status: tab.value })}
                sx={{
                  px: 1.5, py: 0.5, borderRadius: 1.5, cursor: 'pointer',
                  bgcolor: isActive ? '#E9F2FF' : 'transparent',
                  color: isActive ? '#0052CC' : '#5E6C84',
                  fontWeight: isActive ? 700 : 400,
                  fontSize: '0.82rem',
                  '&:hover': { bgcolor: '#F4F5F7' },
                  transition: 'all 0.15s',
                }}
              >
                {tab.label}
              </Box>
            )
          })}
        </Box>

        {/* Table */}
        <TableContainer sx={{ maxHeight: 'calc(100vh - 390px)' }}>
          <ProjectsTable projects={projects} loading={loading} />
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0) }}
          rowsPerPageOptions={[10, 20, 50]}
          sx={{ borderTop: '1px solid #EBECF0' }}
        />
      </Paper>
    </Box>
  )
}
