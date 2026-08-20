import client from "./client";
import { User, UpdateUserDto } from "@/types/user";

export const usersApi = {
    getMe: () => client.get<any, User>('/users/me'),
    getAll: () => client.get<any, User[]>('/users'),
    getOne: (id: number) => client.get<any, User>(`/users/${id}`),
    create: (data: { fullName: string; email: string; password?: string }) => client.post<any, User>('/users', data),
    update: (id: number, data: UpdateUserDto) => client.patch<any, User>('/users/me', data),
    updateProfile: (data: { fullName?: string }) => client.patch<any, User>('/users/me', data),
    changePassword: (data: { currentPassword?: string; password?: string; newPassword: string }) => 
        client.patch<any, any>('/users/me/password', {
            currentPassword: data.currentPassword || data.password,
            newPassword: data.newPassword,
        }),
    updateAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return client.patch('/users/me/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id: number) => client.delete('/users/me'),
    deleteMe: () => client.delete('/users/me'),
};
