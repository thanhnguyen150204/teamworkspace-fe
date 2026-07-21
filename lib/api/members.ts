import client from "./client";
import { Membership, InviteMemberDto, UpdateMemberRoleDto } from "@/types/membership";

export const memberApi = {
    getAll: (workspaceId: number) => client.get<Membership[]>(`/workspaces/${workspaceId}/members`),
    invite: (workspaceId: number, data: InviteMemberDto) =>
        client.post<Membership>(`/workspaces/${workspaceId}/members`, data),
    updateRole: (workspaceId: number, userId: number, data: UpdateMemberRoleDto) =>
        client.patch<Membership>(`/workspaces/${workspaceId}/members/${userId}`, data),
    remove: (workspaceId: number, userId: number) =>
        client.delete(`/workspaces/${workspaceId}/members/${userId}`),
};
