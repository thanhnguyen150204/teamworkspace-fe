'use client'

import { useEffect, useState } from "react"
import { projectApi } from "@/lib/api/projects"
import { Project } from "@/types/project"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface EditProjectDialogProps {
  workspaceId: number
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function EditProjectDialog({
  workspaceId,
  project,
  open,
  onOpenChange,
  onSuccess,
}: EditProjectDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (project) {
      setName(project.name)
      setDescription(project.description ?? "")
    }
  }, [project])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !project) return

    setLoading(true)
    try {
      await projectApi.update(workspaceId, project.id, {
        name: name.trim(),
        description: description || undefined,
      })
      toast.success("Cập nhật dự án thành công!")
      onOpenChange(false)
      onSuccess?.()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể cập nhật dự án.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh Sửa Dự Án</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tên và mô tả cho dự án.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2">
            <div className="space-y-1.5">
              <label htmlFor="edit-pj-name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Tên Dự Án *
              </label>
              <Input
                id="edit-pj-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="edit-pj-desc" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Mô tả dự án
              </label>
              <Textarea
                id="edit-pj-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
