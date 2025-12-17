"use client"

import { useState } from "react"
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
import { mockOutreachStrategies } from "@/lib/mock-data"
import { Mail, Phone, MessageSquare, Shield, CheckCircle2, Clock } from "lucide-react"

export default function OutreachPage() {
  const strategy = mockOutreachStrategies[0]
  const [statusNote, setStatusNote] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const simulateUpdate = (nextState: string) => {
    setIsUpdating(true)
    setStatusNote("Jazon logging change for audit purposes…")
    setTimeout(() => {
      setStatusNote(nextState)
      setIsUpdating(false)
    }, 800)
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
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Outreach Engine</h1>
              <p className="text-sm text-muted-foreground">
                Strategic, multi-channel engagement - not email blasting
              </p>
            </div>

            {/* Active Strategy Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{strategy.leadName} - {strategy.company}</CardTitle>
                    <CardDescription>Active outreach strategy</CardDescription>
                  </div>
                  <Badge variant="default">{strategy.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Strategy Progress</span>
                      <span className="text-sm text-muted-foreground">
                        Step {strategy.currentStep} of {strategy.totalSteps}
                      </span>
                    </div>
                    <Progress value={(strategy.currentStep / strategy.totalSteps) * 100} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Channel Strategy */}
            <Card>
              <CardHeader>
                <CardTitle>Multi-Channel Strategy</CardTitle>
                <CardDescription>
                  Intelligent escalation across channels based on engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {strategy.channelStrategy.map((channel, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className={`p-3 rounded-lg ${
                        channel.status === "completed" ? "bg-chart-2/10 text-chart-2" :
                        channel.status === "active" ? "bg-primary/10 text-primary" :
                        "bg-muted text-muted-foreground"
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
                            <Clock className="w-4 h-4 text-primary animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{channel.goal}</p>
                        {channel.reasoning && (
                          <div className="bg-muted/50 rounded-lg p-3 mt-2">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Why this channel
                            </p>
                            <p className="text-sm">{channel.reasoning}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Message Preview Cards */}
            <Card>
              <CardHeader>
                <CardTitle>Message History</CardTitle>
                <CardDescription>
                  Each message annotated with personalization elements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {strategy.messages.map((msg, idx) => (
                    <div key={idx} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">Step {msg.step}</Badge>
                            <Badge variant="secondary">{msg.channel}</Badge>
                            {msg.sent && <CheckCircle2 className="w-4 h-4 text-chart-2" />}
                          </div>
                          <h4 className="font-semibold text-sm mt-2">{msg.subject}</h4>
                        </div>
                        {msg.result && (
                          <Badge variant="default" className="text-xs">{msg.result}</Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">{msg.preview}</p>

                      <div className="bg-muted/50 rounded-lg p-3">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          Personalization Elements
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

            {/* Guardrails */}
            <Card className="border-chart-4/20 bg-chart-4/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Outreach Guardrails
                </CardTitle>
                <CardDescription>
                  Automated safety controls to maintain quality and compliance
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => simulateUpdate("Outreach paused for this strategy (demo).")}
                  >
                    Pause Outreach
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() =>
                      simulateUpdate(
                        "Voice escalation forced for next touch, aligned with your escalation rules (demo).",
                      )
                    }
                  >
                    Force Voice Escalation
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => simulateUpdate("Campaign stopped for this lead (demo).")}
                  >
                    Stop Campaign
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Maximum Touches
                    </p>
                    <p className="text-lg font-semibold">{strategy.guardrails.maxTouches} touches</p>
                  </div>
                  
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Voice Escalation
                    </p>
                    <p className="text-lg font-semibold">
                      {strategy.guardrails.voiceEscalationAllowed ? "Allowed" : "Not Allowed"}
                    </p>
                  </div>
                </div>

                {strategy.guardrails.voiceEscalationTrigger && (
                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Voice Escalation Trigger
                    </p>
                    <p className="text-sm">{strategy.guardrails.voiceEscalationTrigger}</p>
                  </div>
                )}

                <div className="pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Auto-Stop Conditions
                  </p>
                  <ul className="space-y-2">
                    {strategy.guardrails.stopConditions.map((condition, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-destructive mt-0.5">•</span>
                        <span>{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <p className="text-xs text-muted-foreground">
                  Changes are logged for audit purposes in this demo, without modifying any real systems.
                </p>
                {statusNote && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {statusNote}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Strategy Insights */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Channel Mix</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
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
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">32%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Above average for this ICP segment
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

