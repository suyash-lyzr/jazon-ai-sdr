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
import { mockLeads, mockConversations } from "@/lib/mock-data"
import { Mail, Phone, MessageSquare, ChevronDown, ChevronUp } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ConversationsPage() {
  const [selectedLead, setSelectedLead] = useState("L001")
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())

  const lead = mockLeads.find(l => l.id === selectedLead)
  const conversations = mockConversations[selectedLead] || []

  const toggleMessage = (messageId: string) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedMessages(newExpanded)
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
              <h1 className="text-3xl font-semibold text-foreground">Conversations</h1>
              <p className="text-sm text-muted-foreground">
                Unified communication view across all channels
              </p>
            </div>

            {/* Lead Selector */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium">Select Lead:</label>
                  <Select value={selectedLead} onValueChange={setSelectedLead}>
                    <SelectTrigger className="w-[300px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {mockLeads.filter(l => mockConversations[l.id]).map(lead => (
                        <SelectItem key={lead.id} value={lead.id}>
                          {lead.name} - {lead.company}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lead Summary */}
            {lead && (
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{lead.name}</CardTitle>
                      <CardDescription>
                        {lead.title} at {lead.company}
                      </CardDescription>
                    </div>
                    <Badge variant="default">ICP Score: {lead.icpScore}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Stage
                      </p>
                      <p className="text-sm font-medium">{lead.stage}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Channel
                      </p>
                      <p className="text-sm font-medium">{lead.channel}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Last Contact
                      </p>
                      <p className="text-sm font-medium">{lead.lastContact}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Total Messages
                      </p>
                      <p className="text-sm font-medium">{conversations.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Conversation Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Conversation Timeline</CardTitle>
                <CardDescription>
                  Chronological view of all interactions across email, LinkedIn, and voice
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {conversations.map((msg, idx) => (
                    <div key={msg.id} className="relative">
                      {/* Timeline Line */}
                      {idx < conversations.length - 1 && (
                        <div className="absolute left-[22px] top-12 bottom-0 w-px bg-border" />
                      )}
                      
                      <div className="flex gap-4">
                        {/* Channel Icon */}
                        <div className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                          msg.channel === "email" ? "bg-primary/10 text-primary" :
                          msg.channel === "voice" ? "bg-chart-2/10 text-chart-2" :
                          "bg-chart-3/10 text-chart-3"
                        }`}>
                          {msg.channel === "email" && <Mail className="w-5 h-5" />}
                          {msg.channel === "voice" && <Phone className="w-5 h-5" />}
                          {msg.channel === "linkedin" && <MessageSquare className="w-5 h-5" />}
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {msg.channel}
                              </Badge>
                              <Badge variant={msg.direction === "inbound" ? "default" : "secondary"} className="text-xs">
                                {msg.direction}
                              </Badge>
                            </div>
                            <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                          </div>

                          {msg.subject && (
                            <h4 className="font-semibold text-sm">{msg.subject}</h4>
                          )}

                          {/* Voice Call Summary */}
                          {msg.channel === "voice" && msg.summary ? (
                            <div className="border rounded-lg overflow-hidden">
                              <div className="bg-muted/50 p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div>
                                      <p className="text-xs text-muted-foreground">Duration</p>
                                      <p className="text-sm font-medium">{msg.duration}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground">Outcome</p>
                                      <Badge variant="default" className="text-xs">{msg.outcome}</Badge>
                                    </div>
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleMessage(msg.id)}
                                  >
                                    {expandedMessages.has(msg.id) ? (
                                      <>
                                        <ChevronUp className="w-4 h-4 mr-1" />
                                        Hide Details
                                      </>
                                    ) : (
                                      <>
                                        <ChevronDown className="w-4 h-4 mr-1" />
                                        Show Details
                                      </>
                                    )}
                                  </Button>
                                </div>

                                {expandedMessages.has(msg.id) && (
                                  <>
                                    <div className="pt-3 border-t mt-3">
                                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                        Call Summary
                                      </p>
                                      <p className="text-sm">{msg.summary}</p>
                                    </div>

                                    {msg.objections && msg.objections.length > 0 && (
                                      <div className="pt-3 border-t">
                                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                          Objections Detected
                                        </p>
                                        <ul className="space-y-1.5">
                                          {msg.objections.map((objection, oidx) => (
                                            <li key={oidx} className="text-sm flex items-start gap-2">
                                              <span className="text-destructive mt-0.5">•</span>
                                              <span>{objection}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          ) : (
                            /* Regular Message */
                            <div className="bg-muted/30 rounded-lg p-3">
                              <p className="text-sm">{msg.content}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {conversations.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Communication Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Channel Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-sm">Email</span>
                      </div>
                      <span className="text-sm font-medium">
                        {conversations.filter(c => c.channel === "email").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-chart-3" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <span className="text-sm font-medium">
                        {conversations.filter(c => c.channel === "linkedin").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-chart-2" />
                        <span className="text-sm">Voice</span>
                      </div>
                      <span className="text-sm font-medium">
                        {conversations.filter(c => c.channel === "voice").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Response Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {conversations.length > 0 
                      ? Math.round((conversations.filter(c => c.direction === "inbound").length / conversations.filter(c => c.direction === "outbound").length) * 100)
                      : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversations.filter(c => c.direction === "inbound").length} responses to{" "}
                    {conversations.filter(c => c.direction === "outbound").length} outreach
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Voice Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">
                    {conversations.filter(c => c.channel === "voice").length}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Strategic qualification calls
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

