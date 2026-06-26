import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Card, CardContent, Tabs, Tab, Alert, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import PageHeader from '../../components/common/PageHeader'
import ProjectHeader from './ProjectHeader'
import WorkflowTracker from './WorkflowTracker'
import CommentsSection from './CommentsSection'
import FilesSection from './FilesSection'
import ActivityTimeline from './ActivityTimeline'
import QcChecklistSection from './QcChecklistSection'
import SendApprovalSection from './SendApprovalSection'
import useProject from '../../hooks/useProject'
import useAuth from '../../auth/useAuth'
import { isAdminOrPM } from '../../utils/roleHelpers'
import { useSnackbar } from 'notistack'
import { PROJECT_PRIORITY } from '../../utils/constants'

export default function ProjectDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { enqueueSnackbar } = useSnackbar()
  const [activeTab, setActiveTab] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [editSaving, setEditSaving] = useState(false)
  const {
    project, comments, files, activity, loading, error,
    addComment, deleteComment, advanceStage, rejectStage, assignStage, uploadFile, deleteFile,
    updateStatus, updateProject,
  } = useProject(id)

  const handleAdvance = async (stageName, remarks) => {
    try {
      await advanceStage(stageName, remarks)
      enqueueSnackbar('Stage marked as complete', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to advance stage', { variant: 'error' })
    }
  }

  const handleReject = async (stageName, reason) => {
    try {
      await rejectStage(stageName, reason)
      enqueueSnackbar('Stage rejected', { variant: 'warning' })
    } catch {
      enqueueSnackbar('Failed to reject stage', { variant: 'error' })
    }
  }

  const handleAssign = async (stageName, userId) => {
    try {
      await assignStage(stageName, userId)
      enqueueSnackbar('Stage assigned successfully', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to assign stage', { variant: 'error' })
    }
  }

  const handleAddComment = async (content) => {
    try {
      await addComment(content)
      enqueueSnackbar('Comment added', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to post comment', { variant: 'error' })
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId)
      enqueueSnackbar('Comment deleted', { variant: 'info' })
    } catch {
      enqueueSnackbar('Failed to delete comment', { variant: 'error' })
    }
  }

  const handleUploadFile = async (file, category) => {
    try {
      await uploadFile(file, category)
      enqueueSnackbar('File uploaded successfully', { variant: 'success' })
    } catch {
      enqueueSnackbar('File upload failed', { variant: 'error' })
    }
  }

  const handleDeleteFile = async (fileId) => {
    try {
      await deleteFile(fileId)
      enqueueSnackbar('File deleted', { variant: 'info' })
    } catch {
      enqueueSnackbar('Failed to delete file', { variant: 'error' })
    }
  }

  const handleStatusChange = async (status) => {
    try {
      await updateStatus(status)
      enqueueSnackbar(`Project set to ${status.replace('_', ' ')}`, { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to update status', { variant: 'error' })
    }
  }

  const handleEditOpen = () => {
    setEditForm({
      title: project.title,
      description: project.description || '',
      priority: project.priority,
      dueDate: project.dueDate || '',
    })
    setEditOpen(true)
  }

  const handleEditSave = async () => {
    setEditSaving(true)
    try {
      await updateProject(editForm)
      setEditOpen(false)
      enqueueSnackbar('Project updated', { variant: 'success' })
    } catch {
      enqueueSnackbar('Failed to update project', { variant: 'error' })
    } finally {
      setEditSaving(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !project) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error || 'Project not found.'}
      </Alert>
    )
  }

  return (
    <Box>
      <PageHeader
        breadcrumbs={[
          { label: 'Dashboard', path: '/dashboard' },
          { label: 'Projects', path: '/projects' },
          { label: project.projectCode },
        ]}
        title=""
        sx={{ mb: 0 }}
      />

      <ProjectHeader
        project={project}
        canEdit={isAdminOrPM(user?.role)}
        onEdit={handleEditOpen}
        onStatusChange={handleStatusChange}
      />

      <WorkflowTracker
        project={project}
        onAdvance={handleAdvance}
        onReject={handleReject}
        onAssign={handleAssign}
      />

      {/* Tab section */}
      <Card>
        <Box sx={{ borderBottom: '1px solid #DFE1E6' }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2 }}>
            <Tab label={`Comments (${comments.length})`} />
            <Tab label={`Files (${files.length})`} />
            <Tab label="QC Checklist" />
            <Tab label="Approval" />
            <Tab label={`Activity (${activity.length})`} />
          </Tabs>
        </Box>
        <CardContent sx={{ p: 3 }}>
          {activeTab === 0 && (
            <CommentsSection
              comments={comments}
              onAdd={handleAddComment}
              onDelete={handleDeleteComment}
            />
          )}
          {activeTab === 1 && (
            <FilesSection
              files={files}
              onUpload={handleUploadFile}
              onDelete={handleDeleteFile}
            />
          )}
          {activeTab === 2 && (
            <QcChecklistSection projectId={id} />
          )}
          {activeTab === 3 && (
            <SendApprovalSection projectId={id} canSend={isAdminOrPM(user?.role)} />
          )}
          {activeTab === 4 && (
            <ActivityTimeline activity={activity} />
          )}
        </CardContent>
      </Card>
      {/* Edit Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth label="Title *"
              value={editForm.title || ''}
              onChange={(e) => setEditForm((f) => ({ ...f, title: e.target.value }))}
            />
            <TextField
              fullWidth multiline rows={3} label="Description"
              value={editForm.description || ''}
              onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editForm.priority || 'MEDIUM'}
                label="Priority"
                onChange={(e) => setEditForm((f) => ({ ...f, priority: e.target.value }))}
              >
                {Object.keys(PROJECT_PRIORITY).map((p) => (
                  <MenuItem key={p} value={p}>{p}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth type="date" label="Due Date"
              InputLabelProps={{ shrink: true }}
              value={editForm.dueDate || ''}
              onChange={(e) => setEditForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleEditSave} variant="contained" disabled={editSaving || !editForm.title?.trim()}>
            {editSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
