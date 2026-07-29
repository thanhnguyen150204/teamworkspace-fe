"use client"

import * as React from "react"
import {
  Activity,
  Building2,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  Send,
  Settings,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/layout/nav-main"
import { NavProjects } from "@/components/layout/nav-projects"
import { NavSecondary } from "@/components/layout/nav-secondary"
import { NavUser } from "@/components/layout/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter, useParams } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { usePermission } from "@/hook/use-permission"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const params = useParams();
  const {user} = useAuthStore();
  const { workspaces, activeWorkspace, projects, fetchWorkspaces, setActiveWorkspace} = useWorkspaceStore()
  const { canAccessSettings} = usePermission()
  const workspaceId  = params?.workspaceId ? Number(params.workspaceId) : activeWorkspace?.id

  React.useEffect(() => {
    fetchWorkspaces()
  }, [])

  React.useEffect(() => {
    if (params?.workspaceId && workspaces.length > 0) {
      const wsId = Number(params.workspaceId)
      if (!activeWorkspace || activeWorkspace.id !== wsId) {
        const ws = workspaces.find(w => w.id === wsId)
        if (ws) {
          setActiveWorkspace(ws)
        }
      }
    }
  }, [params?.workspaceId, workspaces, activeWorkspace, setActiveWorkspace])

  const currentWorkspaceId = params?.workspaceId
    ? Number(params.workspaceId)
    : activeWorkspace?.id

  const navMain = [
    {
      title: "Workspaces",
      url: "/dashboard",
      icon: Building2,
    },
    ...(currentWorkspaceId ? [
      {
        title: "Overview",
        url: `/dashboard/workspace/${currentWorkspaceId}`,
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: `/dashboard/workspace/${currentWorkspaceId}/projects`,
        icon: FolderKanban,
        items: projects.map(p => ({
          title: p.name,
          url: `/dashboard/workspace/${currentWorkspaceId}/projects/${p.id}`,
        })),
      },
      {
        title: "Members",
        url: `/dashboard/workspace/${currentWorkspaceId}/members`,
        icon: Users,
      },
      {
        title: "Activity",
        url: `/dashboard/workspace/${currentWorkspaceId}/activity`,
        icon: Activity,
      },
      ...(canAccessSettings ? [{
        title: "Settings",
        url: `/dashboard/workspace/${currentWorkspaceId}/settings`,
        icon: Settings,
      }] : []),
    ] : [])
  ]
  const navSecondary = [
    { title: "Support", url: "#", icon: LifeBuoy},
    { title: "Feedback", url: "#", icon: Send},
  ]
  const userData = user ? {
    name: user.fullName,
    email: user.email,
    avatar: user.avatar || "",
  } : {
    name: "User",
    email: "",
    avatar: "",
  }
  return (
    <Sidebar
      variant="sidebar"
      className="[&_[data-sidebar=sidebar]]:!bg-gradient-to-b [&_[data-sidebar=sidebar]]:!from-teal-800 [&_[data-sidebar=sidebar]]:!via-cyan-900 [&_[data-sidebar=sidebar]]:!to-teal-950 [&_[data-sidebar=sidebar]]:!text-white border-r border-teal-700/40"
      {...props}
    >
      <SidebarHeader className="border-b border-teal-700/40 pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" onClick={() => router.push('/dashboard')} className="text-white hover:bg-white/10 hover:text-white cursor-pointer">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white/20 text-white shadow-xs backdrop-blur-md border border-white/20">
                <Building2 className="size-4"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-white">
                  {activeWorkspace?.name || "Select Workspace"}
                </span>
                <span className="truncate text-xs text-cyan-200/90">
                  {activeWorkspace?.description || "Team Workspace"}
                </span>
              </div>
              <ChevronDown className="ml-auto size-4 text-cyan-200" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="text-cyan-100">
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto text-cyan-200/90" />
      </SidebarContent>
      <SidebarFooter className="border-t border-teal-700/40">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
