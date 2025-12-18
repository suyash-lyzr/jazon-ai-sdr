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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { mockConversations, mockQualificationData, mockMeetings } from "@/lib/mock-data"
import { useJazonApp } from "@/context/jazon-app-context"
import { Search, Filter, ArrowUpDown, Mail, Phone, MessageSquare, Clock, CheckCircle2, AlertCircle, Plus, Database, Upload, HelpCircle, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LeadsPage() {
  const { leads } = useJazonApp()
  const router = useRouter()
  const [selectedLead, setSelectedLead] = useState<string | null>(null)
  const [filterStage, setFilterStage] = useState<string>("all")
  const [filterSource, setFilterSource] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [addLeadsOpen, setAddLeadsOpen] = useState(false)

  const lead = selectedLead ? leads.find((l) => l.id === selectedLead) : null
  const conversations = selectedLead ? mockConversations[selectedLead] || [] : []
  const qualification = selectedLead ? mockQualificationData[selectedLead] : null
  const meeting = selectedLead ? mockMeetings.find((m) => m.leadId === selectedLead) : null
  const voiceMessages = conversations.filter((msg) => msg.channel === "voice")

  const filteredLeads = useMemo(
    () =>
      leads.filter((lead) => {
        const matchesSearch =
          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lead.company.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStage = filterStage === "all" || lead.stage === filterStage
        const matchesSource = filterSource === "all" || lead.source?.toLowerCase() === filterSource.toLowerCase()
        return matchesSearch && matchesStage && matchesSource
      }),
    [leads, searchQuery, filterStage, filterSource],
  )

  const getIcpScoreColor = (score: number) => {
    if (score >= 85) return "text-chart-2"
    if (score >= 70) return "text-chart-4"
    return "text-muted-foreground"
  }

  const getIcpScoreBg = (score: number) => {
    if (score >= 85) return "bg-chart-2/10"
    if (score >= 70) return "bg-chart-4/10"
    return "bg-muted"
  }

  const getIcpScoreLabel = (score: number) => {
    if (score >= 85) return "High fit"
    if (score >= 70) return "Medium fit"
    return "Low fit"
  }

  const getStageExplanation = (stage: string) => {
    switch (stage) {
      case "Research": return "AI validating ICP fit before initiating outreach"
      case "Engaged": return "AI nurturing with multi-channel sequence"
      case "Qualification": return "AI validating BANT signals (Need, Authority, Timeline, Budget)"
      case "Meeting Scheduled": return "Fully qualified - AI prepared AE handoff"
      case "Disqualified": return "AI determined low fit - saved AE time"
      default: return "AI processing lead"
    }
  }

  const getRecommendationReason = (lead: typeof leads[0]) => {
    const reasons = []
    if (lead.icpScore >= 85) reasons.push(`ICP score ${lead.icpScore}`)
    if (lead.stage === "Qualification") reasons.push("High engagement signals")
    if (lead.stage === "Meeting Scheduled") reasons.push("BANT confirmed")
    return reasons.join(" • ") || "Evaluating lead"
  }

  const getStageColor = (stage: string) => {
    switch (stage) {
      case "Qualification": return "default"
      case "Meeting Scheduled": return "default"
      case "Engaged": return "secondary"
      case "Disqualified": return "outline"
      default: return "outline"
    }
  }

  const getChannelIcon = (channel: string) => {
    if (channel.includes("Email")) return <Mail className="w-3 h-3" />
    if (channel.includes("Voice")) return <Phone className="w-3 h-3" />
    if (channel.includes("LinkedIn")) return <MessageSquare className="w-3 h-3" />
    return <Mail className="w-3 h-3" />
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
              <h1 className="text-3xl font-semibold text-foreground">Leads</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered system of record where Jazon evaluates, qualifies, and decides next actions for every lead.
              </p>
            </div>

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-1 gap-2">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={filterStage} onValueChange={setFilterStage}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stages</SelectItem>
                        <SelectItem value="Qualification">Qualification</SelectItem>
                        <SelectItem value="Engaged">Engaged</SelectItem>
                        <SelectItem value="Meeting Scheduled">Meeting Scheduled</SelectItem>
                        <SelectItem value="Research">Research</SelectItem>
                        <SelectItem value="Disqualified">Disqualified</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={filterSource} onValueChange={setFilterSource}>
                      <SelectTrigger className="w-[180px]">
                        <Database className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sources</SelectItem>
                        <SelectItem value="apollo">Apollo</SelectItem>
                        <SelectItem value="salesforce">Salesforce</SelectItem>
                        <SelectItem value="hubspot">HubSpot</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{filteredLeads.length} leads</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => router.push("/leads/outbound")}
                    >
                      <Sparkles className="w-4 h-4" />
                      Find Outbound Leads
                    </Button>
                    <Dialog open={addLeadsOpen} onOpenChange={setAddLeadsOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Plus className="w-4 h-4" />
                          Add Leads
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Leads</DialogTitle>
                          <DialogDescription>
                            Choose how to add leads to Jazon for AI processing
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 py-4">
                          <Button
                            variant="outline"
                            className="h-auto p-4 justify-start"
                            onClick={() => {
                              // Demo action
                              setAddLeadsOpen(false)
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <Database className="w-5 h-5 mt-0.5 text-primary" />
                              <div className="flex-1 text-left">
                                <p className="font-medium">Sync from CRM</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Connect Salesforce or HubSpot for automatic lead sync (demo)
                                </p>
                              </div>
                            </div>
                          </Button>
                          <Button
                            variant="outline"
                            className="h-auto p-4 justify-start"
                            onClick={() => {
                              // Demo action
                              setAddLeadsOpen(false)
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <Upload className="w-5 h-5 mt-0.5 text-primary" />
                              <div className="flex-1 text-left">
                                <p className="font-medium">One-time CSV Upload</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  For pilots or demos only. Configure in Setup for production use.
                                </p>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leads Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Leads</CardTitle>
                <CardDescription>
                  Click any lead to drill down into AI decision reasoning and evidence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Lead</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1">
                            ICP Score
                            <ArrowUpDown className="w-3 h-3" />
                          </div>
                        </TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Lead Source</TableHead>
                        <TableHead>Ingestion Date</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead>Last Contact</TableHead>
                        <TableHead className="font-semibold">
                          <div className="flex items-center gap-1.5">
                            AI Recommendation
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Hover over recommendations to see why Jazon made this decision</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLeads.map((lead) => (
                        <TableRow 
                          key={lead.id} 
                          className="cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => setSelectedLead(lead.id)}
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-xs text-muted-foreground">{lead.title}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{lead.company}</p>
                              <p className="text-xs text-muted-foreground">{lead.industry}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex flex-col items-center gap-1">
                                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getIcpScoreBg(lead.icpScore)}`}>
                                    <span className={`text-lg font-bold ${getIcpScoreColor(lead.icpScore)}`}>
                                      {lead.icpScore}
                                    </span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {getIcpScoreLabel(lead.icpScore)}
                                  </span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {lead.icpScore >= 85 ? "High fit" : lead.icpScore >= 70 ? "Medium fit" : "Low fit"} - {lead.icpScore}/100 ICP score
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant={getStageColor(lead.stage)} className="cursor-help">
                                  {lead.stage}
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{getStageExplanation(lead.stage)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              {lead.source === "Apollo" && <Search className="w-3.5 h-3.5 text-chart-3" />}
                              {lead.source === "Salesforce" && <Database className="w-3.5 h-3.5 text-primary" />}
                              {lead.source === "HubSpot" && <Database className="w-3.5 h-3.5 text-chart-2" />}
                              {lead.source === "CSV" && <Upload className="w-3.5 h-3.5 text-muted-foreground" />}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  lead.source === "Apollo" ? "border-chart-3/30 bg-chart-3/5 text-chart-3" :
                                  lead.source === "Salesforce" ? "border-primary/30 bg-primary/5" :
                                  lead.source === "HubSpot" ? "border-chart-2/30 bg-chart-2/5 text-chart-2" :
                                  ""
                                }`}
                              >
                                {lead.source || "Unknown"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {lead.ingestedAt || "Not recorded"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="flex items-center gap-1.5 cursor-help">
                                  {getChannelIcon(lead.channel)}
                                  <span className="text-sm">{lead.channel}</span>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  {lead.channel.includes("Voice") 
                                    ? "Voice is only triggered when ICP score and engagement thresholds are met"
                                    : "Multi-channel sequence. Voice escalation occurs when thresholds are met"}
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {lead.lastContact}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <p className="text-sm font-medium text-foreground truncate cursor-help">
                                  {lead.aiRecommendation}
                                </p>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <p className="font-medium mb-1">Why?</p>
                                <p className="text-xs">{getRecommendationReason(lead)}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TooltipProvider>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>

      {/* Lead Detail Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {lead && (
            <>
              <SheetHeader>
                <SheetTitle>{lead.name}</SheetTitle>
                <SheetDescription>{lead.title} at {lead.company}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 px-4 md:px-6">
                {/* Lead Source Context (Apollo-specific) */}
                {lead.source === "Apollo" && lead.sourceMetadata?.apolloListName && (
                  <Card className="border-chart-3/30 bg-chart-3/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Lead Source
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Source</p>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className="text-xs border-chart-3/30 bg-chart-3/10 text-chart-3">
                              Apollo.io
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">List Name</p>
                          <p className="text-sm font-medium">{lead.sourceMetadata.apolloListName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Imported Via</p>
                          <p className="text-sm font-medium">Outbound Ingestion</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Last Synced</p>
                          <p className="text-sm font-medium">{lead.ingestedAt || "Unknown"}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-xs text-muted-foreground">
                          This lead was sourced from Apollo and enriched by Jazon before outreach. All messaging is executed by Jazon (not Apollo sequences).
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Current AI Decision - Most Prominent */}
                <Card className="border-primary/30 bg-primary/5 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base font-semibold">Current AI Decision</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground mb-2">
                        {lead.aiRecommendation}
                      </p>
                      <div className="flex items-center gap-3">
                        <Badge variant="default" className="text-xs">
                          {qualification && qualification.overallScore >= 80 ? "High" : qualification && qualification.overallScore >= 60 ? "Medium" : "Low"} Confidence
                        </Badge>
                        {qualification && (
                          <span className="text-xs text-muted-foreground">
                            {qualification.overallScore}% overall qualification score
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Expected Outcome
                      </p>
                      <p className="text-sm text-foreground">
                        {lead.stage === "Qualification" && "Voice escalation will accelerate qualification and increase meeting booking probability by 30%."}
                        {lead.stage === "Meeting Scheduled" && "AE handoff prepared with full context. High probability of pipeline opportunity based on qualification profile."}
                        {lead.stage === "Engaged" && "Continuing nurture sequence to build engagement before qualification attempt."}
                        {lead.stage === "Disqualified" && "Early disqualification prevents wasted AE time and focuses resources on higher-fit leads."}
                        {lead.stage === "Research" && "ICP validation in progress. Outreach will begin once fit is confirmed."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Why Jazon Recommended This - Compressed */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Why Jazon Recommended This</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>
                          <span className="font-medium">ICP Analysis:</span> Score of {lead.icpScore} indicates {lead.icpScore >= 85 ? "strong alignment" : lead.icpScore >= 70 ? "moderate alignment" : "weak alignment"} with ideal customer profile.
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>
                          <span className="font-medium">Engagement Signals:</span>{" "}
                          {lead.stage === "Qualification" && "High engagement across multiple channels indicates readiness for deeper qualification."}
                          {lead.stage === "Meeting Scheduled" && "Fully qualified with confirmed need, authority, and timeline."}
                          {lead.stage === "Engaged" && "Positive initial responses, continuing nurture sequence."}
                          {lead.stage === "Disqualified" && "No alignment with ICP criteria or budget constraints identified."}
                          {lead.stage === "Research" && "Validating ICP fit before initiating outreach."}
                        </span>
                      </li>
                      {qualification && qualification.overallScore >= 80 && (
                        <li className="flex items-start gap-2">
                          <span className="text-primary mt-0.5">•</span>
                          <span>
                            <span className="font-medium">Qualification Status:</span> {qualification.overallScore}% confidence with {[qualification.need, qualification.timeline, qualification.authority, qualification.budget].filter((v) => v.known).length} of 4 BANT criteria confirmed.
                          </span>
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Lead Snapshot - Combined Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Lead Snapshot</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          ICP Score
                        </p>
                        <div className={`text-2xl font-bold ${getIcpScoreColor(lead.icpScore)}`}>
                          {lead.icpScore}/100
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {lead.icpScore >= 85 ? "Excellent fit" : lead.icpScore >= 70 ? "Good fit" : "Poor fit"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Current Stage
                        </p>
                        <Badge variant={getStageColor(lead.stage)} className="text-sm mb-1">
                          {lead.stage}
                        </Badge>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last contact: {lead.lastContact}
                        </p>
                      </div>
                    </div>

                    {lead.triggers.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                          Detected Triggers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {lead.triggers.map((trigger, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">{trigger}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-border/50">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                        Lead Origin
                      </p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Source:</span>{" "}
                          <span className="font-medium">{lead.source || "Not specified"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Ingested:</span>{" "}
                          <span className="font-medium">{lead.ingestedAt || "Not recorded"}</span>
                        </div>
                        {lead.importedBy && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Imported by:</span>{" "}
                            <span className="font-medium">{lead.importedBy}</span>
                          </div>
                        )}
                        {lead.originTrigger && (
                          <div className="col-span-2 text-xs text-muted-foreground">
                            {lead.originTrigger}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Tabbed Interface for Lower Half */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="activity" className="w-full">
                      <TabsList className="w-full justify-start">
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="qualification">Qualification</TabsTrigger>
                        {voiceMessages.length > 0 && (
                          <TabsTrigger value="voice">Voice Summary</TabsTrigger>
                        )}
                        {meeting && (
                          <TabsTrigger value="handoff">AE Handoff</TabsTrigger>
                        )}
                      </TabsList>

                      <TabsContent value="activity" className="mt-4">
                        <div className="space-y-4">
                          {conversations.length > 0 ? (
                            conversations.map((msg) => (
                              <div key={msg.id} className="flex gap-3 pb-4 border-b last:border-0 last:pb-0">
                                <div className={`p-2 rounded-full h-fit shrink-0 ${
                                  msg.channel === "email" ? "bg-primary/10 text-primary" :
                                  msg.channel === "voice" ? "bg-chart-2/10 text-chart-2" :
                                  "bg-chart-3/10 text-chart-3"
                                }`}>
                                  {msg.channel === "email" && <Mail className="w-4 h-4" />}
                                  {msg.channel === "voice" && <Phone className="w-4 h-4" />}
                                  {msg.channel === "linkedin" && <MessageSquare className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 space-y-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                      <Badge variant="outline" className="text-xs mb-1">
                                        {msg.channel} • {msg.direction}
                                      </Badge>
                                      {msg.subject && (
                                        <p className="font-medium text-sm truncate">{msg.subject}</p>
                                      )}
                                    </div>
                                    <span className="text-xs text-muted-foreground shrink-0">{msg.timestamp}</span>
                                  </div>
                                  {msg.summary ? (
                                    <div className="bg-muted/50 rounded p-2 space-y-2">
                                      <p className="text-sm">{msg.summary}</p>
                                      {msg.duration && (
                                        <p className="text-xs text-muted-foreground">
                                          Duration: {msg.duration} • Outcome: {msg.outcome}
                                        </p>
                                      )}
                                      {msg.objections && msg.objections.length > 0 && (
                                        <div>
                                          <p className="text-xs font-medium mt-2 mb-1">Objections raised:</p>
                                          <ul className="text-xs text-muted-foreground space-y-1">
                                            {msg.objections.map((obj, idx) => (
                                              <li key={idx}>• {obj}</li>
                                            ))}
                                          </ul>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-muted-foreground">{msg.content}</p>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No conversation history yet</p>
                          )}
                        </div>
                      </TabsContent>

                      <TabsContent value="qualification" className="mt-4">
                        {qualification ? (
                          <div className="space-y-4">
                            {Object.entries({
                              "Need": qualification.need,
                              "Timeline": qualification.timeline,
                              "Authority": qualification.authority,
                              "Budget": qualification.budget
                            }).map(([key, data]) => (
                              <div key={key} className="pb-3 border-b last:border-0 last:pb-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-sm font-medium">{key}</p>
                                  <div className="flex items-center gap-2">
                                    <Badge variant={data.known ? "default" : "outline"} className="text-xs">
                                      {data.known ? "Confirmed" : "Unknown"}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {data.confidence}% confidence
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground">{data.value}</p>
                              </div>
                            ))}
                            <div className="pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium">Overall Qualification Score</p>
                                <Badge variant="default" className="text-sm">
                                  {qualification.overallScore}%
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                Recommendation: {qualification.recommendation === "book_meeting" ? "Book meeting" : qualification.recommendation === "nurture" ? "Continue nurture" : "Disqualify"}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Qualification in progress</p>
                        )}
                      </TabsContent>

                      {voiceMessages.length > 0 && (
                        <TabsContent value="voice" className="mt-4">
                          <div className="space-y-4">
                            <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
                              <div className="flex items-center gap-2 mb-2">
                                <Phone className="w-4 h-4 text-chart-2" />
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  Voice Escalation (Conditional)
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground mb-3">
                                Voice was used as an escalation when engagement and ICP score crossed the configured threshold.
                              </p>
                            </div>
                            {voiceMessages.map((msg) => (
                              <div key={msg.id} className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs">
                                    {msg.timestamp}
                                  </Badge>
                                  {msg.duration && (
                                    <span className="text-xs text-muted-foreground">
                                      Duration: {msg.duration}
                                    </span>
                                  )}
                                </div>
                                {msg.summary && (
                                  <div className="bg-muted/50 rounded p-3 space-y-2">
                                    <p className="text-sm font-medium mb-1">Call Summary</p>
                                    <p className="text-sm text-foreground">{msg.summary}</p>
                                    {msg.outcome && (
                                      <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                        <span className="text-sm font-medium">Outcome: {msg.outcome}</span>
                                      </div>
                                    )}
                                    {msg.objections && msg.objections.length > 0 && (
                                      <div className="pt-2 border-t border-border/50">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">Objections Raised:</p>
                                        <ul className="space-y-1">
                                          {msg.objections.map((obj, idx) => (
                                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                              <span>{obj}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      )}

                      {meeting && (
                        <TabsContent value="handoff" className="mt-4">
                          <div className="space-y-4">
                            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <p className="text-sm font-semibold">Meeting Scheduled</p>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {meeting.scheduledFor} • Status: {meeting.status}
                              </p>
                            </div>

                            {meeting.handoffPack && (
                              <>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                    Research Summary
                                  </p>
                                  <p className="text-sm text-foreground">{meeting.handoffPack.researchSummary}</p>
                                </div>

                                <div>
                                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                    Qualification Notes
                                  </p>
                                  <ul className="space-y-1">
                                    {meeting.handoffPack.qualificationNotes.map((note, idx) => (
                                      <li key={idx} className="flex items-start gap-2 text-sm">
                                        <span className="text-primary mt-0.5">•</span>
                                        <span>{note}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>

                                {meeting.handoffPack.objectionsRaised.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                      Objections Raised
                                    </p>
                                    <ul className="space-y-1">
                                      {meeting.handoffPack.objectionsRaised.map((obj, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                          <span>{obj}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {meeting.handoffPack.suggestedTalkTrack.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                      Suggested Talk Track
                                    </p>
                                    <ul className="space-y-2">
                                      {meeting.handoffPack.suggestedTalkTrack.map((track, idx) => (
                                        <li key={idx} className="text-sm text-foreground">
                                          {track}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {meeting.handoffPack.whyBooked && (
                                  <div className="pt-3 border-t">
                                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                      Why This Meeting Was Booked
                                    </p>
                                    <p className="text-sm text-foreground">{meeting.handoffPack.whyBooked}</p>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </TabsContent>
                      )}
                    </Tabs>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  )
}

