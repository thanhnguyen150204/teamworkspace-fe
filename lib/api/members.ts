import client from "./client";
import { Membership, InviteMemberDto, UpdateMemberRoleDto } from "@/types/membership";

export const memberApi = {
    getAll: (workspaceId: number) => client.get<any, Membership[]>(`/workspaces/${workspaceId}/members`),
    invite: (workspaceId: number, data: InviteMemberDto) =>
        client.post<any, Membership>(`/workspaces/${workspaceId}/members`, data),
    updateRole: (workspaceId: number, userId: number, data: UpdateMemberRoleDto) =>
        client.patch<any, Membership>(`/workspaces/${workspaceId}/members/${userId}`, data),
    remove: (workspaceId: number, userId: number) =>
        client.delete<any, void>(`/workspaces/${workspaceId}/members/${userId}`),
};
