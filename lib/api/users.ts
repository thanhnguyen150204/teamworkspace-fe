import client from "./client";
import { User, UpdateUserDto } from "@/types/user";

export const usersApi = {
    getMe: () => client.get<any, User>('/users/me'),
    getAll: () => client.get<any, User[]>('/users'),
    getOne: (id: number) => client.get<any, User>(`/users/${id}`),
    create: (data: { fullName: string; email: string; password?: string }) => client.post<any, User>('/users', data),
    update: (id: number, data: UpdateUserDto) => client.patch<any, User>(`/users/${id}`, data),
    updateAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return client.patch('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id: number) => client.delete(`/users/${id}`),
};
