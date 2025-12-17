"use client"

import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Database, Link2, Phone, CalendarDays, Mail } from "lucide-react"

const integrationGroups = [
  {
    name: "Lead Sources",
    items: [
      {
        name: "Salesforce",
        status: "Connected (Demo)",
        permissions: "Read / Write",
        usedBy: "Lead ingestion, CRM Sync, Workflow",
      },
      {
        name: "HubSpot",
        status: "Connected (Demo)",
        permissions: "Read / Write",
        usedBy: "Lead ingestion, Nurture sequences",
      },
      {
        name: "CSV Upload",
        status: "Enabled (Setup)",
        permissions: "Write",
        usedBy: "Bulk lead imports from events",
      },
    ],
  },
  {
    name: "Research Providers",
    items: [
      {
        name: "LinkedIn",
        status: "Connected (Demo)",
        permissions: "Read",
        usedBy: "Company research, persona insights, triggers",
      },
      {
        name: "Perplexity",
        status: "Connected (Demo)",
        permissions: "Act (AI)",
        usedBy: "External context, industry research",
      },
      {
        name: "CRM Data",
        status: "Connected (Demo)",
        permissions: "Read",
        usedBy: "Historical activity, segments, pipelines",
      },
    ],
  },
  {
    name: "Outreach Channels",
    items: [
      {
        name: "Gmail",
        status: "Connected (Demo)",
        permissions: "Send / Log",
        usedBy: "Outbound email outreach",
      },
      {
        name: "LinkedIn Messaging",
        status: "Connected (Demo)",
        permissions: "Send / Log",
        usedBy: "Social outreach and engagement",
      },
      {
        name: "WhatsApp",
        status: "Connected (Demo)",
        permissions: "Send / Log",
        usedBy: "Regional messaging, follow-ups",
      },
      {
        name: "Phone (Voice)",
        status: "Connected (Demo)",
        permissions: "Call / Log",
        usedBy: "Voice qualification, objection handling",
      },
    ],
  },
  {
    name: "Scheduling",
    items: [
      {
        name: "Google Calendar",
        status: "Connected (Demo)",
        permissions: "Create / Update",
        usedBy: "Meeting booking and reminders",
      },
    ],
  },
]

export default function IntegrationsPage() {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 60)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <JazonSidebar variant="inset" />
      <SidebarInset>
        <JazonHeader />
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Integrations</h1>
              <p className="text-sm text-muted-foreground">
                Unified view of how Jazon connects to your systems across the SDR lifecycle.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    Data Plane Overview
                  </CardTitle>
                  <CardDescription>
                    All integrations in this demo are simulated but wired into the workflow and explainability.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    Lead sources feed Jazon&apos;s unified lead store, which is then enriched via research providers,
                    orchestrated through outreach channels, and synchronized back to CRM and calendars.
                  </p>
                  <p>
                    This page is designed for RevOps and IT to understand exactly where data flows and what Jazon is
                    allowed to do.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Link2 className="w-4 h-4" />
                    Connection Health
                  </CardTitle>
                  <CardDescription>High-level view of integration status.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lead Sources</p>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Research Providers</p>
                    <Badge variant="default">Healthy</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Outreach Channels</p>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Scheduling</p>
                    <Badge variant="default">Connected</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {integrationGroups.map((group) => (
              <Card key={group.name}>
                <CardHeader>
                  <CardTitle>{group.name}</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-3 md:grid-cols-2">
                  {group.items.map((item) => (
                    <div key={item.name} className="border rounded-lg p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm">{item.name}</p>
                        <Badge variant="default" className="text-xs">
                          {item.status}
                        </Badge>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <p>
                          <span className="font-medium text-foreground">Permissions:</span> {item.permissions}
                        </p>
                        <p>
                          <span className="font-medium text-foreground">Used by:</span> {item.usedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

