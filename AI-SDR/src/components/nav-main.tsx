"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function NavMain({
  items,
  label,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    children?: {
      title: string
      url: string
      icon?: Icon
    }[]
  }[]
  label?: string
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className="p-1">
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-0.5">
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const isActive =
              item.url === "/"
                ? pathname === "/"
                : pathname === item.url || pathname.startsWith(`${item.url}/`)

            // If item has children, render as collapsible
            if (item.children && item.children.length > 0) {
              const hasActiveChild = item.children.some(
                (child) => pathname === child.url || pathname.startsWith(`${child.url}/`)
              )
              const isOpen = hasActiveChild || isActive

              return (
                <Collapsible key={item.title} asChild defaultOpen={isOpen}>
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isActive || hasActiveChild}
                        className={`h-8 px-3 text-sm font-medium ${
                          isActive || hasActiveChild 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-muted/50"
                        }`}
                      >
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span className="flex-1 text-left">{item.title}</span>
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub className="ml-2 mt-1 space-y-0.5 border-l border-border/50 pl-3">
                        {item.children.map((child) => {
                          const isChildActive = pathname === child.url || pathname.startsWith(`${child.url}/`)
                          return (
                            <SidebarMenuSubItem key={child.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isChildActive}
                                size="sm"
                                className={`h-7 px-3 text-xs transition-colors ${
                                  isChildActive 
                                    ? "bg-primary/10 text-primary font-medium" 
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                                }`}
                              >
                                <Link href={child.url} className="flex items-center gap-2">
                                  {child.icon && <child.icon className="h-3.5 w-3.5" />}
                                  <span>{child.title}</span>
                                </Link>
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

            // Regular item without children
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  size="default"
                  className={`h-9 px-3 text-sm font-medium ${isActive ? "bg-primary text-primary-foreground" : ""}`}
                >
                  <Link href={item.url}>
                    {item.icon && <item.icon className="h-5 w-5" />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
