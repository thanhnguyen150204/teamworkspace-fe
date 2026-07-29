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
    fetchWorkspaces: () => Promise<void>;
    setActiveWorkspace: (workspace: Workspace) => Promise<void>;
    fetchProjects: (workspaceId: number) => Promise<void>;
    setActiveProject: (project: Project | null) => void;
    fetchMyRole: (workspaceId: number) => Promise<void>;
}



export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    workspaces: [],
    activeWorkspace: null,
    projects: [],
    activeProject: null,
    isLoading: false,
    myRole: null,
    fetchWorkspaces: async () => {
        set({ isLoading: true });
        try {
            const data = await workspaceApi.getAll();
            set({ workspaces: data, isLoading: false });
            if (data.length > 0 && !get().activeWorkspace) {
                get().setActiveWorkspace(data[0]);
            }
        } catch {
            set({ isLoading: false });
        }
    },
    setActiveWorkspace: async (workspace) => {
        set({ activeWorkspace: workspace, activeProject: null });
        await Promise.all([ 
        get().fetchProjects(workspace.id),
        get().fetchMyRole(workspace.id),
        ]);
    },

    fetchProjects: async (workspaceId) => {
        try {
            const projects = await projectApi.getAll(workspaceId);
            set({ projects });
        } catch {
            set({ projects: [] });
        }
    },
    setActiveProject: (project) => {
        set({ activeProject: project });
    },

    fetchMyRole: async (workspaceId) => {
        try{
            const members = await memberApi.getAll(workspaceId) as any[];
            const user = useAuthStore.getState().user;
            if(!user){
                set({ myRole: null});
                return;
            }
            const myMembership = members.find(
                (m: any) => m.userId === user.id
            );
            set({ myRole : (myMembership?.role as WorkspaceRole)|| null});

        } catch{
            set({ myRole : null});
        }
    },

}));