import client from "./client";
import { CreateWorkspaceDto, UpdateWorkspaceDto, Workspace } from "@/types/workspace";

export const workspaceApi = {
    create: (data: CreateWorkspaceDto) => client.post('/workspaces', data),
    getAll: () => client.get<Workspace[]>('/workspaces'),
    getOne: (id: number) => client.get<Workspace>(`/workspaces/${id}`),
    update: (id: number, data: UpdateWorkspaceDto) => client.patch(`/workspaces/${id}`, data),
    delete: (id: number) => client.delete(`/workspaces/${id}`),
};
