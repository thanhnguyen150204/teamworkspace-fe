'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { usePermission } from "@/hook/use-permission"
import { activityApi } from "@/lib/api/activity"
import { memberApi } from "@/lib/api/members"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { Activity, Membership } from "@/types"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  FolderKanban, Users, Activity as ActivityIcon,
  Clock, TrendingUp, Settings,
} from "lucide-react"
import { ProjectList } from "@/components/features/project/project-list"

export default function WorkspacePage() {
  const params = useParams()
  const router = useRouter()
  const workspaceId = Number(params.workspaceId)
  const { activeWorkspace, projects, fetchProjects, setActiveWorkspace, workspaces, fetchWorkspaces, fetchMyRole } = useWorkspaceStore()
  const { canAccessSettings } = usePermission()
  const [activities, setActivities] = useState<Activity[]>([])
  const [members, setMembers] = useState<Membership[]>([])

  useEffect(() => {
    const init = async () => {
      try {
        if (!activeWorkspace || activeWorkspace.id !== workspaceId) {
          if (workspaces.length === 0) await fetchWorkspaces()
          const ws = workspaces.find(w => w.id === workspaceId)
          if (ws) await setActiveWorkspace(ws)
        }
        await fetchMyRole(workspaceId)
        await fetchProjects(workspaceId)
        const [acts, mems] = await Promise.all([
          activityApi.getWorkspaceActivity(workspaceId).catch(() => []),
          memberApi.getAll(workspaceId).catch(() => []),
        ])
        setActivities(acts as Activity[])
        setMembers(mems as Membership[])
      } catch (err) {
        console.error(err)
      }
    }
    if (workspaceId) init()
  }, [workspaceId, fetchProjects, fetchWorkspaces, fetchMyRole, setActiveWorkspace, activeWorkspace, workspaces])

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderKanban, color: "from-blue-500 to-blue-600", shadowColor: "shadow-blue-500/20" },
    { label: "Members", value: members.length, icon: Users, color: "from-indigo-500 to-indigo-600", shadowColor: "shadow-indigo-500/20" },
    { label: "Activities", value: activities.length, icon: ActivityIcon, color: "from-sky-500 to-sky-600", shadowColor: "shadow-sky-500/20" },
  ]

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{activeWorkspace?.name || "Workspace"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-8 text-white shadow-xl shadow-blue-600/20">
        <div className="absolute -top-20 -right-20 size-64 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{activeWorkspace?.name || "Workspace"}</h1>
            <p className="text-blue-100/80 max-w-lg">
              {activeWorkspace?.description || "Quản lý dự án và cộng tác cùng đội nhóm."}
            </p>
          </div>
          {canAccessSettings && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/workspace/${workspaceId}/settings`)}
              className="gap-1.5 border-white/30 text-white hover:bg-white/20 hover:text-white bg-white/10 backdrop-blur-sm"
            >
              <Settings className="size-4" /> Settings
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="group p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${stat.color} text-white shadow-md ${stat.shadowColor}`}>
                <stat.icon className="size-5" />
              </div>
              <TrendingUp className="size-4 text-green-500" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Projects + Recent Activities */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <ProjectList
            workspaceId={workspaceId}
            projects={projects}
            onRefresh={() => fetchProjects(workspaceId)}
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <div className="text-center py-8 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Clock className="size-8 mx-auto text-slate-400 mb-2" />
                <p className="text-sm text-slate-500">No activities yet</p>
              </div>
            ) : activities.slice(0, 8).map((act) => (
              <div key={act.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex size-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold">
                    {act.action[0]}
                  </span>
                  <span className="font-medium capitalize">{act.action.toLowerCase()}</span>
                  <span className="text-slate-400 text-xs">{act.entityType.toLowerCase()}</span>
                </div>
                {act.description && <p className="text-xs text-slate-500 ml-8">{act.description}</p>}
                <p className="text-xs text-slate-400 ml-8 mt-1">{new Date(act.createdAt).toLocaleString('vi-VN')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
