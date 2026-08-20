'use client'

import { useEffect, useState } from "react"
import { commentApi } from "@/lib/api/comments"
import { Comment, CreateCommentDto } from "@/types/comment"
import { useAuthStore } from "@/stores/auth-store"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Pencil, Trash2, Check, X } from "lucide-react"

interface CommentSectionProps {
  taskId: number
}

export function CommentSection({ taskId }: CommentSectionProps) {
  const { user } = useAuthStore()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newContent, setNewContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState("")

  const fetchComments = async () => {
    try {
      const data = await commentApi.getAll(taskId) as any as Comment[]
      setComments(data)
    } catch {
      toast.error("Failed to load comments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [taskId])

  // Listen for real-time comment_added events from other users via WebSocket
  useEffect(() => {
    const handler = (e: Event) => {
      const comment = (e as CustomEvent<Comment>).detail
      // Only append if it belongs to this task and was sent by someone else
      // (our own comments are already appended optimistically in handleAdd)
      if (comment.taskId === taskId && comment.userId !== user?.id) {
        setComments(prev => {
          // Avoid duplicates
          if (prev.some(c => c.id === comment.id)) return prev
          return [...prev, comment]
        })
      }
    }
    window.addEventListener('ws:comment_added', handler)
    return () => window.removeEventListener('ws:comment_added', handler)
  }, [taskId, user?.id])

  const handleAdd = async () => {
    if (!newContent.trim()) return
    setSubmitting(true)
    try {
      const comment = await commentApi.create(taskId, { content: newContent }) as any as Comment
      setComments(prev => [...prev, comment])
      setNewContent("")
      toast.success("Đã thêm comment")
    } catch {
      toast.error("Không thể thêm comment")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (commentId: number) => {
    if (!editContent.trim()) return
    try {
      const updated = await commentApi.update(taskId, commentId, { content: editContent }) as any as Comment
      setComments(prev => prev.map(c => c.id === commentId ? updated : c))
      setEditingId(null)
      toast.success("Đã cập nhật comment")
    } catch {
      toast.error("Không thể cập nhật comment")
    }
  }

  const handleDelete = async (commentId: number) => {
    try {
      await commentApi.delete(taskId, commentId)
      setComments(prev => prev.filter(c => c.id !== commentId))
      toast.success("Đã xóa comment")
    } catch {
      toast.error("Không thể xóa comment")
    }
  }

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id)
    setEditContent(comment.content)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0" />
            <div className="flex-1 h-16 rounded-lg bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
        <MessageSquare className="size-4" />
        <span>Comments ({comments.length})</span>
      </div>

      {/* Add comment */}
      <div className="flex gap-3">
        <Avatar className="size-8 shrink-0">
          <AvatarFallback className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
            {user?.fullName?.charAt(0).toUpperCase() ?? "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <Textarea
            placeholder="Thêm comment..."
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            rows={2}
            className="resize-none text-sm"
          />
          <Button size="sm" onClick={handleAdd} disabled={submitting || !newContent.trim()}>
            {submitting ? "Đang gửi..." : "Gửi"}
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Chưa có comment nào. Hãy là người đầu tiên!</p>
        )}
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-3 group">
            <Avatar className="size-8 shrink-0">
              <AvatarFallback className="text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {comment.user?.fullName?.charAt(0).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  {comment.user?.fullName ?? `User #${comment.userId}`}
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-slate-400">
                    {new Date(comment.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit", month: "2-digit", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </span>
                  {user?.id === comment.userId && editingId !== comment.id && (
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 ml-2 transition-opacity">
                      <Button variant="ghost" size="icon" className="size-6" onClick={() => startEdit(comment)}>
                        <Pencil className="size-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="size-6 text-red-500 hover:text-red-600" onClick={() => handleDelete(comment.id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {editingId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    rows={2}
                    className="resize-none text-sm"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" className="size-7 p-0" onClick={() => handleEdit(comment.id)}>
                      <Check className="size-3.5 text-green-600" />
                    </Button>
                    <Button size="sm" variant="ghost" className="size-7 p-0" onClick={() => setEditingId(null)}>
                      <X className="size-3.5 text-slate-500" />
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/60 rounded-lg px-3 py-2">
                  {comment.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
