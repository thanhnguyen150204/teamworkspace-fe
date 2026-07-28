import client from "./client";
import { CreateTaskDto, KanbanBoard, Task, UpdateTaskDto } from "@/types/task";

export const taskApi = {
    getAll: (projectId: number) => client.get<any,Task[]>(`/projects/${projectId}/tasks`),
    getKanban: (projectId: number) => client.get<any, KanbanBoard>(`/projects/${projectId}/tasks/kanban`),
    getOne: (projectId: number, taskId: number) => client.get<any,Task>(`/projects/${projectId}/tasks/${taskId}`),
    create: (projectId: number, data: CreateTaskDto) => client.post<any, Task>(`/projects/${projectId}/tasks`, data),
    update: (projectId: number, taskId: number, data: UpdateTaskDto) => client.patch<any, Task>(`/projects/${projectId}/tasks/${taskId}`, data),
    delete: (projectId: number, taskId: number) => client.delete<any, void>(`/projects/${projectId}/tasks/${taskId}`),
};
