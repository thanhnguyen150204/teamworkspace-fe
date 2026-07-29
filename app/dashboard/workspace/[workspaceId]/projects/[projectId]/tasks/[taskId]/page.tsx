'use client'

import { useParams } from "next/navigation"
import { TaskDetail } from "@/components/features/task/task-detail"

export default function TaskDetailPage() {
  const params = useParams()
  const projectId = Number(params.projectId)
  const taskId = Number(params.taskId)
  const workspaceId = Number(params.workspaceId)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <TaskDetail projectId={projectId} taskId={taskId} workspaceId={workspaceId} />
    </div>
  )
}
