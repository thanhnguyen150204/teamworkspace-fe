'use client'
import { useAuthStore } from "@/stores/auth-store";
import { Button } from "@/components/ui/button";
import { LogOut, User, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

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
    <div className="max-w-4xl mx-auto p-6 md:p-10 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.fullName || "User"}! 👋
          </h1>
          <p className="text-blue-100 text-sm">
            You are successfully authenticated and in your workspace dashboard.
          </p>
        </div>
        <Button
          onClick={handleLogout}
          variant="secondary"
          className="self-start md:self-auto gap-2 font-semibold text-blue-900 hover:bg-white"
        >
          <LogOut className="size-4" />
          Đăng xuất
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-900 dark:text-slate-100">
            <User className="size-5 text-blue-500" /> Account Info
          </h2>
          <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-900 dark:text-slate-100">Full Name</span>
              <span>{user?.fullName || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800">
              <span className="font-medium text-slate-900 dark:text-slate-100">Email</span>
              <span>{user?.email || "N/A"}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-slate-900 dark:text-slate-100">Status</span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="size-4" /> Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
