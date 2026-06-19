import { Box, TextField, Select, MenuItem, FormControl, InputLabel, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import CloseIcon from '@mui/icons-material/Close'
import { PROJECT_STATUS, PROJECT_PRIORITY, WORKFLOW_STAGES } from '../../utils/constants'

export default function ProjectFilters({ filters, onChange, onClear }) {
  const hasActiveFilter = Object.values(filters).some((v) => v !== '' && v !== undefined)

  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        placeholder="Search by title, code, or customer..."
        size="small"
        value={filters.search || ''}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        sx={{ minWidth: 280 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: '1rem', color: '#97A0AF' }} />
            </InputAdornment>
          ),
        }}
      />

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Status</InputLabel>
        <Select
          value={filters.status || ''}
          label="Status"
          onChange={(e) => onChange({ ...filters, status: e.target.value })}
        >
          <MenuItem value="">All Status</MenuItem>
          {Object.keys(PROJECT_STATUS).map((s) => (
            <MenuItem key={s} value={s}>{s.replace('_', ' ')}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 130 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={filters.priority || ''}
          label="Priority"
          onChange={(e) => onChange({ ...filters, priority: e.target.value })}
        >
          <MenuItem value="">All Priorities</MenuItem>
          {Object.keys(PROJECT_PRIORITY).map((p) => (
            <MenuItem key={p} value={p}>{p}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Stage</InputLabel>
        <Select
          value={filters.currentStage || ''}
          label="Stage"
          onChange={(e) => onChange({ ...filters, currentStage: e.target.value })}
        >
          <MenuItem value="">All Stages</MenuItem>
          {WORKFLOW_STAGES.map((s) => (
            <MenuItem key={s.key} value={s.key}>{s.label}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {hasActiveFilter && (
        <Button
          size="small"
          startIcon={<CloseIcon fontSize="small" />}
          onClick={onClear}
          variant="outlined"
          color="inherit"
          sx={{ borderColor: '#DFE1E6', color: '#5E6C84' }}
        >
          Clear filters
        </Button>
      )}
    </Box>
  )
}
