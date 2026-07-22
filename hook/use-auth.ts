'use client';
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth(){
    const {user, isAuthenticated, isLoading, fetchMe, logout} = useAuthStore();
    useEffect(() => {
        if(isAuthenticated && !user){
            fetchMe();
        }
    }, [isAuthenticated, user, fetchMe]);
    return { user, isAuthenticated, isLoading, logout};
}