export interface CommentUser {
    id: number;
    fullName: string;
    avatar: string | null;
}
export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    userId: number;
    taskId: number;
    user?: CommentUser;
}

export interface CreateCommentDto {
    content: string;
}

export interface UpdateCommentDto {
    content?: string;
}