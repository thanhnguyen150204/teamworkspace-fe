export interface Attachment {
    id: number;
    fileName: string;
    fileUrl: string;
    fileSize: number;
    mimeType: string;
    createdAt: string;
    taskId: number;
}