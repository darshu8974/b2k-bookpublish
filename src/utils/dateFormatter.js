import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  parseISO,
  differenceInDays,
} from 'date-fns'

export function formatDate(dateStr) {
  if (!dateStr) return '—'
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  return format(date, 'MMM dd, yyyy')
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  return format(date, 'MMM dd, yyyy • h:mm a')
}

export function formatRelative(dateStr) {
  if (!dateStr) return '—'
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`
  return formatDistanceToNow(date, { addSuffix: true })
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '—'
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr
  return format(date, 'MMM dd')
}

export function isOverdue(dueDateStr) {
  if (!dueDateStr) return false
  const daysLeft = differenceInDays(
    typeof dueDateStr === 'string' ? parseISO(dueDateStr) : dueDateStr,
    new Date()
  )
  return daysLeft < 0
}

export function getDaysLeft(dueDateStr) {
  if (!dueDateStr) return null
  return differenceInDays(
    typeof dueDateStr === 'string' ? parseISO(dueDateStr) : dueDateStr,
    new Date()
  )
}

export function formatDueLabel(dueDateStr) {
  if (!dueDateStr) return null
  const days = getDaysLeft(dueDateStr)
  if (days < 0) return `${Math.abs(days)}d overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return 'Due tomorrow'
  return `${days}d left`
}
