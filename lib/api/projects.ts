import client from "./client";
import { CreateProjectDto, Project, UpdateProjectDto } from "@/types/project";

export const projectApi = {
    getAll: (workspaceId: number) => client.get<any, Project[]>(`/workspaces/${workspaceId}/projects`),
    getOne: (workspaceId: number, projectId: number) => client.get<any, Project>(`/workspaces/${workspaceId}/projects/${projectId}`),
    create: (workspaceId: number, data: CreateProjectDto) => client.post<any, Project>(`/workspaces/${workspaceId}/projects`, data),
    update: (workspaceId: number, projectId: number, data: UpdateProjectDto) => client.patch<any, Project>(`/workspaces/${workspaceId}/projects/${projectId}`, data),
    delete: (workspaceId: number, projectId: number) => client.delete<any, void>(`/workspaces/${workspaceId}/projects/${projectId}`),
};
