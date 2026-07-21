import client from "./client";
import { CreateCommentDto, Comment, UpdateCommentDto } from "@/types/comment";

export const commentApi = {
    getAll: (taskId: number) => client.get<Comment[]>(`/tasks/${taskId}/comments`),
    create: (taskId: number, data: CreateCommentDto) => client.post<Comment>(`/tasks/${taskId}/comments`, data),
    update: (commentId: number, data: UpdateCommentDto) => client.patch<Comment>(`/tasks/0/comments/${commentId}`, data),
    delete: (commentId: number) => client.delete(`/tasks/0/comments/${commentId}`),
};
