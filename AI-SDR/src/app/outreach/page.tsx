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
import { Textarea } from "@/components/ui/textarea"
import { mockOutreachStrategies } from "@/lib/mock-data"
import { useJazonApp } from "@/context/jazon-app-context"
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Shield, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  Pause,
  PhoneCall,
  StopCircle,
  UserCheck,
  Rocket,
  AlertCircle,
  TrendingUp,
  Target,
  Info
} from "lucide-react"

export default function OutreachPage() {
  const { leads } = useJazonApp()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [controlDialogOpen, setControlDialogOpen] = useState<string | null>(null)
  const [overrideReason, setOverrideReason] = useState("")

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
    if (selectedLead.stage === "Disqualified") return "disqualified"
    if (selectedLead.stage === "Research") return "not_started"
    if (selectedLead.stage === "Meeting Scheduled") return "completed"
    return "active"
  }

  const outreachStatus = getOutreachStatus()

  const getCurrentPhase = () => {
    if (!selectedLead) return "-"
    if (selectedLead.stage === "Research") return "Awareness"
    if (selectedLead.stage === "Engaged") return "Engagement"
    if (selectedLead.stage === "Qualification") return "Qualification"
    if (selectedLead.stage === "Meeting Scheduled") return "Handoff"
    return "Research"
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
                {/* Outreach Status Strip */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Outreach Status</p>
                      <div className="flex items-center gap-2">
                        {outreachStatus === "active" && (
                          <>
                            <div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
                            <Badge variant="default">Active</Badge>
                          </>
                        )}
                        {outreachStatus === "completed" && (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-chart-2" />
                            <Badge variant="secondary">Completed</Badge>
                          </>
                        )}
                        {outreachStatus === "not_started" && (
                          <>
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <Badge variant="outline">Not Started</Badge>
                          </>
                        )}
                        {outreachStatus === "disqualified" && (
                          <>
                            <StopCircle className="w-4 h-4 text-destructive" />
                            <Badge variant="outline">Stopped</Badge>
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
                        {outreachStatus === "active" ? "Voice call - 2 hours ago" : selectedLead.lastContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Next Planned Action</p>
                      <p className="text-sm font-medium">
                        {outreachStatus === "active" && selectedLead.stage === "Qualification" 
                          ? "Follow-up email - tomorrow" 
                          : outreachStatus === "completed"
                          ? "AE handoff complete"
                          : "Research in progress"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Edge Cases: No Outreach Started */}
                {outreachStatus === "not_started" && (
                  <Card className="border-border/50">
                    <CardContent className="py-12 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-full bg-muted">
                          <Rocket className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">No outreach started for this lead</h3>
                          <p className="text-sm text-muted-foreground">
                            Jazon is completing ICP validation before initiating outreach
                          </p>
                        </div>
                        <Button className="gap-2">
                          <Rocket className="w-4 h-4" />
                          Start outreach using Research & ICP
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Edge Cases: Disqualified */}
                {outreachStatus === "disqualified" && (
                  <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="py-8">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-destructive/10">
                          <StopCircle className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Outreach Disabled</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            This lead was disqualified and outreach has been automatically stopped.
                          </p>
                          <div className="bg-background rounded-lg p-3 border">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Disqualification Reason
                            </p>
                            <p className="text-sm">
                              Low ICP score - wrong market segment. Early disqualification prevented wasted AE time.
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Edge Cases: Completed */}
                {outreachStatus === "completed" && (
                  <Card className="border-chart-2/20 bg-chart-2/5">
                    <CardContent className="py-8">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-chart-2/10">
                          <CheckCircle2 className="w-6 h-6 text-chart-2" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-2">Outreach Successfully Completed</h3>
                          <p className="text-sm text-muted-foreground">
                            Lead fully qualified and meeting scheduled. Outreach strategy achieved its goal.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Active Outreach Content */}
                {outreachStatus === "active" && (
                  <>
                    {/* AI-Generated Strategy */}
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

                    {/* Message History - Enterprise Grade */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Message History</CardTitle>
                        <CardDescription>
                          Each message annotated with AI personalization elements and outcomes for full auditability
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {strategy.messages.map((msg, idx) => (
                            <div key={idx} className="border rounded-lg p-4 space-y-3 bg-card">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="outline" className="text-xs">Step {msg.step}</Badge>
                                    <Badge variant="secondary" className="text-xs">{msg.channel}</Badge>
                                    <Badge variant="outline" className="text-xs">Outbound</Badge>
                                    <Badge variant="default" className="text-xs bg-primary/80">AI-generated</Badge>
                                    {msg.sent && <CheckCircle2 className="w-4 h-4 text-chart-2" />}
                                  </div>
                                  <h4 className="font-semibold text-sm">{msg.subject}</h4>
                                </div>
                                {msg.result && (
                                  <Badge variant="default" className="text-xs shrink-0">{msg.result}</Badge>
                                )}
                              </div>

                              <p className="text-sm text-muted-foreground leading-relaxed">{msg.preview}</p>

                              <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                  AI Personalization Elements Used
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {msg.personalization.map((item, pidx) => (
                                    <Badge key={pidx} variant="outline" className="text-xs">
                                      {item}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Outreach Guardrails - Explicit & Grouped */}
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

                    {/* Metrics with Context */}
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
                  </>
                )}
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
