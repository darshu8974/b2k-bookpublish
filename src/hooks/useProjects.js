import { useState, useEffect, useCallback } from 'react'
import { MOCK_PROJECTS } from '../mocks/mockData'
import { projectsApi } from '../api/projects.api'

const USE_MOCK = false

export default function useProjects(filters = {}) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [debouncedSearch, setDebouncedSearch] = useState(filters.search || '')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(filters.search || ''), 400)
    return () => clearTimeout(timer)
  }, [filters.search])

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400))
        let data = [...MOCK_PROJECTS]
        if (filters.status) data = data.filter((p) => p.status === filters.status)
        if (filters.priority) data = data.filter((p) => p.priority === filters.priority)
        if (filters.currentStage) data = data.filter((p) => p.currentStage === filters.currentStage)
        if (debouncedSearch) {
          const q = debouncedSearch.toLowerCase()
          data = data.filter((p) =>
            p.title.toLowerCase().includes(q) ||
            p.projectCode.toLowerCase().includes(q) ||
            p.customerName?.toLowerCase().includes(q)
          )
        }
        setProjects(data)
        setTotal(data.length)
        setTotalPages(1)
      } else {
        const resp = await projectsApi.getAll({
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          stage: filters.currentStage || undefined,
          search: debouncedSearch || undefined,
          page: filters.page || 0,
          size: filters.size || 20,
        })
        const paged = resp.data.data
        setProjects(paged.content)
        setTotal(paged.totalElements)
        setTotalPages(paged.totalPages)
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.priority, filters.currentStage, debouncedSearch, filters.page, filters.size])

  useEffect(() => { fetchProjects() }, [fetchProjects])

  const createProject = useCallback(async (data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 600))
      const newProject = {
        id: `p${Date.now()}`,
        projectCode: `PF-2024-${String(MOCK_PROJECTS.length + 1).padStart(4, '0')}`,
        ...data,
        status: 'ACTIVE',
        currentStage: 'MANUSCRIPT_INTAKE',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      MOCK_PROJECTS.push(newProject)
      return newProject
    } else {
      const resp = await projectsApi.create(data)
      return resp.data.data
    }
  }, [])

  return { projects, loading, error, total, totalPages, refetch: fetchProjects, createProject }
}
