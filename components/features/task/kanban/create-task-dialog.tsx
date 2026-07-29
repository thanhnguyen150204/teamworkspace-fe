'use client'

import { useState } from "react"
import { useTaskStore } from "@/stores/task-store"
import { TaskStatus, TaskPriority } from "@/types/enum"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateTaskDialogProps{
    projectId: number 
    defaultStatus?: TaskStatus
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void 
}

export function CreateTaskDialog({
    projectId,
    defaultStatus = TaskStatus.TODO,
    open,
    onOpenChange,
    onSuccess,
}: CreateTaskDialogProps){
    const {createTask} = useTaskStore()
    const [title, setTitle] = useState ("")
    const [description, setDescription] = useState("")
    const [status, setStatus] = useState<TaskStatus>(defaultStatus)
    const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM)
    const [dueDate, setDueDate] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if(!title.trim()) return 
        setLoading(true) 
        try{
            await createTask(projectId, {
                title, 
                description: description || undefined,
                status,
                priority,
                dueDate: dueDate || undefined,
            })
            toast.success("Create task successfully")

            setTitle("")
            setDescription("")
            setStatus(defaultStatus)
            setPriority(TaskPriority.MEDIUM)
            setDueDate("")
            onOpenChange(false)
            onSuccess?.()
        }catch(err : any){
            toast.error(err.response?.data?.message|| "Failed to create task")
        }finally{
            setLoading(false)
        }
    }
    return (
     <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Tạo Task Mới</DialogTitle>
          <DialogDescription>Thêm task vào kanban board của dự án.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Tên task *
            </label>
            <Input
              placeholder="Ví dụ: Thiết kế trang chủ..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Mô tả
            </label>
            <Textarea
              placeholder="Mô tả chi tiết task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Trạng thái
              </label>
              <Select value={status} onValueChange={(v) => setStatus(v as TaskStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                  <SelectItem value={TaskStatus.REVIEW}>Review</SelectItem>
                  <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Priority */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                Độ ưu tiên
              </label>
              <Select value={priority} onValueChange={(v) => setPriority(v as TaskPriority)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TaskPriority.LOW}>🟢 Low</SelectItem>
                  <SelectItem value={TaskPriority.MEDIUM}>🟡 Medium</SelectItem>
                  <SelectItem value={TaskPriority.HIGH}>🔴 High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {/* Due Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Ngày hết hạn
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? "Đang tạo..." : "Tạo Task"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}