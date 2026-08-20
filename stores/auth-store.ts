import { create } from 'zustand';
import { User } from '@/types/user';
import { usersApi } from '@/lib/api/users';
import { setCookie, deleteCookie } from '@/lib/cookies';
import { useWorkspaceStore } from './workspace-store';
import { useTaskStore } from './task-store';
import { disconnectSocket } from '@/lib/socket';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  fetchMe: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('access_token'): null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token'): false,
  isLoading: false,
  setAuth: (user, token, refreshToken) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    setCookie('access_token', token);
    set({ user, accessToken: token, isAuthenticated: true, isLoading: false });
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    deleteCookie('access_token');
    set({ user: null, accessToken: null, isAuthenticated: false, isLoading: false });
    // Disconnect WebSocket so the stale JWT is not reused on next login
    disconnectSocket();
    useWorkspaceStore.setState({
      workspaces: [],
      activeWorkspace: null,
      projects: [],
      activeProject: null,
      myRole: null,
      loadedProjectsWorkspaceId: null,
      isLoading: false,
    });
    useTaskStore.setState({
      tasks: [],
      kanban: null,
      activeTask: null,
      isLoading: false,
    });
  },
  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const user = await usersApi.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      deleteCookie('access_token');
    }
  },
}));