export interface RefreshToken {
    id: number;
    token: string;
    userId: number;
    expiresAt: string;
    revoked: boolean;
    createdAt: string;
}