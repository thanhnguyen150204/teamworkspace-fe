'use client'

import { Project } from "@/types/project"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { KanbanSquare, ListTodo, Pencil, Trash2 } from "lucide-react"
import { useState } from "react"
import { EditProjectDialog } from "./edit-project-dialog"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { WorkspaceRole } from "@/types/enum"
import { projectApi } from "@/lib/api/projects"
import { toast } from "sonner"

interface ProjectDetailHeaderProps {
  project: Project
  workspaceId: number
  onRefresh?: () => void
}

export function ProjectDetailHeader({ project, workspaceId, onRefresh }: ProjectDetailHeaderProps) {
  const router = useRouter()
  const { myRole, fetchProjects } = useWorkspaceStore()
  const [openEdit, setOpenEdit] = useState(false)

  const canManage = myRole === WorkspaceRole.OWNER || myRole === WorkspaceRole.ADMIN

  const base = `/dashboard/workspace/${workspaceId}/projects/${project.id}`

  const tabs = [
    { label: "Kanban",    icon: KanbanSquare, href: `${base}/kanban` },
    { label: "Danh sách", icon: ListTodo,     href: `${base}/tasks` },
  ]

  const handleDelete = async () => {
    if (!confirm(`Bạn có chắc muốn xóa dự án "${project.name}"? Thao tác này sẽ xóa toàn bộ tasks thuộc dự án.`)) return

    try {
      await projectApi.delete(workspaceId, project.id)
      toast.success("Đã xóa dự án thành công!")
      await fetchProjects(workspaceId, true)
      router.push(`/dashboard/workspace/${workspaceId}`)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa dự án.")
    }
  }

  return (
    <>
      <div className="space-y-3">
        {/* Title + Action buttons */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
            {project.description && (
              <p className="text-sm text-slate-500 mt-1">{project.description}</p>
            )}
          </div>

          {canManage && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpenEdit(true)}
                className="gap-1.5"
              >
                <Pencil className="size-3.5" /> Sửa dự án
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="gap-1.5"
              >
                <Trash2 className="size-3.5" /> Xóa dự án
              </Button>
            </div>
          )}
        </div>

        {/* Nav tabs */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-0">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.href}
                onClick={() => router.push(tab.href)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-white border-b-2 border-transparent hover:border-slate-300 transition-colors"
              >
                <Icon className="size-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      <EditProjectDialog
        workspaceId={workspaceId}
        project={project}
        open={openEdit}
        onOpenChange={setOpenEdit}
        onSuccess={() => {
          fetchProjects(workspaceId, true)
          onRefresh?.()
        }}
      />
    </>
  )
}
