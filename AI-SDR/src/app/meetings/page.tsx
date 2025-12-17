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
import { mockMeetings } from "@/lib/mock-data"
import { Calendar, Building2, FileText, AlertCircle, TrendingUp, Target } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default function MeetingsPage() {
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null)

  const meeting = selectedMeeting ? mockMeetings.find(m => m.id === selectedMeeting) : null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming": return "default"
      case "completed": return "secondary"
      case "cancelled": return "outline"
      default: return "outline"
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
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Meetings & AE Handoffs</h1>
              <p className="text-sm text-muted-foreground">
                Enterprise-ready handoff packages for seamless AE collaboration
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Upcoming Meetings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary">
                    {mockMeetings.filter(m => m.status === "upcoming").length}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">This Week</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">5</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Show Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">94%</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg. Meeting Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$287K</div>
                </CardContent>
              </Card>
            </div>

            {/* Upcoming Meetings List */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduled Meetings</CardTitle>
                <CardDescription>
                  Click any meeting to view the complete AE handoff package
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMeetings.map((meeting) => (
                    <div key={meeting.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{meeting.leadName}</h3>
                            <Badge variant={getStatusColor(meeting.status)}>
                              {meeting.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-4 h-4" />
                              {meeting.company}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4" />
                              {meeting.scheduledFor}
                            </div>
                          </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <FileText className="w-4 h-4 mr-2" />
                              View Handoff Pack
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>AE Handoff Package</DialogTitle>
                              <DialogDescription>
                                {meeting.leadName} at {meeting.company}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-6 mt-4">
                              {/* Research Summary */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    Research Summary
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">{meeting.handoffPack.researchSummary}</p>
                                </CardContent>
                              </Card>

                              {/* Qualification Notes */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Qualification Notes
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {meeting.handoffPack.qualificationNotes.map((note, idx) => (
                                      <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-chart-2 mt-1">•</span>
                                        <span>{note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              {/* Objections Raised */}
                              <Card className="border-destructive/20 bg-destructive/5">
                                <CardHeader>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-destructive" />
                                    Objections Raised
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {meeting.handoffPack.objectionsRaised.map((objection, idx) => (
                                      <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-destructive mt-1">•</span>
                                        <span>{objection}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              {/* Suggested Talk Track */}
                              <Card className="border-primary/20 bg-primary/5">
                                <CardHeader>
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    Suggested Talk Track
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <ul className="space-y-2">
                                    {meeting.handoffPack.suggestedTalkTrack.map((point, idx) => (
                                      <li key={idx} className="text-sm flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>{point}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </CardContent>
                              </Card>

                              {/* Why This Meeting Was Booked */}
                              <Card className="border-chart-2/20 bg-chart-2/5">
                                <CardHeader>
                                  <CardTitle className="text-base">Why This Meeting Was Booked</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm">{meeting.handoffPack.whyBooked}</p>
                                </CardContent>
                              </Card>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Qualification
                          </p>
                          <p className="text-sm font-medium">
                            {meeting.handoffPack.qualificationNotes.length} criteria met
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Objections
                          </p>
                          <p className="text-sm font-medium">
                            {meeting.handoffPack.objectionsRaised.length} identified
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Talk Track Points
                          </p>
                          <p className="text-sm font-medium">
                            {meeting.handoffPack.suggestedTalkTrack.length} suggested
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Package Status
                          </p>
                          <Badge variant="default" className="text-xs">Ready</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Handoff Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Handoff Quality Metrics</CardTitle>
                <CardDescription>
                  Measuring the effectiveness of AI-prepared handoff packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">AE Satisfaction</span>
                      <span className="text-sm font-medium">4.8/5.0</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-chart-2" style={{ width: "96%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Information Accuracy</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-chart-2" style={{ width: "94%" }} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Meeting-to-Opportunity</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-chart-2" style={{ width: "78%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Best Practices */}
            <Card className="border-chart-4/20 bg-chart-4/5">
              <CardHeader>
                <CardTitle>Handoff Package Best Practices</CardTitle>
                <CardDescription>
                  What makes an effective AE handoff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Always Include</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Full BANT qualification with confidence scores</li>
                      <li>• Company research and ICP scoring rationale</li>
                      <li>• All objections raised and how they were handled</li>
                      <li>• Specific talk track based on conversation history</li>
                      <li>• Clear explanation of why meeting was booked</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Quality Indicators</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• High confidence scores (80%+) on all BANT criteria</li>
                      <li>• Multiple conversation touchpoints documented</li>
                      <li>• Voice call confirmation for high-value deals</li>
                      <li>• Specific timeline and budget range confirmed</li>
                      <li>• Decision maker authority verified</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

