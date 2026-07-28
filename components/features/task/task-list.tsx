'use client'

import { useEffect, useState } from "react"
import { useTaskStore } from "@/stores/task-store"
import { Task } from "@/types/task"
import { TaskStatus, TaskPriority } from "@/types/enum"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Plus, Search, Calendar, Flag, ChevronRight, Loader2 } from "lucide-react"
import { CreateTaskDialog } from "./kanban/create-task-dialog"

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  [TaskStatus.TODO]:        { label: "To Do",        className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
  [TaskStatus.IN_PROGRESS]: { label: "In Progress",  className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  [TaskStatus.REVIEW]:      { label: "Review",       className: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  [TaskStatus.DONE]:        { label: "Done",         className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  [TaskPriority.LOW]:    { label: "Low",    className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" },
  [TaskPriority.MEDIUM]: { label: "Medium", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300" },
  [TaskPriority.HIGH]:   { label: "High",   className: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300" },
}

interface TaskListProps {
  projectId: number
  workspaceId: number
}

export function TaskList({ projectId, workspaceId }: TaskListProps) {
  const router = useRouter()
  const { tasks, fetchTasks, updateTask, isLoading } = useTaskStore()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL")
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    fetchTasks(projectId)
  }, [projectId, fetchTasks])

  const filtered = tasks.filter(task => {
    const matchSearch = task.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === "ALL" || task.status === (statusFilter as TaskStatus)
    const matchPriority = priorityFilter === "ALL" || task.priority === (priorityFilter as TaskPriority)
    return matchSearch && matchStatus && matchPriority
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Danh Sách Task</h2>
          <p className="text-sm text-slate-500 mt-0.5">{tasks.length} task trong dự án</p>
        </div>
        <Button onClick={() => setOpenCreate(true)} className="gap-2">
          <Plus className="size-4" />
          Tạo Task
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="size-4 text-slate-400 shrink-0" />
          <Input
            placeholder="Tìm kiếm task..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border-none shadow-none h-8 p-0 focus-visible:ring-0 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={v => setStatusFilter(v ?? "ALL")}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả trạng thái</SelectItem>
            {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
              <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={v => setPriorityFilter(v ?? "ALL")}>
          <SelectTrigger className="w-36 h-8 text-sm">
            <SelectValue placeholder="Ưu tiên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Tất cả ưu tiên</SelectItem>
            {Object.entries(PRIORITY_CONFIG).map(([val, cfg]) => (
              <SelectItem key={val} value={val}>{cfg.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Task table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="size-6 animate-spin text-slate-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
            <p className="text-sm">Không tìm thấy task nào</p>
            {tasks.length === 0 && (
              <Button variant="outline" size="sm" onClick={() => setOpenCreate(true)} className="gap-1">
                <Plus className="size-3" /> Tạo task đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="text-left px-4 py-3">Task</th>
                <th className="text-left px-4 py-3 hidden sm:table-cell">Trạng thái</th>
                <th className="text-left px-4 py-3 hidden md:table-cell">Ưu tiên</th>
                <th className="text-left px-4 py-3 hidden lg:table-cell">Deadline</th>
                <th className="px-4 py-3 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map(task => {
                const status = STATUS_CONFIG[task.status]
                const priority = PRIORITY_CONFIG[task.priority]
                const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE

                return (
                  <tr
                    key={task.id}
                    onClick={() => router.push(`/dashboard/workspace/${workspaceId}/projects/${projectId}/tasks/${task.id}`)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-800 dark:text-white line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{task.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Select
                        value={task.status}
                        onValueChange={v => { updateTask(projectId, task.id, { status: v as TaskStatus }) }}
                      >
                        <SelectTrigger
                          className={`w-32 h-7 text-xs border-none ${status.className}`}
                          onClick={e => e.stopPropagation()}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <SelectItem key={val} value={val} className="text-xs">{cfg.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priority.className}`}>
                        <Flag className="size-3" />{priority.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      {task.dueDate ? (
                        <span className={`flex items-center gap-1 text-xs ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                          <Calendar className="size-3" />
                          {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ChevronRight className="size-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      <CreateTaskDialog
        projectId={projectId}
        defaultStatus={TaskStatus.TODO}
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={() => fetchTasks(projectId)}
      />
    </div>
  )
}
