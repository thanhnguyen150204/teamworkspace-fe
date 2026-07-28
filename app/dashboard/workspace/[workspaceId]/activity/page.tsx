'use client'

import { useParams } from "next/navigation"
import { ActivityFeed } from "@/components/features/workspace/activity/activity-feed"

export default function ActivityPage() {
  const params = useParams()
  const workspaceId = Number(params.workspaceId)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      <ActivityFeed workspaceId={workspaceId} />
    </div>
  )
}
