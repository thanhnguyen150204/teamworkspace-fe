'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { useAuthStore } from "@/stores/auth-store"
import {
  Building2, Plus, ArrowRight, Calendar, Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Workspace } from "@/types/workspace"
import { CreateWorkspaceDialog } from "@/components/features/workspace/create-workspace-dialog"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthStore()
  const { workspaces, fetchWorkspaces, setActiveWorkspace } = useWorkspaceStore()
  const [isLoading, setIsLoading] = useState(true)
  const [openCreate, setOpenCreate] = useState(false)

  useEffect(() => {
    fetchWorkspaces().finally(() => setIsLoading(false))
  }, [fetchWorkspaces])

  const handleSelectWorkspace = async (ws: Workspace) => {
    await setActiveWorkspace(ws)
    router.push(`/dashboard/workspace/${ws.id}`)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-indigo-600/5 to-purple-600/5" />
        <div className="absolute -top-40 -right-40 size-96 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 size-96 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-5 text-blue-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Hello, {user?.fullName || "User"}!
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Choose <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Workspace</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl">
            Manage your projects, tasks, and collaborate with your team efficiently.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Your Workspace ({workspaces.length})
          </h2>
          <Button
            onClick={() => setOpenCreate(true)}
            className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40"
          >
            <Plus className="size-4" />
            Create Workspace
          </Button>
        </div>
        
        {/* Workspace Cards */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 mb-6">
              <Building2 className="size-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">No Workspace Found</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
              Create your first workspace to get started.
            </p>
            <Button onClick={() => setOpenCreate(true)}
              className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <Plus className="size-4" /> Create First Workspace
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <button key={ws.id} onClick={() => handleSelectWorkspace(ws)}
                className="group text-left p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-shadow">
                    <Building2 className="size-6" />
                  </div>
                  <ArrowRight className="size-5 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {ws.name}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">
                  {ws.description || "Không có mô tả"}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="size-3.5" />
                    {new Date(ws.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <CreateWorkspaceDialog
        open={openCreate}
        onOpenChange={setOpenCreate}
        onSuccess={() => fetchWorkspaces()}
      />
    </div>
  )
}
