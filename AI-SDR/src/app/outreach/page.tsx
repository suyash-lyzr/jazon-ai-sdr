"use client";

import { useState, useMemo, useEffect } from "react";
import { JazonSidebar } from "@/components/jazon-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { mockOutreachStrategies, mockConversations } from "@/lib/mock-data";
import { useJazonApp } from "@/context/jazon-app-context";
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
  Zap,
  Database,
  Search,
  Send,
  Eye,
  FileText,
  ChevronDown,
  ChevronUp,
  Edit3,
  Loader2,
  Linkedin,
} from "lucide-react";

export default function OutreachPage() {
  const { leads: mockLeads } = useJazonApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [controlDialogOpen, setControlDialogOpen] = useState<string | null>(
    null
  );
  const [overrideReason, setOverrideReason] = useState("");
  const [viewMode, setViewMode] = useState<"executive" | "full">("executive");
  const [expandedMessageContent, setExpandedMessageContent] = useState<
    Set<string>
  >(new Set());

  // New state for DB-backed data
  const [dbLeads, setDbLeads] = useState<any[]>([]);
  const [outreachData, setOutreachData] = useState<any>(null);
  const [isLoadingOutreach, setIsLoadingOutreach] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editSidebar, setEditSidebar] = useState<{
    open: boolean;
    section: "strategy" | "copy" | "guardrails" | null;
  }>({
    open: false,
    section: null,
  });
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [selectedStepCopy, setSelectedStepCopy] = useState<any>(null);
  const [editingCopy, setEditingCopy] = useState(false);
  const [editedCopyData, setEditedCopyData] = useState<any>(null);

  // Helper function to format dates consistently (avoid hydration mismatch)
  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    // Use ISO format or a consistent format that works on both server and client
    return d.toISOString().split("T")[0]; // Returns YYYY-MM-DD format
  };

  // Helper function to format relative time (for display)
  // Returns a consistent format to avoid hydration mismatch
  const formatRelativeTime = (
    date: Date | string | null | undefined
  ): string => {
    if (!date) return "";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";

    // Use a consistent format that works the same on server and client
    // Format: "YYYY-MM-DD HH:MM" or just the date if it's old
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    // If more than 7 days, just show the date
    if (diffDays >= 7) {
      return formatDate(d);
    }

    // For recent dates, show a simple format that's consistent
    // Format as "YYYY-MM-DD" to avoid locale/timezone issues
    return formatDate(d);
  };

  // Fetch leads from database on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();

        if (data.success && data.leads) {
          const transformedLeads = data.leads.map((dbLead: any) => ({
            id: dbLead._id,
            name: dbLead.name,
            company: dbLead.company?.name || "Unknown",
            icpScore: dbLead.icp_score?.icp_score || 0,
            stage:
              dbLead.status === "icp_scored" ? "Qualification" : "Research",
            _dbLead: dbLead,
          }));
          setDbLeads(transformedLeads);
        }
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    fetchLeads();
  }, []);

  // Combine mock leads and database leads
  const leads = useMemo(() => {
    const mockLeadsTransformed = mockLeads.map((l) => ({
      ...l,
      _dbLead: null,
    }));
    return [...mockLeadsTransformed, ...dbLeads];
  }, [mockLeads, dbLeads]);

  // Default to first lead with active outreach
  const defaultLead = useMemo(() => {
    if (leads.length === 0) return null;
    return (
      leads.find((l) => l.stage === "Qualification" || l.stage === "Engaged") ||
      leads[0]
    );
  }, [leads]);

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId) || defaultLead
    : defaultLead;

  // Fetch outreach data when selected lead changes
  useEffect(() => {
    const fetchOutreachData = async () => {
      if (!selectedLead || !selectedLead._dbLead) {
        setOutreachData(null);
        return;
      }

      setIsLoadingOutreach(true);
      try {
        const response = await fetch(`/api/leads/${selectedLead.id}/outreach`);
        const data = await response.json();

        if (data.success) {
          setOutreachData(data.data);
        }
      } catch (error) {
        console.error("Error fetching outreach data:", error);
      } finally {
        setIsLoadingOutreach(false);
      }
    };

    fetchOutreachData();
  }, [selectedLead?.id]);

  // Use real data if available, otherwise fall back to mock
  const strategy = outreachData?.strategy ||
    mockOutreachStrategies?.[0] || {
      channelStrategy: [],
      guardrails: {
        maxTouches: 8,
        voiceEscalationAllowed: true,
        voiceEscalationTrigger: "",
        stopConditions: [],
      },
    };
  const conversations = selectedLead
    ? mockConversations[selectedLead.id] || []
    : [];

  // Generate outreach strategy + copy
  const handleGenerateOutreach = async () => {
    if (!selectedLead || !selectedLead._dbLead) {
      alert("Please select a database lead to generate outreach");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(
        `/api/leads/${selectedLead.id}/outreach/generate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh outreach data
        const refreshResponse = await fetch(
          `/api/leads/${selectedLead.id}/outreach`
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setOutreachData(refreshData.data);
        }
        setStatusNote("Outreach strategy and copy generated successfully");
      } else {
        alert(`Error: ${data.error || "Failed to generate outreach"}`);
      }
    } catch (error) {
      console.error("Error generating outreach:", error);
      alert("Failed to generate outreach");
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle control actions
  const handleControlAction = async (action: string) => {
    if (!selectedLead || !selectedLead._dbLead) return;

    setIsUpdating(true);
    setStatusNote(`Logging ${action} for audit purposes…`);

    try {
      const response = await fetch(
        `/api/leads/${selectedLead.id}/outreach/control`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action,
            reason: overrideReason,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Refresh outreach data
        const refreshResponse = await fetch(
          `/api/leads/${selectedLead.id}/outreach`
        );
        const refreshData = await refreshResponse.json();
        if (refreshData.success) {
          setOutreachData(refreshData.data);
        }

        setStatusNote(data.message);
        setControlDialogOpen(null);
        setOverrideReason("");
      } else {
        alert(`Error: ${data.error || "Failed to execute control action"}`);
      }
    } catch (error) {
      console.error("Error executing control action:", error);
      alert("Failed to execute control action");
    } finally {
      setIsUpdating(false);
    }
  };

  const simulateUpdate = (action: string, nextState: string) => {
    setIsUpdating(true);
    setStatusNote(`Logging ${action} for audit purposes…`);
    setTimeout(() => {
      setStatusNote(nextState);
      setIsUpdating(false);
      setControlDialogOpen(null);
      setOverrideReason("");
    }, 800);
  };

  const toggleMessageContent = (messageId: string) => {
    const newExpanded = new Set(expandedMessageContent);
    if (newExpanded.has(messageId)) {
      newExpanded.delete(messageId);
    } else {
      newExpanded.add(messageId);
    }
    setExpandedMessageContent(newExpanded);
  };

  // Determine outreach status (use real data if available)
  const getOutreachStatus = () => {
    if (!selectedLead) return "no_lead";
    if (outreachData?.campaign) {
      return outreachData.campaign.status === "not_started"
        ? "research"
        : outreachData.campaign.status;
    }
    // Fallback to mock logic
    if (selectedLead.stage === "Disqualified") return "stopped";
    if (selectedLead.stage === "Meeting Scheduled") return "completed";
    if (
      selectedLead.stage === "Qualification" ||
      selectedLead.stage === "Engaged"
    )
      return "active";
    return "research";
  };

  const outreachStatus = getOutreachStatus();

  const getCurrentPhase = () => {
    if (!selectedLead) return "-";
    if (outreachData?.campaign) {
      return outreachData.campaign.current_phase;
    }
    // Fallback to mock logic
    if (selectedLead.stage === "Research") return "Research";
    if (selectedLead.stage === "Engaged") return "Engagement";
    if (selectedLead.stage === "Qualification") return "Qualification";
    if (selectedLead.stage === "Meeting Scheduled") return "Handoff";
    return "Research";
  };

  const getFinalDecision = () => {
    if (!selectedLead) return "-";
    if (outreachData?.campaign?.final_decision) {
      return `${outreachData.campaign.final_decision.status}${
        outreachData.campaign.final_decision.reason
          ? ` → ${outreachData.campaign.final_decision.reason}`
          : ""
      }`;
    }
    // Fallback to mock logic
    if (selectedLead.stage === "Meeting Scheduled")
      return "Qualified → AE handoff";
    if (selectedLead.stage === "Disqualified")
      return "Disqualified → ICP mismatch";
    if (selectedLead.stage === "Qualification") return "In progress";
    if (selectedLead.stage === "Engaged") return "Nurturing → Qualification";
    return "Research in progress";
  };

  // Generate full audit trail - use real events if available, otherwise generate mock
  const fullAuditTrail = useMemo(() => {
    if (!selectedLead) return [];

    // If we have real events from the database, use those
    if (outreachData?.events && outreachData.events.length > 0) {
      return outreachData.events;
    }

    // Otherwise generate mock audit trail
    type AuditEvent = {
      id: string;
      eventType:
        | "lifecycle"
        | "research"
        | "outreach"
        | "engagement"
        | "decision"
        | "guardrail"
        | "outcome";
      timestamp: string;
      sortOrder: number; // Explicit sort order for strict chronological ordering
      actor: "AI" | "System" | "Human";
      title: string;
      description: string;
      metadata?: Record<string, any>;
      badge?: string;
      icon?: any;
    };

    const events: AuditEvent[] = [];
    let sortCounter = 1;

    // A. Lead Lifecycle Events (ALWAYS FIRST)
    events.push({
      id: `${selectedLead.id}-ingestion`,
      eventType: "lifecycle",
      timestamp: selectedLead.ingestedAt || "7 days ago",
      sortOrder: sortCounter++,
      actor: "System",
      title: `Lead ingested from ${selectedLead.source || "Unknown source"}`,
      description:
        selectedLead.originTrigger ||
        `Lead entered Jazon via ${selectedLead.source}. Initial data sync completed.`,
      metadata: {
        source: selectedLead.source,
        importedBy: selectedLead.importedBy,
        workspace: "Production Workspace",
      },
      badge: "Lead Ingestion",
    });

    // B. AI Research & ICP Decisions
    events.push({
      id: `${selectedLead.id}-research`,
      eventType: "research",
      timestamp: "6 days ago",
      sortOrder: sortCounter++,
      actor: "AI",
      title: "ICP analysis completed",
      description: `Lead evaluated with ICP score ${selectedLead.icpScore}. ${
        selectedLead.icpScore >= 85
          ? "High fit"
          : selectedLead.icpScore >= 70
          ? "Medium fit"
          : "Low fit"
      } determined based on company size, industry, tech stack, and persona.`,
      metadata: {
        icpScore: selectedLead.icpScore,
        fitCategory:
          selectedLead.icpScore >= 85
            ? "High"
            : selectedLead.icpScore >= 70
            ? "Medium"
            : "Low",
        dataSources: ["LinkedIn", "CRM", "Perplexity"],
        confidence: selectedLead.icpScore >= 70 ? "High" : "Medium",
      },
      badge: "AI Research",
    });

    if (selectedLead.triggers && selectedLead.triggers.length > 0) {
      events.push({
        id: `${selectedLead.id}-triggers`,
        eventType: "research",
        timestamp: "6 days ago",
        sortOrder: sortCounter++,
        actor: "AI",
        title: `${selectedLead.triggers.length} buying signal(s) detected`,
        description: selectedLead.triggers.join(". ") + ".",
        metadata: {
          triggerCount: selectedLead.triggers.length,
          signals: selectedLead.triggers,
        },
        badge: "Trigger Detection",
      });
    }

    // C. Outreach Actions (if lead has active or past outreach)
    if (selectedLead.stage !== "Research") {
      // Only start outreach if not disqualified at research stage
      if (
        selectedLead.stage !== "Disqualified" ||
        selectedLead.icpScore >= 60
      ) {
        events.push({
          id: `${selectedLead.id}-outreach-start`,
          eventType: "outreach",
          timestamp: "5 days ago",
          sortOrder: sortCounter++,
          actor: "AI",
          title: "Outreach strategy initiated",
          description: `Multi-channel sequence started based on ICP score ${selectedLead.icpScore}. Initial channel: Email. Strategy includes up to 8 touches across Email, LinkedIn, and conditional Voice.`,
          metadata: {
            channelStrategy: ["Email", "LinkedIn", "Voice"],
            icpScore: selectedLead.icpScore,
            complianceChecks: ["GDPR", "CAN-SPAM", "Business hours"],
          },
          badge: "Outreach Start",
        });

        // Add message events (sorted by their actual timestamps)
        conversations.forEach((msg) => {
          events.push({
            id: msg.id,
            eventType: msg.direction === "outbound" ? "outreach" : "engagement",
            timestamp: msg.timestamp,
            sortOrder: sortCounter++,
            actor: msg.direction === "outbound" ? "AI" : "Human",
            title: msg.subject || `${msg.channel} ${msg.direction}`,
            description:
              msg.summary ||
              msg.content ||
              `${msg.channel} message ${msg.direction}`,
            metadata: {
              channel: msg.channel,
              direction: msg.direction,
              outcome: msg.outcome,
              duration: msg.duration,
              aiGenerated: msg.direction === "outbound",
            },
            badge:
              msg.direction === "outbound"
                ? "Outreach Action"
                : "Engagement Event",
          });
        });
      }
    }

    // D. Guardrails & Compliance (in chronological position)
    if (
      selectedLead.stage === "Engaged" ||
      selectedLead.stage === "Qualification"
    ) {
      events.push({
        id: `${selectedLead.id}-compliance-check`,
        eventType: "guardrail",
        timestamp: "3 days ago",
        sortOrder: sortCounter++,
        actor: "System",
        title: "Weekend outreach blocked",
        description:
          "Scheduled email deferred to Monday to respect business hours compliance rule.",
        metadata: {
          guardrailName: "No weekend outreach",
          triggerCondition: "Saturday send scheduled",
          actionTaken: "Deferred to Monday 9:00 AM",
          systemConfirmation: "Compliance rule enforced",
        },
        badge: "Compliance",
      });
    }

    // E. AI Decisions & Escalations (in chronological position)
    if (
      selectedLead.stage === "Qualification" &&
      selectedLead.channel &&
      selectedLead.channel.includes("Voice")
    ) {
      events.push({
        id: `${selectedLead.id}-voice-escalation`,
        eventType: "decision",
        timestamp: "2 hours ago",
        sortOrder: sortCounter++,
        actor: "AI",
        title: "Voice escalation approved",
        description: `High engagement on previous channels + ICP score ${selectedLead.icpScore} warranted personal touch. Voice escalation guardrails passed.`,
        metadata: {
          icpScore: selectedLead.icpScore,
          rulesTriggered: ["ICP ≥ 80", "Engagement on 2+ channels"],
          rulesPassed: ["Max touches not exceeded", "Voice escalation allowed"],
          humanApprovalRequired: false,
          confidence: "High",
        },
        badge: "AI Decision",
      });
    }

    // F. Final Outcome (ALWAYS LAST)
    if (selectedLead.stage === "Meeting Scheduled") {
      events.push({
        id: `${selectedLead.id}-meeting`,
        eventType: "outcome",
        timestamp: "1 hour ago",
        sortOrder: sortCounter++,
        actor: "AI",
        title: "Meeting booked",
        description:
          "Lead fully qualified via BANT analysis. Meeting scheduled and calendar invite sent.",
        metadata: {
          qualificationScore: 88,
          bantConfirmed: ["Need", "Timeline", "Authority", "Budget"],
        },
        badge: "Outcome",
      });

      events.push({
        id: `${selectedLead.id}-handoff`,
        eventType: "outcome",
        timestamp: "1 hour ago",
        sortOrder: sortCounter++,
        actor: "System",
        title: "AE handoff completed",
        description:
          "Handoff pack prepared with research summary, qualification notes, objections, and talk track. CRM updated.",
        metadata: {
          crmUpdated: true,
          handoffPackGenerated: true,
        },
        badge: "Outcome",
      });
    }

    if (selectedLead.stage === "Disqualified") {
      events.push({
        id: `${selectedLead.id}-disqualify`,
        eventType: "decision",
        timestamp: "1 week ago",
        sortOrder: sortCounter++,
        actor: "AI",
        title: "Lead disqualified",
        description: `ICP score ${selectedLead.icpScore} below threshold (60). Wrong market segment. Outreach stopped to save AE time.`,
        metadata: {
          icpScore: selectedLead.icpScore,
          reason: "ICP mismatch",
          confidence: "High",
          rulesTriggered: ["ICP < 60"],
        },
        badge: "AI Decision",
      });

      events.push({
        id: `${selectedLead.id}-stop`,
        eventType: "outcome",
        timestamp: "1 week ago",
        sortOrder: sortCounter++,
        actor: "System",
        title: "Outreach stopped",
        description:
          "All scheduled actions cancelled. Lead moved to disqualified status. CRM updated.",
        metadata: {
          crmUpdated: true,
          outreachStopped: true,
        },
        badge: "Outcome",
      });
    }

    // STRICT CHRONOLOGICAL SORT: Oldest → Newest (using sortOrder as the single source of truth)
    return events.sort((a, b) => a.sortOrder - b.sortOrder);
  }, [selectedLead, conversations, outreachData]);

  // Executive timeline (filtered for key events)
  const executiveTimeline = useMemo(() => {
    if (!fullAuditTrail || !Array.isArray(fullAuditTrail)) return [];
    return fullAuditTrail.filter(
      (event) =>
        event.eventType === "outcome" ||
        event.eventType === "decision" ||
        (event.eventType === "outreach" &&
          event.metadata?.channel === "voice") ||
        (event.eventType === "engagement" &&
          event.metadata?.direction === "inbound")
    );
  }, [fullAuditTrail]);

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
                  Outreach Campaign
                </h1>
                <p className="text-sm text-muted-foreground">
                  Strategic, multi-channel engagement - not email blasting
                </p>
              </div>
              <div className="flex items-center gap-3">
                {selectedLead && selectedLead._dbLead && (
                  <Button
                    onClick={handleGenerateOutreach}
                    disabled={isGenerating}
                    className="gap-2"
                    size="sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        {outreachData?.strategy
                          ? "Regenerate"
                          : "Generate"}{" "}
                        Outreach
                      </>
                    )}
                  </Button>
                )}
                <div className="flex items-center gap-2 min-w-0 max-w-md">
                  <label className="text-xs text-muted-foreground shrink-0">
                    Lead:
                  </label>
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
                            <span className="text-muted-foreground">
                              • {lead.company}
                            </span>
                            <Badge
                              variant="outline"
                              className="ml-auto text-xs"
                            >
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
            </div>

            {selectedLead && (
              <>
                {/* Section 1: Outreach Summary (Always Visible) */}
                <div className="bg-muted/30 rounded-xl p-5 border border-border/50">
                  <div className="grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Outreach Status
                      </p>
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
                            <Badge className="bg-chart-2 hover:bg-chart-2">
                              Completed
                            </Badge>
                          </>
                        )}
                        {outreachStatus === "stopped" && (
                          <>
                            <StopCircle className="w-4 h-4 text-destructive" />
                            <Badge
                              variant="outline"
                              className="text-destructive border-destructive"
                            >
                              Stopped
                            </Badge>
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
                      <p className="text-xs text-muted-foreground mb-1">
                        Current Phase
                      </p>
                      <p className="text-sm font-medium">{getCurrentPhase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Last Action
                      </p>
                      <p className="text-sm font-medium">
                        {outreachData?.events && outreachData.events.length > 0
                          ? `${
                              outreachData.events[
                                outreachData.events.length - 1
                              ].title
                            } - ${formatRelativeTime(
                              outreachData.events[
                                outreachData.events.length - 1
                              ].timestamp
                            )}`
                          : outreachStatus === "active"
                          ? "Voice call - 2 hours ago"
                          : outreachStatus === "completed"
                          ? "AE handoff - 1 hour ago"
                          : selectedLead.lastContact}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Next Planned Action
                      </p>
                      <p className="text-sm font-medium">
                        {outreachData?.campaign?.next_planned_action?.label
                          ? `${
                              outreachData.campaign.next_planned_action.label
                            }${
                              outreachData.campaign.next_planned_action
                                .scheduled_at
                                ? ` - ${formatRelativeTime(
                                    outreachData.campaign.next_planned_action
                                      .scheduled_at
                                  )}`
                                : ""
                            }`
                          : outreachStatus === "active" &&
                            selectedLead.stage === "Qualification"
                          ? "Follow-up email - tomorrow"
                          : outreachStatus === "completed"
                          ? "AE handoff complete"
                          : outreachStatus === "stopped"
                          ? "None - outreach stopped"
                          : "Generate outreach strategy"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Final AI Decision
                      </p>
                      <p className="text-sm font-medium">
                        {getFinalDecision()}
                      </p>
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
                          <h3 className="font-semibold text-lg mb-2">
                            Outreach Successfully Completed
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Meeting scheduled and AE handoff completed. Outreach
                            strategy achieved its goal.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Why it worked
                              </p>
                              <ul className="space-y-1 text-sm">
                                <li className="flex items-start gap-2">
                                  <span className="text-chart-2">•</span>
                                  <span>
                                    High ICP score ({selectedLead.icpScore})
                                  </span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-chart-2">•</span>
                                  <span>
                                    Strong engagement across multiple channels
                                  </span>
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
                          <h3 className="font-semibold text-lg mb-2">
                            Outreach Disabled
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            This lead was disqualified and outreach has been
                            automatically stopped.
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Disqualification Reason
                              </p>
                              <p className="text-sm mb-2">
                                Low ICP score ({selectedLead.icpScore}) - wrong
                                market segment
                              </p>
                              <Badge variant="outline" className="text-xs">
                                High Confidence
                              </Badge>
                            </div>
                            <div className="bg-background/50 rounded-lg p-3 border border-border/30">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                Value Saved
                              </p>
                              <p className="text-sm mb-2">
                                Early disqualification prevented wasted AE time
                              </p>
                              <Badge variant="outline" className="text-xs">
                                AI Decision (Automatic)
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Active Outreach Strategy (only for active leads OR when strategy exists) */}
                {(outreachStatus === "active" || outreachData?.strategy) && (
                  <Card>
                    <CardHeader className="relative pr-20">
                      <div>
                        <CardTitle>
                          AI-Generated Outreach Strategy for This Lead
                        </CardTitle>
                        <CardDescription>
                          {outreachData?.strategy?.plan_summary ||
                            `Intelligent channel escalation based on ICP score (${selectedLead.icpScore}) and engagement signals from Research & ICP`}
                        </CardDescription>
                      </div>
                      {outreachData?.strategy && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // Open edit sidebar for strategy
                            const strategySteps =
                              outreachData.strategy
                                .recommended_channel_sequence || [];
                            setEditFormData({
                              plan_summary:
                                outreachData.strategy.plan_summary || "",
                              steps: strategySteps.map((step: any) => ({
                                step: step.step,
                                channel: step.channel,
                                goal: step.goal || "",
                                reasoning: step.reasoning || "",
                                recommended_delay_hours:
                                  step.recommended_delay_hours || 0,
                                send_window: step.send_window || "",
                                personalization_signals: (
                                  step.personalization_signals || []
                                ).join("\n"),
                                gating_conditions: (
                                  step.gating_conditions || []
                                ).join("\n"),
                              })),
                            });
                            setEditSidebar({ open: true, section: "strategy" });
                          }}
                          className="absolute top-4 right-4 h-6 px-2 gap-1.5 text-xs"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Progress Indicator */}
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium">
                              Strategy Progress
                            </span>
                            <span className="text-sm text-muted-foreground">
                              Step{" "}
                              {outreachData?.campaign?.current_step_number ||
                                strategy.currentStep ||
                                0}{" "}
                              of{" "}
                              {outreachData?.strategy
                                ?.recommended_channel_sequence?.length ||
                                strategy.totalSteps ||
                                0}
                            </span>
                          </div>
                          <Progress
                            value={
                              ((outreachData?.campaign?.current_step_number ||
                                strategy.currentStep) /
                                (outreachData?.strategy
                                  ?.recommended_channel_sequence?.length ||
                                  strategy.totalSteps)) *
                              100
                            }
                            className="h-2"
                          />
                          <div className="flex items-center gap-2 mt-2">
                            {Array.from({
                              length:
                                outreachData?.strategy
                                  ?.recommended_channel_sequence?.length ||
                                strategy.totalSteps,
                            }).map((_, idx) => (
                              <div
                                key={idx}
                                className={`flex-1 h-1 rounded-full ${
                                  idx <
                                  (outreachData?.campaign
                                    ?.current_step_number ||
                                    strategy.currentStep)
                                    ? "bg-chart-2"
                                    : idx ===
                                      (outreachData?.campaign
                                        ?.current_step_number ||
                                        strategy.currentStep)
                                    ? "bg-primary"
                                    : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Channel Strategy */}
                        <div className="space-y-4">
                          {(
                            outreachData?.strategy
                              ?.recommended_channel_sequence ||
                            strategy?.channelStrategy ||
                            []
                          ).map((channel: any, idx: number) => {
                            // Determine status: from campaign current_step or fallback to mock
                            const stepStatus =
                              outreachData?.campaign?.current_step_number >
                              channel.step
                                ? "completed"
                                : outreachData?.campaign
                                    ?.current_step_number === channel.step
                                ? "active"
                                : "pending";
                            const displayStatus = channel.status || stepStatus;

                            return (
                              <div key={idx} className="flex gap-4 items-start">
                                <div
                                  className={`p-3 rounded-lg shrink-0 ${
                                    displayStatus === "completed"
                                      ? "bg-chart-2/10 text-chart-2"
                                      : displayStatus === "active"
                                      ? "bg-primary/10 text-primary"
                                      : "bg-muted/50 text-muted-foreground"
                                  }`}
                                >
                                  {channel.channel === "Email" && (
                                    <Mail className="w-5 h-5" />
                                  )}
                                  {channel.channel === "LinkedIn" && (
                                    <MessageSquare className="w-5 h-5" />
                                  )}
                                  {channel.channel === "Voice" && (
                                    <Phone className="w-5 h-5" />
                                  )}
                                </div>

                                <div className="flex-1 space-y-2">
                                  <div className="flex items-center gap-2">
                                    <h3 className="font-semibold">
                                      {channel.channel}
                                    </h3>
                                    <Badge
                                      variant="outline"
                                      className="text-xs"
                                    >
                                      Step {channel.step}
                                    </Badge>
                                    {displayStatus === "completed" && (
                                      <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                    )}
                                    {displayStatus === "active" && (
                                      <div className="flex items-center gap-1 text-primary">
                                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        <span className="text-xs font-medium">
                                          In Progress
                                        </span>
                                      </div>
                                    )}
                                    {displayStatus === "pending" && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Upcoming
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {channel.goal}
                                  </p>

                                  {/* View Copy Button */}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      // Find the corresponding copy draft
                                      const drafts =
                                        outreachData?.copy?.drafts || [];
                                      const draft = drafts.find(
                                        (d: any) =>
                                          d.step === channel.step ||
                                          (String(d.step) ===
                                            String(channel.step) &&
                                            d.channel === channel.channel)
                                      );
                                      setSelectedStepCopy(
                                        draft || {
                                          step: channel.step,
                                          channel: channel.channel,
                                          _missing: true,
                                        }
                                      );
                                      setEditedCopyData(
                                        draft ? { ...draft } : null
                                      );
                                      setEditingCopy(false);
                                      setCopyDialogOpen(true);
                                    }}
                                    className="gap-2 mt-2"
                                    disabled={
                                      !outreachData?.copy?.drafts?.some(
                                        (d: any) =>
                                          d.step === channel.step ||
                                          String(d.step) ===
                                            String(channel.step)
                                      )
                                    }
                                  >
                                    <FileText className="w-4 h-4" />
                                    View AI-Generated Copy
                                  </Button>

                                  {channel.reasoning && (
                                    <div className="bg-muted/30 rounded-lg p-3 mt-2 border border-border/30">
                                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                        Why this step exists
                                      </p>
                                      <p className="text-sm">
                                        {channel.reasoning}
                                      </p>
                                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-border/30">
                                        <div className="text-xs text-muted-foreground">
                                          <span className="font-medium">
                                            Confidence:
                                          </span>{" "}
                                          High
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                          <span className="font-medium">
                                            Triggered by:
                                          </span>{" "}
                                          ICP {selectedLead.icpScore} +
                                          engagement signals
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
                                          <span>
                                            ICP score threshold met (≥80)
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                          <span>
                                            Engagement signals met (2+ channels)
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <CheckCircle2 className="w-4 h-4 text-chart-2" />
                                          <span>Guardrails passed</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                          <AlertCircle className="w-4 h-4 text-muted-foreground" />
                                          <span className="text-muted-foreground">
                                            Human approval: Not required
                                          </span>
                                        </div>
                                      </div>
                                      <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/30">
                                        Voice is conditional and used only for
                                        high-intent leads. This is not a
                                        voice-first approach.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
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
                          Full timeline of messages and AI decisions for
                          auditability
                        </CardDescription>
                      </div>
                      <Tabs
                        value={viewMode}
                        onValueChange={(v) =>
                          setViewMode(v as "executive" | "full")
                        }
                      >
                        <TabsList>
                          <TabsTrigger value="executive" className="text-xs">
                            Executive Summary
                          </TabsTrigger>
                          <TabsTrigger value="full" className="text-xs">
                            Full Audit Trail
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Status Banner */}
                    {outreachStatus === "completed" && viewMode === "full" && (
                      <div className="bg-chart-2/10 rounded-lg p-3 border border-chart-2/30 mb-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-chart-2" />
                          <p className="text-xs font-medium">
                            Timeline locked for audit. All events are
                            timestamped and cannot be modified.
                          </p>
                        </div>
                      </div>
                    )}
                    {outreachStatus === "active" && viewMode === "full" && (
                      <div className="bg-primary/10 rounded-lg p-3 border border-primary/20 mb-6">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                          <p className="text-xs font-medium">
                            Outreach in progress. Events logged in real time as
                            they occur.
                          </p>
                        </div>
                      </div>
                    )}
                    {outreachStatus === "stopped" && viewMode === "full" && (
                      <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/30 mb-6">
                        <div className="flex items-center gap-2">
                          <StopCircle className="w-4 h-4 text-destructive" />
                          <p className="text-xs font-medium">
                            Outreach stopped automatically. Timeline locked for
                            audit.
                          </p>
                        </div>
                      </div>
                    )}

                    {viewMode === "executive" ? (
                      /* Executive Summary View */
                      <div className="space-y-4">
                        {executiveTimeline.length > 0 ? (
                          executiveTimeline.map((event) => (
                            <div
                              key={event.id}
                              className="flex gap-3 pb-4 border-b last:border-0 last:pb-0"
                            >
                              <div
                                className={`p-2 rounded-lg shrink-0 h-fit ${
                                  event.eventType === "outcome"
                                    ? "bg-chart-2/10 text-chart-2"
                                    : event.eventType === "decision"
                                    ? "bg-primary/10 text-primary"
                                    : "bg-muted text-foreground"
                                }`}
                              >
                                {event.eventType === "outcome" && (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                                {event.eventType === "decision" && (
                                  <Target className="w-4 h-4" />
                                )}
                                {event.eventType === "outreach" &&
                                  event.metadata?.channel === "voice" && (
                                    <Phone className="w-4 h-4" />
                                  )}
                                {event.eventType === "engagement" && (
                                  <MessageSquare className="w-4 h-4" />
                                )}
                              </div>
                              <div className="flex-1 space-y-2 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {event.badge}
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {event.actor}
                                      </Badge>
                                      <h4 className="font-medium text-sm">
                                        {event.title}
                                      </h4>
                                    </div>
                                  </div>
                                  <span className="text-xs text-muted-foreground shrink-0">
                                    {event.timestamp}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  {event.description}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-sm text-muted-foreground">
                              No key events to display yet.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Full Audit Trail View */
                      <div className="space-y-4">
                        {/* Ordering clarity cue */}
                        <div className="bg-muted/20 rounded-lg p-2 border border-border/30">
                          <p className="text-xs text-center text-muted-foreground">
                            Events shown in chronological order (oldest →
                            newest)
                          </p>
                        </div>

                        {fullAuditTrail.length > 0 ? (
                          fullAuditTrail.map((event: any) => {
                            // Event type styling
                            const getEventColor = (type: string) => {
                              switch (type) {
                                case "lifecycle":
                                  return "bg-muted/50 border-border text-foreground";
                                case "research":
                                  return "bg-primary/5 border-primary/20 text-primary";
                                case "outreach":
                                  return "bg-chart-3/5 border-chart-3/20 text-chart-3";
                                case "engagement":
                                  return "bg-chart-2/5 border-chart-2/20 text-chart-2";
                                case "decision":
                                  return "bg-primary/10 border-primary/30 text-primary";
                                case "guardrail":
                                  return "bg-chart-4/5 border-chart-4/20 text-chart-4";
                                case "outcome":
                                  return "bg-chart-2/10 border-chart-2/30 text-chart-2";
                                default:
                                  return "bg-muted border-border text-foreground";
                              }
                            };

                            const getEventIcon = (type: string) => {
                              switch (type) {
                                case "lifecycle":
                                  return <Database className="w-5 h-5" />;
                                case "research":
                                  return <Search className="w-5 h-5" />;
                                case "outreach":
                                  return <Send className="w-5 h-5" />;
                                case "engagement":
                                  return <Eye className="w-5 h-5" />;
                                case "decision":
                                  return <Target className="w-5 h-5" />;
                                case "guardrail":
                                  return <Shield className="w-5 h-5" />;
                                case "outcome":
                                  return <CheckCircle2 className="w-5 h-5" />;
                                default:
                                  return <Activity className="w-5 h-5" />;
                              }
                            };

                            return (
                              <div key={event.id} className="relative">
                                {/* Vertical timeline connector */}
                                <div className="absolute left-6 top-14 bottom-0 w-px bg-border" />

                                <div className="flex gap-4">
                                  {/* Icon */}
                                  <div
                                    className={`p-3 rounded-lg shrink-0 border ${getEventColor(
                                      event.eventType
                                    )}`}
                                  >
                                    {getEventIcon(event.eventType)}
                                  </div>

                                  {/* Content Card */}
                                  <div className="flex-1 min-w-0">
                                    <div className="bg-card border rounded-lg p-4">
                                      {/* Header */}
                                      <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                                            <Badge
                                              variant="outline"
                                              className="text-xs"
                                            >
                                              {event.badge}
                                            </Badge>
                                            <Badge
                                              variant={
                                                event.actor === "AI"
                                                  ? "default"
                                                  : event.actor === "Human"
                                                  ? "secondary"
                                                  : "outline"
                                              }
                                              className="text-xs"
                                            >
                                              {event.actor}
                                            </Badge>
                                          </div>
                                          <h4 className="font-semibold text-sm">
                                            {event.title}
                                          </h4>
                                        </div>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                          {event.timestamp}
                                        </span>
                                      </div>

                                      {/* Description */}
                                      <p className="text-sm text-foreground leading-relaxed mb-3">
                                        {event.description}
                                      </p>

                                      {/* Metadata */}
                                      {event.metadata &&
                                        Object.keys(event.metadata).length >
                                          0 && (
                                          <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                                              Event Details
                                            </p>
                                            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                                              {Object.entries(
                                                event.metadata
                                              ).map(([key, value]) => (
                                                <div key={key}>
                                                  <span className="text-xs text-muted-foreground capitalize">
                                                    {key
                                                      .replace(
                                                        /([A-Z])/g,
                                                        " $1"
                                                      )
                                                      .trim()}
                                                    :
                                                  </span>{" "}
                                                  <span className="text-xs font-medium">
                                                    {Array.isArray(value)
                                                      ? value.join(", ")
                                                      : typeof value ===
                                                        "boolean"
                                                      ? value
                                                        ? "Yes"
                                                        : "No"
                                                      : String(value)}
                                                  </span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                      {/* View Message Content (for outreach/engagement events) */}
                                      {(event.eventType === "outreach" ||
                                        event.eventType === "engagement") &&
                                        event.metadata?.channel &&
                                        (() => {
                                          const message = conversations.find(
                                            (m) => m.id === event.id
                                          );
                                          return (
                                            message?.body || message?.scriptUsed
                                          );
                                        })() && (
                                          <div className="mt-3">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                toggleMessageContent(event.id)
                                              }
                                              className="text-xs w-full justify-start"
                                            >
                                              <Eye className="w-3 h-3 mr-2" />
                                              {expandedMessageContent.has(
                                                event.id
                                              )
                                                ? "Hide"
                                                : "View"}{" "}
                                              Message Content
                                              {expandedMessageContent.has(
                                                event.id
                                              ) ? (
                                                <ChevronUp className="w-3 h-3 ml-auto" />
                                              ) : (
                                                <ChevronDown className="w-3 h-3 ml-auto" />
                                              )}
                                            </Button>

                                            {expandedMessageContent.has(
                                              event.id
                                            ) &&
                                              (() => {
                                                const message =
                                                  conversations.find(
                                                    (m) => m.id === event.id
                                                  );
                                                if (!message) return null;

                                                return (
                                                  <div className="mt-3 bg-background rounded-lg p-4 border border-primary/20 space-y-3">
                                                    <div className="flex items-center gap-2">
                                                      <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                      >
                                                        {message.channel ===
                                                        "email"
                                                          ? "Email Content"
                                                          : message.channel ===
                                                            "linkedin"
                                                          ? "LinkedIn Message"
                                                          : message.channel ===
                                                            "voice"
                                                          ? "Voice Call"
                                                          : "Message Content"}
                                                      </Badge>
                                                      {message.aiGenerated && (
                                                        <Badge
                                                          variant="outline"
                                                          className="text-xs bg-primary/5 border-primary/20"
                                                        >
                                                          AI-generated
                                                        </Badge>
                                                      )}
                                                    </div>

                                                    {message.subject && (
                                                      <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-1">
                                                          Subject
                                                        </p>
                                                        <p className="text-sm font-medium">
                                                          {message.subject}
                                                        </p>
                                                      </div>
                                                    )}

                                                    {message.body && (
                                                      <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                                          {message.channel ===
                                                          "email"
                                                            ? "Email Body"
                                                            : message.channel ===
                                                              "linkedin"
                                                            ? "LinkedIn Message"
                                                            : "Message Content"}
                                                        </p>
                                                        <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                                                          <pre className="text-sm whitespace-pre-wrap text-foreground leading-relaxed font-sans">
                                                            {message.body}
                                                          </pre>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {message.scriptUsed && (
                                                      <div>
                                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                                          Voice Call Script
                                                          (AI-Generated)
                                                        </p>
                                                        <div className="bg-muted/30 rounded-lg p-4 border border-border/30">
                                                          <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">
                                                            {message.scriptUsed}
                                                          </pre>
                                                        </div>
                                                      </div>
                                                    )}

                                                    {message.personalizationTokens &&
                                                      message
                                                        .personalizationTokens
                                                        .length > 0 && (
                                                        <div>
                                                          <p className="text-xs font-medium text-muted-foreground mb-2">
                                                            Personalization
                                                            Tokens
                                                          </p>
                                                          <div className="flex flex-wrap gap-2">
                                                            {(
                                                              message.personalizationTokens ||
                                                              []
                                                            ).map(
                                                              (token, tidx) => (
                                                                <Badge
                                                                  key={tidx}
                                                                  variant="outline"
                                                                  className="text-xs"
                                                                >
                                                                  {token}
                                                                </Badge>
                                                              )
                                                            )}
                                                          </div>
                                                        </div>
                                                      )}

                                                    <div className="pt-2 border-t text-xs text-muted-foreground">
                                                      This shows the exact
                                                      content sent to the lead
                                                      for full transparency and
                                                      auditability.
                                                    </div>
                                                  </div>
                                                );
                                              })()}
                                          </div>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-12">
                            <div className="flex flex-col items-center gap-4">
                              <div className="p-4 rounded-full bg-muted">
                                <FileText className="w-8 h-8 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="font-semibold mb-1">
                                  No audit trail available
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  This lead is still in research phase. Full
                                  audit trail will be available once outreach
                                  begins.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Demo disclaimer */}
                        <div className="mt-6 pt-4 border-t border-border/50">
                          <p className="text-xs text-center text-muted-foreground">
                            This is an immutable audit log. All events are
                            timestamped and cannot be modified.
                          </p>
                        </div>
                      </div>
                    )}
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
                          All control actions are logged for audit purposes and
                          require confirmation.
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
                      <CardHeader className="relative pr-20">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-chart-4" />
                            Outreach Guardrails
                          </CardTitle>
                          <CardDescription>
                            Automated safety controls to maintain quality and
                            compliance
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const guardrails =
                              outreachData?.guardrails || strategy.guardrails;
                            setEditFormData({
                              max_touches: guardrails.max_touches || 8,
                              voice_escalation_allowed:
                                guardrails.voice_escalation_allowed ?? true,
                              voice_escalation_trigger:
                                guardrails.voice_escalation_trigger ||
                                "High ICP (≥80) + engagement on 2+ channels",
                              stop_conditions: (
                                guardrails.stop_conditions || []
                              ).join("\n"),
                              compliance_rules: (
                                guardrails.compliance_rules || []
                              ).join("\n"),
                            });
                            setEditSidebar({
                              open: true,
                              section: "guardrails",
                            });
                          }}
                          className="absolute top-4 right-4 h-6 px-2 gap-1.5 text-xs"
                        >
                          <Edit3 className="h-3 w-3" />
                          Edit
                        </Button>
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
                              <p className="text-lg font-semibold">
                                {outreachData?.guardrails?.max_touches ||
                                  strategy.guardrails.maxTouches}{" "}
                                touches
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                After this, outreach stops automatically
                              </p>
                            </div>
                            <div className="bg-background rounded-lg p-3 border">
                              <p className="text-xs text-muted-foreground mb-1">
                                Voice Escalation
                              </p>
                              <p className="text-lg font-semibold">
                                {outreachData?.guardrails
                                  ?.voice_escalation_allowed ??
                                strategy.guardrails.voiceEscalationAllowed
                                  ? "Allowed"
                                  : "Not Allowed"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {outreachData?.guardrails
                                  ?.voice_escalation_trigger ||
                                  strategy.guardrails.voiceEscalationTrigger ||
                                  "Configured in Agent Instructions"}
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
                            {(
                              outreachData?.guardrails?.stop_conditions ||
                              strategy?.guardrails?.stopConditions ||
                              []
                            ).map((condition: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <StopCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                                <div>
                                  <span className="font-medium">
                                    {condition}
                                  </span>
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    Jazon will immediately stop outreach when
                                    this occurs
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
                            {(
                              outreachData?.guardrails?.compliance_rules || [
                                "No weekend outreach (respects business hours)",
                                "Unsubscribe links included in all emails",
                                "GDPR and CAN-SPAM compliant messaging",
                              ]
                            ).map((rule: string, idx: number) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-sm"
                              >
                                <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                                <span>{rule}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Metrics with Context (Always visible for active/completed leads) */}
                {(outreachStatus === "active" ||
                  outreachStatus === "completed") && (
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
                            <span className="text-muted-foreground">
                              LinkedIn
                            </span>
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
                          <div className="text-3xl font-bold text-chart-2">
                            32%
                          </div>
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
                        <CardTitle className="text-sm">
                          Avg. Time to Response
                        </CardTitle>
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
                    All actions shown are part of a demo environment and do not
                    affect real systems.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Control Confirmation Dialogs */}
      <Dialog
        open={!!controlDialogOpen}
        onOpenChange={() => setControlDialogOpen(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {controlDialogOpen === "pause" && "Pause Outreach"}
              {controlDialogOpen === "voice" && "Force Voice Escalation"}
              {controlDialogOpen === "stop" && "Stop Outreach"}
            </DialogTitle>
            <DialogDescription>
              This action will be logged for audit purposes and require
              confirmation.
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
            <Button
              variant="outline"
              onClick={() => setControlDialogOpen(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedLead?._dbLead) {
                  // Use real API
                  handleControlAction(controlDialogOpen || "");
                } else {
                  // Fallback to mock
                  const messages = {
                    pause:
                      "Outreach paused for this lead. All scheduled actions stopped.",
                    voice:
                      "Voice escalation forced for next touch, aligned with escalation rules.",
                    stop: "Outreach stopped for this lead. Marked for review.",
                  };
                  simulateUpdate(
                    controlDialogOpen || "",
                    messages[controlDialogOpen as keyof typeof messages] ||
                      "Action completed"
                  );
                }
              }}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Copy View/Edit Sidebar */}
      <Sheet open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
        <SheetContent className="w-[90vw] sm:w-[1200px] max-w-[1400px] flex flex-col overflow-hidden">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl font-semibold flex items-center gap-3">
              {selectedStepCopy?.channel === "Email" && (
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              )}
              {selectedStepCopy?.channel === "LinkedIn" && (
                <div className="p-2 rounded-lg bg-indigo-500/10">
                  <Linkedin className="w-5 h-5 text-indigo-600" />
                </div>
              )}
              {selectedStepCopy?.channel === "Voice" && (
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Phone className="w-5 h-5 text-purple-600" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span>
                    Step {selectedStepCopy?.step}: {selectedStepCopy?.channel}{" "}
                    Copy
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {editingCopy ? "Editing" : "AI-Generated"}
                  </Badge>
                </div>
              </div>
            </SheetTitle>
            <SheetDescription className="text-sm">
              {editingCopy
                ? "Edit the AI-generated copy below. Your changes will override the AI suggestions."
                : "View the AI-generated copy for this outreach step. Click 'Edit Copy' to make changes."}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            {selectedStepCopy && (
              <div className="space-y-6">
                {selectedStepCopy._missing && (
                  <Alert>
                    <AlertCircle className="w-4 h-4" />
                    <AlertTitle>No Draft Available</AlertTitle>
                    <AlertDescription>
                      No AI draft found for this step yet. Regenerate outreach
                      to generate drafts, or edit and save your own copy.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Email Copy */}
                {selectedStepCopy.channel === "Email" && (
                  <>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-semibold">
                          Subject Line Options
                        </Label>
                        {!editingCopy && (
                          <Badge variant="secondary" className="text-xs">
                            {selectedStepCopy.subject_options?.length || 0}{" "}
                            options
                          </Badge>
                        )}
                      </div>
                      {editingCopy ? (
                        <Textarea
                          value={(editedCopyData?.subject_options || []).join(
                            "\n"
                          )}
                          onChange={(e) =>
                            setEditedCopyData({
                              ...editedCopyData,
                              subject_options: e.target.value
                                .split("\n")
                                .filter((s) => s.trim()),
                            })
                          }
                          rows={3}
                          placeholder="Enter subject lines (one per line)"
                          className="text-sm resize-none"
                        />
                      ) : (
                        <div className="space-y-2">
                          {(selectedStepCopy.subject_options || []).map(
                            (subject: string, idx: number) => (
                              <Card
                                key={idx}
                                className="bg-muted/30 border-border/50"
                              >
                                <CardContent className="p-4">
                                  <p className="text-sm font-medium text-foreground">
                                    {subject}
                                  </p>
                                </CardContent>
                              </Card>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Email Body
                      </Label>
                      {editingCopy ? (
                        <Textarea
                          value={editedCopyData?.body || ""}
                          onChange={(e) =>
                            setEditedCopyData({
                              ...editedCopyData,
                              body: e.target.value,
                            })
                          }
                          rows={14}
                          placeholder="Enter email body"
                          className="text-sm resize-none"
                        />
                      ) : (
                        <Card className="bg-muted/30 border-border/50">
                          <CardContent className="p-5">
                            <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                              {selectedStepCopy.body}
                            </pre>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </>
                )}

                {/* LinkedIn Copy */}
                {selectedStepCopy.channel === "LinkedIn" && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      LinkedIn Connection Message
                    </Label>
                    {editingCopy ? (
                      <Textarea
                        value={editedCopyData?.body || ""}
                        onChange={(e) =>
                          setEditedCopyData({
                            ...editedCopyData,
                            body: e.target.value,
                          })
                        }
                        rows={8}
                        placeholder="Enter LinkedIn message"
                        className="text-sm resize-none"
                      />
                    ) : (
                      <Card className="bg-muted/30 border-border/50">
                        <CardContent className="p-5">
                          <pre className="text-sm whitespace-pre-wrap font-sans leading-relaxed text-foreground">
                            {selectedStepCopy.body}
                          </pre>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Voice Copy */}
                {selectedStepCopy.channel === "Voice" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Voice Call Script & Talking Points
                      </Label>
                      {!editingCopy && (
                        <Badge variant="secondary" className="text-xs">
                          {selectedStepCopy.talking_points?.length || 0} points
                        </Badge>
                      )}
                    </div>
                    {editingCopy ? (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          Enter each talking point separated by a blank line
                        </p>
                        <Textarea
                          value={(editedCopyData?.talking_points || []).join(
                            "\n\n"
                          )}
                          onChange={(e) =>
                            setEditedCopyData({
                              ...editedCopyData,
                              talking_points: e.target.value
                                .split("\n\n")
                                .filter((s) => s.trim()),
                            })
                          }
                          rows={18}
                          placeholder="Enter talking points (separate with blank lines)"
                          className="text-sm resize-none"
                        />
                      </div>
                    ) : (
                      <Card className="bg-muted/30 border-border/50">
                        <CardContent className="p-5 space-y-4">
                          {(selectedStepCopy.talking_points || []).map(
                            (point: string, idx: number) => (
                              <div key={idx} className="flex gap-3">
                                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary flex items-center justify-center text-xs font-semibold">
                                  {idx + 1}
                                </div>
                                <p className="text-sm flex-1 leading-relaxed text-foreground pt-0.5">
                                  {point}
                                </p>
                              </div>
                            )
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}

                {/* Personalization Used */}
                {selectedStepCopy.personalization_used &&
                  selectedStepCopy.personalization_used.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">
                        Personalization Signals Used
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {selectedStepCopy.personalization_used.map(
                          (signal: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="secondary"
                              className="text-xs py-1.5 px-3"
                            >
                              {signal}
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Strategy Alignment */}
                {selectedStepCopy.strategy_alignment && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Strategy Alignment
                    </Label>
                    <Card className="bg-primary/5 border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex gap-3">
                          <Target className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-foreground leading-relaxed">
                            {selectedStepCopy.strategy_alignment}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-muted/30">
            {!editingCopy ? (
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => setCopyDialogOpen(false)}
                  className="flex-1"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setEditingCopy(true)}
                  className="flex-1 gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Copy
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingCopy(false);
                    setEditedCopyData(
                      selectedStepCopy ? { ...selectedStepCopy } : null
                    );
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!selectedLead?._dbLead || !editedCopyData) return;

                    setIsSaving(true);
                    setStatusNote("Saving copy edits...");

                    try {
                      // Find the copy run ID
                      const copyRunId = outreachData?.copy?._id;
                      if (!copyRunId) {
                        throw new Error("Copy run ID not found");
                      }

                      // Update the specific draft in the drafts array
                      const updatedDrafts = (
                        outreachData.copy.drafts || []
                      ).map((d: any) =>
                        d.step === editedCopyData.step ? editedCopyData : d
                      );

                      const response = await fetch(
                        `/api/leads/${selectedLead.id}/outreach/override`,
                        {
                          method: "PATCH",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            scope: "outreach_copy",
                            entity_id: copyRunId,
                            updates: {
                              drafts: updatedDrafts,
                            },
                            path_prefix: "copy_output",
                            reason: "Manual UI edit via Copy Sidebar",
                          }),
                        }
                      );

                      if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(
                          errorData.message ||
                            `HTTP error! status: ${response.status}`
                        );
                      }

                      setStatusNote("Copy edits saved successfully!");
                      setEditingCopy(false);
                      setCopyDialogOpen(false);

                      // Refetch outreach data
                      const updatedOutreachResponse = await fetch(
                        `/api/leads/${selectedLead.id}/outreach`
                      );
                      const updatedOutreachData =
                        await updatedOutreachResponse.json();
                      setOutreachData(updatedOutreachData.data);
                    } catch (error: any) {
                      console.error("Error saving copy edits:", error);
                      setStatusNote(`Error saving edits: ${error.message}`);
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  disabled={isSaving}
                  className="flex-1 gap-2"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Edit Sidebars */}
      <Sheet
        open={editSidebar.open}
        onOpenChange={(open) => setEditSidebar({ ...editSidebar, open })}
      >
        <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
          <SheetHeader className="px-6">
            <SheetTitle className="text-xl font-semibold">
              Edit{" "}
              {editSidebar.section === "strategy"
                ? "Outreach Strategy"
                : editSidebar.section === "copy"
                ? "Outreach Copy"
                : "Guardrails"}
            </SheetTitle>
            <SheetDescription className="text-sm text-muted-foreground">
              Update the fields below. All fields are prefilled and can be
              edited.
            </SheetDescription>
          </SheetHeader>

          <div className="px-6 py-6 space-y-6">
            {editSidebar.section === "guardrails" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="max_touches" className="text-sm font-medium">
                    Maximum Touches
                  </Label>
                  <Input
                    id="max_touches"
                    type="number"
                    value={editFormData.max_touches || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        max_touches: e.target.value,
                      })
                    }
                    placeholder="e.g., 8"
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="voice_escalation_allowed"
                    checked={editFormData.voice_escalation_allowed}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        voice_escalation_allowed: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />
                  <Label
                    htmlFor="voice_escalation_allowed"
                    className="text-sm font-medium"
                  >
                    Voice Escalation Allowed
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="voice_escalation_trigger"
                    className="text-sm font-medium"
                  >
                    Voice Escalation Trigger
                  </Label>
                  <Textarea
                    id="voice_escalation_trigger"
                    value={editFormData.voice_escalation_trigger || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        voice_escalation_trigger: e.target.value,
                      })
                    }
                    rows={3}
                    placeholder="e.g., High ICP (≥80) + engagement on 2+ channels"
                    className="w-full resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="stop_conditions"
                    className="text-sm font-medium"
                  >
                    AI Auto-Stop Conditions (one per line)
                  </Label>
                  <Textarea
                    id="stop_conditions"
                    value={editFormData.stop_conditions || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        stop_conditions: e.target.value,
                      })
                    }
                    rows={6}
                    placeholder="Explicit opt-out&#10;No engagement after 8 touches"
                    className="w-full resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="compliance_rules"
                    className="text-sm font-medium"
                  >
                    Compliance Rules (one per line)
                  </Label>
                  <Textarea
                    id="compliance_rules"
                    value={editFormData.compliance_rules || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        compliance_rules: e.target.value,
                      })
                    }
                    rows={6}
                    placeholder="No weekend outreach&#10;Unsubscribe links in emails"
                    className="w-full resize-none"
                  />
                </div>
              </>
            )}

            {editSidebar.section === "strategy" && editFormData.steps && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="plan_summary" className="text-sm font-medium">
                    Strategy Summary
                  </Label>
                  <Textarea
                    id="plan_summary"
                    value={editFormData.plan_summary || ""}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        plan_summary: e.target.value,
                      })
                    }
                    rows={2}
                    placeholder="One-line summary of the outreach strategy"
                    className="w-full resize-none"
                  />
                </div>

                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold mb-4">Strategy Steps</h4>
                  {(editFormData.steps || []).map(
                    (step: any, stepIdx: number) => (
                      <div
                        key={stepIdx}
                        className="mb-6 pb-6 border-b last:border-0"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="outline" className="text-xs">
                            Step {step.step}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {step.channel}
                          </Badge>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm font-medium">Goal</Label>
                            <Input
                              value={step.goal}
                              onChange={(e) => {
                                const newSteps = [...editFormData.steps];
                                newSteps[stepIdx].goal = e.target.value;
                                setEditFormData({
                                  ...editFormData,
                                  steps: newSteps,
                                });
                              }}
                              placeholder="What this step achieves"
                              className="w-full"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Reasoning
                            </Label>
                            <Textarea
                              value={step.reasoning}
                              onChange={(e) => {
                                const newSteps = [...editFormData.steps];
                                newSteps[stepIdx].reasoning = e.target.value;
                                setEditFormData({
                                  ...editFormData,
                                  steps: newSteps,
                                });
                              }}
                              rows={3}
                              placeholder="Why this step exists"
                              className="w-full resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Delay (hours)
                              </Label>
                              <Input
                                type="number"
                                value={step.recommended_delay_hours}
                                onChange={(e) => {
                                  const newSteps = [...editFormData.steps];
                                  newSteps[stepIdx].recommended_delay_hours =
                                    e.target.value;
                                  setEditFormData({
                                    ...editFormData,
                                    steps: newSteps,
                                  });
                                }}
                                placeholder="48"
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Send Window
                              </Label>
                              <Input
                                value={step.send_window}
                                onChange={(e) => {
                                  const newSteps = [...editFormData.steps];
                                  newSteps[stepIdx].send_window =
                                    e.target.value;
                                  setEditFormData({
                                    ...editFormData,
                                    steps: newSteps,
                                  });
                                }}
                                placeholder="Business hours only"
                                className="w-full"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-sm font-medium">
                              Personalization Signals (one per line)
                            </Label>
                            <Textarea
                              value={step.personalization_signals}
                              onChange={(e) => {
                                const newSteps = [...editFormData.steps];
                                newSteps[stepIdx].personalization_signals =
                                  e.target.value;
                                setEditFormData({
                                  ...editFormData,
                                  steps: newSteps,
                                });
                              }}
                              rows={4}
                              placeholder="Signal 1&#10;Signal 2"
                              className="w-full resize-none"
                            />
                          </div>

                          {step.channel === "Voice" && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium">
                                Gating Conditions (one per line)
                              </Label>
                              <Textarea
                                value={step.gating_conditions}
                                onChange={(e) => {
                                  const newSteps = [...editFormData.steps];
                                  newSteps[stepIdx].gating_conditions =
                                    e.target.value;
                                  setEditFormData({
                                    ...editFormData,
                                    steps: newSteps,
                                  });
                                }}
                                rows={4}
                                placeholder="ICP score >= 80&#10;Engagement on 2+ channels"
                                className="w-full resize-none"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>

          <SheetFooter className="px-6 pb-6">
            <div className="flex items-center gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setEditSidebar({ open: false, section: null })}
                disabled={isSaving}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!selectedLead?._dbLead || !outreachData) return;

                  setIsSaving(true);
                  try {
                    // Save based on section
                    if (editSidebar.section === "guardrails") {
                      // Save guardrails overrides
                      const updates = [
                        {
                          path: "max_touches",
                          value: parseInt(editFormData.max_touches),
                        },
                        {
                          path: "voice_escalation_allowed",
                          value: editFormData.voice_escalation_allowed,
                        },
                        {
                          path: "voice_escalation_trigger",
                          value: editFormData.voice_escalation_trigger,
                        },
                        {
                          path: "stop_conditions",
                          value: editFormData.stop_conditions
                            .split("\n")
                            .filter((s: string) => s.trim()),
                        },
                        {
                          path: "compliance_rules",
                          value: editFormData.compliance_rules
                            .split("\n")
                            .filter((s: string) => s.trim()),
                        },
                      ];

                      for (const update of updates) {
                        await fetch(
                          `/api/leads/${selectedLead.id}/outreach/override`,
                          {
                            method: "PATCH",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              scope: "outreach_guardrails",
                              entity_id: outreachData.guardrails._id,
                              path: update.path,
                              value: update.value,
                            }),
                          }
                        );
                      }
                    } else if (editSidebar.section === "strategy") {
                      // Save strategy overrides
                      await fetch(
                        `/api/leads/${selectedLead.id}/outreach/override`,
                        {
                          method: "PATCH",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            scope: "outreach_strategy",
                            entity_id: outreachData.strategy._id,
                            path: "plan_summary",
                            value: editFormData.plan_summary,
                          }),
                        }
                      );

                      // Save step overrides
                      for (let i = 0; i < editFormData.steps.length; i++) {
                        const step = editFormData.steps[i];
                        const updates = [
                          { path: `steps[${i}].goal`, value: step.goal },
                          {
                            path: `steps[${i}].reasoning`,
                            value: step.reasoning,
                          },
                          {
                            path: `steps[${i}].recommended_delay_hours`,
                            value: parseInt(step.recommended_delay_hours),
                          },
                          {
                            path: `steps[${i}].send_window`,
                            value: step.send_window,
                          },
                          {
                            path: `steps[${i}].personalization_signals`,
                            value: step.personalization_signals
                              .split("\n")
                              .filter((s: string) => s.trim()),
                          },
                        ];

                        if (step.gating_conditions) {
                          updates.push({
                            path: `steps[${i}].gating_conditions`,
                            value: step.gating_conditions
                              .split("\n")
                              .filter((s: string) => s.trim()),
                          });
                        }

                        for (const update of updates) {
                          await fetch(
                            `/api/leads/${selectedLead.id}/outreach/override`,
                            {
                              method: "PATCH",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                scope: "outreach_strategy",
                                entity_id: outreachData.strategy._id,
                                path: update.path,
                                value: update.value,
                              }),
                            }
                          );
                        }
                      }
                    }

                    // Refresh data
                    const refreshResponse = await fetch(
                      `/api/leads/${selectedLead.id}/outreach`
                    );
                    const refreshData = await refreshResponse.json();
                    if (refreshData.success) {
                      setOutreachData(refreshData.data);
                    }

                    setEditSidebar({ open: false, section: null });
                  } catch (error) {
                    console.error("Error saving:", error);
                    alert("Failed to save changes");
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving}
                className="flex-1"
              >
                {isSaving ? "Saving..." : "Save All Changes"}
              </Button>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
