'use client'

import { useEffect, useState } from "react"
import { memberApi } from "@/lib/api/members"
import { Membership } from "@/types/membership"
import { WorkspaceRole } from "@/types/enum"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { MemberCard } from "./member-card"
import { InviteMemberDialog } from "./invite-member-dialog"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, Loader2, LogOut } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface MemberListProps {
  workspaceId: number
}

export function MemberList({ workspaceId }: MemberListProps) {
  const router = useRouter()
  const { myRole, fetchMyRole, fetchWorkspaces } = useWorkspaceStore()
  const [members, setMembers] = useState<Membership[]>([])
  const [loading, setLoading] = useState(true)
  const [leaving, setLeaving] = useState(false)
  const [openInvite, setOpenInvite] = useState(false)

  const canEdit = myRole === WorkspaceRole.OWNER || myRole === WorkspaceRole.ADMIN
  const isOwner = myRole === WorkspaceRole.OWNER

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
    if (!workspaceId) return
    fetchMyRole(workspaceId)
    fetchMembers()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspaceId])

  const handleLeaveWorkspace = async () => {
    if (isOwner) {
      toast.error("Owner duy nhất không thể rời workspace. Vui lòng chuyển quyền owner hoặc xóa workspace.")
      return
    }
    if (!confirm("Bạn có chắc chắn muốn rời khỏi Workspace này?")) return

    setLeaving(true)
    try {
      await memberApi.leave(workspaceId)
      toast.success("Đã rời khỏi workspace")
      await fetchWorkspaces(true)
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể rời khỏi workspace")
    } finally {
      setLeaving(false)
    }
  }

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

        <div className="flex items-center gap-2">
          {!isOwner && myRole !== null && (
            <Button
              variant="outline"
              onClick={handleLeaveWorkspace}
              disabled={leaving}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/50"
            >
              {leaving ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
              Rời Workspace
            </Button>
          )}

          {canEdit && (
            <Button onClick={() => setOpenInvite(true)} className="gap-2">
              <UserPlus className="size-4" />
              Mời thành viên
            </Button>
          )}
        </div>
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
