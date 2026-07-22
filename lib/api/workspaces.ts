import client from "./client";
import { CreateWorkspaceDto, UpdateWorkspaceDto, Workspace } from "@/types/workspace";

export const workspaceApi = {
    create: (data: CreateWorkspaceDto) => client.post('/workspaces', data),
    getAll: () => client.get<any, Workspace[]>('/workspaces'),
    getOne: (id: number) => client.get<any, Workspace>(`/workspaces/${id}`),
    update: (id: number, data: UpdateWorkspaceDto) => client.patch<any, void>(`/workspaces/${id}`, data),
    delete: (id: number) => client.delete<any, void>(`/workspaces/${id}`),
};
