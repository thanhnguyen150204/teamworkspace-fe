import { WorkspaceRole } from "./enum";
export interface Membership {
    id: number;
    role: WorkspaceRole;
    joinedAt: string;
    userId: number;
    workspaceId: number;
}

export interface InviteMemberDto {
    email: string;
    role: WorkspaceRole;
}

export interface UpdateMemberRoleDto {
    role: WorkspaceRole;
}