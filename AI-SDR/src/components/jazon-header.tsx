"use client"

import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export function JazonHeader() {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-card px-4">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <span className="text-sm font-medium">Production Workspace</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Production Workspace
                <Badge variant="secondary" className="ml-2">Active</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem>Development Workspace</DropdownMenuItem>
              <DropdownMenuItem>Sandbox Workspace</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <div className="p-3 text-sm border-b hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="font-medium">High-value lead qualified</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Sarah Chen (Accenture) escalated to voice qualification
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 text-sm border-b hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-chart-2" />
                    <div className="flex-1">
                      <p className="font-medium">Meeting scheduled</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lisa Park (NTT Data) - Tomorrow at 2:00 PM
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-3 text-sm hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 mt-1.5 rounded-full bg-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">Weekly learning summary ready</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        5 new insights from last week&apos;s activities
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

