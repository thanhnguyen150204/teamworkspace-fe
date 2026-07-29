export interface Project{
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    workspaceId: number;
}

export interface CreateProjectDto {
    name: string;
    description?: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
}