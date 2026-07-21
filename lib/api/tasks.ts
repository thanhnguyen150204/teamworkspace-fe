import client from "./client";
import { CreateTaskDto, KanbanBoard, Task, UpdateTaskDto } from "@/types/task";

export const taskApi = {
    getAll: (projectId: number) => client.get<Task[]>(`/projects/${projectId}/tasks`),
    getKanban: (projectId: number) => client.get<KanbanBoard>(`/projects/${projectId}/tasks/kanban`),
    getOne: (projectId: number, taskId: number) => client.get<Task>(`/projects/${projectId}/tasks/${taskId}`),
    create: (projectId: number, data: CreateTaskDto) => client.post<Task>(`/projects/${projectId}/tasks`, data),
    update: (projectId: number, taskId: number, data: UpdateTaskDto) => client.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, data),
    delete: (projectId: number, taskId: number) => client.delete(`/projects/${projectId}/tasks/${taskId}`),
};
