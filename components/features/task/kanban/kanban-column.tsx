'use client'

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Task } from "@/types/task"
import { TaskStatus } from "@/types/enum"
import { KanbanTaskCard } from "./kanban-task-card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"


interface KanbanColumnProps {
  status: TaskStatus
  tasks: Task[]
  onAddTask: () => void
}

const COLUMN_CONFIG: Record<TaskStatus, { label: string; headerClass: string; badgeClass: string }> = {
  [TaskStatus.TODO]: {
    label: "To Do",
    headerClass: "bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 text-white shadow-md shadow-cyan-600/20 border-none",
    badgeClass: "bg-white/20 text-white font-bold backdrop-blur-xs",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    headerClass: "bg-gradient-to-r from-sky-500 via-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/20 border-none",
    badgeClass: "bg-white/20 text-white font-bold backdrop-blur-xs",
  },
  [TaskStatus.REVIEW]: {
    label: "Review",
    headerClass: "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 text-white shadow-md shadow-teal-600/20 border-none",
    badgeClass: "bg-white/20 text-white font-bold backdrop-blur-xs",
  },
  [TaskStatus.DONE]: {
    label: "Done",
    headerClass: "bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white shadow-md shadow-emerald-600/20 border-none",
    badgeClass: "bg-white/20 text-white font-bold backdrop-blur-xs",
  },
}

export function KanbanColumn({ status, tasks, onAddTask }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status]

  // Filter unique tasks by ID to guarantee React key uniqueness
  const uniqueTasks = Array.from(
    new Map(tasks.map((t) => [t.id, t])).values()
  )

  return (
    <div className="flex-1 min-w-[280px] max-w-[320px] shrink-0 flex flex-col gap-3 rounded-2xl bg-sky-50/95 dark:bg-slate-900 border border-sky-200/80 dark:border-sky-900/40 p-3.5 shadow-md shadow-sky-900/5 dark:shadow-none max-h-[calc(100vh-160px)]">
      {/* Column Header */}
      <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl shrink-0 ${config.headerClass}`}>
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-bold text-white tracking-tight">
            {config.label}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full ${config.badgeClass}`}>
            {tasks.length}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="size-7 rounded-lg hover:bg-white/20 text-white"
          onClick={onAddTask}
        >
          <Plus className="size-4" />
        </Button>
      </div>
      {/* Task Cards */}
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 overflow-y-auto flex flex-col gap-3 min-h-[340px] rounded-xl p-2 transition-colors ${snapshot.isDraggingOver
              ? "bg-sky-200/70 dark:bg-sky-950/60 border-2 border-dashed border-sky-500"
              : "bg-blue-100/50 dark:bg-slate-950/40 border border-blue-200/50"
              }`}
          >
            {uniqueTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={provided.draggableProps.style}
                    className={snapshot.isDragging ? "shadow-2xl z-50 cursor-grabbing opacity-90 scale-105" : ""}
                  >
                    <KanbanTaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {uniqueTasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed border-sky-300/70 dark:border-slate-800 bg-sky-50/70 dark:bg-slate-900/40 text-slate-400">
                <span className="text-xs font-semibold text-sky-600 dark:text-sky-400">Kéo task vào đây</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}