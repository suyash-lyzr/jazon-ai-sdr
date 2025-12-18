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
import { mockConversations } from "@/lib/mock-data"
import { useJazonApp } from "@/context/jazon-app-context"
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Eye,
  FileText,
  Copy
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MessageWithTimeBucket {
  message: typeof mockConversations[string][0]
  timeBucket: string
  sortOrder: number
}

export default function ConversationsPage() {
  const { leads } = useJazonApp()
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null)
  const [expandedMessages, setExpandedMessages] = useState<Set<string>>(new Set())
  const [expandedAIInsights, setExpandedAIInsights] = useState<Set<string>>(new Set())
  const [expandedMessageContent, setExpandedMessageContent] = useState<Set<string>>(new Set())

  // Default to first lead with conversations
  const defaultLead = useMemo(() => {
    if (leads.length === 0) return null
    return leads.find(l => mockConversations[l.id]?.length > 0) || leads[0]
  }, [leads])

  const selectedLead = selectedLeadId
    ? leads.find(l => l.id === selectedLeadId) || defaultLead
    : defaultLead

  const conversations = selectedLead ? mockConversations[selectedLead.id] || [] : []

  // Helper: Parse timestamp to date for sorting
  const parseTimestamp = (timestamp: string): Date => {
    const now = new Date()
    if (timestamp.includes("hour")) {
      const hours = parseInt(timestamp.match(/(\d+)\s*hour/)?.[1] || "0")
      return new Date(now.getTime() - hours * 60 * 60 * 1000)
    }
    if (timestamp.includes("day")) {
      const days = parseInt(timestamp.match(/(\d+)\s*day/)?.[1] || "0")
      return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
    }
    if (timestamp.includes("week")) {
      const weeks = parseInt(timestamp.match(/(\d+)\s*week/)?.[1] || "0")
      return new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000)
    }
    return now
  }

  // Helper: Group messages by time bucket
  const getTimeBucket = (timestamp: string): string => {
    const date = parseTimestamp(timestamp)
    const now = new Date()
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffHours < 24) return "Today"
    if (diffHours < 48) return "Yesterday"
    if (diffHours < 168) return "Earlier this week"
    return "Older"
  }

  // Sort and group conversations (newest first)
  const groupedConversations = useMemo(() => {
    if (conversations.length === 0) return []
    
    // Sort by timestamp (newest first)
    const sorted = [...conversations].sort((a, b) => {
      const dateA = parseTimestamp(a.timestamp)
      const dateB = parseTimestamp(b.timestamp)
      return dateB.getTime() - dateA.getTime()
    })

    // Group by time bucket
    const grouped: Record<string, MessageWithTimeBucket[]> = {}
    sorted.forEach((msg, idx) => {
      const bucket = getTimeBucket(msg.timestamp)
      if (!grouped[bucket]) grouped[bucket] = []
      grouped[bucket].push({
        message: msg,
        timeBucket: bucket,
        sortOrder: idx,
      })
    })

    return grouped
  }, [conversations])

  // Generate AI insights for each message
  const getAIInsight = (msg: typeof conversations[0]): string[] => {
    const insights: string[] = []
    
    if (msg.channel === "voice" && msg.outcome === "Qualified") {
      insights.push("Triggered escalation to voice")
      insights.push("Confirmed technical fit and budget authority")
    } else if (msg.direction === "inbound" && msg.channel === "email") {
      insights.push("Detected buying intent from response")
      insights.push("Confirmed active evaluation in progress")
    } else if (msg.direction === "outbound" && msg.channel === "email") {
      if (msg.subject?.toLowerCase().includes("qualification")) {
        insights.push("Initial outreach based on ICP score and triggers")
      }
    } else if (msg.channel === "linkedin" && msg.direction === "outbound") {
      insights.push("Multi-channel engagement strategy")
      insights.push("Building rapport before voice escalation")
    }
    
    if (insights.length === 0) {
      insights.push("Part of multi-channel qualification sequence")
    }
    
    return insights
  }

  // Determine conversation status
  const getConversationStatus = (): {
    status: string
    lastSignal: string
    health: "positive" | "neutral" | "stalled"
  } => {
    if (!selectedLead || conversations.length === 0) {
      return {
        status: "No conversations yet",
        lastSignal: "N/A",
        health: "neutral",
      }
    }

    const lastMessage = conversations[0]
    const hasVoice = conversations.some(m => m.channel === "voice")
    const hasInbound = conversations.some(m => m.direction === "inbound")

    let status = ""
    let lastSignal = ""
    let health: "positive" | "neutral" | "stalled" = "neutral"

    if (hasVoice && lastMessage.outcome === "Qualified") {
      status = "Qualified via voice call"
      lastSignal = "Budget confirmed in last call"
      health = "positive"
    } else if (hasInbound) {
      status = "Engaged, awaiting response"
      lastSignal = "Active evaluation confirmed"
      health = "positive"
    } else if (selectedLead.stage === "Disqualified") {
      status = "Disqualified due to low ICP"
      lastSignal = "ICP score below threshold"
      health = "stalled"
    } else {
      status = "Outreach in progress"
      lastSignal = "No response yet"
      health = "neutral"
    }

    return { status, lastSignal, health }
  }

  const conversationContext = getConversationStatus()

  const toggleMessage = (messageId: string) => {
    const newExpanded = new Set(expandedMessages)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedMessages(newExpanded)
  }

  const toggleAIInsight = (messageId: string) => {
    const newExpanded = new Set(expandedAIInsights)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedAIInsights(newExpanded)
  }

  const toggleMessageContent = (messageId: string) => {
    const newExpanded = new Set(expandedMessageContent)
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId)
    } else {
      newExpanded.add(messageId)
    }
    setExpandedMessageContent(newExpanded)
  }

  // Calculate engagement rate
  const engagementRate = useMemo(() => {
    if (conversations.length === 0) return 0
    const outbound = conversations.filter(c => c.direction === "outbound").length
    const inbound = conversations.filter(c => c.direction === "inbound").length
    return outbound > 0 ? Math.round((inbound / outbound) * 100) : 0
  }, [conversations])

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
                <h1 className="text-3xl font-semibold text-foreground">Conversations</h1>
                <p className="text-sm text-muted-foreground">
                  Unified communication view across all channels
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
                      .filter(l => mockConversations[l.id]?.length > 0)
                      .map((lead) => (
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

            {/* Conversation Context Summary */}
            {selectedLead && (
              <div className="bg-muted/30 rounded-lg border border-border/50 p-4">
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Current Stage
                    </p>
                    <p className="text-sm font-medium">{selectedLead.stage}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      AI Conversation Status
                    </p>
                    <p className="text-sm font-medium">{conversationContext.status}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Last Meaningful Signal
                    </p>
                    <p className="text-sm font-medium">{conversationContext.lastSignal}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                      Conversation Health
                    </p>
                    <Badge
                      variant={
                        conversationContext.health === "positive"
                          ? "default"
                          : conversationContext.health === "stalled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-xs"
                    >
                      {conversationContext.health === "positive"
                        ? "Positive"
                        : conversationContext.health === "stalled"
                        ? "Stalled"
                        : "Neutral"}
                    </Badge>
                  </div>
                </div>
              </div>
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
                {/* Read-only Banner */}
                <Alert className="mb-6">
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    This timeline shows the exact messages exchanged across channels. Messaging actions and strategy controls are managed in the Outreach Engine.
                  </AlertDescription>
                </Alert>

                {conversations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">No conversations yet</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupedConversations).map(([bucket, messages]) => (
                      <div key={bucket}>
                        {/* Time Bucket Label */}
                        <div className="flex items-center gap-2 mb-4">
                          <div className="h-px flex-1 bg-border" />
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide px-2">
                            {bucket}
                          </span>
                          <div className="h-px flex-1 bg-border" />
                        </div>

                        {/* Messages in this bucket */}
                        <div className="space-y-6">
                          {messages.map(({ message: msg }, idx) => (
                            <div key={msg.id} className="relative">
                              {/* Timeline Line */}
                              {idx < messages.length - 1 && (
                                <div className="absolute left-[22px] top-12 bottom-0 w-px bg-border" />
                              )}

                              <div className="flex gap-4">
                                {/* Channel Icon */}
                                <div
                                  className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${
                                    msg.channel === "email"
                                      ? "bg-primary/10 text-primary"
                                      : msg.channel === "voice"
                                      ? "bg-chart-2/10 text-chart-2"
                                      : "bg-chart-3/10 text-chart-3"
                                  }`}
                                >
                                  {msg.channel === "email" && <Mail className="w-5 h-5" />}
                                  {msg.channel === "voice" && <Phone className="w-5 h-5" />}
                                  {msg.channel === "linkedin" && (
                                    <MessageSquare className="w-5 h-5" />
                                  )}
                                </div>

                                {/* Message Content */}
                                <div className="flex-1 space-y-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        {msg.channel}
                                      </Badge>
                                      <Badge
                                        variant={
                                          msg.direction === "inbound" ? "default" : "secondary"
                                        }
                                        className="text-xs"
                                      >
                                        {msg.direction}
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                      {msg.timestamp}
                                    </span>
                                  </div>

                                  {msg.subject && (
                                    <h4 className="font-semibold text-sm">{msg.subject}</h4>
                                  )}

                                  {/* Voice Call Summary */}
                                  {msg.channel === "voice" && msg.summary ? (
                                    <div className="border rounded-lg overflow-hidden">
                                      <div className="bg-muted/50 p-3 space-y-3">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-4">
                                            <div>
                                              <p className="text-xs text-muted-foreground">
                                                Duration
                                              </p>
                                              <p className="text-sm font-medium">{msg.duration}</p>
                                            </div>
                                            <div>
                                              <p className="text-xs text-muted-foreground">
                                                Outcome
                                              </p>
                                              <Badge variant="default" className="text-xs">
                                                {msg.outcome}
                                              </Badge>
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
                                          <div className="pt-3 border-t space-y-4">
                                            {/* AI Call Summary */}
                                            <div>
                                              <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-4 h-4 text-primary" />
                                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                  AI Call Summary
                                                </p>
                                              </div>
                                              <div className="space-y-3">
                                                <div>
                                                  <p className="text-xs font-medium mb-1">
                                                    Key Points Discussed
                                                  </p>
                                                  <p className="text-sm">{msg.summary}</p>
                                                </div>
                                                {msg.objections && msg.objections.length > 0 && (
                                                  <div>
                                                    <p className="text-xs font-medium mb-1">
                                                      Objections Raised
                                                    </p>
                                                    <ul className="space-y-1.5">
                                                      {msg.objections.map((objection, oidx) => (
                                                        <li
                                                          key={oidx}
                                                          className="text-sm flex items-start gap-2"
                                                        >
                                                          <span className="text-destructive mt-0.5">
                                                            •
                                                          </span>
                                                          <span>{objection}</span>
                                                        </li>
                                                      ))}
                                                    </ul>
                                                  </div>
                                                )}
                                                <div>
                                                  <p className="text-xs font-medium mb-1">
                                                    Signals Detected
                                                  </p>
                                                  <div className="flex flex-wrap gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                      Budget: Confirmed
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                      Authority: Economic buyer
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                      Timeline: Q1
                                                    </Badge>
                                                  </div>
                                                </div>
                                                <div>
                                                  <p className="text-xs font-medium mb-1">
                                                    Impact on Qualification Decision
                                                  </p>
                                                  <p className="text-sm text-muted-foreground">
                                                    Voice call confirmed all BANT criteria. Lead
                                                    qualified and escalated to AE handoff.
                                                  </p>
                                                </div>
                                              </div>
                                            </div>

                                            {/* Voice Script Used */}
                                            {msg.scriptUsed && (
                                              <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                  <FileText className="w-4 h-4 text-primary" />
                                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                                    Script Used (AI-Generated)
                                                  </p>
                                                </div>
                                                <div className="bg-background rounded-lg p-4 border border-border/30">
                                                  <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">
{msg.scriptUsed}
                                                  </pre>
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        )}

                                        {/* AI Insight (collapsed by default) */}
                                        <Collapsible
                                          open={expandedAIInsights.has(msg.id)}
                                          onOpenChange={() => toggleAIInsight(msg.id)}
                                        >
                                          <CollapsibleTrigger asChild>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="w-full justify-start text-xs text-muted-foreground"
                                            >
                                              <Sparkles className="w-3 h-3 mr-1" />
                                              Why this interaction mattered
                                              {expandedAIInsights.has(msg.id) ? (
                                                <ChevronUp className="w-3 h-3 ml-auto" />
                                              ) : (
                                                <ChevronDown className="w-3 h-3 ml-auto" />
                                              )}
                                            </Button>
                                          </CollapsibleTrigger>
                                          <CollapsibleContent>
                                            <div className="pt-2 border-t mt-2">
                                              <p className="text-xs font-medium text-muted-foreground mb-2">
                                                AI Insight
                                              </p>
                                              <ul className="space-y-1.5">
                                                {getAIInsight(msg).map((insight, iidx) => (
                                                  <li key={iidx} className="text-xs flex items-start gap-2">
                                                    <span className="text-primary mt-0.5">•</span>
                                                    <span>{insight}</span>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          </CollapsibleContent>
                                        </Collapsible>
                                      </div>
                                    </div>
                                  ) : (
                                    /* Regular Message */
                                    <div className="space-y-3">
                                      <div className="bg-muted/30 rounded-lg p-3">
                                        <p className="text-sm">{msg.content}</p>
                                      </div>

                                      {/* View Message Content Button */}
                                      {msg.body && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleMessageContent(msg.id)}
                                          className="w-full justify-start text-xs"
                                        >
                                          <Eye className="w-3 h-3 mr-2" />
                                          {expandedMessageContent.has(msg.id) ? "Hide" : "View"} Full Message Content
                                          {expandedMessageContent.has(msg.id) ? (
                                            <ChevronUp className="w-3 h-3 ml-auto" />
                                          ) : (
                                            <ChevronDown className="w-3 h-3 ml-auto" />
                                          )}
                                        </Button>
                                      )}

                                      {/* Expanded Message Content */}
                                      {expandedMessageContent.has(msg.id) && msg.body && (
                                        <div className="bg-background rounded-lg p-4 border border-border/30 space-y-3">
                                          <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                              <Badge variant="outline" className="text-xs">
                                                {msg.channel === "email" ? "Email Content" : msg.channel === "linkedin" ? "LinkedIn Message" : "WhatsApp Message"}
                                              </Badge>
                                              <Badge variant="secondary" className="text-xs">
                                                {msg.direction}
                                              </Badge>
                                              {msg.aiGenerated && (
                                                <Badge variant="outline" className="text-xs bg-primary/5 border-primary/20">
                                                  AI-generated
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                          
                                          {msg.subject && (
                                            <div>
                                              <p className="text-xs font-medium text-muted-foreground mb-1">Subject</p>
                                              <p className="text-sm font-medium">{msg.subject}</p>
                                            </div>
                                          )}
                                          
                                          <div>
                                            <p className="text-xs font-medium text-muted-foreground mb-2">Message Body</p>
                                            <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                                              <pre className="text-sm whitespace-pre-wrap text-foreground leading-relaxed font-sans">
{msg.body}
                                              </pre>
                                            </div>
                                          </div>
                                          
                                          {msg.personalizationTokens && msg.personalizationTokens.length > 0 && (
                                            <div>
                                              <p className="text-xs font-medium text-muted-foreground mb-2">Personalization Tokens Used</p>
                                              <div className="flex flex-wrap gap-2">
                                                {msg.personalizationTokens.map((token, tidx) => (
                                                  <Badge key={tidx} variant="outline" className="text-xs">
                                                    {token}
                                                  </Badge>
                                                ))}
                                              </div>
                                            </div>
                                          )}
                                          
                                          <div className="pt-2 border-t text-xs text-muted-foreground">
                                            This shows the exact content sent to the lead for full transparency and auditability.
                                          </div>
                                        </div>
                                      )}

                                      {/* AI Insight (collapsed by default) */}
                                      <Collapsible
                                        open={expandedAIInsights.has(msg.id)}
                                        onOpenChange={() => toggleAIInsight(msg.id)}
                                      >
                                        <CollapsibleTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="w-full justify-start text-xs text-muted-foreground"
                                          >
                                            <Sparkles className="w-3 h-3 mr-1" />
                                            Why this interaction mattered
                                            {expandedAIInsights.has(msg.id) ? (
                                              <ChevronUp className="w-3 h-3 ml-auto" />
                                            ) : (
                                              <ChevronDown className="w-3 h-3 ml-auto" />
                                            )}
                                          </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                          <div className="pt-2 border-t mt-2">
                                            <p className="text-xs font-medium text-muted-foreground mb-2">
                                              AI Insight
                                            </p>
                                            <ul className="space-y-1.5">
                                              {getAIInsight(msg).map((insight, iidx) => (
                                                <li
                                                  key={iidx}
                                                  className="text-xs flex items-start gap-2"
                                                >
                                                  <span className="text-primary mt-0.5">•</span>
                                                  <span>{insight}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </CollapsibleContent>
                                      </Collapsible>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
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
                        {conversations.filter((c) => c.channel === "email").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-chart-3" />
                        <span className="text-sm">LinkedIn</span>
                      </div>
                      <span className="text-sm font-medium">
                        {conversations.filter((c) => c.channel === "linkedin").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-chart-2" />
                        <span className="text-sm">Voice</span>
                      </div>
                      <span className="text-sm font-medium">
                        {conversations.filter((c) => c.channel === "voice").length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm">Engagement Rate</CardTitle>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p className="text-xs">
                            Engagement counts inbound responses (email replies, LinkedIn messages)
                            within 7 days of outbound outreach. Voice calls are not included in
                            this calculation.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{engagementRate}%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {conversations.filter((c) => c.direction === "inbound").length} responses to{" "}
                    {conversations.filter((c) => c.direction === "outbound").length} outreach
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Voice Calls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">
                    {conversations.filter((c) => c.channel === "voice").length}
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
