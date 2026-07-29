import { Task, TaskPriority } from "@/types";
import { Calendar, Flag } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

interface KanbanTaskCardProps {
    task: Task
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
    [TaskPriority.LOW]: {
        label: "Low",
        className: "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400",
    },
    [TaskPriority.MEDIUM]: {
        label: "Medium",
        className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-400",
    },
    [TaskPriority.HIGH]: {
        label: "High",
        className: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400",
    },
}

export function KanbanTaskCard({ task }: KanbanTaskCardProps) {
    const router = useRouter()
    const params = useParams()

    const handleClick = () => {
        router.push(`dashboard/workspace/${params.workspaceId}/project/${task.projectId}/tasks/${task.id}`)
    }
    const priorityConfig = PRIORITY_CONFIG[task.priority]

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "DONE"

    return (
        <div
            onClick={handleClick}
            className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-3 cursor-pointer"
        >
            {/* Title */}
            <p className="text-sm font-medium text-slate-800 dark:text-white leading-snug line-clamp-2">
                {task.title}
            </p>
            {/* Description snippet */}
            {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {task.description}
                </p>
            )}
            {/* Footer */}
            <div className="flex items-center justify-between pt-1">
                {/* Priority badge */}
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${priorityConfig.className}`}>
                    <Flag className="size-3" />
                    {priorityConfig.label}
                </span>
                {/* Due date */}
                {task.dueDate && (
                    <span className={`inline-flex items-center gap-1 text-xs ${isOverdue ? "text-red-500" : "text-slate-400"}`}>
                        <Calendar className="size-3" />
                        {new Date(task.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                )}
            </div>
        </div>
    )
}