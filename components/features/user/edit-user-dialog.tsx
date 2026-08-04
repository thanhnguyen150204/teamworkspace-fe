'use client'

import { useEffect, useState } from "react"
import { useUserStore } from "@/stores/user-store"
import { User } from "@/types/user"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditUserDialogProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditUserDialog({ user, open, onOpenChange }: EditUserDialogProps) {
  const { updateUser } = useUserStore()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "")
      setEmail(user.email || "")
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !fullName.trim() || !email.trim()) return

    setLoading(true)
    try {
      await updateUser(user.id, { fullName, email })
      onOpenChange(false)
    } catch {
      // Error handled in store toast
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Chỉnh Sửa Người Dùng</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label className="text-slate-300">Họ và tên</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white"
          />
        </div>

        <DialogFooter className="pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-slate-800 border-slate-700 text-white hover:bg-slate-700 cursor-pointer"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={loading || !fullName.trim() || !email.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
          >
            {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
