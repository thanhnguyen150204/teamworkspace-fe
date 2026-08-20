'use client'

import { Task, TaskPriority } from "@/types";
import { Calendar, Flag, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useTaskStore } from "@/stores/task-store";
import { toast } from "sonner";

interface KanbanTaskCardProps {
    task: Task
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
    [TaskPriority.LOW]: {
        label: "LOW",
        className: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-semibold",
    },
    [TaskPriority.MEDIUM]: {
        label: "MEDIUM",
        className: "bg-amber-50 text-amber-700 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 font-semibold",
    },
    [TaskPriority.HIGH]: {
        label: "HIGH",
        className: "bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 font-bold",
    },
}

export function KanbanTaskCard({ task }: KanbanTaskCardProps) {
    const router = useRouter()
    const params = useParams()
    const { deleteTask } = useTaskStore()

    const projectId = task.projectId || Number(params.projectId)

    const handleClick = () => {
        router.push(`/dashboard/workspace/${params.workspaceId}/projects/${projectId}/tasks/${task.id}`)
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!confirm(`Bạn có chắc muốn xóa task "${task.title}"?`)) return
        try {
            await deleteTask(projectId, task.id)
            toast.success("Đã xóa task thành công")
        } catch {
            toast.error("Không thể xóa task")
        }
    }

    const priorityConfig = PRIORITY_CONFIG[task.priority]
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE"

    return (
        <div
            onClick={handleClick}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group hover:border-blue-400 dark:hover:border-blue-500/80 flex flex-col gap-2.5 relative"
        >
            {/* Header: Title + Delete button */}
            <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
                    {task.title}
                </p>
                <button
                    onClick={handleDelete}
                    title="Xóa task"
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-all shrink-0"
                >
                    <Trash2 className="size-3.5" />
                </button>
            </div>

            {/* Description snippet */}
            {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800/60 mt-0.5">
                {/* Priority badge */}
                <span className={`inline-flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full shadow-2xs ${priorityConfig.className}`}>
                    <Flag className="size-3" />
                    {priorityConfig.label}
                </span>
                {/* Due date */}
                {task.dueDate && (
                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md ${isOverdue ? "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                        <Calendar className="size-3" />
                        {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                )}
            </div>
        </div>
    )
}