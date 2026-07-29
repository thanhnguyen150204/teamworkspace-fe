'use client'
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { LogOut, GalleryVerticalEnd, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";

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
        await authApi.logout(refreshToken).catch(() => { });
      }
    } finally {
      logout();
      toast.success("Logged out successfully");
      router.push("/auth/login");
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Top Header */}
        <header className="sticky top-0 z-40 w-full border-b border-teal-500/30 bg-gradient-to-r from-teal-700 via-cyan-700 to-emerald-700 text-white backdrop-blur-md px-5 py-2.5 flex items-center justify-between shadow-md shadow-teal-900/10">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-white hover:bg-white/20 hover:text-white" />
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4 bg-white/30" />
            <div className="flex size-8 items-center justify-center rounded-lg bg-white/20 text-white shadow-xs backdrop-blur-md">
              <GalleryVerticalEnd className="size-4" />
            </div>
            <span className="font-extrabold text-base text-white tracking-tight drop-shadow-xs">
              Team Workspace
            </span>
          </div>

          <InputGroup className="w-full max-w-md h-9 bg-white/15 border-white/25 text-white rounded-xl focus-within:ring-2 focus-within:ring-white/40 transition-all shadow-none">
            <InputGroupAddon align="inline-start" className="pl-3 text-cyan-100">
              <Search className="size-4" />
            </InputGroupAddon>
            <InputGroupInput
              type="text"
              placeholder="Search projects, tasks, members..."
              className="h-full text-sm placeholder:text-cyan-100/80 text-white"
            />
            <InputGroupAddon align="inline-end" className="pr-2.5">
              <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-white/30 bg-white/20 px-1.5 font-mono text-[10px] font-medium text-white shadow-xs">
                <span className="text-[11px]">⌘</span>K
              </kbd>
            </InputGroupAddon>
          </InputGroup>

          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-sm font-semibold text-white shadow-xs">
                <div className="size-6 rounded-full bg-white text-teal-700 flex items-center justify-center text-xs font-extrabold uppercase">
                  {user.fullName ? user.fullName[0] : "U"}
                </div>
                <span>{user.fullName || user.email}</span>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 bg-white/10 hover:bg-rose-500/80 text-white border-white/30 hover:border-transparent transition-colors shadow-xs"
            >
              <LogOut className="size-4" />
              <span>Log out</span>
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-emerald-100/50 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950 min-h-[calc(100vh-57px)]">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
