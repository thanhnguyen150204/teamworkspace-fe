export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    userId: number;
    taskId: number;
}