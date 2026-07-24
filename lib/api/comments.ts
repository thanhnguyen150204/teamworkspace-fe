import client from "./client";
import { CreateCommentDto, Comment, UpdateCommentDto } from "@/types/comment";

export const commentApi = {
    getAll: (taskId: number) => client.get<Comment[]>(`/tasks/${taskId}/comments`),
    create: (taskId: number, data: CreateCommentDto) => client.post<Comment>(`/tasks/${taskId}/comments`, data),
    update: (taskId: number, commentId: number, data: UpdateCommentDto) => client.patch<Comment>(`/tasks/${taskId}/comments/${commentId}`, data),
    delete: (taskId: number, commentId: number) => client.delete(`/tasks/${taskId}/comments/${commentId}`),
};
