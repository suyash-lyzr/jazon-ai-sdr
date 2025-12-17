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
import { Progress } from "@/components/ui/progress"
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
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { mockOutreachStrategies, mockConversations } from "@/lib/mock-data"
import { useJazonApp } from "@/context/jazon-app-context"
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Shield, 
  CheckCircle2, 
  Clock,
  Pause,
  PhoneCall,
  StopCircle,
  UserCheck,
  AlertCircle,
  TrendingUp,
  Target,
  Activity,
  Zap
} from "lucide-react"

export default function OutreachPage() {
  const { leads } = useJazonApp()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [controlDialogOpen, setControlDialogOpen] = useState<string | null>(null)
  const [overrideReason, setOverrideReason] = useState("")
  const [viewMode, setViewMode] = useState<"executive" | "full">("executive")

  // Default to first lead with active outreach
  const defaultLead = useMemo(() => {
    if (leads.length === 0) return null
    return leads.find(l => l.stage === "Qualification" || l.stage === "Engaged") || leads[0]
  }, [leads])

  const selectedLead = selectedLeadId 
    ? leads.find(l => l.id === selectedLeadId) || defaultLead
    : defaultLead

  // Use mock strategy for now - in production would be per lead
  const strategy = mockOutreachStrategies[0]
  const conversations = selectedLead ? mockConversations[selectedLead.id] || [] : []

  const simulateUpdate = (action: string, nextState: string) => {
    setIsUpdating(true)
    setStatusNote(`Logging ${action} for audit purposes…`)
    setTimeout(() => {
      setStatusNote(nextState)
      setIsUpdating(false)
      setControlDialogOpen(null)
      setOverrideReason("")
    }, 800)
  }

  // Determine outreach status for selected lead
  const getOutreachStatus = () => {
    if (!selectedLead) return "no_lead"
    if (selectedLead.stage === "Disqualified") return "stopped"
    if (selectedLead.stage === "Meeting Scheduled") return "completed"
    if (selectedLead.stage === "Qualification" || selectedLead.stage === "Engaged") return "active"
    return "research"
  }

  const outreachStatus = getOutreachStatus()

  const getCurrentPhase = () => {
    if (!selectedLead) return "-"
    if (selectedLead.stage === "Research") return "Research"
    if (selectedLead.stage === "Engaged") return "Engagement"
    if (selectedLead.stage === "Qualification") return "Qualification"
    if (selectedLead.stage === "Meeting Scheduled") return "Handoff"
    return "Research"
  }

  const getFinalDecision = () => {
    if (!selectedLead) return "-"
    if (selectedLead.stage === "Meeting Scheduled") return "Qualified → AE handoff"
    if (selectedLead.stage === "Disqualified") return "Disqualified → ICP mismatch"
    if (selectedLead.stage === "Qualification") return "In progress"
    if (selectedLead.stage === "Engaged") return "Nurturing → Qualification"
    return "Research in progress"
  }

  // Generate full activity timeline (messages + system events)
  const activityTimeline = useMemo(() => {
    const timeline: Array<{
      id: string
      type: "message" | "system"
      timestamp: string
      channel?: string
      direction?: string
      subject?: string
      content?: string
      summary?: string
      duration?: string
      outcome?: string
      systemAction?: string
      aiGenerated?: boolean
    }> = []

    // Add conversations
    conversations.forEach(msg => {
      timeline.push({
        id: msg.id,
        type: "message",
        timestamp: msg.timestamp,
        channel: msg.channel,
        direction: msg.direction,
        subject: msg.subject,
        content: msg.content,
        summary: msg.summary,
        duration: msg.duration,
        outcome: msg.outcome,
        aiGenerated: msg.direction === "outbound",
      })
    })

    // Add system events based on lead stage
    if (selectedLead?.stage === "Qualification" && selectedLead.channel.includes("Voice")) {
      timeline.push({
        id: "sys-voice",
        type: "system",
        timestamp: "2 hours ago",
        systemAction: "Voice escalation triggered",
        content: `ICP score ${selectedLead.icpScore} and engagement signals met escalation threshold`,
      })
    }

    if (selectedLead?.stage === "Meeting Scheduled") {
      timeline.push({
        id: "sys-meeting",
        type: "system",
        timestamp: "1 hour ago",
        systemAction: "AE handoff completed",
        content: "Lead fully qualified, meeting booked, handoff pack prepared for AE team",
      })
    }

    if (selectedLead?.stage === "Disqualified") {
      timeline.push({
        id: "sys-disqual",
        type: "system",
        timestamp: "1 week ago",
        systemAction: "Disqualification applied",
        content: "Low ICP score (45) - wrong market segment. Outreach automatically stopped.",
      })
    }

    // Sort by timestamp (most recent first for demo)
    return timeline.sort((a, b) => {
      // Simple sort - in production would parse actual timestamps
      return 0
    })
  }, [conversations, selectedLead])

  const executiveTimeline = activityTimeline.filter(item => 
    item.type === "system" || 
    item.channel === "voice" || 
    (item.type === "message" && item.direction === "inbound")
  )

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
                <h1 className="text-3xl font-semibold text-foreground">Outreach Engine</h1>
                <p className="text-sm text-muted-foreground">
                  Strategic, multi-channel engagement - not email blasting
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
                    {leads.map((lead) => (
                      <SelectItem key={lead.id} value={lead.id}>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{lead.name}</span>
                          <span className="text-muted-foreground">• {lead.company}</span>
                          <Badge variant="outline" className="ml-auto text-xs">
                            ICP {lead.icpScore}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {lead.stage}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedLead && (
              <>
                {/* Section 1: Outreach Summary (Always Visible) */}
                <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Outreach Status</p>
                      <div className="flex items-center gap-2">
                        {outreachStatus === "active" && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            <Badge variant="default">Active</Badge>
                          </>
                        )}
                        {outreachStatus === "completed" && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-chart-2" />
                            <Badge className="bg-chart-2 hover:bg-chart-2">Completed</Badge>
                          </>
                        )}
                        {outreachStatus === "stopped" && (
                          <>
                            <StopCircle className="w-4 h-4 text-destructive" />
                            <Badge variant="outline" className="text-destructive border-destructive">Stopped</Badge>
                          </>
                        )}
                        {outreachStatus === "research" && (
                          <>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="outline">Research</Badge>
                          </>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Current Phase</p>
                      <p className="text-sm font-medium">{getCurrentPhase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Last Action</p>
                      <p className="text-sm font-medium">
                        {outreachStatus === "active" ? "Voice call - 2 hours ago" : 
                         outreachStatus === "completed" ? "AE handoff - 1 hour ago" :
                         selectedLead.lastContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Next Planned Action</p>
                      <p className="text-sm font-medium">
                        {outreachStatus === "active" && selectedLead.stage === "Qualification" 
                          ? "Follow-up email - tomorrow" 
                          : outreachStatus === "completed"
                          ? "AE handoff complete"
                          : outreachStatus === "stopped"
                          ? "None - outreach stopped"
                          : "Research in progress"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Final AI Decision</p>
                      <p className="text-sm font-medium">{getFinalDecision()}</p>
                    </div>
                  </div>
                </div>

                {/* Completion Summary (if completed) */}
                {outreachStatus === "completed" && (
                  <Card className="border-chart-2/30 bg-chart-2/10">
                    <CardContent className="py-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/20">
                          <CheckCircle2 className="w-6 h-6 text-chart-2" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Outreach Successfully Completed</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Meeting scheduled and AE handoff completed. Outreach strategy achieved its goal.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Why it worked
                              </p>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-start gap-2">
                                  <span className="text-chart-2">•</span>
                                  <span>High ICP score ({selectedLead.icpScore})</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-chart-2">•</span>
                                  <span>Strong engagement across multiple channels</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-chart-2">•</span>
                                  <span>Active buying signals detected</span>
                                </li>
                              </ul>
                            </div>
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Outcome
                              </p>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5" />
                                  <span>Meeting booked</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5" />
                                  <span>AE handoff pack prepared</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5" />
                                  <span>CRM updated (demo)</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Disqualification Summary (if stopped) */}
                {outreachStatus === "stopped" && (
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="py-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-destructive/10">
                          <StopCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">Outreach Disabled</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This lead was disqualified and outreach has been automatically stopped.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Disqualification Reason
                              </p>
                              <p className="text-sm mb-2">
                                Low ICP score ({selectedLead.icpScore}) - wrong market segment
                              </p>
                              <Badge variant="outline" className="text-xs">High Confidence</Badge>
                            </div>
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Value Saved
                              </p>
                              <p className="text-sm mb-2">
                                Early disqualification prevented wasted AE time
                              </p>
                              <Badge variant="outline" className="text-xs">AI Decision (Automatic)</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Active Outreach Strategy (only for active leads) */}
                {outreachStatus === "active" && (
                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Generated Outreach Strategy for This Lead</CardTitle>
                      <CardDescription>
                        Intelligent channel escalation based on ICP score ({selectedLead.icpScore}) and engagement signals from Research & ICP
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Progress Indicator */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">Strategy Progress</span>
                            <span className="text-sm text-muted-foreground">
                              Step {strategy.currentStep} of {strategy.totalSteps}
                            </span>
                          </div>
                          <Progress value={(strategy.currentStep / strategy.totalSteps) * 100} className="h-2" />
                          <div className="flex items-center gap-2 mt-2">
                            {Array.from({ length: strategy.totalSteps }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`flex-1 h-1 rounded-full ${
                                  idx < strategy.currentStep
                                    ? "bg-chart-2"
                                    : idx === strategy.currentStep
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Channel Strategy */}
                        <div className="space-y-4">
                          {strategy.channelStrategy.map((channel, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                              <div className={`p-3 rounded-lg shrink-0 ${
                                channel.status === "completed" ? "bg-chart-2/10 text-chart-2" :
                                channel.status === "active" ? "bg-primary/10 text-primary" :
                                "bg-muted/50 text-muted-foreground"
                              }`}>
                                {channel.channel === "Email" && <Mail className="w-5 h-5" />}
                                {channel.channel === "LinkedIn" && <MessageSquare className="w-5 h-5" />}
                                {channel.channel === "Voice" && <Phone className="w-5 h-5" />}
                              </div>
                              
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold">{channel.channel}</h3>
                                  <Badge variant="outline" className="text-xs">
                                    Step {channel.step}
                                  </Badge>
                                  {channel.status === "completed" && (
                                    <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                  )}
                                  {channel.status === "active" && (
                                    <div className="flex items-center gap-1 text-primary">
                                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                      <span className="text-xs font-medium">In Progress</span>
                                    </div>
                                  )}
                                  {channel.status === "pending" && (
                                    <Badge variant="outline" className="text-xs">Upcoming</Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{channel.goal}</p>
                                
                                {channel.reasoning && (
                                  <div className="bg-muted/30 rounded-lg p-3 mt-2 border border-border/30">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                      Why this step exists
                                    </p>
                                    <p className="text-sm">{channel.reasoning}</p>
                                    <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border/30">
                                      <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">Confidence:</span> High
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        <span className="font-medium">Triggered by:</span> ICP {selectedLead.icpScore} + engagement signals
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {/* Voice Readiness Check */}
                                {channel.channel === "Voice" && (
                                  <div className="bg-primary/5 rounded-lg p-4 mt-2 border border-primary/20">
                                    <div className="flex items-center gap-2 mb-3">
                                      <Target className="w-4 h-4 text-primary" />
                                      <p className="text-xs font-semibold uppercase tracking-wide">
                                        Voice Readiness Check
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                        <span>ICP score threshold met (≥80)</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                        <span>Engagement signals met (2+ channels)</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                        <span>Guardrails passed</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-sm">
                                        <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-muted-foreground">Human approval: Not required</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
                                      Voice is conditional and used only for high-intent leads. This is not a voice-first approach.
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Section 2: Conversation & Activity History (Always Visible) */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Conversation & Activity History
                        </CardTitle>
                        <CardDescription className="mt-2">
                          Full timeline of messages and AI decisions for auditability
                        </CardDescription>
                      </div>
                      <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "executive" | "full")}>
                        <TabsList>
                          <TabsTrigger value="executive" className="text-xs">Executive Summary</TabsTrigger>
                          <TabsTrigger value="full" className="text-xs">Full Audit Trail</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {(outreachStatus === "completed" || outreachStatus === "stopped") && (
                      <div className="bg-muted/30 rounded-lg p-3 border border-border/50 mb-4">
                        <p className="text-xs text-muted-foreground">
                          Outreach is read-only for {outreachStatus === "completed" ? "completed" : "disqualified"} leads. Viewing historical activity only.
                        </p>
                      </div>
                    )}
                    
                    <div className="space-y-4">
                      {(viewMode === "full" ? activityTimeline : executiveTimeline).length > 0 ? (
                        (viewMode === "full" ? activityTimeline : executiveTimeline).map((item) => (
                          <div key={item.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                            {/* Icon */}
                            <div className={`p-2 rounded-lg shrink-0 h-fit ${
                              item.type === "system" ? "bg-muted text-foreground" :
                              item.channel === "email" ? "bg-primary/10 text-primary" :
                              item.channel === "voice" ? "bg-chart-2/10 text-chart-2" :
                              "bg-chart-3/10 text-chart-3"
                            }`}>
                              {item.type === "system" && <Zap className="w-4 h-4" />}
                              {item.channel === "email" && <Mail className="w-4 h-4" />}
                              {item.channel === "voice" && <Phone className="w-4 h-4" />}
                              {item.channel === "linkedin" && <MessageSquare className="w-4 h-4" />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 space-y-2 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    {item.type === "system" ? (
                                      <>
                                        <Badge variant="outline" className="text-xs">System Event</Badge>
                                        <span className="text-sm font-medium">{item.systemAction}</span>
                                      </>
                                    ) : (
                                      <>
                                        <Badge variant="outline" className="text-xs">
                                          {item.channel} • {item.direction}
                                        </Badge>
                                        {item.aiGenerated && (
                                          <Badge variant="default" className="text-xs bg-primary/80">AI-generated</Badge>
                                        )}
                                        {item.subject && (
                                          <p className="font-medium text-sm truncate">{item.subject}</p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground shrink-0">{item.timestamp}</span>
                              </div>

                              {item.summary ? (
                                <div className="bg-muted/30 rounded p-3 border border-border/30">
                                  <p className="text-sm">{item.summary}</p>
                                  {item.duration && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      Duration: {item.duration} • Outcome: {item.outcome}
                                    </p>
                                  )}
                                </div>
                              ) : item.content && (
                                <p className="text-sm text-muted-foreground">{item.content}</p>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <div className="flex flex-col items-center gap-3">
                            <div className="p-4 rounded-full bg-muted">
                              <Activity className="w-6 h-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              No conversation history yet. Outreach will begin after ICP validation.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Section 3: Controls & Guardrails (conditionally styled) */}
                {outreachStatus === "active" && (
                  <>
                    {/* Human Controls */}
                    <Card className="border-primary/20 bg-primary/5">
                      <CardHeader>
                        <CardTitle>Human Controls</CardTitle>
                        <CardDescription>
                          Override AI decisions or adjust outreach strategy
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => setControlDialogOpen("pause")}
                            className="gap-2"
                          >
                            <Pause className="w-4 h-4" />
                            Pause Outreach
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => setControlDialogOpen("voice")}
                            className="gap-2"
                          >
                            <PhoneCall className="w-4 h-4" />
                            Force Voice Escalation
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            onClick={() => setControlDialogOpen("stop")}
                            className="gap-2"
                          >
                            <StopCircle className="w-4 h-4" />
                            Stop Outreach
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isUpdating}
                            className="gap-2"
                          >
                            <UserCheck className="w-4 h-4" />
                            Send to AE for Review
                          </Button>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          All control actions are logged for audit purposes and require confirmation.
                        </p>
                        {statusNote && (
                          <div className="bg-background rounded-lg p-3 border">
                            <p className="text-xs text-muted-foreground">
                              {statusNote}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Outreach Guardrails */}
                    <Card className="border-chart-4/20 bg-chart-4/5">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-chart-4" />
                          Outreach Guardrails
                        </CardTitle>
                        <CardDescription>
                          Automated safety controls to maintain quality and compliance
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Frequency Limits */}
                        <div>
                          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                            Frequency Limits
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background rounded-lg p-3 border">
                              <p className="text-xs text-muted-foreground mb-1">
                                Maximum Touches
                              </p>
                              <p className="text-lg font-semibold">{strategy.guardrails.maxTouches} touches</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                After this, outreach stops automatically
                              </p>
                            </div>
                            <div className="bg-background rounded-lg p-3 border">
                              <p className="text-xs text-muted-foreground mb-1">
                                Voice Escalation
                              </p>
                              <p className="text-lg font-semibold">
                                {strategy.guardrails.voiceEscalationAllowed ? "Allowed" : "Not Allowed"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {strategy.guardrails.voiceEscalationTrigger || "Configured in Agent Instructions"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* AI Auto-Stop Conditions */}
                        <div>
                          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                            AI Auto-Stop Conditions
                          </p>
                          <ul className="space-y-2">
                            {strategy.guardrails.stopConditions.map((condition, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm">
                                <StopCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                                <div>
                                  <span className="font-medium">{condition}</span>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Jazon will immediately stop outreach when this occurs
                                  </p>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Compliance Rules */}
                        <div>
                          <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-3">
                            Compliance Rules
                          </p>
                          <ul className="space-y-2">
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                              <span>No weekend outreach (respects business hours)</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                              <span>Unsubscribe links included in all emails</span>
                            </li>
                            <li className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                              <span>GDPR and CAN-SPAM compliant messaging</span>
                            </li>
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Metrics with Context (Always visible for active/completed leads) */}
                {(outreachStatus === "active" || outreachStatus === "completed") && (
                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Channel Mix</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Email</span>
                            <span className="font-medium">40%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">LinkedIn</span>
                            <span className="font-medium">35%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Voice</span>
                            <span className="font-medium">25%</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
                          Optimized based on ICP segment patterns
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Response Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-bold text-chart-2">32%</div>
                          <TrendingUp className="w-4 h-4 text-chart-2" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Above average for this ICP segment
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                          Team benchmark: 24% • Segment avg: 28%
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Avg. Time to Response</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">18h</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Median response time
                        </p>
                        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t">
                          Faster than enterprise avg: 36h
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Demo Safety Footer */}
                <div className="bg-muted/20 rounded-lg p-3 border border-border/30">
                  <p className="text-xs text-center text-muted-foreground">
                    All actions shown are part of a demo environment and do not affect real systems.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Control Confirmation Dialogs */}
      <Dialog open={!!controlDialogOpen} onOpenChange={() => setControlDialogOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {controlDialogOpen === "pause" && "Pause Outreach"}
              {controlDialogOpen === "voice" && "Force Voice Escalation"}
              {controlDialogOpen === "stop" && "Stop Outreach"}
            </DialogTitle>
            <DialogDescription>
              This action will be logged for audit purposes and require confirmation.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium mb-2 block">
              Reason for override (optional):
            </label>
            <Textarea
              placeholder="Enter a brief explanation for this manual intervention..."
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setControlDialogOpen(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const messages = {
                  pause: "Outreach paused for this lead. All scheduled actions stopped.",
                  voice: "Voice escalation forced for next touch, aligned with escalation rules.",
                  stop: "Outreach stopped for this lead. Marked for review.",
                }
                simulateUpdate(
                  controlDialogOpen || "",
                  messages[controlDialogOpen as keyof typeof messages] || "Action completed"
                )
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}
