import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Avatar, Divider, IconButton, Tooltip, Menu, MenuItem,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import EditIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/DeleteOutline'
import EmptyState from '../../components/common/EmptyState'
import ChatBubbleIcon from '@mui/icons-material/ChatBubbleOutline'
import { formatRelative } from '../../utils/dateFormatter'
import { getAvatarColor } from '../../utils/statusColors'
import useAuth from '../../auth/useAuth'

function CommentItem({ comment, onDelete, currentUserId }) {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const isOwn = comment.authorId === currentUserId
  const bg = getAvatarColor(comment.authorName || '')
  const initials = comment.authorName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <Box sx={{ display: 'flex', gap: 1.5, mb: 2.5 }}>
      <Avatar sx={{ width: 34, height: 34, bgcolor: bg, fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, mt: 0.25 }}>
        {initials}
      </Avatar>
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography fontSize="0.875rem" fontWeight={600}>{comment.authorName}</Typography>
          <Typography fontSize="0.72rem" color="text.disabled">{formatRelative(comment.createdAt)}</Typography>
          {comment.updatedAt !== comment.createdAt && <Typography fontSize="0.68rem" color="text.disabled">(edited)</Typography>}
        </Box>

        {editing ? (
          <Box>
            <TextField
              fullWidth
              multiline
              size="small"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              sx={{ mb: 1 }}
            />
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button size="small" variant="contained" onClick={() => setEditing(false)}>Save</Button>
              <Button size="small" variant="outlined" onClick={() => { setEditing(false); setEditContent(comment.content) }}>Cancel</Button>
            </Box>
          </Box>
        ) : (
          <Box sx={{
            p: 1.5, bgcolor: '#F4F5F7', borderRadius: '0 8px 8px 8px',
            border: '1px solid #EBECF0',
          }}>
            <Typography fontSize="0.875rem" lineHeight={1.6} sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {comment.content}
            </Typography>
          </Box>
        )}
      </Box>

      {isOwn && !editing && (
        <>
          <IconButton size="small" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ alignSelf: 'flex-start', mt: 0.25 }}>
            <MoreHorizIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            PaperProps={{ elevation: 2, sx: { borderRadius: 2, border: '1px solid #DFE1E6', minWidth: 140 } }}
          >
            <MenuItem onClick={() => { setEditing(true); setMenuAnchor(null) }} sx={{ fontSize: '0.875rem', py: 1 }}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} /> Edit
            </MenuItem>
            <MenuItem onClick={() => { onDelete(comment.id); setMenuAnchor(null) }} sx={{ fontSize: '0.875rem', py: 1, color: 'error.main' }}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Delete
            </MenuItem>
          </Menu>
        </>
      )}
    </Box>
  )
}

export default function CommentsSection({ comments, onAdd, onDelete }) {
  const { user } = useAuth()
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || 'U'
  const bg = getAvatarColor(user?.fullName || '')

  const handleSubmit = async () => {
    if (!newComment.trim()) return
    setSubmitting(true)
    try {
      await onAdd(newComment.trim())
      setNewComment('')
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit()
    }
  }

  return (
    <Box>
      <Typography fontWeight={700} fontSize="0.95rem" mb={2}>
        Comments <Box component="span" sx={{ color: 'text.secondary', fontWeight: 400, ml: 0.5 }}>({comments.length})</Box>
      </Typography>

      {/* Composer */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: bg, fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, mt: 0.5 }}>
          {initials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            placeholder="Add a comment... (Ctrl+Enter to submit)"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ mb: 1 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="small"
              endIcon={<SendIcon fontSize="small" />}
              disabled={!newComment.trim() || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Posting...' : 'Comment'}
            </Button>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Comments list */}
      {comments.length === 0 ? (
        <EmptyState
          icon={ChatBubbleIcon}
          title="No comments yet"
          description="Be the first to add a comment or remark on this project."
          sx={{ py: 4 }}
        />
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            onDelete={onDelete}
            currentUserId={user?.id}
          />
        ))
      )}
    </Box>
  )
}
