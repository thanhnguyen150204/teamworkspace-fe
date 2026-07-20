export interface ApiResponse<T> {
    success:boolean;
    statusCode: number;
    data: T;
    timestamp: string;
} 
export interface ApiError{
    success: false;
    statusCode: number;
    message: string | string[];
    path: string;
    timestamp: string;
}

