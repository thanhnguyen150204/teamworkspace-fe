import { Workspace } from '@/types/workspace';
import { Project } from '@/types/project';
import { create } from 'zustand';
import { workspaceApi } from '@/lib/api/workspaces';
import { projectApi } from '@/lib/api/projects';
import { WorkspaceRole } from '@/types';
import { memberApi } from '@/lib/api/members';
import { useAuthStore } from './auth-store';
interface WorkspaceState {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    projects: Project[];
    activeProject: Project | null;
    isLoading: boolean;
    myRole: WorkspaceRole | null;
    loadedProjectsWorkspaceId: number | null;
    loadedRoleWorkspaceId: number | null;
    fetchWorkspaces: (force?: boolean) => Promise<void>;
    setActiveWorkspace: (workspace: Workspace) => Promise<void>;
    fetchProjects: (workspaceId: number, force?: boolean) => Promise<void>;
    setActiveProject: (project: Project | null) => void;
    fetchMyRole: (workspaceId: number, force?: boolean) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    workspaces: [],
    activeWorkspace: null,
    projects: [],
    activeProject: null,
    isLoading: false,
    myRole: null,
    loadedProjectsWorkspaceId: null,
    loadedRoleWorkspaceId: null,
    
    fetchWorkspaces: async (force = false) => {
        if (!force && get().workspaces.length > 0) {
            return;
        }
        set({ isLoading: true });
        try {
            const data = await workspaceApi.getAll();
            set({ workspaces: data, isLoading: false });
            if (data.length > 0 && !get().activeWorkspace) {
                await get().setActiveWorkspace(data[0]);
            }
        } catch {
            set({ isLoading: false });
        }
    },
    setActiveWorkspace: async (workspace) => {
        const currentActive = get().activeWorkspace;
        if (currentActive?.id !== workspace.id) {
            set({ activeWorkspace: workspace, activeProject: null });
        }
        await Promise.all([ 
            get().fetchProjects(workspace.id),
            get().fetchMyRole(workspace.id),
        ]);
    },

    fetchProjects: async (workspaceId, force = false) => {
        if (!force && get().loadedProjectsWorkspaceId === workspaceId && get().projects.length > 0) {
            return;
        }
        try {
            const projects = await projectApi.getAll(workspaceId);
            set({ projects, loadedProjectsWorkspaceId: workspaceId });
        } catch {
            set({ projects: [], loadedProjectsWorkspaceId: null });
        }
    },
    setActiveProject: (project) => {
        set({ activeProject: project });
    },

    fetchMyRole: async (workspaceId, force = false) => {
        if (!force && get().loadedRoleWorkspaceId === workspaceId && get().myRole !== null) {
            return;
        }
        try {
            const members = await memberApi.getAll(workspaceId) as any[];
            const user = useAuthStore.getState().user;
            if(!user){
                set({ myRole: null, loadedRoleWorkspaceId: null });
                return;
            }
            const myMembership = members.find(
                (m: any) => m.userId === user.id
            );
            set({ 
                myRole: (myMembership?.role as WorkspaceRole) || null,
                loadedRoleWorkspaceId: workspaceId,
            });

        } catch {
            set({ myRole: null, loadedRoleWorkspaceId: null });
        }
    },

}));