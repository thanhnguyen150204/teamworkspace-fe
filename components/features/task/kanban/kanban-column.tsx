'use client'

import { Droppable, Draggable } from "@hello-pangea/dnd"
import { Task } from "@/types/task"
import { TaskStatus } from "@/types/enum"
import { KanbanTaskCard } from "./kanban-task-card"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"


interface KanbanColumnProps{
    status: TaskStatus
    tasks: Task[]
    onAddTask: () => void 
}

const COLUMN_CONFIG: Record<TaskStatus, { label: string; headerClass: string; badgeClass: string}> ={
    [TaskStatus.TODO]: {
        label: "To Do",
        headerClass: "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700",
        badgeClass: "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
    },
    [TaskStatus.IN_PROGRESS]: {
        label: "In Progress",
        headerClass: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800",
        badgeClass: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
    },
    [TaskStatus.REVIEW]: {
        label: "Review",
        headerClass: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800",
        badgeClass: "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300",
    },
    [TaskStatus.DONE]: {
        label: "Done",
        headerClass: "bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800",
        badgeClass: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
    },
}

export function KanbanColumn({ status, tasks, onAddTask}: KanbanColumnProps){
    const config = COLUMN_CONFIG[status]

    return(
        <div className="w-72 shrink-0 flex flex-col gap-2">
      {/* Column Header */}
      <div className={`flex items-center justify-between px-3 py-2 rounded-xl border ${config.headerClass}`}>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            {config.label}
          </span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
            {tasks.length}
          </span>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="size-7"
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
            className={`flex flex-col gap-2 min-h-[200px] rounded-xl p-2 transition-colors ${
              snapshot.isDraggingOver
                ? "bg-slate-100 dark:bg-slate-800/60"
                : "bg-transparent"
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={snapshot.isDragging ? "rotate-2 scale-105" : ""}
                  >
                    <KanbanTaskCard task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            {tasks.length === 0 && (
              <div className="flex items-center justify-center h-20 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-400">Kéo task vào đây</span>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  )
}