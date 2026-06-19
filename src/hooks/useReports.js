import { useState, useEffect } from 'react'
import { projectsApi } from '../api/projects.api'
import { WORKFLOW_STAGES } from '../utils/constants'

function getMonthKey(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('default', { month: 'short', year: '2-digit' })
}

function lastSixMonthKeys() {
  const keys = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    keys.push(d.toLocaleString('default', { month: 'short', year: '2-digit' }))
  }
  return keys
}

export default function useReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const resp = await projectsApi.getAll({ size: 1000, page: 0 })
        const projects = resp.data.data.content ?? []

        // 1. Projects by stage
        const stageCount = {}
        projects.forEach((p) => { stageCount[p.currentStage] = (stageCount[p.currentStage] || 0) + 1 })
        const projectsByStage = WORKFLOW_STAGES
          .map((s) => ({ stage: s.label, count: stageCount[s.key] || 0 }))
          .filter((d) => d.count > 0)

        // 2. Projects by priority
        const priorityOrder = ['URGENT', 'HIGH', 'MEDIUM', 'LOW']
        const priorityCount = {}
        projects.forEach((p) => { priorityCount[p.priority] = (priorityCount[p.priority] || 0) + 1 })
        const projectsByPriority = priorityOrder
          .filter((p) => priorityCount[p])
          .map((p) => ({ priority: p.charAt(0) + p.slice(1).toLowerCase(), count: priorityCount[p] }))

        // 3. Monthly trend — last 6 months
        const monthKeys = lastSixMonthKeys()
        const monthMap = {}
        monthKeys.forEach((k) => { monthMap[k] = { month: k, started: 0, completed: 0 } })
        projects.forEach((p) => {
          if (p.createdAt) {
            const k = getMonthKey(p.createdAt)
            if (monthMap[k]) monthMap[k].started++
          }
          if (p.status === 'COMPLETED' && p.updatedAt) {
            const k = getMonthKey(p.updatedAt)
            if (monthMap[k]) monthMap[k].completed++
          }
        })
        const monthlyTrend = Object.values(monthMap)

        // 4. Team workload — group by project manager
        const now = new Date()
        const pmMap = {}
        projects.forEach((p) => {
          const name = p.projectManagerName || (p.projectManager?.fullName)
          if (!name) return
          if (!pmMap[name]) pmMap[name] = { name, openStages: 0, completedThisMonth: 0 }
          if (p.status === 'ACTIVE') pmMap[name].openStages++
          if (p.status === 'COMPLETED' && p.updatedAt) {
            const d = new Date(p.updatedAt)
            if (d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
              pmMap[name].completedThisMonth++
            }
          }
        })
        const teamWorkload = Object.values(pmMap)

        setData({ projectsByStage, projectsByPriority, monthlyTrend, teamWorkload, total: projects.length })
      } catch (e) {
        setError(e.response?.data?.message || e.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return { data, loading, error }
}
