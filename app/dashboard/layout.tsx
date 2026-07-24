'use client'
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { LogOut, GalleryVerticalEnd, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const { user, logout, fetchMe, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && !user) {
      fetchMe();
    }
  }, [isAuthenticated, user, fetchMe]);

  const handleLogout = async () => {
    try {
      const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
      if (refreshToken) {
        await authApi.logout(refreshToken).catch(() => {});
      }
    } finally {
      logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-500 text-white shadow-md shadow-blue-500/20">
            <GalleryVerticalEnd className="size-5" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Team Workspace
          </span>
        </div>

        <InputGroup className="w-full max-w-md h-9 bg-slate-100/80 dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-none">
          <InputGroupAddon align="inline-start" className="pl-3 text-slate-400 dark:text-slate-500">
            <Search className="size-4" />
          </InputGroupAddon>
          <InputGroupInput 
            type="text" 
            placeholder="Tìm kiếm dự án, công việc, thành viên..." 
            className="h-full text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100" 
          />
          <InputGroupAddon align="inline-end" className="pr-2.5">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-1.5 font-mono text-[10px] font-medium text-slate-400 dark:text-slate-500 shadow-xs">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </InputGroupAddon>
        </InputGroup>

        <div className="flex items-center gap-4">
          {user && (
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200">
              <div className="size-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                {user.fullName ? user.fullName[0] : "U"}
              </div>
              <span>{user.fullName || user.email}</span>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-colors"
          >
            <LogOut className="size-4" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
