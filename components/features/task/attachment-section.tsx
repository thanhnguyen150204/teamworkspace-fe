'use client'

import { useEffect, useRef, useState } from "react"
import { Attachment } from "@/types/attachment"
import { attachmentApi } from "@/lib/api/attachments"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Paperclip,
  Upload,
  Loader2,
  Trash2,
  ExternalLink,
  FileImage,
  FileText,
  FileCode,
  FileArchive,
  File as FileIcon,
} from "lucide-react"

interface AttachmentSectionProps {
  taskId: number
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

function getFileIcon(mimeType: string, fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || ""
  if (mimeType?.startsWith("image/") || ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) {
    return <FileImage className="size-5 text-cyan-600 dark:text-cyan-400" />
  }
  if (mimeType === "application/pdf" || ext === "pdf") {
    return <FileText className="size-5 text-red-500" />
  }
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) {
    return <FileArchive className="size-5 text-amber-500" />
  }
  if (["js", "ts", "json", "html", "css", "py", "java"].includes(ext)) {
    return <FileCode className="size-5 text-emerald-500" />
  }
  return <FileIcon className="size-5 text-slate-400" />
}

export function AttachmentSection({ taskId }: AttachmentSectionProps) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchAttachments = async () => {
    try {
      const res = await attachmentApi.getAll(taskId)
      if (Array.isArray(res)) {
        setAttachments(res)
      } else if (res && Array.isArray((res as any).data)) {
        setAttachments((res as any).data)
      } else {
        setAttachments([])
      }
    } catch {
      setAttachments([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttachments()
  }, [taskId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      await attachmentApi.upload(taskId, file)
      toast.success("Tải tệp lên thành công")
      if (fileInputRef.current) fileInputRef.current.value = ""
      await fetchAttachments()
    } catch {
      toast.error("Không thể tải tệp lên")
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (attachmentId: number) => {
    if (!confirm("Bạn có chắc muốn xóa tệp này?")) return
    setDeletingId(attachmentId)
    try {
      await attachmentApi.delete(taskId, attachmentId)
      toast.success("Đã xóa tệp")
      setAttachments((prev) => prev.filter((a) => a.id !== attachmentId))
    } catch {
      toast.error("Không thể xóa tệp")
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header & Upload Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="size-4 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Tệp đính kèm ({attachments.length})
          </h3>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="gap-2 cursor-pointer border-teal-600/30 text-teal-700 dark:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/30"
        >
          {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
          {uploading ? "Đang tải..." : "Thêm tệp"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Attachment List */}
      {loading ? (
        <div className="flex items-center justify-center py-6">
          <Loader2 className="size-5 animate-spin text-slate-400" />
        </div>
      ) : attachments.length === 0 ? (
        <div className="text-center py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-xs text-slate-400 italic">Chưa có tệp đính kèm nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {attachments.map((att) => {
            const isImage = att.mimeType?.startsWith("image/")
            return (
              <div
                key={att.id}
                className="group relative flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-teal-500/40 transition-all shadow-2xs"
              >
                {/* File Thumbnail or Icon */}
                <div className="size-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden border border-slate-200/60 dark:border-slate-700/60">
                  {isImage ? (
                    <img
                      src={att.fileUrl}
                      alt={att.fileName}
                      className="size-full object-cover"
                    />
                  ) : (
                    getFileIcon(att.mimeType, att.fileName)
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={att.fileName}>
                    {att.fileName}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {formatFileSize(att.fileSize)} • {new Date(att.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Mở tệp"
                  >
                    <ExternalLink className="size-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={() => handleDelete(att.id)}
                    disabled={deletingId === att.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Xóa tệp"
                  >
                    {deletingId === att.id ? (
                      <Loader2 className="size-3.5 animate-spin text-red-500" />
                    ) : (
                      <Trash2 className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
