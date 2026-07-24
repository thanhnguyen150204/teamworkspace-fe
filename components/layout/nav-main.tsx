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
import { useRouter } from "next/router"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url || pathname.startsWith(item.url + '/')
          return(
          <Collapsible key={item.title} defaultOpen={item.isActive || isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={item.title}
                onClick={() => router.push(item.url)}
                className={isActive ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-medium" : ""}
              >
                <item.icon className={isActive ? "text-blue-600 dark:text-blue-400" : ""} />
                <span>{item.title}</span>
              </SidebarMenuButton>
              {item.items?.length ? (
                <>
                  <CollapsibleTrigger
                    render={
                      <SidebarMenuAction className="data-[state=open]:rotate-90" />
                    }
                  >
                    <ChevronRight />
                    <span className="sr-only">Toggle</span>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const isSubActive = pathname === subItem.url
                        return(
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            onClick={() => router.push(subItem.url)}
                            className={isSubActive ? "text-blue-700 dark:text-blue-300 font-medium" : ""}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                  })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        )
      })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
