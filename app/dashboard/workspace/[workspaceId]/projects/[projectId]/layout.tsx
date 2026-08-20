'use client'

import { useParams } from "next/navigation"
import { useProjectSocket } from "@/hook/use-project-socket"

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()
  const projectId = Number(params.projectId)

  // Subscribe to real-time WebSocket events for all sub-routes (/kanban, /tasks, etc.)
  useProjectSocket(projectId)

  return <>{children}</>
}
