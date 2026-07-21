export interface Workspace{
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface CreateWorkspaceDto {
    name: string;
    description?: string;
}

export interface UpdateWorkspaceDto {
    name?: string;
    description?: string;
}