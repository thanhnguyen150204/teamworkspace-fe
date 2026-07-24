"use client"

import * as React from "react"
import {
  Activity,
  BookOpen,
  Bot,
  Building2,
  ChevronDown,
  Command,
  FolderKanban,
  Frame,
  LayoutDashboard,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings,
  Settings2,
  SquareTerminal,
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
import { useRouter } from "next/router"
import { useParams } from "next/navigation"
import { useAuthStore } from "@/stores/auth-store"
import { useWorkspaceStore } from "@/stores/workspace-store"
import { usePermission } from "@/hook/use-permission"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const params = useParams();
  const {user} = useAuthStore();
  const { workspaces, activeWorkspace, projects, fetchWorkspaces, setActiveWorkspace} = useWorkspaceStore()
  const { canAccessSettings} = usePermission()
  const workspaceId  = params?.workspaceId ? Number(params.workspaceId) : activeWorkspace?.id

  React.useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  const navMain = workspaceId ? [
    {
      title: "Overview",
      url: `/dashboard/workspace/${workspaceId}`,
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Projects",
      url: `/dashboard/workspace/${workspaceId}/projects`,
      icon: FolderKanban,
      isActive: false,
      items: projects.map(p =>({
        title: p.name,
        url: `/dashboard/workspace/${workspaceId}/project/${p.id}`,
      })),
    },
    {
      title: "Members",
      url: `/dashboard/workspace/${workspaceId}/members`,
      icon: Users,
    },
    {
      title: "Activity",
      url: `/dashboard/workspace/${workspaceId}/activity`,
      icon: Activity,
    },
    ...(canAccessSettings ? [{
      title: "Settings",
      url: `/dashboard/workspace/${workspaceId}/settings`,
      icon: Settings,
    }]: []),
  ]: []
  const navSecondary = [
    { title: "Support", url: "#", icon: LifeBuoy},
    { title: "Feedback", url: "#", icon: Send},
  ]
  const userDate = user ? {
    name: user.fullName,
    email: user.email,
    avatar: user.avatar || "",
  } : {
    name: "User",
    email: "",
    avatar: "",
  }
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<a href="#" />}>
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <Building2 className="size-4"/>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {activeWorkspace?.name || "Chọn Workspace"}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {activeWorkspace?.description || "Team Workspace"}
                </span>
              </div>
              <ChevronDown className="ml-auto size-4 text-muted-foreground" />

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
