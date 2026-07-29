import { WorkspaceRole } from "./enum";

export interface MembershipUser {
    id: number;
    fullName: string;
    email: string;
    avatar: string | null;
    avatarUrl?: string;
}

export interface Membership {
    id: number;
    role: WorkspaceRole;
    joinedAt: string;
    userId: number;
    workspaceId: number;
    user?: MembershipUser;
}

export interface InviteMemberDto {
    email: string;
    role: WorkspaceRole;
}

export interface UpdateMemberRoleDto {
    role: WorkspaceRole;
}