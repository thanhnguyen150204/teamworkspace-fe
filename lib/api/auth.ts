import client from "./client";
import { LoginRequest, LoginResponse, RegisterRequest, RefreshResponse } from "@/types/auth";
import { User } from "@/types/user";
import axios from "axios";

export const authApi = {
    register: (data: RegisterRequest) => client.post<User, any>('/auth/register', data),
    login: (data: LoginRequest) => client.post<LoginResponse, any>('/auth/login', data),
    refresh: (refreshToken: string) =>
        axios.post<{ data: RefreshResponse }>(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
            { refresh_token: refreshToken }
        ),
    logout: (refreshToken: string) => client.post('/auth/logout', { refresh_token: refreshToken }),
};
