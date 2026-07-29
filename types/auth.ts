export interface RegisterRequest{
    fullName: string;
    email: string;
    password: string;
}
export interface LoginRequest{
    email: string;
    password: string;
}
export interface LoginResponse{
    access_token: string;
    refresh_token: string;
    user:{
        id: number;
        email: string;
        fullName: string;
    }
}
export interface RefreshResponse{
    access_token: string;
}