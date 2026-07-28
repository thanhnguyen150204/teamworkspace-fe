'use client'

import { useEffect, useState } from "react"
import { memberApi } from "@/lib/api/members"
import { Membership } from "@/types/membership"
import { WorkspaceRole } from "@/types/enum"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { MemberCard } from "./member-card"
import { InviteMemberDialog } from "./invite-member-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface MemberListProps {
  workspaceId: number
}

export function MemberList({ workspaceId }: MemberListProps) {
  const { myRole } = useWorkspaceStore()
  const [members, setMembers] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [openInvite, setOpenInvite] = useState(false)

  const canEdit = myRole === WorkspaceRole.OWNER || myRole === WorkspaceRole.ADMIN

  const fetchMembers = async () => {
    try {
      const data = await memberApi.getAll(workspaceId) as any as Membership[]
      setMembers(data)
    } catch {
      toast.error("Không thể tải danh sách thành viên")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [workspaceId])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="size-5" />
            Thành Viên
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">{members.length} thành viên trong workspace</p>
        </div>
        {canEdit && (
          <Button onClick={() => setOpenInvite(true)} className="gap-2">
            <UserPlus className="size-4" />
            Mời thành viên
          </Button>
        )}
      </div>

      {/* Members list */}
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="size-6 animate-spin text-slate-400" />
        </div>
      ) : members.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
          <Users className="size-8 opacity-40" />
          <p className="text-sm">Chưa có thành viên nào</p>
        </div>
      ) : (
        <div className="space-y-2">
          {members.map(member => (
            <MemberCard
              key={member.id}
              member={member}
              canEdit={canEdit}
              workspaceId={workspaceId}
              onRefresh={fetchMembers}
            />
          ))}
        </div>
      )}

      <InviteMemberDialog
        workspaceId={workspaceId}
        open={openInvite}
        onOpenChange={setOpenInvite}
        onSuccess={fetchMembers}
      />
    </div>
  )
}
