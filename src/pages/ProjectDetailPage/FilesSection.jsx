import { useState } from 'react'
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableHead,
  TableRow, IconButton, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Select, MenuItem, FormControl, InputLabel, Chip,
} from '@mui/material'
import UploadIcon from '@mui/icons-material/CloudUploadOutlined'
import DownloadIcon from '@mui/icons-material/DownloadOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined'
import FileUploadZone from '../../components/common/FileUploadZone'
import EmptyState from '../../components/common/EmptyState'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import { UserAvatarWithName } from '../../components/common/UserAvatar'
import { formatDateTime } from '../../utils/dateFormatter'
import { UPLOAD_CATEGORIES } from '../../utils/constants'
import useFileUpload from '../../hooks/useFileUpload'
import useAuth from '../../auth/useAuth'
import { canDeleteFile } from '../../utils/roleHelpers'

const CATEGORY_COLORS = {
  CUSTOMER_BRIEF:    { bg: '#DEEBFF', color: '#0052CC' },
  SAMPLE_FILE:       { bg: '#EAE6FF', color: '#403294' },
  REVIEW_FEEDBACK:   { bg: '#FFF0B3', color: '#172B4D' },
  TYPESET_DRAFT:     { bg: '#E3FCEF', color: '#006644' },
  PAGINATED_FILE:    { bg: '#E3FCEF', color: '#006644' },
  QC_REPORT:         { bg: '#FFEBE6', color: '#BF2600' },
  FINAL_DELIVERABLE: { bg: '#DEEBFF', color: '#0747A6' },
  OTHER:             { bg: '#F4F5F7', color: '#5E6C84' },
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export default function FilesSection({ files, onUpload, onDelete }) {
  const { user } = useAuth()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [category, setCategory] = useState('OTHER')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const { queue, uploading, addFiles, removeFile, clearQueue, uploadAll } = useFileUpload(onUpload)

  const handleUpload = async () => {
    await uploadAll(category)
    setTimeout(() => {
      setUploadOpen(false)
      clearQueue()
    }, 800)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography fontWeight={700} fontSize="0.95rem">
          Files <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>({files.length})</Box>
        </Typography>
        <Button variant="outlined" size="small" startIcon={<UploadIcon />} onClick={() => setUploadOpen(true)}>
          Upload File
        </Button>
      </Box>

      {files.length === 0 ? (
        <EmptyState
          icon={InsertDriveFileIcon}
          title="No files uploaded yet"
          description="Upload project files such as manuscripts, samples, and deliverables."
          actionLabel="Upload File"
          onAction={() => setUploadOpen(true)}
          sx={{ py: 4 }}
        />
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>File Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Uploaded By</TableCell>
              <TableCell>Date</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => {
              const catColors = CATEGORY_COLORS[file.uploadCategory] || CATEGORY_COLORS.OTHER
              const catLabel = UPLOAD_CATEGORIES.find((c) => c.value === file.uploadCategory)?.label || file.uploadCategory
              return (
                <TableRow key={file.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{
                        width: 30, height: 30, borderRadius: 1.5,
                        bgcolor: '#E9F2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <InsertDriveFileIcon sx={{ fontSize: '0.85rem', color: '#0052CC' }} />
                      </Box>
                      <Typography fontSize="0.82rem" fontWeight={500}>{file.originalFilename}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={catLabel}
                      size="small"
                      sx={{ bgcolor: catColors.bg, color: catColors.color, fontWeight: 600, fontSize: '0.65rem', borderRadius: '4px', height: 20 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="0.8rem" color="text.secondary">{formatBytes(file.fileSizeBytes)}</Typography>
                  </TableCell>
                  <TableCell>
                    {file.uploadedBy && <UserAvatarWithName user={file.uploadedBy} size={24} />}
                  </TableCell>
                  <TableCell>
                    <Typography fontSize="0.78rem" color="text.secondary">{formatDateTime(file.createdAt)}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}>
                      <Tooltip title="Download">
                        <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                      </Tooltip>
                      {canDeleteFile(user?.role) && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => setDeleteTarget(file)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onClose={() => setUploadOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>File Category</InputLabel>
            <Select value={category} label="File Category" onChange={(e) => setCategory(e.target.value)}>
              {UPLOAD_CATEGORIES.map((c) => (
                <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FileUploadZone onFilesAdded={addFiles} queuedFiles={queue} onRemoveFile={removeFile} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setUploadOpen(false); clearQueue() }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={queue.length === 0 || uploading}
            startIcon={<UploadIcon />}
          >
            {uploading ? 'Uploading...' : `Upload ${queue.length > 0 ? `(${queue.length})` : ''}`}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { onDelete(deleteTarget.id); setDeleteTarget(null) }}
        title="Delete File"
        message={`Are you sure you want to delete "${deleteTarget?.originalFilename}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="error"
      />
    </Box>
  )
}
