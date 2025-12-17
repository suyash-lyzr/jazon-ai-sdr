"use client"

import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useJazonApp } from "@/context/jazon-app-context"
import { mockQualificationData, mockMeetings } from "@/lib/mock-data"
import { CheckCircle2, Clock, PhoneCall, CalendarCheck2, Database, BrainCircuit } from "lucide-react"

const workflowSteps = [
  "Lead Ingested",
  "Research Completed",
  "ICP Scored",
  "Outreach Started",
  "Qualification In Progress",
  "Voice Escalation (Conditional)",
  "Meeting Booked",
  "CRM Updated",
  "Learning Loop Updated",
] as const

export default function WorkflowPage() {
  const { leads, agentInstructions } = useJazonApp()
  const primaryLead = leads[0]
  const qualification = primaryLead ? mockQualificationData[primaryLead.id] : undefined
  const meeting = mockMeetings.find((m) => m.leadId === primaryLead?.id)

  const stepStatus = (step: (typeof workflowSteps)[number]) => {
    switch (step) {
      case "Lead Ingested":
        return "Completed"
      case "Research Completed":
      case "ICP Scored":
      case "Outreach Started":
      case "Qualification In Progress":
        return "Completed"
      case "Voice Escalation (Conditional)":
        return primaryLead?.channel.includes("Voice") ? "Completed" : "Skipped"
      case "Meeting Booked":
        return meeting ? "Completed" : "In Progress"
      case "CRM Updated":
      case "Learning Loop Updated":
        return "Completed"
      default:
        return "In Progress"
    }
  }

  const lastActionForStep = (step: (typeof workflowSteps)[number]) => {
    switch (step) {
      case "Lead Ingested":
        return primaryLead?.ingestedAt || "7 days ago"
      case "Research Completed":
        return "3 days ago"
      case "ICP Scored":
        return "3 days ago"
      case "Outreach Started":
        return "5 days ago"
      case "Qualification In Progress":
        return "2 hours ago"
      case "Voice Escalation (Conditional)":
        return primaryLead?.channel.includes("Voice") ? "2 hours ago" : "Not triggered"
      case "Meeting Booked":
        return meeting ? "Scheduled for " + meeting.scheduledFor : "Pending"
      case "CRM Updated":
        return "2 minutes ago"
      case "Learning Loop Updated":
        return "Yesterday"
      default:
        return "-"
    }
  }

  const explanationForStep = (step: (typeof workflowSteps)[number]) => {
    switch (step) {
      case "Lead Ingested":
        return "Lead entered Jazon via configured sources (Salesforce, HubSpot, or CSV upload)."
      case "Research Completed":
        return "Jazon enriched the lead with company, persona, and trigger data from LinkedIn, CRM, and other sources."
      case "ICP Scored":
        return "Lead was evaluated against your ICP definition and scoring weights from Settings."
      case "Outreach Started":
        return "Outreach strategy selected based on ICP score, tone, and allowed channels."
      case "Qualification In Progress":
        return `BANT questions prioritized with ${qualification?.overallScore ?? 80}% confidence target based on your qualification strictness.`
      case "Voice Escalation (Conditional)":
        return agentInstructions.allowedChannels.voice
          ? "Voice was considered when ICP score and engagement crossed your escalation threshold."
          : "Voice escalation is disabled in Agent Instructions."
      case "Meeting Booked":
        return meeting
          ? "Qualification met your thresholds, so Jazon booked a meeting and prepared an AE handoff pack."
          : "Lead is still moving through outreach and qualification steps."
      case "CRM Updated":
        return "Jazon wrote qualification status, ICP score, and next-best-action back to your CRM."
      case "Learning Loop Updated":
        return "Outcome signals for this lead feed into weekly learning to adjust ICP scoring and outreach logic."
      default:
        return ""
    }
  }

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
              <h1 className="text-3xl font-semibold text-foreground">Workflow</h1>
              <p className="text-sm text-muted-foreground">
                Read-only view showing how Jazon autonomously moves a lead through each decision step.
              </p>
            </div>

            {primaryLead && (
              <Card>
                <CardHeader>
                  <CardTitle>Current Example Lead</CardTitle>
                  <CardDescription>
                    This workflow is illustrated using {primaryLead.name} at {primaryLead.company}.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Stage</p>
                    <p className="font-medium">{primaryLead.stage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">ICP Score</p>
                    <p className="font-medium">{primaryLead.icpScore}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Lifecycle Steps</CardTitle>
                <CardDescription>
                  Each step is explainable, with clear ownership and timing so RevOps and IT can audit behavior.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-4">
                  {workflowSteps.map((step, index) => {
                    const status = stepStatus(step)
                    const ts = lastActionForStep(step)
                    const explanation = explanationForStep(step)
                    const isLast = index === workflowSteps.length - 1

                    return (
                      <div key={step} className="flex gap-4">
                        <div className="flex flex-col items-center mr-1">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full border bg-card ${
                              status === "Completed"
                                ? "border-chart-2 text-chart-2"
                                : status === "Skipped"
                                ? "border-muted text-muted-foreground"
                                : "border-primary text-primary"
                            }`}
                          >
                            {status === "Completed" ? (
                              <CheckCircle2 className="w-4 h-4" />
                            ) : status === "Skipped" ? (
                              <Clock className="w-4 h-4" />
                            ) : (
                              <Clock className="w-4 h-4" />
                            )}
                          </div>
                          {!isLast && <div className="mt-1 h-full w-px bg-border" />}
                        </div>
                        <div className="flex-1 space-y-1 pb-6 border-b last:border-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{step}</p>
                            <Badge
                              variant={
                                status === "Completed"
                                  ? "default"
                                  : status === "Skipped"
                                  ? "outline"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">Last activity: {ts}</p>
                          <p className="text-sm">{explanation}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Systems Touched
                </CardTitle>
                <CardDescription>High-level view of which systems are involved in this workflow.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Lead Sources</p>
                  <p>Salesforce, HubSpot, CSV</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Research</p>
                  <p>LinkedIn, Perplexity, CRM</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Outreach</p>
                  <p>Email, LinkedIn, Voice</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Learning</p>
                  <p>Weekly Learning Loop</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

