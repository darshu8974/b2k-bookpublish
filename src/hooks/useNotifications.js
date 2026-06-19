import { useState, useEffect, useCallback } from 'react'
import { MOCK_NOTIFICATIONS } from '../mocks/mockData'
import { notificationsApi } from '../api/notifications.api'

const USE_MOCK = false
const POLL_INTERVAL = 30000

export default function useNotifications() {
  const [notifications, setNotifications] = useState([])

  const fetchNotifications = useCallback(async () => {
    if (USE_MOCK) {
      setNotifications([...MOCK_NOTIFICATIONS])
      return
    }
    try {
      const resp = await notificationsApi.getAll({ page: 0, size: 50 })
      setNotifications(resp.data.data.content)
    } catch {
      // silently ignore polling errors
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, POLL_INTERVAL)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  const markRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
    if (!USE_MOCK) {
      try { await notificationsApi.markRead(id) } catch { /* ignore */ }
    }
  }, [])

  const markAllRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    if (!USE_MOCK) {
      try { await notificationsApi.markAllRead() } catch { /* ignore */ }
    }
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  return { notifications, unreadCount, markRead, markAllRead }
}
