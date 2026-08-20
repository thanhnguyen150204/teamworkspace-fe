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
            const currentActive = get().activeWorkspace;
            const activeStillExists = currentActive ? data.some((w) => w.id === currentActive.id) : false;

            if (data.length > 0) {
                const nextActive = activeStillExists ? currentActive : data[0];
                set({ workspaces: data, activeWorkspace: nextActive, isLoading: false });
                if (!activeStillExists) {
                    await get().setActiveWorkspace(data[0]);
                }
            } else {
                set({
                    workspaces: [],
                    activeWorkspace: null,
                    projects: [],
                    activeProject: null,
                    myRole: null,
                    loadedProjectsWorkspaceId: null,
                    loadedRoleWorkspaceId: null,
                    isLoading: false,
                });
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
            let user = useAuthStore.getState().user;

            // If user hasn't loaded yet, try fetching it first
            if (!user) {
                await useAuthStore.getState().fetchMe();
                user = useAuthStore.getState().user;
            }

            if (!user) {
                set({ myRole: null, loadedRoleWorkspaceId: null });
                return;
            }

            const members = await memberApi.getAll(workspaceId) as any[];
            const myMembership = members.find(
                (m: any) => m.userId === user!.id
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