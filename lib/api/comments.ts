import client from "./client";
import { CreateCommentDto, Comment, UpdateCommentDto } from "@/types/comment";

export const commentApi = {
    getAll: (taskId: number) => client.get<any, Comment[]>(`/tasks/${taskId}/comments`),
    create: (taskId: number, data: CreateCommentDto) => client.post<any, Comment>(`/tasks/${taskId}/comments`, data),
    update: (taskId: number, commentId: number, data: UpdateCommentDto) => client.patch<any, Comment>(`/tasks/${taskId}/comments/${commentId}`, data),
    delete: (taskId: number, commentId: number) => client.delete<any, void>(`/tasks/${taskId}/comments/${commentId}`),
};
