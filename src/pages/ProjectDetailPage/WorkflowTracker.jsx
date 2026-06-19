import { useState } from 'react'
import {
  Box, Card, CardContent, Typography, Drawer, Button, TextField,
  Select, MenuItem, FormControl, InputLabel, Divider, Alert,
} from '@mui/material'
import WorkflowStepper from '../../components/workflow/WorkflowStepper'
import StageStatusIcon from '../../components/workflow/StageStatusIcon'
import StageActionMenu from '../../components/workflow/StageActionMenu'
import StatusChip from '../../components/common/StatusChip'
import { UserAvatar, UserAvatarWithName } from '../../components/common/UserAvatar'
import { WORKFLOW_STAGES } from '../../utils/constants'
import { MOCK_USERS as USERS } from '../../mocks/mockData'
import { formatDate, formatRelative } from '../../utils/dateFormatter'
import useAuth from '../../auth/useAuth'
import { canAdvanceStage, canRejectStage, canAssignStage } from '../../utils/roleHelpers'

function StageDrawer({ stage, open, onClose, onAdvance, onReject, onAssign }) {
  const { user } = useAuth()
  const [remarks, setRemarks] = useState(stage?.remarks || '')
  const [rejectReason, setRejectReason] = useState('')
  const [selectedUser, setSelectedUser] = useState(stage?.assignedTo || '')
  const [view, setView] = useState('detail')

  const stageInfo = WORKFLOW_STAGES.find((s) => s.key === stage?.stageName)
  const assignedUser = USERS.find((u) => u.id === stage?.assignedTo)

  if (!stage) return null

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 420, borderLeft: '1px solid #DFE1E6' } }}
    >
      <Box sx={{ p: 2.5, borderBottom: '1px solid #EBECF0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <StageStatusIcon status={stage.status} size={30} />
        <Box>
          <Typography fontWeight={700} fontSize="1rem">{stageInfo?.label}</Typography>
          <Typography fontSize="0.75rem" color="text.secondary">{stageInfo?.description}</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5 }}>
        {/* Stage tabs */}
        <Box sx={{ display: 'flex', gap: 0.5, mb: 2.5, bgcolor: '#F4F5F7', borderRadius: 2, p: 0.5 }}>
          {['detail', 'assign', 'reject'].map((v) => (
            <Box
              key={v}
              onClick={() => setView(v)}
              sx={{
                flex: 1, textAlign: 'center', py: 0.75, borderRadius: 1.5, cursor: 'pointer',
                bgcolor: view === v ? '#FFFFFF' : 'transparent',
                fontWeight: view === v ? 600 : 400,
                fontSize: '0.8rem',
                boxShadow: view === v ? '0 1px 3px rgba(9,30,66,0.12)' : 'none',
                color: view === v ? 'text.primary' : 'text.secondary',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}
            >
              {v}
            </Box>
          ))}
        </Box>

        {view === 'detail' && (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Typography fontSize="0.72rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={0.5}>Status</Typography>
                <StatusChip status={stage.status} type="stage" />
              </Box>
              {stage.dueDate && (
                <Box>
                  <Typography fontSize="0.72rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={0.5}>Due</Typography>
                  <Typography fontSize="0.875rem" fontWeight={500}>{formatDate(stage.dueDate)}</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box mb={2}>
              <Typography fontSize="0.72rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={1}>Assignee</Typography>
              {assignedUser
                ? <UserAvatarWithName user={assignedUser} size={32} subtitleText={assignedUser.role.replace('_', ' ')} />
                : <Typography fontSize="0.875rem" color="text.disabled">Not assigned</Typography>
              }
            </Box>

            {stage.startedAt && (
              <Box mb={2}>
                <Typography fontSize="0.72rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={0.5}>Started</Typography>
                <Typography fontSize="0.875rem">{formatRelative(stage.startedAt)}</Typography>
              </Box>
            )}

            {stage.completedAt && (
              <Box mb={2}>
                <Typography fontSize="0.72rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={0.5}>Completed</Typography>
                <Typography fontSize="0.875rem">{formatRelative(stage.completedAt)}</Typography>
              </Box>
            )}

            {stage.remarks && (
              <Box mb={2}>
                <Typography fontSize="0.72rem" color="text.disabled" textTransform="uppercase" letterSpacing="0.06em" mb={0.5}>Remarks</Typography>
                <Box sx={{ p: 1.5, bgcolor: '#FFFAE6', borderRadius: 1.5, border: '1px solid #FFE380' }}>
                  <Typography fontSize="0.875rem">{stage.remarks}</Typography>
                </Box>
              </Box>
            )}

            {canAdvanceStage(user?.role, stage.stageName) && stage.status !== 'COMPLETED' && (
              <Box mt={3}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Remarks (optional)"
                  placeholder="Add notes before completing this stage..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  sx={{ mb: 1.5 }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="success"
                  onClick={() => { onAdvance(stage.stageName, remarks); onClose() }}
                >
                  Mark Stage Complete
                </Button>
              </Box>
            )}
          </Box>
        )}

        {view === 'assign' && (
          <Box>
            <Typography fontSize="0.875rem" color="text.secondary" mb={2}>
              Assign a team member to be responsible for this stage.
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Assign to</InputLabel>
              <Select
                value={selectedUser}
                label="Assign to"
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                {USERS.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UserAvatar user={u} size={24} showTooltip={false} />
                      <Box>
                        <Typography fontSize="0.875rem">{u.fullName}</Typography>
                        <Typography fontSize="0.72rem" color="text.secondary">{u.role.replace(/_/g, ' ')}</Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              fullWidth
              variant="contained"
              disabled={!selectedUser}
              onClick={() => { onAssign(stage.stageName, selectedUser); onClose() }}
            >
              Assign
            </Button>
          </Box>
        )}

        {view === 'reject' && (
          <Box>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Rejecting will mark this stage as rejected and notify the assignee.
            </Alert>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Reason for rejection"
              placeholder="Describe the issues that need to be addressed..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              sx={{ mb: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="error"
              disabled={!rejectReason.trim()}
              onClick={() => { onReject(stage.stageName, rejectReason); onClose() }}
            >
              Reject Stage
            </Button>
          </Box>
        )}
      </Box>
    </Drawer>
  )
}

export default function WorkflowTracker({ project, onAdvance, onReject, onAssign }) {
  const { user } = useAuth()
  const [selectedStage, setSelectedStage] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleStageClick = (stage) => {
    setSelectedStage(stage)
    setDrawerOpen(true)
  }

  return (
    <Card sx={{ mb: 2.5 }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography fontWeight={700} fontSize="1rem">Workflow Progress</Typography>
            <Typography fontSize="0.78rem" color="text.secondary">Click any stage to view details and take action</Typography>
          </Box>
          <Typography fontSize="0.8rem" fontWeight={600} color="primary.main">
            Stage {WORKFLOW_STAGES.findIndex((s) => s.key === project.currentStage) + 1} of {WORKFLOW_STAGES.length}
          </Typography>
        </Box>

        <WorkflowStepper
          stages={project.stages || []}
          onStageClick={handleStageClick}
          activeStage={project.currentStage}
        />
      </CardContent>

      <StageDrawer
        stage={selectedStage}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onAdvance={onAdvance}
        onReject={onReject}
        onAssign={onAssign}
      />
    </Card>
  )
}
