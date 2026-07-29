'use client'

import { Project } from "@/types/project"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { KanbanSquare, ListTodo } from "lucide-react"

interface ProjectDetailHeaderProps {
  project: Project
  workspaceId: number
}

export function ProjectDetailHeader({ project, workspaceId }: ProjectDetailHeaderProps) {
  const router = useRouter()
  const base = `/dashboard/workspace/${workspaceId}/projects/${project.id}`

  const tabs = [
    { label: "Kanban",       icon: KanbanSquare, href: `${base}/kanban` },
    { label: "Danh sách",    icon: ListTodo,     href: `${base}/tasks` },
  ]

  return (
    <div className="space-y-3">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{project.name}</h1>
        {project.description && (
          <p className="text-sm text-slate-500 mt-1">{project.description}</p>
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
  )
}
