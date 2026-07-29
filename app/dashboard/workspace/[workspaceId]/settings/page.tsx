'use client'

import { useParams } from "next/navigation"
import { WorkspaceSettings } from "@/components/features/workspace/settings/workspace-settings"

export default function WorkspaceSettingsPage() {
  const params = useParams()
  const workspaceId = Number(params.workspaceId)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      <WorkspaceSettings workspaceId={workspaceId} />
    </div>
  )
}
