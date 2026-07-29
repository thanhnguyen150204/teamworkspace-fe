import client from "./client";
import { Attachment } from "@/types/attachment";

export const attachmentApi = {
    getAll: (taskId: number) => client.get<any, Attachment[]>(`/tasks/${taskId}/attachments`),
    upload: (taskId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return client.post<any, Attachment>(`/tasks/${taskId}/attachments`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (taskId: number, attachmentId: number) =>
        client.delete<any, any>(`/tasks/${taskId}/attachments/${attachmentId}`),
};
