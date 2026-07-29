'use client'

import { useEffect, useState } from "react"
import { workspaceApi } from "@/lib/api/workspaces"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { WorkspaceRole } from "@/types/enum"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Save, Settings, Trash2, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"

interface WorkspaceSettingsProps {
  workspaceId: number
}

export function WorkspaceSettings({ workspaceId }: WorkspaceSettingsProps) {
  const router = useRouter()
  const { activeWorkspace, myRole, fetchWorkspaces } = useWorkspaceStore()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmName, setConfirmName] = useState("")

  const isOwner = myRole === WorkspaceRole.OWNER

  useEffect(() => {
    if (activeWorkspace) {
      setName(activeWorkspace.name)
      setDescription(activeWorkspace.description ?? "")
    }
  }, [activeWorkspace])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    try {
      await workspaceApi.update(workspaceId, { name: name.trim(), description: description || undefined })
      await fetchWorkspaces()
      toast.success("Đã cập nhật workspace")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể cập nhật workspace")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (confirmName !== activeWorkspace?.name) {
      toast.error("Tên workspace không khớp")
      return
    }
    setDeleting(true)
    try {
      await workspaceApi.delete(workspaceId)
      toast.success("Đã xóa workspace")
      await fetchWorkspaces()
      router.push("/dashboard")
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Không thể xóa workspace")
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Settings className="size-5 text-slate-600 dark:text-slate-400" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Cài Đặt Workspace</h2>
      </div>

      {/* General settings */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-semibold text-slate-800 dark:text-white">Thông tin chung</h3>
        </div>
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Tên workspace *</label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Tên workspace..."
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">Mô tả</label>
            <Textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả workspace..."
              rows={3}
              className="resize-none"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={saving || !name.trim()} className="gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              Lưu thay đổi
            </Button>
          </div>
        </form>
      </div>

      {/* Danger Zone – chỉ OWNER */}
      {isOwner && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-200 dark:border-red-900/50 overflow-hidden">
          <div className="px-6 py-4 border-b border-red-100 dark:border-red-900/30 flex items-center gap-2">
            <AlertTriangle className="size-4 text-red-500" />
            <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Vùng nguy hiểm</h3>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-white">Xóa workspace</p>
              <p className="text-xs text-slate-500 mt-1">
                Thao tác này sẽ xóa vĩnh viễn workspace cùng toàn bộ projects và tasks. Không thể hoàn tác.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Nhập tên workspace để xác nhận: <span className="text-red-500 font-mono">{activeWorkspace?.name}</span>
              </label>
              <Input
                value={confirmName}
                onChange={e => setConfirmName(e.target.value)}
                placeholder="Nhập tên workspace..."
                className="border-red-200 dark:border-red-900/50 focus-visible:ring-red-500"
              />
            </div>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting || confirmName !== activeWorkspace?.name}
              className="gap-2"
            >
              {deleting ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
              Xóa workspace vĩnh viễn
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
