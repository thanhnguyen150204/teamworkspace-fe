export interface Project{
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    workspaceId: number;
}