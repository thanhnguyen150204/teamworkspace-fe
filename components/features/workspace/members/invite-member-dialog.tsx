'use client'

import { useState } from "react"
import { memberApi } from "@/lib/api/members"
import { WorkspaceRole } from "@/types/enum"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Mail } from "lucide-react"

interface InviteMemberDialogProps {
  workspaceId: number
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InviteMemberDialog({ workspaceId, open, onOpenChange, onSuccess }: InviteMemberDialogProps) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<WorkspaceRole>(WorkspaceRole.MEMBER)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await memberApi.invite(workspaceId, { email, role })
      toast.success(`Đã mời ${email} vào workspace`)
      setEmail("")
      setRole(WorkspaceRole.MEMBER)
      onOpenChange(false)
      onSuccess()
    } catch (err: any) {
      const msg = err.response?.data?.message
      toast.error(Array.isArray(msg) ? msg[0] : msg || "Không thể mời thành viên")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mời Thành Viên</DialogTitle>
            <DialogDescription>
              Nhập email người dùng để mời vào workspace.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Vai trò
              </label>
              <Select value={role} onValueChange={v => setRole(v as WorkspaceRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={WorkspaceRole.ADMIN}>Admin – Quản lý workspace</SelectItem>
                  <SelectItem value={WorkspaceRole.MEMBER}>Member – Thành viên thường</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading || !email.trim()}>
              {loading ? "Đang mời..." : "Gửi lời mời"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
