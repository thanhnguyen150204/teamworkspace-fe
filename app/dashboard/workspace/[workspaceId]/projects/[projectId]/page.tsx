'use client'

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { projectApi } from "@/lib/api/projects"
import { Project } from "@/types/project"
import { ProjectDetailHeader } from "@/components/features/project/project-detail-header"
import { Loader2, KanbanSquare, ListTodo } from "lucide-react"
import { Button } from "@/components/ui/button"
export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = Number(params.workspaceId)
  const projectId = Number(params.projectId)
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectApi.getOne(workspaceId, projectId)
      .then(setProject)
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [workspaceId, projectId])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2 text-slate-400">
        <p>Không tìm thấy project</p>
        <Button variant="outline" size="sm" onClick={() => router.back()}>Quay lại</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <ProjectDetailHeader project={project} workspaceId={workspaceId} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
        <button
          onClick={() => router.push(`/dashboard/workspace/${workspaceId}/projects/${projectId}/kanban`)}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
        >
          <div className="size-10 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <KanbanSquare className="size-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-blue-600 transition-colors">Kanban Board</p>
            <p className="text-xs text-slate-500">Quản lý task theo cột</p>
          </div>
        </button>

        <button
          onClick={() => router.push(`/dashboard/workspace/${workspaceId}/projects/${projectId}/tasks`)}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-green-300 dark:hover:border-green-700 hover:shadow-md transition-all group"
        >
          <div className="size-10 rounded-lg bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
            <ListTodo className="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-slate-800 dark:text-white group-hover:text-green-600 transition-colors">Danh Sách Task</p>
            <p className="text-xs text-slate-500">Xem tất cả task dạng bảng</p>
          </div>
        </button>
      </div>
    </div>
  )
}
