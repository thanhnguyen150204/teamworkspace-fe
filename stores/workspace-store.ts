import {Workspace} from '@/types/workspace';
import { Project } from '@/types/project';
import { create } from 'zustand';
import { workspaceApi } from '@/lib/api/workspaces';
import { projectApi } from '@/lib/api/projects';
interface WorkspaceState {
    workspaces: Workspace[];
    activeWorkspace: Workspace | null;
    projects : Project[];
    activeProject: Project | null;
    isLoading: boolean;
    fetchWorkspaces: () => Promise<void>;
    setActiveWorkspace: (workspace: Workspace ) => Promise<void>;
    fetchProjects: (workspaceId: number) => Promise<void>;
    setActiveProject: (project: Project | null) => void;
}


export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
    workspaces: [],
    activeWorkspace: null,
    projects: [],
    activeProject: null,
    isLoading: false,
    fetchWorkspaces: async() =>{
        set({ isLoading : true});
        try{
            const data = await workspaceApi.getAll();
            set({workspaces : data, isLoading: false});
            if(data.length > 0 && !get().activeWorkspace){
                get().setActiveWorkspace(data[0]);
            }
        }catch{
            set({ isLoading : false});
        }
    },
    setActiveWorkspace: async (workspace) => {
        set({ activeWorkspace: workspace, activeProject: null});
        await get().fetchProjects(workspace.id);
    },

    fetchProjects: async (workspaceId) => {
        try{
            const projects = await projectApi.getAll(workspaceId);
            set({projects});
        } catch{
            set({ projects: [] });
        }
    },
    setActiveProject: (project) => {
        set({ activeProject: project });
    },
}));