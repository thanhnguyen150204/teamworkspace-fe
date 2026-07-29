'use client'

import { Membership } from "@/types/membership"
import { WorkspaceRole } from "@/types/enum"
import { memberApi } from "@/lib/api/members"
import { toast } from "sonner"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Crown, Shield, User2, MoreHorizontal, Trash2 } from "lucide-react"

const ROLE_CONFIG: Record<WorkspaceRole, { label: string; icon: React.ElementType; className: string }> = {
  [WorkspaceRole.OWNER]: { label: "Owner",  icon: Crown,  className: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300" },
  [WorkspaceRole.ADMIN]: { label: "Admin",  icon: Shield, className: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300" },
  [WorkspaceRole.MEMBER]:{ label: "Member", icon: User2,  className: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400" },
}

interface MemberCardProps {
  member: Membership
  canEdit: boolean
  workspaceId: number
  onRefresh: () => void
}

export function MemberCard({ member, canEdit, workspaceId, onRefresh }: MemberCardProps) {
  const roleConfig = ROLE_CONFIG[member.role]
  const RoleIcon = roleConfig.icon

  const handleRoleChange = async (newRole: WorkspaceRole) => {
    try {
      await memberApi.updateRole(workspaceId, member.userId, { role: newRole })
      toast.success("Đã cập nhật role")
      onRefresh()
    } catch {
      toast.error("Không thể cập nhật role")
    }
  }

  const handleRemove = async () => {
    if (!confirm(`Bạn có chắc muốn xóa ${member.user?.fullName ?? "thành viên này"}?`)) return
    try {
      await memberApi.remove(workspaceId, member.userId)
      toast.success("Đã xóa thành viên")
      onRefresh()
    } catch {
      toast.error("Không thể xóa thành viên")
    }
  }

  const name = member.user?.fullName ?? `User #${member.userId}`
  const email = member.user?.email ?? ""
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
      <div className="flex items-center gap-3">
        <Avatar className="size-10">
          <AvatarFallback className="text-sm font-semibold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-white">{name}</p>
          {email && <p className="text-xs text-slate-400">{email}</p>}
          <p className="text-xs text-slate-400">
            Tham gia: {new Date(member.joinedAt).toLocaleDateString("vi-VN")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${roleConfig.className}`}>
          <RoleIcon className="size-3" />
          {roleConfig.label}
        </span>

        {canEdit && member.role !== WorkspaceRole.OWNER && (
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center size-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleRoleChange(WorkspaceRole.ADMIN)}>
                <Shield className="size-3.5 mr-2" /> Đặt làm Admin
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRoleChange(WorkspaceRole.MEMBER)}>
                <User2 className="size-3.5 mr-2" /> Đặt làm Member
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleRemove} className="text-red-600 focus:text-red-600">
                <Trash2 className="size-3.5 mr-2" /> Xóa khỏi workspace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
