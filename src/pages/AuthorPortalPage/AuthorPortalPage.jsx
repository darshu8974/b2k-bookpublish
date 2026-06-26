import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box, Card, CardContent, Typography, Button, TextField,
  CircularProgress, Divider, Chip, Alert,
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import ThumbDownOutlinedIcon from '@mui/icons-material/ThumbDownOutlined'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import { authorTokenApi } from '../../api/authorToken.api'
import { formatDate } from '../../utils/dateFormatter'

const STATUS_COLORS = {
  PENDING:  { bg: '#FFF0B3', color: '#172B4D', label: 'Awaiting Review' },
  APPROVED: { bg: '#E3FCEF', color: '#006644', label: 'Approved' },
  REJECTED: { bg: '#FFEBE6', color: '#BF2600', label: 'Rejected' },
  EXPIRED:  { bg: '#F4F5F7', color: '#5E6C84', label: 'Expired' },
}

export default function AuthorPortalPage() {
  const [params] = useSearchParams()
  const token = params.get('token')

  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [action, setAction] = useState(null)   // 'approve' | 'reject'
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(null)        // 'approved' | 'rejected'

  useEffect(() => {
    if (!token) { setError('No review token provided in the link.'); setLoading(false); return }
    authorTokenApi.getPortalInfo(token)
      .then((res) => setInfo(res.data.data))
      .catch((err) => {
        const msg = err.response?.data?.message || 'This link is invalid or has expired.'
        setError(msg)
      })
      .finally(() => setLoading(false))
  }, [token])

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      if (action === 'approve') {
        await authorTokenApi.approve(token, comment || null)
        setDone('approved')
      } else {
        await authorTokenApi.reject(token, comment || null)
        setDone('rejected')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong. Please try again.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#F4F5F7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      p: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography fontSize="1.5rem" fontWeight={800} color="#172B4D" letterSpacing="-0.5px">
            ProTrack
          </Typography>
          <Typography fontSize="0.85rem" color="text.secondary" mt={0.5}>
            Author Proof Review Portal
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 3, border: '1px solid #DFE1E6', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}>
          <CardContent sx={{ p: 3.5 }}>

            {/* Loading */}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
                <CircularProgress size={36} />
              </Box>
            )}

            {/* Error / Invalid token */}
            {!loading && error && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <ErrorOutlineIcon sx={{ fontSize: '3rem', color: '#DE350B', mb: 1.5 }} />
                <Typography fontWeight={700} fontSize="1.1rem" mb={1}>Link Unavailable</Typography>
                <Typography color="text.secondary" fontSize="0.9rem">{error}</Typography>
              </Box>
            )}

            {/* Success screen */}
            {!loading && !error && done && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                {done === 'approved' ? (
                  <>
                    <CheckCircleOutlineIcon sx={{ fontSize: '3.5rem', color: '#00875A', mb: 1.5 }} />
                    <Typography fontWeight={700} fontSize="1.15rem" mb={1}>Proof Approved!</Typography>
                    <Typography color="text.secondary" fontSize="0.9rem">
                      Thank you. Your approval has been recorded and the team has been notified.
                    </Typography>
                  </>
                ) : (
                  <>
                    <CancelOutlinedIcon sx={{ fontSize: '3.5rem', color: '#DE350B', mb: 1.5 }} />
                    <Typography fontWeight={700} fontSize="1.15rem" mb={1}>Feedback Submitted</Typography>
                    <Typography color="text.secondary" fontSize="0.9rem">
                      Thank you for your feedback. The production team will review your comments and be in touch.
                    </Typography>
                  </>
                )}
              </Box>
            )}

            {/* Main review card */}
            {!loading && !error && !done && info && (
              <>
                {/* Project info */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
                    <Typography fontSize="0.72rem" color="text.disabled" fontWeight={600} letterSpacing="0.5px" textTransform="uppercase">
                      Proof Review Request
                    </Typography>
                    {(() => {
                      const s = STATUS_COLORS[info.status] || STATUS_COLORS.PENDING
                      return <Chip label={s.label} size="small" sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: '0.7rem', height: 20 }} />
                    })()}
                  </Box>

                  <Typography fontWeight={800} fontSize="1.2rem" color="#172B4D" mb={0.5} lineHeight={1.3}>
                    {info.projectTitle}
                  </Typography>
                  <Typography fontSize="0.82rem" color="text.secondary" mb={2}>
                    Project Code: <strong>{info.projectCode}</strong>
                    {info.customerName && <> &nbsp;·&nbsp; Client: <strong>{info.customerName}</strong></>}
                  </Typography>

                  <Box sx={{ p: 2, bgcolor: '#F8F9FA', borderRadius: 2, border: '1px solid #EBECF0' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
                      <Box>
                        <Typography fontSize="0.72rem" color="text.disabled" fontWeight={600}>SENT TO</Typography>
                        <Typography fontSize="0.88rem" fontWeight={600}>{info.authorName || info.authorEmail}</Typography>
                        {info.authorName && <Typography fontSize="0.78rem" color="text.secondary">{info.authorEmail}</Typography>}
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography fontSize="0.72rem" color="text.disabled" fontWeight={600}>LINK EXPIRES</Typography>
                        <Typography fontSize="0.88rem" fontWeight={600}>{formatDate(info.expiresAt)}</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                <Divider sx={{ mb: 3 }} />

                {/* Already decided */}
                {info.status !== 'PENDING' && (
                  <Alert severity={info.status === 'APPROVED' ? 'success' : 'warning'} sx={{ borderRadius: 2 }}>
                    This proof has already been <strong>{info.status.toLowerCase()}</strong>. No further action is needed.
                  </Alert>
                )}

                {/* Action area */}
                {info.status === 'PENDING' && (
                  <>
                    {!action ? (
                      <>
                        <Typography fontSize="0.9rem" color="text.secondary" mb={2.5} textAlign="center">
                          Please review the proof and select your decision below.
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<ThumbUpOutlinedIcon />}
                            onClick={() => setAction('approve')}
                            sx={{ bgcolor: '#00875A', '&:hover': { bgcolor: '#006644' }, borderRadius: 2, py: 1.5, fontWeight: 700 }}
                          >
                            Approve
                          </Button>
                          <Button
                            fullWidth
                            variant="outlined"
                            size="large"
                            startIcon={<ThumbDownOutlinedIcon />}
                            onClick={() => setAction('reject')}
                            sx={{ borderColor: '#DE350B', color: '#DE350B', '&:hover': { borderColor: '#BF2600', bgcolor: '#FFEBE6' }, borderRadius: 2, py: 1.5, fontWeight: 700 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Box sx={{
                          p: 2, mb: 2.5, borderRadius: 2, border: '1px solid',
                          borderColor: action === 'approve' ? '#00875A' : '#DE350B',
                          bgcolor: action === 'approve' ? '#E3FCEF' : '#FFEBE6',
                        }}>
                          <Typography fontWeight={700} fontSize="0.9rem"
                            color={action === 'approve' ? '#006644' : '#BF2600'}>
                            {action === 'approve' ? '✓ Approving this proof' : '✗ Requesting changes'}
                          </Typography>
                        </Box>

                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label={action === 'approve' ? 'Comments (optional)' : 'Please describe the required changes *'}
                          placeholder={action === 'approve'
                            ? 'Any additional notes for the production team...'
                            : 'Describe what needs to be changed or corrected...'}
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          sx={{ mb: 2.5 }}
                        />

                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}
                            disabled={submitting || (action === 'reject' && !comment.trim())}
                            sx={{
                              bgcolor: action === 'approve' ? '#00875A' : '#DE350B',
                              '&:hover': { bgcolor: action === 'approve' ? '#006644' : '#BF2600' },
                              borderRadius: 2, py: 1.5, fontWeight: 700,
                            }}
                          >
                            {submitting ? 'Submitting...' : action === 'approve' ? 'Confirm Approval' : 'Submit Feedback'}
                          </Button>
                          <Button
                            variant="outlined"
                            size="large"
                            onClick={() => { setAction(null); setComment('') }}
                            disabled={submitting}
                            sx={{ borderRadius: 2, py: 1.5, minWidth: 100 }}
                          >
                            Back
                          </Button>
                        </Box>

                        {action === 'reject' && !comment.trim() && (
                          <Typography fontSize="0.78rem" color="text.secondary" mt={1} textAlign="center">
                            Please describe the changes required before submitting.
                          </Typography>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}

          </CardContent>
        </Card>

        <Typography textAlign="center" fontSize="0.75rem" color="text.disabled" mt={2.5}>
          This is a secure review link sent by your publisher via ProTrack.
        </Typography>
      </Box>
    </Box>
  )
}
