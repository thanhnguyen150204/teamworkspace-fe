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
        if(!destination) return 
        if (destination.droppableId === source.droppableId) return

        const taskId = parseInt(draggableId) 
        const newStatus = destination.droppableId as TaskStatus
        moveTask(projectId, taskId, newStatus)
    }
    const handleAddTask = (status: TaskStatus) => {
        setDefaultStatus(status)
        setOpenCreate(true)
    }
    if( isLoading || !kanban) {
        return (
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((col) => (
                    <div key={col} className="w-72 shrink-0 h-96 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                ))}
            </div>
        )
    }
    return (
        <>
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex gap-4 overflow-x-auto pb-4">
                {COLUMNS.map((status) => (
                    <KanbanColumn
                        key={status}
                        status= {status}
                        tasks={kanban[status] ?? []}
                        onAddTask = {() => handleAddTask(status)}
                    />
                ))}

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