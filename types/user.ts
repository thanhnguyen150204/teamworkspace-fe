export interface User{
    id: number;
    fullName: string;
    email: string;
    avatar: string | null;
    isActive: boolean;
    lastLoginAt: string | null;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface UpdateUserDto {
    fullName?: string;
    email?: string;
    password?: string;
}