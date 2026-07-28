'use client'

import { useParams } from "next/navigation"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { ProjectList } from "@/components/features/project/project-list"
import { useEffect } from "react"

export default function WorkspaceProjectsPage() {
  const params = useParams()
  const workspaceId = Number(params.workspaceId)
  const { projects, fetchProjects } = useWorkspaceStore()

  useEffect(() => {
    fetchProjects(workspaceId)
  }, [workspaceId, fetchProjects])

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <ProjectList
        workspaceId={workspaceId}
        projects={projects}
        onRefresh={() => fetchProjects(workspaceId)}
      />
    </div>
  )
}
