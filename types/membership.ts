import { WorkspaceRole } from "./enum";
export interface Membership {
    id: number;
    role: WorkspaceRole;
    joinedAt: string;
    userId: number;
    workspaceId: number;
}