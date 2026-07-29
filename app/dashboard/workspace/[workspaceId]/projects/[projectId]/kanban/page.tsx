'use client'

import { useParams } from "next/navigation"
import { KanbanBoard } from "@/components/features/task/kanban/kanban-board"

export default function KanbanPage() {
  const params = useParams()
  const projectId = Number(params.projectId)

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 h-[calc(100vh-64px)] overflow-hidden">
      <KanbanBoard projectId={projectId} />
    </div>
  )
}
