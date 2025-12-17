"use client";

import * as React from "react";
import Image from "next/image";
import {
  IconAdjustments,
  IconBrain,
  IconCalendar,
  IconDatabase,
  IconHome,
  IconMessage,
  IconRocket,
  IconSearch,
  IconSettings,
  IconTarget,
  IconUsers,
} from "@tabler/icons-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Alex Morgan",
    email: "alex.morgan@company.com",
    avatar: "/avatars/user.jpg",
  },
  navExecution: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconHome,
    },
    {
      title: "Leads",
      url: "/leads",
      icon: IconUsers,
    },
    {
      title: "Research & ICP",
      url: "/research",
      icon: IconSearch,
    },
    {
      title: "Outreach Engine",
      url: "/outreach",
      icon: IconRocket,
    },
    {
      title: "Conversations",
      url: "/conversations",
      icon: IconMessage,
    },
    {
      title: "Meetings & Handoffs",
      url: "/meetings",
      icon: IconCalendar,
    },
  ],
  navSystem: [
    {
      title: "Setup",
      url: "/setup",
      icon: IconAdjustments,
    },
    {
      title: "CRM Sync",
      url: "/crm-sync",
      icon: IconDatabase,
    },
    {
      title: "Integrations",
      url: "/integrations",
      icon: IconDatabase,
    },
  ],
  navAI: [
    {
      title: "Qualification",
      url: "/qualification",
      icon: IconTarget,
    },
    {
      title: "Workflow",
      url: "/workflow",
      icon: IconTarget,
    },
    {
      title: "Learning Loop",
      url: "/learning",
      icon: IconBrain,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: IconSettings,
    },
  ],
};

export function JazonSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {state === "collapsed" ? (
          <div className="flex items-center justify-center">
            <SidebarTrigger />
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg overflow-hidden bg-card">
                    <Image
                      src="/lyzr_logo.png"
                      alt="Jazon AI SDR"
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-base font-semibold">Jazon AI SDR</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarTrigger className="ml-2" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navExecution} />
        <NavMain items={data.navSystem} label="System Configuration" />
        <NavMain items={data.navAI} label="AI Intelligence" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
