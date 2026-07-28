'use client'

import { useParams } from "next/navigation"
import { TaskList } from "@/components/features/task/task-list"

export default function TasksPage() {
  const params = useParams()
  const projectId = Number(params.projectId)
  const workspaceId = Number(params.workspaceId)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <TaskList projectId={projectId} workspaceId={workspaceId} />
    </div>
  )
}
