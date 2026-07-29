'use client'

import { useEffect, useState } from "react"
import { useTaskStore } from "@/stores/task-store"
import { Task, UpdateTaskDto } from "@/types/task"
import { TaskStatus, TaskPriority } from "@/types/enum"
import { taskApi } from "@/lib/api/tasks"
import { CommentSection } from "./comment-section"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  ArrowLeft, Calendar, Flag, Loader2, Pencil, Save, Trash2, X,
} from "lucide-react"

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  [TaskStatus.TODO]:        { label: "TO DO",        className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  [TaskStatus.IN_PROGRESS]: { label: "IN PROGRESS",  className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  [TaskStatus.REVIEW]:      { label: "REVIEW",       className: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  [TaskStatus.DONE]:        { label: "DONE",         className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  [TaskPriority.LOW]:    { label: "LOW",    className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
  [TaskPriority.MEDIUM]: { label: "MEDIUM", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300" },
  [TaskPriority.HIGH]:   { label: "HIGH",   className: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
}

interface TaskDetailProps {
  projectId: number
  taskId: number
  workspaceId: number
}

export function TaskDetail({ projectId, taskId, workspaceId }: TaskDetailProps) {
  const router = useRouter()
  const { fetchTask, updateTask, deleteTask, activeTask, isLoading } = useTaskStore()
  const [editingTitle, setEditingTitle] = useState(false)
  const [editingDesc, setEditingDesc] = useState(false)
  const [titleVal, setTitleVal] = useState("")
  const [descVal, setDescVal] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchTask(projectId, taskId)
  }, [projectId, taskId])

  useEffect(() => {
    if (activeTask) {
      setTitleVal(activeTask.title)
      setDescVal(activeTask.description ?? "")
    }
  }, [activeTask])

  const handleSaveTitle = async () => {
    if (!titleVal.trim() || !activeTask) return
    setSaving(true)
    try {
      await updateTask(projectId, taskId, { title: titleVal.trim() })
      setEditingTitle(false)
      toast.success("Đã cập nhật tên task")
    } catch {
      toast.error("Không thể cập nhật tên task")
    } finally {
      setSaving(false)
    }
  }

  const handleSaveDesc = async () => {
    if (!activeTask) return
    setSaving(true)
    try {
      await updateTask(projectId, taskId, { description: descVal || undefined })
      setEditingDesc(false)
      toast.success("Đã cập nhật mô tả")
    } catch {
      toast.error("Không thể cập nhật mô tả")
    } finally {
      setSaving(false)
    }
  }

  const handleFieldUpdate = async (data: UpdateTaskDto) => {
    if (!activeTask) return
    try {
      await updateTask(projectId, taskId, data)
      toast.success("Đã cập nhật")
    } catch {
      toast.error("Không thể cập nhật")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Bạn có chắc muốn xóa task này?")) return
    setDeleting(true)
    try {
      await deleteTask(projectId, taskId)
      toast.success("Đã xóa task")
      router.push(`/dashboard/workspace/${workspaceId}/projects/${projectId}/tasks`)
    } catch {
      toast.error("Không thể xóa task")
      setDeleting(false)
    }
  }

  if (isLoading || !activeTask) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-slate-400" />
      </div>
    )
  }

  const task = activeTask
  const status = STATUS_CONFIG[task.status]
  const priority = PRIORITY_CONFIG[task.priority]
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 text-slate-500 hover:text-slate-700"
        onClick={() => router.push(`/dashboard/workspace/${workspaceId}/projects/${projectId}/tasks`)}
      >
        <ArrowLeft className="size-4" />
        Quay lại
      </Button>

      {/* Card container */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          {editingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={titleVal}
                onChange={e => setTitleVal(e.target.value)}
                className="text-lg font-bold h-10"
                autoFocus
                onKeyDown={e => { if (e.key === "Enter") handleSaveTitle(); if (e.key === "Escape") setEditingTitle(false) }}
              />
              <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={handleSaveTitle} disabled={saving}>
                {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4 text-green-600" />}
              </Button>
              <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={() => { setEditingTitle(false); setTitleVal(task.title) }}>
                <X className="size-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4 group">
              <h1 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">{task.title}</h1>
              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="ghost" className="size-7" onClick={() => setEditingTitle(true)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button size="icon" variant="ghost" className="size-7 text-red-500 hover:text-red-600" onClick={handleDelete} disabled={deleting}>
                  {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
          {/* Main content */}
          <div className="lg:col-span-2 p-6 space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mô tả</label>
                {!editingDesc && (
                  <Button size="icon" variant="ghost" className="size-6" onClick={() => setEditingDesc(true)}>
                    <Pencil className="size-3" />
                  </Button>
                )}
              </div>
              {editingDesc ? (
                <div className="space-y-2">
                  <Textarea
                    value={descVal}
                    onChange={e => setDescVal(e.target.value)}
                    rows={4}
                    className="resize-none text-sm"
                    autoFocus
                    placeholder="Thêm mô tả cho task..."
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveDesc} disabled={saving}>
                      {saving ? <Loader2 className="size-3.5 animate-spin mr-1" /> : null}
                      Lưu
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setEditingDesc(false); setDescVal(task.description ?? "") }}>
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 min-h-[40px] whitespace-pre-wrap">
                  {task.description || <span className="italic text-slate-300 dark:text-slate-600">Chưa có mô tả...</span>}
                </p>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100 dark:border-slate-800" />

            {/* Comments */}
            <CommentSection taskId={taskId} />
          </div>

          {/* Sidebar meta */}
          <div className="p-6 space-y-5 bg-slate-50/50 dark:bg-slate-900/50">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Trạng thái</label>
              <Select value={task.status} onValueChange={v => handleFieldUpdate({ status: v as TaskStatus })}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                    <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Độ ưu tiên</label>
              <Select value={task.priority} onValueChange={v => handleFieldUpdate({ priority: v as TaskPriority })}>
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
                    <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Calendar className="size-3" /> Ngày hết hạn
              </label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={task.dueDate ? task.dueDate.split("T")[0] : ""}
                onChange={e => handleFieldUpdate({ dueDate: e.target.value || undefined })}
              />
              {isOverdue && (
                <p className="text-xs text-red-500">⚠️ Đã quá hạn</p>
              )}
            </div>

            {/* Badges */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${status.className}`}>{status.label}</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${priority.className}`}>
                  <Flag className="size-3" />{priority.label}
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="space-y-1 text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
              <p>Tạo lúc: {new Date(task.createdAt).toLocaleDateString("vi-VN")}</p>
              <p>Cập nhật: {new Date(task.updatedAt).toLocaleDateString("vi-VN")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
