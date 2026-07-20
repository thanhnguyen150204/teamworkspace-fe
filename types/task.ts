import { TaskPriority, TaskStatus } from "./enum";

export interface Task{
    id: number;
    title: string;
    description: string | null;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string | null;
    completedAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    creatorId: number;
    projectId: number;
}