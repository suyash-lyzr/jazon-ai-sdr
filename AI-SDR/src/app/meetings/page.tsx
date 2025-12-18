"use client"

import { useState, useMemo } from "react"
import { JazonSidebar } from "@/components/jazon-sidebar"
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
  Video,
  Users,
  ExternalLink,
  ChevronDown,
  CalendarCheck,
  ListChecks,
  MessageSquare,
  Zap,
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
  const [isAgendaOpen, setIsAgendaOpen] = useState(false)

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

  // Generate meeting details
  const getMeetingDetails = () => {
    if (!selectedLead || !meeting) return null

    return {
      title: `Sales Automation Discovery Call – ${selectedLead.company}`,
      dateTime: meeting.scheduledFor || "Tomorrow, 2:00 – 2:30 PM (IST)",
      duration: "30 minutes",
      meetingType: "Discovery / Qualification",
      status: meeting.status === "upcoming" ? "Scheduled" : meeting.status === "completed" ? "Completed" : "Canceled",
      participants: [
        {
          name: selectedLead.name,
          role: `${selectedLead.title} – ${selectedLead.company}`,
          type: "prospect",
        },
        {
          name: handoffStatus.assignedAE || "Sarah Mitchell",
          role: "Assigned AE",
          type: "ae",
        },
        {
          name: "Jazon AI SDR",
          role: "Auto-scheduler",
          type: "ai",
        },
      ],
      calendarIntegration: {
        provider: "Google Calendar",
        status: "Connected – Demo",
        inviteSent: true,
        conferencing: "Google Meet (auto-generated link)",
        meetLink: "https://meet.google.com/abc-defg-hij",
      },
    }
  }

  const meetingDetails = getMeetingDetails()

  // Generate AI agenda
  const getMeetingAgenda = () => {
    if (!selectedLead) return []

    return [
      `Introduce Jazon AI SDR and qualification approach`,
      `Understand ${selectedLead.company}'s sales automation initiative`,
      `Validate integration requirements and security expectations`,
      `Align on next steps and evaluation timeline`,
    ]
  }

  const meetingAgenda = getMeetingAgenda()

  // Generate meeting notes (for completed meetings)
  const getMeetingNotes = () => {
    if (!meeting || meeting.status !== "completed") return null

    return {
      summary: `${selectedLead?.name} confirmed active RFP evaluation. Budget approved at $400K with expansion potential. Primary concerns around explainability and integration effort. Strong alignment with enterprise sales automation goals.`,
      keyDecisions: [
        "Proceed to technical evaluation with IT team",
        "Schedule security review with CISO",
        "Share ROI calculator and case studies",
      ],
      openQuestions: [
        "Integration timeline with existing Salesforce instance",
        "Data residency requirements for APAC region",
      ],
      objections: [
        "Concern about AI transparency in customer-facing calls",
        "Need for SOC 2 Type II certification confirmation",
      ],
    }
  }

  const meetingNotes = getMeetingNotes()

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
                        <Ban className="w-5 h-5 text-destructive mt-0.5" />
                        <div>
                          <h3 className="font-semibold text-sm mb-1">Meeting not scheduled due to early disqualification</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            This lead was disqualified during the qualification process. Scheduling is blocked.
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Disqualification reason: Low ICP score or BANT criteria not met.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!meeting && selectedLead.stage !== "Disqualified" && (
                  <Card className="border-chart-4/20 bg-chart-4/5">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-chart-4 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-sm mb-1">
                              Meeting not scheduled yet
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2">
                              Lead is qualified but awaiting prospect response for scheduling.
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Reason: Prospect has not confirmed availability after qualification call.
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" disabled className="shrink-0">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule when ready
                        </Button>
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

                {/* Meeting Details Section */}
                {meeting && meetingDetails && (
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            Meeting Details
                          </CardTitle>
                          <CardDescription className="mt-1">
                            Auto-scheduled by AI SDR using calendar availability and qualification confidence
                          </CardDescription>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge variant="outline" className="gap-1.5 cursor-help">
                                <Zap className="w-3 h-3" />
                                Calendar-Aware AI
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="left" className="max-w-xs">
                              <p className="text-sm">
                                Jazon schedules meetings only after ICP, intent, and compliance checks are satisfied. No cold scheduling.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Two Column Layout */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Meeting Info */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Meeting Information
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Meeting Title</p>
                                <p className="text-sm font-medium">{meetingDetails.title}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                              <Clock className="w-4 h-4 text-muted-foreground mt-0.5" />
                              <div className="flex-1">
                                <p className="text-xs text-muted-foreground">Date & Time</p>
                                <p className="text-sm font-medium">{meetingDetails.dateTime}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="text-sm font-medium">{meetingDetails.duration}</p>
                              </div>
                              <div className="p-3 bg-muted/30 rounded-lg">
                                <p className="text-xs text-muted-foreground">Meeting Type</p>
                                <p className="text-sm font-medium">{meetingDetails.meetingType}</p>
                              </div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">Meeting Status</p>
                              <Badge
                                variant={
                                  meetingDetails.status === "Scheduled"
                                    ? "default"
                                    : meetingDetails.status === "Completed"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {meetingDetails.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Participants & Calendar */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                            Participants & Calendar
                          </h4>
                          <div className="space-y-3">
                            {/* Participants */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Participants</p>
                              </div>
                              <div className="space-y-2">
                                {meetingDetails.participants.map((participant, idx) => (
                                  <div key={idx} className="flex items-center gap-3">
                                    <Avatar className="h-7 w-7">
                                      <AvatarFallback className="text-xs">
                                        {participant.type === "ai" ? (
                                          <Sparkles className="w-3 h-3" />
                                        ) : (
                                          participant.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")
                                        )}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <p className="text-sm font-medium">{participant.name}</p>
                                      <p className="text-xs text-muted-foreground">{participant.role}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Calendar Integration */}
                            <div className="p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-2 mb-3">
                                <CalendarCheck className="w-4 h-4 text-muted-foreground" />
                                <p className="text-xs text-muted-foreground">Calendar Integration</p>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Provider</span>
                                  <Badge variant="outline" className="text-xs">
                                    {meetingDetails.calendarIntegration.provider} ({meetingDetails.calendarIntegration.status})
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Calendar Invite</span>
                                  <span className="text-sm text-chart-2 flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Sent
                                  </span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">Conferencing</span>
                                  <span className="text-sm flex items-center gap-1">
                                    <Video className="w-3.5 h-3.5 text-muted-foreground" />
                                    Google Meet
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Meeting Agenda - Collapsible */}
                      <Collapsible open={isAgendaOpen} onOpenChange={setIsAgendaOpen}>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" className="w-full justify-between p-3 h-auto bg-muted/30 hover:bg-muted/50">
                            <div className="flex items-center gap-2">
                              <ListChecks className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Agenda (AI-Generated)</span>
                              <Badge variant="secondary" className="text-xs">
                                {meetingAgenda.length} items
                              </Badge>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                                isAgendaOpen ? "rotate-180" : ""
                              }`}
                            />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-3">
                          <div className="p-4 bg-muted/20 rounded-lg border border-border/50">
                            <ol className="space-y-2 list-decimal list-inside">
                              {meetingAgenda.map((item, idx) => (
                                <li key={idx} className="text-sm text-foreground">
                                  {item}
                                </li>
                              ))}
                            </ol>
                            <p className="text-xs text-muted-foreground mt-4 pt-3 border-t border-border/50">
                              Agenda generated dynamically from ICP research, conversation signals, and qualification gaps.
                            </p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      {/* Helper text */}
                      <p className="text-xs text-muted-foreground italic">
                        In production, Jazon uses connected calendars to find mutual availability and schedule meetings automatically.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Meeting Notes - Only for Completed Meetings */}
                {meeting?.status === "completed" && meetingNotes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Meeting Notes & Outcomes
                      </CardTitle>
                      <CardDescription>
                        AI-generated summary from the completed call
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Summary */}
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Summary</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-lg">
                          {meetingNotes.summary}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Key Decisions */}
                        <div className="p-4 bg-chart-2/5 border border-chart-2/20 rounded-lg">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-chart-2" />
                            Key Decisions
                          </h4>
                          <ul className="space-y-2">
                            {meetingNotes.keyDecisions.map((decision, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-chart-2 mt-0.5">•</span>
                                <span>{decision}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Objections Surfaced */}
                        <div className="p-4 bg-chart-4/5 border border-chart-4/20 rounded-lg">
                          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-chart-4" />
                            Objections Surfaced
                          </h4>
                          <ul className="space-y-2">
                            {meetingNotes.objections.map((objection, idx) => (
                              <li key={idx} className="text-sm flex items-start gap-2">
                                <span className="text-chart-4 mt-0.5">•</span>
                                <span>{objection}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Open Questions */}
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <h4 className="text-sm font-semibold mb-3">Open Questions</h4>
                        <ul className="space-y-2">
                          {meetingNotes.openQuestions.map((question, idx) => (
                            <li key={idx} className="text-sm flex items-start gap-2">
                              <span className="text-primary mt-0.5">?</span>
                              <span>{question}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Divider connecting to handoff sections */}
                {meeting && (
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-border/50" />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-background px-4 text-xs text-muted-foreground">
                        The sections below use this meeting context to generate AE-ready handoff intelligence
                      </span>
                    </div>
                  </div>
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
