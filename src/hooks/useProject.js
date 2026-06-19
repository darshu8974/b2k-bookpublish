import { useState, useEffect, useCallback } from 'react'
import { MOCK_PROJECTS, MOCK_COMMENTS, MOCK_FILES, MOCK_ACTIVITY } from '../mocks/mockData'
import { projectsApi } from '../api/projects.api'
import { commentsApi } from '../api/comments.api'
import { filesApi } from '../api/files.api'
import { workflowApi } from '../api/workflow.api'

const USE_MOCK = false

export default function useProject(projectId) {
  const [project, setProject] = useState(null)
  const [comments, setComments] = useState([])
  const [files, setFiles] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProject = useCallback(async () => {
    if (!projectId) return
    setLoading(true)
    setError(null)
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 350))
        const p = MOCK_PROJECTS.find((x) => x.id === projectId)
        if (!p) throw new Error('Project not found')
        setProject(p)
        setComments(MOCK_COMMENTS.filter((c) => c.projectId === projectId))
        setFiles(MOCK_FILES.filter((f) => f.projectId === projectId))
        setActivity(MOCK_ACTIVITY.filter((a) => a.projectId === projectId).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)))
      } else {
        const [projectResp, commentsResp, filesResp, activityResp] = await Promise.all([
          projectsApi.getById(projectId),
          commentsApi.getByProject(projectId),
          filesApi.getByProject(projectId),
          projectsApi.getActivity(projectId),
        ])
        setProject(projectResp.data.data)
        setComments(commentsResp.data.data)
        setFiles(filesResp.data.data)
        setActivity(activityResp.data.data)
      }
    } catch (e) {
      setError(e.response?.data?.message || e.message)
    } finally {
      setLoading(false)
    }
  }, [projectId])

  useEffect(() => { fetchProject() }, [fetchProject])

  const addComment = useCallback(async (content) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300))
      const newComment = {
        id: `cm${Date.now()}`,
        projectId,
        authorId: 'u1',
        authorName: 'Arjun Mehta',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setComments((prev) => [...prev, newComment])
      MOCK_COMMENTS.push(newComment)
      return newComment
    } else {
      const resp = await commentsApi.add(projectId, { content })
      const newComment = resp.data.data
      setComments((prev) => [...prev, newComment])
      return newComment
    }
  }, [projectId])

  const deleteComment = useCallback(async (commentId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200))
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    } else {
      await commentsApi.delete(projectId, commentId)
      setComments((prev) => prev.filter((c) => c.id !== commentId))
    }
  }, [projectId])

  const advanceStage = useCallback(async (stageName, remarks = '') => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 500))
      setProject((prev) => {
        if (!prev) return prev
        const stages = prev.stages.map((s) => {
          if (s.stageName === stageName) return { ...s, status: 'COMPLETED', completedAt: new Date().toISOString() }
          return s
        })
        const ordered = [...stages].sort((a, b) => a.stageOrder - b.stageOrder)
        const nextPending = ordered.find((s) => s.status === 'PENDING')
        if (nextPending) {
          const idx = stages.findIndex((s) => s.stageName === nextPending.stageName)
          stages[idx] = { ...stages[idx], status: 'IN_PROGRESS', startedAt: new Date().toISOString() }
        }
        return { ...prev, stages, currentStage: nextPending?.stageName || 'COMPLETED' }
      })
    } else {
      const resp = await workflowApi.advanceStage(projectId, { stageName, remarks })
      const updatedStages = resp.data.data
      setProject((prev) => prev ? { ...prev, stages: updatedStages } : prev)
    }
  }, [projectId])

  const rejectStage = useCallback(async (stageName, reason = '') => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 400))
      setProject((prev) => {
        if (!prev) return prev
        const stages = prev.stages.map((s) => {
          if (s.stageName === stageName) return { ...s, status: 'REJECTED', remarks: reason }
          return s
        })
        return { ...prev, stages }
      })
    } else {
      const resp = await workflowApi.rejectStage(projectId, { stageName, reason })
      const updatedStages = resp.data.data
      setProject((prev) => prev ? { ...prev, stages: updatedStages } : prev)
    }
  }, [projectId])

  const assignStage = useCallback(async (stageName, userId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300))
      setProject((prev) => {
        if (!prev) return prev
        const stages = prev.stages.map((s) => {
          if (s.stageName === stageName) return { ...s, assignedToId: userId, status: 'IN_PROGRESS', startedAt: new Date().toISOString() }
          return s
        })
        return { ...prev, stages }
      })
    } else {
      const resp = await workflowApi.assignStage(projectId, stageName, { userId })
      const updatedStages = resp.data.data
      setProject((prev) => prev ? { ...prev, stages: updatedStages } : prev)
    }
  }, [projectId])

  const uploadFile = useCallback(async (file, category, onProgress) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 800))
      const newFile = {
        id: `f${Date.now()}`,
        projectId,
        originalFilename: file.name,
        fileSize: file.size,
        contentType: file.type,
        category: category || 'OTHER',
        uploadedById: 'u1',
        uploadedByName: 'Arjun Mehta',
        createdAt: new Date().toISOString(),
      }
      setFiles((prev) => [...prev, newFile])
      MOCK_FILES.push(newFile)
      return newFile
    } else {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', category || 'OTHER')
      const resp = await filesApi.upload(projectId, formData, onProgress)
      const newFile = resp.data.data
      setFiles((prev) => [...prev, newFile])
      return newFile
    }
  }, [projectId])

  const deleteFile = useCallback(async (fileId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300))
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
    } else {
      await filesApi.delete(fileId)
      setFiles((prev) => prev.filter((f) => f.id !== fileId))
    }
  }, [])

  const updateStatus = useCallback(async (status) => {
    const resp = await projectsApi.updateStatus(projectId, status)
    setProject((prev) => prev ? { ...prev, status } : prev)
    return resp.data.data
  }, [projectId])

  const updateProject = useCallback(async (data) => {
    const resp = await projectsApi.update(projectId, data)
    setProject(resp.data.data)
    return resp.data.data
  }, [projectId])

  return {
    project, comments, files, activity, loading, error,
    refetch: fetchProject, addComment, deleteComment,
    advanceStage, rejectStage, assignStage, uploadFile, deleteFile,
    updateStatus, updateProject,
  }
}
