'use client'

import { useState } from "react"
import { useUserStore } from "@/stores/user-store"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateUserDialog({ open, onOpenChange }: CreateUserDialogProps) {
  const { createUser } = useUserStore()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password.trim()) return

    setLoading(true)
    try {
      await createUser({ fullName, email, password })
      setFullName("")
      setEmail("")
      setPassword("")
      onOpenChange(false)
    } catch {
      // Toast error handled in store
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-xl font-bold">Thêm Người Dùng Mới</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div className="space-y-1.5">
          <Label className="text-slate-300">Họ và tên</Label>
          <Input
            placeholder="Nhập họ và tên..."
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Email</Label>
          <Input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-800/80 border-slate-700 text-white"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-slate-300">Mật khẩu</Label>
          <Input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
            disabled={loading || !fullName.trim() || !email.trim() || !password.trim()}
            className="bg-blue-600 hover:bg-blue-500 text-white cursor-pointer"
          >
            {loading ? "Đang tạo..." : "Tạo Mới"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
