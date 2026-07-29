import { usersApi } from "@/lib/api/users";
import { UpdateUserDto, User } from "@/types";
import { toast } from "sonner";
import { create } from "zustand";

interface UserState {
    users: User[];
    isLoading: boolean;
    activeUser: User | null;

    fetchUsers: () => Promise<void>;
    createUser: (data: { fullName: string, email: string, password?: string }) => Promise<void>;
    updateUser: (id: number, data: UpdateUserDto) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    setActiveUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
    users: [],
    isLoading: false,
    activeUser: null,

    fetchUsers: async () => {
        set({ isLoading: true });
        try {
            const users = await usersApi.getAll();
            set({ users, isLoading: false });
        } catch {
            toast.error("Not upload list user");
            set({ isLoading: false });
        }
    },
    createUser: async (data) => {
        try {
            const newUser = await usersApi.create(data);
            set((state) => ({ users: [newUser, ...state.users] }));
            toast.success("Create user successfully");
        }
        catch (err: any) {
            toast.error(err.response?.data?.message || "Error during create user");
            throw err;
        }
    },

    updateUser: async (id: number, data: UpdateUserDto) => {
        try {
            const updated = await usersApi.update(id, data);
            set((state) => ({
                users: state.users.map((u) => (u.id === id ? updated : u)),
                activeUser: state.activeUser?.id === id ? updated : state.activeUser,
            }));
            toast.success("Update information successfully");
        }
        catch {
            toast.error("Can't not update user");
        }
    },
    deleteUser: async (id: number) => {
        try {
            await usersApi.delete(id);
            set((state) => ({
                users: state.users.filter((u) => u.id !== id),
            }));
            toast.success("Delete user successfully");
        }
        catch {
            toast.error("Can't not delete user");
        }
    },
    setActiveUser: (user) => set({ activeUser: user }),
}));
