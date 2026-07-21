import client from "./client";
import { User, UpdateUserDto } from "@/types/user";

export const userApi = {
    getProfile: () => client.get<User>('/users/me'),
    getAll: () => client.get<User[]>('/users'),
    getOne: (id: number) => client.get<User>(`/users/${id}`),
    update: (id: number, data: UpdateUserDto) => client.patch<User>(`/users/${id}`, data),
    updateAvatar: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return client.patch('/users/avatar', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },
    delete: (id: number) => client.delete(`/users/${id}`),
};
