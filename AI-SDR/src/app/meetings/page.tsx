"use client"

import { useState, useMemo } from "react"
import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useJazonApp } from "@/context/jazon-app-context"
import { mockMeetings, mockQualificationData, mockConversations } from "@/lib/mock-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Calendar,
  User,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  UserCheck,
  Ban,
  RefreshCw,
  Flag,
  Sparkles,
  Building2,
  DollarSign,
  Target,
  TrendingUp,
} from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface HandoffTimelineEvent {
  id: string
  eventType: "ai" | "system" | "human"
  timestamp: string
  title: string
  description: string
  sortOrder: number
}

interface HandoffAsset {
  id: string
  name: string
  type: "pdf" | "summary" | "transcript"
  status: "generated" | "not_generated"
  timestamp?: string
}

export default function MeetingsPage() {
  const { leads } = useJazonApp()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [controlDialogOpen, setControlDialogOpen] = useState<string | null>(null)
  const [controlNote, setControlNote] = useState("")

  // Default to first lead with a meeting
  const defaultLead = useMemo(() => {
    if (leads.length === 0) return null
    const leadWithMeeting = leads.find(
      (l) => mockMeetings.some((m) => m.leadId === l.id)
    )
    return leadWithMeeting || leads[0]
  }, [leads])

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId) || defaultLead
    : defaultLead

  const meeting = selectedLead
    ? mockMeetings.find((m) => m.leadId === selectedLead.id)
    : null

  const qualification = selectedLead
    ? mockQualificationData[selectedLead.id] || null
    : null

  const conversations = selectedLead
    ? mockConversations[selectedLead.id] || []
    : []

  // Determine handoff status
  const getHandoffStatus = () => {
    if (!selectedLead || !meeting) {
      if (selectedLead?.stage === "Disqualified") {
        return {
          handoffStatus: "Blocked",
          qualificationOutcome: "Disqualified",
          meetingStatus: "Not booked",
          assignedAE: null,
          lastUpdated: "N/A",
        }
      }
      return {
        handoffStatus: "Pending",
        qualificationOutcome: "Needs AE Review",
        meetingStatus: "Not booked",
        assignedAE: null,
        lastUpdated: "N/A",
      }
    }

    const assignedAE = meeting.status === "upcoming" ? "Sarah Mitchell" : null

    return {
      handoffStatus: meeting.status === "upcoming" ? "Completed" : "Pending",
      qualificationOutcome: "Qualified → AE Handoff",
      meetingStatus: meeting.status === "upcoming" ? "Scheduled" : "Not booked",
      assignedAE,
      lastUpdated: "1 hour ago",
    }
  }

  const handoffStatus = getHandoffStatus()

  // Generate executive summary
  const getExecutiveSummary = () => {
    if (!selectedLead || !meeting) {
      return "Lead qualification in progress. Handoff package will be generated upon qualification completion."
    }

    const lead = selectedLead
    const company = lead.company
    const title = lead.title
    const whyQualified = meeting.handoffPack.whyBooked

    return `${lead.name} is the ${title} at ${company}. ${whyQualified}`
  }

  // Extract BANT data
  const getBANTData = () => {
    if (qualification) {
      return {
        budget: {
          value: qualification.budget.value,
          confidence: qualification.budget.confidence,
          status: qualification.budget.known ? "Confirmed" : "Likely",
        },
        authority: {
          value: qualification.authority.value,
          confidence: qualification.authority.confidence,
          status: qualification.authority.known ? "Economic buyer" : "Influencer",
        },
        need: {
          value: qualification.need.value,
          confidence: qualification.need.confidence,
        },
        timeline: {
          value: qualification.timeline.value,
          confidence: qualification.timeline.confidence,
        },
      }
    }

    // Fallback to meeting data
    if (meeting) {
      const notes = meeting.handoffPack.qualificationNotes
      return {
        budget: {
          value: notes.find((n) => n.includes("Budget")) || "Unknown",
          confidence: 75,
          status: "Likely",
        },
        authority: {
          value: notes.find((n) => n.includes("Authority")) || "Unknown",
          confidence: 80,
          status: "Economic buyer",
        },
        need: {
          value: notes.find((n) => n.includes("Need")) || "Unknown",
          confidence: 70,
        },
        timeline: {
          value: notes.find((n) => n.includes("Timeline")) || "Unknown",
          confidence: 75,
        },
      }
    }

    return null
  }

  const bantData = getBANTData()

  // Extract key discussion highlights from conversations
  const getDiscussionHighlights = () => {
    const highlights: string[] = []

    // Find voice call summary
    const voiceCall = conversations.find((c) => c.channel === "voice")
    if (voiceCall?.summary) {
      highlights.push(`Primary concern: ${voiceCall.summary.split(".")[0]}`)
    }

    // Find objections
    if (meeting?.handoffPack.objectionsRaised.length > 0) {
      highlights.push(
        `Objections raised: ${meeting.handoffPack.objectionsRaised.join(", ")}`
      )
    }

    // Find proof requests
    const inboundMessages = conversations.filter((c) => c.direction === "inbound")
    inboundMessages.forEach((msg) => {
      if (msg.content?.toLowerCase().includes("share") || msg.content?.toLowerCase().includes("send")) {
        highlights.push(`Requested: ${msg.content.substring(0, 100)}...`)
      }
    })

    if (highlights.length === 0) {
      highlights.push("No specific discussion highlights extracted yet")
    }

    return highlights
  }

  // Generate handoff timeline
  const getHandoffTimeline = (): HandoffTimelineEvent[] => {
    if (!selectedLead || !meeting) return []

    const events: HandoffTimelineEvent[] = []
    let sortOrder = 0

    // Qualification completed
    if (qualification) {
      events.push({
        id: `${selectedLead.id}-qualification`,
        eventType: "ai",
        timestamp: "2 hours ago",
        title: "Qualification completed",
        description: `BANT criteria validated with ${qualification.overallScore}% confidence. AI recommendation: ${qualification.recommendation === "book_meeting" ? "Book meeting" : "Nurture"}.`,
        sortOrder: sortOrder++,
      })
    }

    // Meeting booked
    if (meeting.status === "upcoming") {
      events.push({
        id: `${selectedLead.id}-meeting`,
        eventType: "ai",
        timestamp: "1 hour ago",
        title: "Meeting booked",
        description: `Meeting scheduled for ${meeting.scheduledFor}. Calendar invite sent to ${selectedLead.name}.`,
        sortOrder: sortOrder++,
      })
    }

    // AE handoff initiated
    events.push({
      id: `${selectedLead.id}-handoff`,
      eventType: "system",
      timestamp: "1 hour ago",
      title: "AE handoff initiated",
      description: `Handoff package generated and assigned to ${handoffStatus.assignedAE || "Auto-assign on handoff"}.`,
      sortOrder: sortOrder++,
    })

    // CRM updated
    events.push({
      id: `${selectedLead.id}-crm`,
      eventType: "system",
      timestamp: "1 hour ago",
      title: "CRM updated",
      description: "Lead status updated in Salesforce. Opportunity record created with qualification details.",
      sortOrder: sortOrder++,
    })

    return events.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const handoffTimeline = getHandoffTimeline()

  // Generate handoff assets
  const getHandoffAssets = (): HandoffAsset[] => {
    if (!meeting) return []

    return [
      {
        id: "asset-1",
        name: "AI-Generated Meeting Brief",
        type: "pdf",
        status: "generated",
        timestamp: "1 hour ago",
      },
      {
        id: "asset-2",
        name: "Qualification Summary",
        type: "summary",
        status: "generated",
        timestamp: "1 hour ago",
      },
      {
        id: "asset-3",
        name: "Objection List",
        type: "summary",
        status: "generated",
        timestamp: "1 hour ago",
      },
      {
        id: "asset-4",
        name: "Voice Call Transcript",
        type: "transcript",
        status: conversations.some((c) => c.channel === "voice")
          ? "generated"
          : "not_generated",
        timestamp: conversations.some((c) => c.channel === "voice")
          ? "2 hours ago"
          : undefined,
      },
    ]
  }

  const handoffAssets = getHandoffAssets()

  const handleControlAction = (action: string) => {
    setControlNote("")
    setControlDialogOpen(null)
    // Simulate action logging
    console.log(`Action logged: ${action} for lead ${selectedLead?.id}`)
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
          <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
            {/* Page Header with Lead Selector */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-foreground">
                  Meetings & AE Handoffs
                </h1>
                <p className="text-sm text-muted-foreground">
                  Enterprise-ready handoff packages for seamless AE collaboration
                </p>
              </div>
              <div className="flex items-center gap-2 min-w-0 max-w-md">
                <label className="text-xs text-muted-foreground shrink-0">Lead:</label>
                <Select
                  value={selectedLeadId || defaultLead?.id || ""}
                  onValueChange={setSelectedLeadId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a lead" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads
                      .filter((l) => mockMeetings.some((m) => m.leadId === l.id) || l.stage === "Meeting Scheduled" || l.stage === "Qualification")
                      .map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{lead.name}</span>
                            <span className="text-muted-foreground">• {lead.company}</span>
                            <Badge variant="outline" className="ml-auto text-xs">
                              ICP {lead.icpScore}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {lead.stage === "Meeting Scheduled" ? "Meeting Scheduled" : lead.stage}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {!selectedLead ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a lead to view handoff details
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Handoff Status Summary */}
                <div className="bg-muted/30 rounded-lg border border-border/50 p-4">
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Handoff Status
                      </p>
                      <Badge
                        variant={
                          handoffStatus.handoffStatus === "Completed"
                            ? "default"
                            : handoffStatus.handoffStatus === "Blocked"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {handoffStatus.handoffStatus}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Qualification Outcome
                      </p>
                      <p className="text-sm font-medium">
                        {handoffStatus.qualificationOutcome}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Meeting Status
                      </p>
                      <p className="text-sm font-medium">{handoffStatus.meetingStatus}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Assigned AE
                      </p>
                      {handoffStatus.assignedAE ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs">
                              {handoffStatus.assignedAE
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">
                            {handoffStatus.assignedAE}
                          </span>
                        </div>
                      ) : (
                        <p className="text-sm font-medium text-muted-foreground">
                          Auto-assign on handoff
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Last Updated
                      </p>
                      <p className="text-sm font-medium">{handoffStatus.lastUpdated}</p>
                    </div>
                  </div>
                </div>

                {/* Edge States */}
                {selectedLead.stage === "Disqualified" && (
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-sm mb-1">Lead Disqualified</h3>
                          <p className="text-sm text-muted-foreground">
                            This lead has been disqualified. Handoff actions are disabled.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!meeting && selectedLead.stage !== "Disqualified" && (
                  <Card className="border-chart-4/20 bg-chart-4/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-chart-4 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-sm mb-1">
                            Waiting for meeting confirmation
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Lead is qualified but meeting has not been scheduled yet.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {meeting?.status === "completed" && (
                  <Card className="border-chart-2/20 bg-chart-2/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-chart-2 mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-sm mb-1">Handoff consumed</h3>
                          <p className="text-sm text-muted-foreground">
                            AE has completed the first call. This handoff package is now read-only
                            for audit purposes.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Primary Handoff Card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl">AI → AE Handoff Summary</CardTitle>
                    <CardDescription>
                      Complete context for seamless AE engagement
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* A. Executive Summary */}
                    <div>
                      <h3 className="text-sm font-semibold mb-2">Executive Summary</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {getExecutiveSummary()}
                      </p>
                    </div>

                    <div className="h-px bg-border" />

                    {/* B. Qualification Snapshot (BANT) */}
                    {bantData && (
                      <div>
                        <h3 className="text-sm font-semibold mb-4">Qualification Snapshot (BANT)</h3>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <DollarSign className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Budget</span>
                                <Badge variant="outline" className="text-xs">
                                  {bantData.budget.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {bantData.budget.value}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-sm font-semibold">{bantData.budget.confidence}%</p>
                            </div>
                          </div>

                          <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <UserCheck className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Authority</span>
                                <Badge variant="outline" className="text-xs">
                                  {bantData.authority.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {bantData.authority.value}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-sm font-semibold">
                                {bantData.authority.confidence}%
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Target className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Need</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {bantData.need.value}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-sm font-semibold">{bantData.need.confidence}%</p>
                            </div>
                          </div>

                          <div className="flex items-start justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm font-medium">Timeline</span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {bantData.timeline.value}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">Confidence</p>
                              <p className="text-sm font-semibold">
                                {bantData.timeline.confidence}%
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="h-px bg-border" />

                    {/* C. Key Discussion Highlights */}
                    {meeting && (
                      <div>
                        <h3 className="text-sm font-semibold mb-2">
                          Key Discussion Highlights
                        </h3>
                        <p className="text-xs text-muted-foreground mb-3">
                          Extracted from conversations
                        </p>
                        <ul className="space-y-2">
                          {getDiscussionHighlights().map((highlight, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-0.5">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="h-px bg-border" />

                    {/* D. AI Recommended Next Steps */}
                    {meeting && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-sm font-semibold">AI Recommended Next Steps</h3>
                          <Badge variant="outline" className="text-xs">AE editable</Badge>
                        </div>
                        <ul className="space-y-2">
                          {meeting.handoffPack.suggestedTalkTrack.map((step, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-chart-2 mt-0.5">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Handoff Assets */}
                <Card>
                  <CardHeader>
                    <CardTitle>Handoff Assets</CardTitle>
                    <CardDescription>
                      AI-generated documents and summaries for AE preparation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {handoffAssets.map((asset) => (
                        <div
                          key={asset.id}
                          className="border rounded-lg p-4 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">{asset.name}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant={
                                  asset.status === "generated" ? "default" : "secondary"
                                }
                                className="text-xs"
                              >
                                {asset.status === "generated" ? "Generated" : "Not generated"}
                              </Badge>
                              {asset.timestamp && (
                                <span className="text-xs text-muted-foreground">
                                  {asset.timestamp}
                                </span>
                              )}
                            </div>
                          </div>
                          {asset.status === "generated" && (
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Full Handoff Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle>Handoff Timeline</CardTitle>
                    <CardDescription>
                      Chronological audit trail of handoff process
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {handoffTimeline.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No handoff events yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {handoffTimeline.map((event, idx) => (
                          <div key={event.id} className="relative">
                            {idx < handoffTimeline.length - 1 && (
                              <div className="absolute left-[22px] top-12 bottom-0 w-px bg-border" />
                            )}
                            <div className="flex gap-4">
                              <div
                                className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                                  event.eventType === "ai"
                                    ? "bg-primary/10 text-primary"
                                    : event.eventType === "system"
                                    ? "bg-chart-2/10 text-chart-2"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                {event.eventType === "ai" ? (
                                  <Sparkles className="w-5 h-5" />
                                ) : event.eventType === "system" ? (
                                  <CheckCircle2 className="w-5 h-5" />
                                ) : (
                                  <User className="w-5 h-5" />
                                )}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Badge variant="outline" className="text-xs">
                                        {event.eventType === "ai"
                                          ? "AI"
                                          : event.eventType === "system"
                                          ? "System"
                                          : "Human"}
                                      </Badge>
                                      <span className="text-sm font-medium">{event.title}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {event.description}
                                    </p>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {event.timestamp}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Human Controls */}
                {selectedLead.stage !== "Disqualified" && meeting?.status !== "completed" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AE & Manager Controls</CardTitle>
                      <CardDescription>
                        All actions are logged for audit purposes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-3">
                        <Dialog
                          open={controlDialogOpen === "reassign"}
                          onOpenChange={(open) =>
                            setControlDialogOpen(open ? "reassign" : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <UserCheck className="w-4 h-4 mr-2" />
                              Reassign AE
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reassign AE</DialogTitle>
                              <DialogDescription>
                                Select a new AE for this handoff
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>New AE</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select AE" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                                    <SelectItem value="john">John Davis</SelectItem>
                                    <SelectItem value="emily">Emily Chen</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Reason (optional)</Label>
                                <Textarea
                                  placeholder="Add a note for audit purposes..."
                                  value={controlNote}
                                  onChange={(e) => setControlNote(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setControlDialogOpen(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => handleControlAction("reassign")}>
                                Reassign
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={controlDialogOpen === "requalify"}
                          onOpenChange={(open) =>
                            setControlDialogOpen(open ? "requalify" : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Request Re-qualification
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Request Re-qualification</DialogTitle>
                              <DialogDescription>
                                Send this lead back to AI for re-qualification
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Reason</Label>
                                <Textarea
                                  placeholder="Why is re-qualification needed?"
                                  value={controlNote}
                                  onChange={(e) => setControlNote(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setControlDialogOpen(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => handleControlAction("requalify")}>
                                Request
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={controlDialogOpen === "complete"}
                          onOpenChange={(open) =>
                            setControlDialogOpen(open ? "complete" : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Mark Handoff Complete
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Mark Handoff Complete</DialogTitle>
                              <DialogDescription>
                                Confirm that the AE has received and reviewed this handoff
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Notes (optional)</Label>
                                <Textarea
                                  placeholder="Add any notes..."
                                  value={controlNote}
                                  onChange={(e) => setControlNote(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setControlDialogOpen(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => handleControlAction("complete")}>
                                Mark Complete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={controlDialogOpen === "flag"}
                          onOpenChange={(open) =>
                            setControlDialogOpen(open ? "flag" : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Flag className="w-4 h-4 mr-2" />
                              Flag Issue
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Flag Issue</DialogTitle>
                              <DialogDescription>
                                Report an issue with this handoff (demo only)
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-2">
                                <Label>Issue Description</Label>
                                <Textarea
                                  placeholder="Describe the issue..."
                                  value={controlNote}
                                  onChange={(e) => setControlNote(e.target.value)}
                                />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => setControlDialogOpen(null)}
                              >
                                Cancel
                              </Button>
                              <Button onClick={() => handleControlAction("flag")}>
                                Flag Issue
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
