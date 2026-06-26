import { Box, Typography, Tooltip } from '@mui/material'
import StageStatusIcon from './StageStatusIcon'
import { WORKFLOW_STAGES, PHASE_COLORS } from '../../utils/constants'
import { stageStatusColors } from '../../utils/statusColors'

const STATUS_LABELS = {
  PENDING: 'Pending', IN_PROGRESS: 'In Progress', REVIEW_PENDING: 'Review',
  APPROVED: 'Approved', REJECTED: 'Rejected', COMPLETED: 'Done', SKIPPED: 'Skipped',
}

export default function WorkflowStepper({ stages = [], onStageClick, activeStage }) {
  const stageMap = {}
  stages.forEach((s) => { stageMap[s.stageName] = s })

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0, overflowX: 'auto', pb: 1 }}>
      {WORKFLOW_STAGES.map((wf, idx) => {
        const stage = stageMap[wf.key]
        const status = stage?.status || 'PENDING'
        const isActive = activeStage === wf.key
        const colors = stageStatusColors[status] || stageStatusColors.PENDING
        const phase = PHASE_COLORS[wf.key] || { main: '#0052CC', bg: '#F0F4FF' }
        const isCompleted = status === 'COMPLETED' || status === 'APPROVED'

        return (
          <Box key={wf.key} sx={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: 90 }}>
            {/* Step node */}
            <Tooltip title={`${wf.label}: ${STATUS_LABELS[status]}`} placement="top">
              <Box
                onClick={() => onStageClick && onStageClick(stage || { stageName: wf.key, status: 'PENDING', stageOrder: wf.order })}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  gap: 0.75, cursor: onStageClick ? 'pointer' : 'default',
                  px: 0.5, py: 1, borderRadius: 2, flex: 1,
                  borderTop: `3px solid ${phase.main}`,
                  bgcolor: isActive ? phase.bg : 'transparent',
                  border: isActive ? `1.5px solid ${phase.main}` : '1.5px solid transparent',
                  borderTopWidth: '3px',
                  borderTopColor: phase.main,
                  transition: 'all 0.15s',
                  '&:hover': onStageClick ? { bgcolor: phase.bg } : {},
                  minWidth: 72,
                }}
              >
                <StageStatusIcon status={status} size={26} />
                <Typography
                  sx={{
                    fontSize: '0.66rem', fontWeight: isActive ? 700 : 500,
                    color: phase.main,
                    textAlign: 'center', lineHeight: 1.25, whiteSpace: 'normal',
                    maxWidth: 92, minHeight: 30,
                  }}
                >
                  {wf.label}
                </Typography>
                <Box sx={{
                  bgcolor: colors.bg, color: colors.text,
                  px: 0.75, py: 0.15, borderRadius: '3px',
                  fontSize: '0.6rem', fontWeight: 700, whiteSpace: 'nowrap',
                }}>
                  {STATUS_LABELS[status]}
                </Box>
              </Box>
            </Tooltip>

            {/* Connector */}
            {idx < WORKFLOW_STAGES.length - 1 && (
              <Box sx={{
                height: 2, width: 16, flexShrink: 0,
                bgcolor: isCompleted ? '#00875A' : '#DFE1E6',
                transition: 'background 0.3s',
                mt: -3,
              }} />
            )}
          </Box>
        )
      })}
    </Box>
  )
}
