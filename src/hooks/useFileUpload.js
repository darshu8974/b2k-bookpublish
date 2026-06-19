import { useState, useCallback } from 'react'

export default function useFileUpload(onUpload) {
  const [queue, setQueue] = useState([])
  const [uploading, setUploading] = useState(false)

  const addFiles = useCallback((files) => {
    const newItems = files.map((f) => ({
      file: f, name: f.name, size: f.size, type: f.type,
      progress: 0, status: 'pending', error: null,
    }))
    setQueue((prev) => [...prev, ...newItems])
  }, [])

  const removeFile = useCallback((name) => {
    setQueue((prev) => prev.filter((f) => f.name !== name))
  }, [])

  const clearQueue = useCallback(() => setQueue([]), [])

  const uploadAll = useCallback(async (category = 'OTHER') => {
    if (!onUpload || queue.length === 0) return
    setUploading(true)
    for (const item of queue) {
      if (item.status !== 'pending') continue
      setQueue((prev) => prev.map((f) => f.name === item.name ? { ...f, status: 'uploading' } : f))
      try {
        for (let progress = 0; progress <= 100; progress += 20) {
          await new Promise((r) => setTimeout(r, 100))
          setQueue((prev) => prev.map((f) => f.name === item.name ? { ...f, progress } : f))
        }
        await onUpload(item.file, category)
        setQueue((prev) => prev.map((f) => f.name === item.name ? { ...f, status: 'done', progress: 100 } : f))
      } catch (err) {
        setQueue((prev) => prev.map((f) => f.name === item.name ? { ...f, status: 'error', error: err.message } : f))
      }
    }
    setUploading(false)
  }, [queue, onUpload])

  return { queue, uploading, addFiles, removeFile, clearQueue, uploadAll }
}
