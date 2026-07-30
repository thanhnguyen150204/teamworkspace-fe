import { create } from "zustand";
import { CreateTaskDto, KanbanBoard, Task, TaskStatus, UpdateTaskDto } from "@/types";
import { taskApi } from "@/lib/api/tasks";

interface TaskState {
    tasks: Task[];
    kanban: KanbanBoard | null;
    activeTask: Task | null;
    isLoading: boolean;

    fetchTasks: (projectId: number) => Promise<void>;
    fetchKanban: (projectId: number) => Promise<void>;
    fetchTask: (projectId: number, taskId: number) => Promise<void>;
    createTask: (projectId: number, data: CreateTaskDto) => Promise<Task>;
    updateTask: (projectId: number, taskId: number, data: UpdateTaskDto) => Promise<void>;
    moveTask: (projectId: number, taskId: number, newStatus: TaskStatus, sourceIndex: number, destinationIndex: number) => Promise<void>;
    deleteTask: (projectId: number, taskId: number) => Promise<void>;
    setActiveTask: (task: Task | null) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
    tasks: [],
    kanban: null,
    activeTask: null,
    isLoading: false,

    fetchTasks: async (projectId) => {
        set({ isLoading: true });
        try {
            const data = await taskApi.getAll(projectId);
            set({ tasks: data, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },

    fetchKanban: async (projectId) => {
        set({ isLoading: true });
        try {
            const data = await taskApi.getKanban(projectId);
            set({ kanban: data, isLoading: false });
        } catch {
            set({ isLoading: false });
        }
    },

    fetchTask: async (projectId, taskId) => {
        try {
            const data = await taskApi.getOne(projectId, taskId);
            set({ activeTask: data });
        } catch {
            set({ activeTask: null });
        }
    },

    createTask: async (projectId, data) => {
        const newTask = await taskApi.create(projectId, data);
        // Update kanban if using kanban view
        const kanban = get().kanban;
        if (kanban) {
            const status = newTask.status;
            set({
                kanban: {
                    ...kanban,
                    [status]: [...kanban[status], newTask],
                },
            });
        }
        return newTask;
    },

    updateTask: async (projectId, taskId, data) => {
        const updated = await taskApi.update(projectId, taskId, data);
        // Update in tasks list
        set((state) => ({
            tasks: state.tasks.map((t) => (t.id === taskId ? updated : t)),
            activeTask: state.activeTask?.id === taskId ? updated : state.activeTask,
        }));
    },

    moveTask: async (projectId, taskId, newStatus, sourceIndex, destinationIndex) => {
        const kanban = get().kanban;
        if (!kanban) return;

        // find task current
        let movedTask: Task | undefined;
        let oldStatus: TaskStatus | undefined;
        for (const status of Object.keys(kanban) as TaskStatus[]) {
            const found = kanban[status].find((t) => t.id === taskId);
            if (found) {
                movedTask = found;
                oldStatus = status;
                break;
            }
        }
        if (!movedTask || !oldStatus) return;

        const isSameColumn = oldStatus === newStatus;
        const updatedTask = { ...movedTask, status: newStatus };

        if (isSameColumn) {
            // Reorder in common column
            const col = [...kanban[oldStatus]];
            col.splice(sourceIndex, 1);          // delete old index
            col.splice(destinationIndex, 0, updatedTask); // insert new index
            set({ kanban: { ...kanban, [oldStatus]: col } });
            // Don't call API because status is not changed
            return;
        }

        // Optimistic update — insert new index
        const newCol = [...kanban[newStatus]];
        newCol.splice(destinationIndex, 0, updatedTask);
        set({
            kanban: {
                ...kanban,
                [oldStatus]: kanban[oldStatus].filter((t) => t.id !== taskId),
                [newStatus]: newCol,
            },
        });

        try {
            await taskApi.update(projectId, taskId, { status: newStatus });
        } catch {
            // Rollback if API error
            set({ kanban });
        }
    },

    deleteTask: async (projectId, taskId) => {
        await taskApi.delete(projectId, taskId);
        set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== taskId),
            activeTask: state.activeTask?.id === taskId ? null : state.activeTask,
        }));
    },

    setActiveTask: (task) => {
        set({ activeTask: task });
    },
}));