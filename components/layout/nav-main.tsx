"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { useRouter, usePathname } from "next/navigation"

import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  url: string
  icon: LucideIcon
  isActive?: boolean
  items?: {
    title: string
    url: string
  }[]
}

function NavItemRow({ item, pathname, router }: { item: NavItem; pathname: string; router: ReturnType<typeof useRouter> }) {
  const isExactActive = item.url === "/dashboard"
    ? pathname === "/dashboard"
    : pathname === item.url

  const isChildRoute = item.url !== "/dashboard" && pathname.startsWith(item.url + '/')
  const hasSubItems = Boolean(item.items?.length)

  const isAnySubActive = hasSubItems && item.items?.some((sub) => pathname === sub.url || pathname.startsWith(sub.url + '/'))

  const [open, setOpen] = useState(Boolean(item.isActive || isExactActive || isChildRoute))

  useEffect(() => {
    if (isExactActive || isChildRoute) {
      setOpen(true)
    }
  }, [isExactActive, isChildRoute])

  if (!hasSubItems) {
    const isActive = isExactActive || isChildRoute
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          onClick={() => router.push(item.url)}
          className={cn(
            "cursor-pointer transition-all duration-150",
            isActive
              ? "bg-white/25 text-white font-bold shadow-2xs border border-white/20"
              : "text-cyan-100/90 hover:bg-white/10 hover:text-white"
          )}
        >
          <item.icon className={isActive ? "text-white" : "text-cyan-200"} />
          <span>{item.title}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    )
  }

  // Parent with subitems: only highlight parent box if user is at exact parent URL (not viewing subproject)
  const isParentBoxHighlighted = isExactActive && !isAnySubActive

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        <SidebarMenuButton
          tooltip={item.title}
          onClick={() => router.push(item.url)}
          className={cn(
            "cursor-pointer transition-all duration-150",
            isParentBoxHighlighted
              ? "bg-white/25 text-white font-bold shadow-2xs border border-white/20"
              : isAnySubActive
              ? "text-white font-semibold hover:bg-white/10"
              : "text-cyan-100/90 hover:bg-white/10 hover:text-white"
          )}
        >
          <item.icon className={isParentBoxHighlighted || isAnySubActive ? "text-white" : "text-cyan-200"} />
          <span>{item.title}</span>
        </SidebarMenuButton>
        <CollapsibleTrigger
          render={
            <SidebarMenuAction className="cursor-pointer text-cyan-200 hover:text-white hover:bg-white/10 data-[state=open]:rotate-90" />
          }
        >
          <ChevronRight />
          <span className="sr-only">Toggle</span>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => {
              const isSubActive = pathname === subItem.url || pathname.startsWith(subItem.url + '/')
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    onClick={() => router.push(subItem.url)}
                    className={cn(
                      "cursor-pointer transition-all duration-150",
                      isSubActive
                        ? "bg-white/25 text-white font-bold shadow-2xs border border-white/20"
                        : "text-cyan-100/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span>{subItem.title}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarMenu>
        {items.map((item) => (
          <NavItemRow key={item.title} item={item} pathname={pathname} router={router} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
