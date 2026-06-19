import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, Button, LinearProgress, IconButton, Tooltip } from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUploadOutlined'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFileOutlined'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/ErrorOutline'

function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

function FileItem({ file, onRemove }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', gap: 1.5,
      p: 1.25, borderRadius: 2, border: '1px solid #DFE1E6', bgcolor: '#FAFBFC',
    }}>
      <Box sx={{
        width: 36, height: 36, borderRadius: 1.5,
        bgcolor: '#E9F2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <InsertDriveFileIcon sx={{ color: '#0052CC', fontSize: '1rem' }} />
      </Box>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography fontSize="0.82rem" fontWeight={500} noWrap>{file.name}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography fontSize="0.72rem" color="text.secondary">{formatBytes(file.size)}</Typography>
          {file.progress !== undefined && file.progress < 100 && (
            <Box sx={{ flex: 1, maxWidth: 120 }}>
              <LinearProgress variant="determinate" value={file.progress} sx={{ height: 4 }} />
            </Box>
          )}
          {file.progress === 100 && (
            <CheckCircleIcon sx={{ fontSize: '0.85rem', color: '#00875A' }} />
          )}
          {file.error && (
            <Tooltip title={file.error}>
              <ErrorIcon sx={{ fontSize: '0.85rem', color: '#DE350B' }} />
            </Tooltip>
          )}
        </Box>
      </Box>
      {onRemove && (
        <IconButton size="small" onClick={() => onRemove(file.name)} sx={{ color: '#97A0AF' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  )
}

export default function FileUploadZone({ onFilesAdded, queuedFiles = [], onRemoveFile, maxSize = 52428800, accept }) {
  const onDrop = useCallback(
    (accepted) => {
      if (onFilesAdded) onFilesAdded(accepted)
    },
    [onFilesAdded]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize,
    accept,
    multiple: true,
  })

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: `2px dashed ${isDragReject ? '#DE350B' : isDragActive ? '#0052CC' : '#DFE1E6'}`,
          borderRadius: 2,
          p: 3, textAlign: 'center', cursor: 'pointer',
          bgcolor: isDragActive ? '#E9F2FF' : '#FAFBFC',
          transition: 'all 0.15s',
          '&:hover': { borderColor: '#0052CC', bgcolor: '#F0F4FF' },
        }}
      >
        <input {...getInputProps()} />
        <CloudUploadIcon sx={{ fontSize: 40, color: isDragActive ? '#0052CC' : '#B3BAC5', mb: 1 }} />
        <Typography fontWeight={600} fontSize="0.9rem" mb={0.5}>
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </Typography>
        <Typography fontSize="0.8rem" color="text.secondary" mb={1.5}>
          or click to browse · Max {formatBytes(maxSize)} per file
        </Typography>
        <Button variant="outlined" size="small" component="span">
          Browse Files
        </Button>
      </Box>

      {queuedFiles.length > 0 && (
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {queuedFiles.map((file) => (
            <FileItem key={file.name} file={file} onRemove={onRemoveFile} />
          ))}
        </Box>
      )}
    </Box>
  )
}
