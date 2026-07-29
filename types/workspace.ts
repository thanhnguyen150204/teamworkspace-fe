import { WorkspaceRole } from "./enum";

export interface WorkspaceMember {
    role: WorkspaceRole;
    user: {
        id: number;
        fullName: string;
        email?: string;
        avatar?: string | null;
    };
}

export interface Workspace{
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
    memberships?: WorkspaceMember[];
}

export interface CreateWorkspaceDto {
    name: string;
    description?: string;
}

export interface UpdateWorkspaceDto {
    name?: string;
    description?: string;
}