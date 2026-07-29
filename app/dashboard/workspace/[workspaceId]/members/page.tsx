'use client'

import { useParams } from "next/navigation"
import { MemberList } from "@/components/features/workspace/members/member-list"

export default function WorkspaceMembersPage() {
  const params = useParams()
  const workspaceId = Number(params.workspaceId)

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl mx-auto w-full">
      <MemberList workspaceId={workspaceId} />
    </div>
  )
}
