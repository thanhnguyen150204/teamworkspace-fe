'use client'

import { useTaskStore } from "@/stores/task-store"
import { TaskStatus } from "@/types"
import { DragDropContext, DropResult } from "@hello-pangea/dnd"
import { useEffect, useState } from "react"
import {KanbanColumn} from "./kanban-column"
import { CreateTaskDialog } from "./create-task-dialog"

interface KanbanBoardProps {
    projectId: number
}
const COLUMNS: TaskStatus[] = [
    TaskStatus.TODO,
    TaskStatus.IN_PROGRESS,
    TaskStatus.REVIEW,
    TaskStatus.DONE,
]

export function KanbanBoard({ projectId }: KanbanBoardProps) {
    const {kanban, fetchKanban, moveTask, isLoading} = useTaskStore()
    const [openCreate, setOpenCreate] = useState(false)
    const [defaultStatus, setDefaultStatus] = useState<TaskStatus>(TaskStatus.TODO)

    useEffect(() => {
        fetchKanban(projectId)
    }, [projectId, fetchKanban])
    
    const handleDragEnd = (result: DropResult) => {
        const { destination, source, draggableId} = result
        if (!destination) return
        // Bỏ qua nếu thả đúng vị trí cũ
        if (destination.droppableId === source.droppableId && destination.index === source.index) return

        const taskId = parseInt(draggableId)
        const newStatus = destination.droppableId as TaskStatus
        moveTask(projectId, taskId, newStatus, source.index, destination.index)
    }
    const handleAddTask = (status: TaskStatus) => {
        setDefaultStatus(status)
        setOpenCreate(true)
    }
    if( isLoading || !kanban) {
        return (
            <div className="w-full flex justify-center py-4">
                <div className="flex gap-5 overflow-x-auto pb-4 max-w-7xl w-full justify-center items-start">
                    {COLUMNS.map((col) => (
                        <div key={col} className="flex-1 min-w-[280px] max-w-[320px] shrink-0 h-96 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 animate-pulse shadow-xs" />
                    ))}
                </div>
            </div>
        )
    }
    return (
        <>
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="w-full flex justify-center py-4">
                <div className="flex gap-5 overflow-x-auto pb-4 max-w-7xl w-full justify-center items-start px-2">
                    {COLUMNS.map((status) => (
                        <KanbanColumn
                            key={status}
                            status= {status}
                            tasks={kanban[status] ?? []}
                            onAddTask = {() => handleAddTask(status)}
                        />
                    ))}
                </div>
            </div>
        </DragDropContext>

        <CreateTaskDialog
            projectId= {projectId}
            defaultStatus= {defaultStatus}
            open={openCreate}
            onOpenChange = {setOpenCreate}
            onSuccess={() => fetchKanban(projectId)}
        />
        </>
    )
}