"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MessageSquare, 
  Loader2,
  Plus,
  Search,
  Upload,
  X,
  FileText,
  Linkedin,
  Clock,
  CheckCircle2,
  Settings2,
  Users,
  Activity,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LeadsTable } from "@/components/leads/LeadsTable";
import { LeadRow, dbLeadToLeadRow, mockLeadToLeadRow } from "@/lib/lead-ui";
import { useJazonApp } from "@/context/jazon-app-context";

interface Campaign {
  _id: string;
  name: string;
  status: string;
  mode: string;
  metrics: {
    total_prospects: number;
    active_prospects: number;
    replied_prospects: number;
    booked_prospects: number;
    response_rate: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface CampaignDetails extends Campaign {
  createdBy: string;
  aiReasoning?: {
    objective: string;
    avgICPScore: number;
    explanation: string;
    approach: string;
    riskFlags: string[];
  };
  scheduling: {
    max_touches: number;
    interval_days: number;
    time_window: {
      start: string;
      end: string;
    };
    timezone: string;
    allowed_days: string[];
  };
  agentProfile: {
    agent_name: string;
    agent_designation: string;
    agent_contact: string;
    seller_name: string;
  };
  instructions: {
    construct: string;
    format: string;
    personalization: string;
    additional_notes: string;
  };
  templates: {
    email_steps: Array<{
      step_name: string;
      construct_instructions: string;
      format_instructions: string;
      template: string;
    }>;
    linkedin_template: string;
    voice_template: string;
  };
  strategyType?: string;
  primaryGoal?: string;
  channelMix?: string[];
}

interface Prospect {
  _id: string;
  lead_id: string;
  lead_name: string;
  lead_email: string;
  lead_title: string;
  lead_company: string;
  status: string;
  aiStatus?: "actively_pursue" | "pause_low_intent" | "escalate_to_call" | "remove_from_campaign";
  current_step: number;
  metrics: {
    emails_sent: number;
    replies: number;
    last_touch_at: string | null;
  };
  addedAt: string;
}

interface KnowledgeItem {
  _id: string;
  type: string;
  file_name?: string;
  file_type?: string;
  url?: string;
  url_title?: string;
  note_title?: string;
  note_content?: string;
  createdAt: string;
}

function OutreachCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { leads: mockLeads } = useJazonApp(); // Get mock leads from context
  
  // State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);
  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [activityData, setActivityData] = useState<any>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [createCampaignDialog, setCreateCampaignDialog] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState("Pain Point Email");
  const [addProspectsDialog, setAddProspectsDialog] = useState(false);
  const [addKnowledgeDialog, setAddKnowledgeDialog] = useState(false);
  const [knowledgeType, setKnowledgeType] = useState<"file" | "url" | "note">("url");
  const [urlInput, setUrlInput] = useState("");
  
  // Unified leads (DB + mock) - system of record
  const [dbLeads, setDbLeads] = useState<any[]>([]);
  const [unifiedLeads, setUnifiedLeads] = useState<LeadRow[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  
  // Add Leads functionality
  const [availableLeads, setAvailableLeads] = useState<LeadRow[]>([]);
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [isAddingLeads, setIsAddingLeads] = useState(false);
  const [showLeadsSelection, setShowLeadsSelection] = useState(false);

  // Delete functionality
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [createError, setCreateError] = useState<string>("");

  // Fetch campaigns and leads on mount
  useEffect(() => {
    fetchCampaigns();
    fetchAllLeads();
  }, []);
  
  // Merge DB leads + mock leads whenever they change
  useEffect(() => {
    const dbLeadRows = dbLeads.map(dbLeadToLeadRow);
    const mockLeadRows = mockLeads.map(mockLeadToLeadRow);
    setUnifiedLeads([...mockLeadRows, ...dbLeadRows]);
  }, [dbLeads, mockLeads]);

  // Handle deep link with leadId
  useEffect(() => {
    const leadId = searchParams.get("leadId");
    if (leadId && campaigns.length === 0) {
      // Auto-create campaign and add lead
      handleAutoCreateCampaign(leadId);
    }
  }, [searchParams, campaigns]);

  const fetchAllLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      if (data.success && data.leads) {
        // Filter only icp_scored leads (same as /leads page)
        const scoredLeads = data.leads.filter((lead: any) => lead.status === "icp_scored");
        setDbLeads(scoredLeads);
      }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const res = await fetch("/api/outreach-campaigns");
      const data = await res.json();
      if (data.success) {
        setCampaigns(data.campaigns);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
    }
  };

  const handleAutoCreateCampaign = async (leadId: string) => {
    try {
      // Create campaign
      const createRes = await fetch("/api/outreach-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autoName: true }),
      });
      const createData = await createRes.json();
      
      if (createData.success) {
        const campaignId = createData.campaign._id;
        
        // Add lead to campaign
        await fetch(`/api/outreach-campaigns/${campaignId}/prospects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lead_ids: [leadId] }),
        });
        
        // Refresh campaigns and select new one
        await fetchCampaigns();
        setSelectedCampaignId(campaignId);
        
        // Clear URL param
        router.replace("/outreach");
      }
    } catch (error) {
      console.error("Failed to auto-create campaign:", error);
    }
  };

  const handleCreateCampaign = async () => {
    if (!newCampaignName.trim()) return;
    
    setIsSaving(true);
    setCreateError("");
    try {
      const res = await fetch("/api/outreach-campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCampaignName }),
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchCampaigns();
        setSelectedCampaignId(data.campaign._id);
        setCreateCampaignDialog(false);
        setNewCampaignName("");
        setCreateError("");
      } else {
        setCreateError(data.message || data.error || "Failed to create campaign");
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
      setCreateError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/outreach-campaigns/${campaignId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchCampaigns();
        // Clear selection if deleted campaign was selected
        if (selectedCampaignId === campaignId) {
          setSelectedCampaignId(null);
        }
        // Remove from selected list if it was there
        setSelectedCampaignIds(prev => prev.filter(id => id !== campaignId));
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedCampaignIds.length === 0) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch("/api/outreach-campaigns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignIds: selectedCampaignIds }),
      });
      const data = await res.json();
      
      if (data.success) {
        await fetchCampaigns();
        // Clear selection if deleted campaign was selected
        if (selectedCampaignId && selectedCampaignIds.includes(selectedCampaignId)) {
          setSelectedCampaignId(null);
        }
        setSelectedCampaignIds([]);
      }
    } catch (error) {
      console.error("Failed to delete campaigns:", error);
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
    }
  };

  const handleToggleCampaignSelection = (campaignId: string) => {
    setSelectedCampaignIds(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaignIds.length === filteredCampaigns.length) {
      setSelectedCampaignIds([]);
    } else {
      setSelectedCampaignIds(filteredCampaigns.map(c => c._id));
    }
  };

  const fetchCampaignDetails = async (campaignId: string) => {
    setIsLoading(true);
    try {
      const [detailsRes, prospectsRes, knowledgeRes, activityRes] = await Promise.all([
        fetch(`/api/outreach-campaigns/${campaignId}`),
        fetch(`/api/outreach-campaigns/${campaignId}/prospects`),
        fetch(`/api/outreach-campaigns/${campaignId}/knowledge`),
        fetch(`/api/outreach-campaigns/${campaignId}/activity`),
      ]);
      
      const [detailsData, prospectsData, knowledgeData, activityData] = await Promise.all([
        detailsRes.json(),
        prospectsRes.json(),
        knowledgeRes.json(),
        activityRes.json(),
      ]);
      
      if (detailsData.success) setCampaignDetails(detailsData.campaign);
      if (prospectsData.success) setProspects(prospectsData.prospects);
      if (knowledgeData.success) setKnowledgeItems(knowledgeData.items);
      if (activityData.success) setActivityData(activityData);
    } catch (error) {
      console.error("Failed to fetch campaign details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCampaignId) {
      fetchCampaignDetails(selectedCampaignId);
    }
  }, [selectedCampaignId]);

  const handleSaveCampaignField = async (field: string, value: unknown) => {
    if (!selectedCampaignId) return;
    
    try {
      await fetch(`/api/outreach-campaigns/${selectedCampaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      
      // Refresh details
      fetchCampaignDetails(selectedCampaignId);
    } catch (error) {
      console.error("Failed to save campaign field:", error);
    }
  };

  const handleAddKnowledge = async () => {
    if (!selectedCampaignId) return;
    
    const body: Record<string, unknown> = { type: knowledgeType };
    
    if (knowledgeType === "url") {
      if (!urlInput.trim()) return;
      body.url = urlInput;
      body.url_title = urlInput;
    } else if (knowledgeType === "file") {
      // For demo, just add metadata
      body.file_name = "demo-file.pdf";
      body.file_type = "PDF";
    } else {
      body.note_title = "Campaign Note";
      body.note_content = "";
    }
    
    try {
      const res = await fetch(`/api/outreach-campaigns/${selectedCampaignId}/knowledge`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      
      if (res.ok) {
        fetchCampaignDetails(selectedCampaignId);
        setAddKnowledgeDialog(false);
        setUrlInput("");
      }
    } catch (error) {
      console.error("Failed to add knowledge:", error);
    }
  };

  const handleDeleteKnowledge = async (itemId: string) => {
    if (!selectedCampaignId) return;
    
    try {
      await fetch(`/api/outreach-campaigns/${selectedCampaignId}/knowledge?itemId=${itemId}`, {
        method: "DELETE",
      });
      fetchCampaignDetails(selectedCampaignId);
    } catch (error) {
      console.error("Failed to delete knowledge:", error);
    }
  };

  const fetchAvailableLeads = () => {
    setIsLoadingLeads(true);
    try {
      // Filter out leads that are already in the campaign
      const currentProspectLeadIds = prospects.map(p => p.lead_id);
      const filteredLeads = unifiedLeads.filter(lead => 
        !currentProspectLeadIds.includes(lead.id)
      );
      setAvailableLeads(filteredLeads);
    } catch (error) {
      console.error("Failed to fetch available leads:", error);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  const handleOpenLeadsSelection = () => {
    setShowLeadsSelection(true);
    fetchAvailableLeads();
  };

  const handleToggleLeadSelection = (leadId: string) => {
    setSelectedLeadIds(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleAddSelectedLeads = async () => {
    if (!selectedCampaignId || selectedLeadIds.length === 0) return;
    
    setIsAddingLeads(true);
    try {
      const res = await fetch(`/api/outreach-campaigns/${selectedCampaignId}/prospects`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadIds: selectedLeadIds }),
      });
      
      const data = await res.json();
      if (data.success) {
        // Refresh campaign details and prospects
        await fetchCampaignDetails(selectedCampaignId);
        // Reset state
        setSelectedLeadIds([]);
        setShowLeadsSelection(false);
        setAddProspectsDialog(false);
      }
    } catch (error) {
      console.error("Failed to add leads:", error);
    } finally {
      setIsAddingLeads(false);
    }
  };

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    return campaigns.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaigns, searchQuery]);

  // Join prospects with unified leads to get full lead data + campaign context
  const campaignLeadRows = useMemo(() => {
    if (prospects.length === 0 || unifiedLeads.length === 0) return [];
    
    // Create a map of leads by ID for quick lookup
    const leadMap = new Map(unifiedLeads.map(lead => [lead.id, lead]));
    
    // Join prospects with their corresponding lead details
    return prospects
      .map(prospect => {
        const leadRow = leadMap.get(prospect.lead_id);
        if (!leadRow) return null; // Skip if lead not found in unified leads
        
        return {
          ...leadRow,
          // Add campaign-specific fields
          _prospectId: prospect._id,
          _prospectStatus: prospect.status,
          _aiStatus: prospect.aiStatus || "actively_pursue",
          _currentStep: prospect.current_step,
          _emailsSent: prospect.metrics?.emails_sent || 0,
        };
      })
      .filter(Boolean) as (LeadRow & {
        _prospectId: string;
        _prospectStatus: string;
        _aiStatus: string;
        _currentStep: number;
        _emailsSent: number;
      })[];
  }, [prospects, unifiedLeads]);

  // Get selected lead full data
  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return unifiedLeads.find(lead => lead.id === selectedLeadId) || null;
  }, [selectedLeadId, unifiedLeads]);

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
            {/* Page Header */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-foreground">
                  Outreach Campaigns
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage multi-channel campaigns with AI-powered sequences
                </p>
              </div>
              <Button onClick={() => setCreateCampaignDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                New Campaign
              </Button>
            </div>

            {!selectedCampaignId ? (
              /* Campaign List View */
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search campaigns..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                      </div>
                  {selectedCampaignIds.length > 0 && (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setCampaignToDelete(null);
                        setDeleteDialogOpen(true);
                      }}
                      className="gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Selected ({selectedCampaignIds.length})
                    </Button>
                  )}
                        </div>

                  <Card>
                    <CardHeader>
                    <CardTitle>All Campaigns</CardTitle>
                      <CardDescription>
                        {filteredCampaigns.length} campaign(s)
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                    {filteredCampaigns.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">
                          No campaigns yet. Create your first campaign to get started.
                        </p>
                          </div>
                    ) : (
                      <div className="border rounded-md">
                        <table className="w-full">
                          <thead className="bg-muted/40 border-b">
                            <tr>
                              <th className="px-4 py-3 text-left w-12">
                                <Checkbox
                                  checked={filteredCampaigns.length > 0 && selectedCampaignIds.length === filteredCampaigns.length}
                                  onCheckedChange={handleSelectAll}
                                />
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Campaign Name
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Leads
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Response Rate
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Created
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredCampaigns.map((campaign) => (
                              <tr
                                key={campaign._id}
                                className="border-b hover:bg-muted/20"
                              >
                                <td className="px-4 py-3">
                                  <Checkbox
                                    checked={selectedCampaignIds.includes(campaign._id)}
                                    onCheckedChange={() => handleToggleCampaignSelection(campaign._id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                </td>
                                <td 
                                  className="px-4 py-3 font-medium cursor-pointer"
                                  onClick={() => setSelectedCampaignId(campaign._id)}
                                >
                                  {campaign.name}
                                </td>
                                <td 
                                  className="px-4 py-3 cursor-pointer"
                                  onClick={() => setSelectedCampaignId(campaign._id)}
                                >
                                  <Badge
                                    variant={
                                      campaign.status === "active"
                                        ? "default"
                                        : "outline"
                                    }
                                  >
                                    {campaign.status}
                                  </Badge>
                                </td>
                                <td 
                                  className="px-4 py-3 text-sm text-muted-foreground cursor-pointer"
                                  onClick={() => setSelectedCampaignId(campaign._id)}
                                >
                                  {campaign.metrics.total_prospects} total,{" "}
                                  {campaign.metrics.active_prospects} active
                                </td>
                                <td 
                                  className="px-4 py-3 cursor-pointer"
                                  onClick={() => setSelectedCampaignId(campaign._id)}
                                >
                                  <span className="text-sm font-medium">
                                    {campaign.metrics.response_rate}%
                                  </span>
                                </td>
                                <td 
                                  className="px-4 py-3 text-sm text-muted-foreground cursor-pointer"
                                  onClick={() => setSelectedCampaignId(campaign._id)}
                                >
                                  {new Date(campaign.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedCampaignId(campaign._id);
                                      }}
                                    >
                                      View
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setCampaignToDelete(campaign._id);
                                        setDeleteDialogOpen(true);
                                      }}
                                      className="text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                    </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                                  </div>
                                )}
                    </CardContent>
                  </Card>
                                    </div>
            ) : (
              /* Campaign Detail View with Tabs */
              <div className="space-y-6">
                <div className="space-y-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCampaignId(null)}
                  >
                    ← Back to Campaigns
                  </Button>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold">
                        {campaignDetails?.name || "Loading..."}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {campaignDetails?.mode || ""}
                                    </p>
                                  </div>
                    <Badge
                      variant={
                        campaignDetails?.status === "active" ? "default" : "outline"
                      }
                    >
                      {campaignDetails?.status}
                    </Badge>
                              </div>
                            </div>

                {/* AI Campaign Reasoning */}
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          AI Campaign Reasoning
                        </CardTitle>
                        <CardDescription>
                          Why this campaign exists and Jazon's strategic approach
                        </CardDescription>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        <Settings2 className="h-4 w-4 mr-2" />
                        Override Strategy
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Campaign Objective</Label>
                          <p className="text-sm font-medium mt-1">
                            {campaignDetails?.aiReasoning?.objective || "Net-new outbound"}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Average ICP Score</Label>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={
                              (campaignDetails?.aiReasoning?.avgICPScore || 75) >= 80 ? "default" : 
                              (campaignDetails?.aiReasoning?.avgICPScore || 75) >= 60 ? "secondary" : "outline"
                            }>
                              {campaignDetails?.aiReasoning?.avgICPScore || 75}/100
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {(campaignDetails?.aiReasoning?.avgICPScore || 75) >= 80 ? "High fit" : 
                               (campaignDetails?.aiReasoning?.avgICPScore || 75) >= 60 ? "Medium fit" : "Lower fit"}
                            </span>
                      </div>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Chosen Outreach Approach</Label>
                          <p className="text-sm font-medium mt-1">
                            {campaignDetails?.aiReasoning?.approach || "Value-led"}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Why This Campaign Exists</Label>
                          <p className="text-sm mt-1 leading-relaxed">
                            {campaignDetails?.aiReasoning?.explanation || 
                             "Early-stage founders need fast, cost-effective AI infrastructure. This campaign targets high-intent prospects with resource constraints who value speed to market."}
                          </p>
                              </div>
                        {(campaignDetails?.aiReasoning?.riskFlags && campaignDetails.aiReasoning.riskFlags.length > 0) && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Risk Flags</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {campaignDetails.aiReasoning.riskFlags.map((flag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {flag}
                                </Badge>
                              ))}
                                    </div>
                                  </div>
                        )}
                        {(!campaignDetails?.aiReasoning?.riskFlags || campaignDetails.aiReasoning.riskFlags.length === 0) && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Risk Flags</Label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                Early-stage founders (limited budget)
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Low historical reply rate for similar ICPs
                              </Badge>
                                </div>
                          </div>
                        )}
                      </div>
                        </div>
                  </CardContent>
                </Card>

                <Tabs defaultValue="campaign" className="w-full">
                  <TabsList>
                    <TabsTrigger value="campaign">Campaign</TabsTrigger>
                    <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                    <TabsTrigger value="strategy">Strategy</TabsTrigger>
                    <TabsTrigger value="prospects">Leads</TabsTrigger>
                    <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>

                  {/* Campaign Tab */}
                  <TabsContent value="campaign" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Agent Name</CardTitle>
                        <CardDescription>Give your SDR agent a name</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Input
                          value={campaignDetails?.agentProfile.agent_name || ""}
                          onChange={(e) =>
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    agentProfile: {
                                      ...prev.agentProfile,
                                      agent_name: e.target.value,
                                    },
                                  }
                                : null
                            )
                          }
                          onBlur={() =>
                            handleSaveCampaignField(
                              "agentProfile",
                              campaignDetails?.agentProfile
                            )
                          }
                          placeholder="e.g., Alex Morgan"
                        />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                        <CardTitle>Agent Designation</CardTitle>
                        <CardDescription>Title or role of the agent</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Input
                          value={campaignDetails?.agentProfile.agent_designation || ""}
                          onChange={(e) =>
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    agentProfile: {
                                      ...prev.agentProfile,
                                      agent_designation: e.target.value,
                                    },
                                  }
                                : null
                            )
                          }
                          onBlur={() =>
                            handleSaveCampaignField(
                              "agentProfile",
                              campaignDetails?.agentProfile
                            )
                          }
                          placeholder="e.g., Senior SDR"
                        />
                    </CardContent>
                  </Card>

                <Card>
                  <CardHeader>
                        <CardTitle>Agent Contact</CardTitle>
                        <CardDescription>How can people contact you?</CardDescription>
                  </CardHeader>
                  <CardContent>
                        <Input
                          value={campaignDetails?.agentProfile.agent_contact || ""}
                          onChange={(e) =>
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    agentProfile: {
                                      ...prev.agentProfile,
                                      agent_contact: e.target.value,
                                    },
                                  }
                                : null
                            )
                          }
                          onBlur={() =>
                            handleSaveCampaignField(
                              "agentProfile",
                              campaignDetails?.agentProfile
                            )
                          }
                          placeholder="email@company.com"
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Seller Name</CardTitle>
                        <CardDescription>The name of the seller</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Input
                          value={campaignDetails?.agentProfile.seller_name || ""}
                          onChange={(e) =>
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    agentProfile: {
                                      ...prev.agentProfile,
                                      seller_name: e.target.value,
                                    },
                                  }
                                : null
                            )
                          }
                          onBlur={() =>
                            handleSaveCampaignField(
                              "agentProfile",
                              campaignDetails?.agentProfile
                            )
                          }
                          placeholder="Company Name"
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Knowledge Base Tab */}
                  <TabsContent value="knowledge" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Knowledge Items</h3>
                        <p className="text-sm text-muted-foreground">
                          {knowledgeItems.length} item(s)
                        </p>
                                          </div>
                      <Button onClick={() => setAddKnowledgeDialog(true)}>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload
                      </Button>
                                      </div>

                    {knowledgeItems.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <p className="text-muted-foreground">
                            No knowledge items yet. Add documents, URLs, or notes.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="space-y-2">
                        {knowledgeItems.map((item) => (
                          <Card key={item._id}>
                            <CardContent className="p-4 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <p className="font-medium">
                                    {item.file_name || item.url_title || item.note_title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {item.type} • {new Date(item.createdAt).toLocaleDateString()}
                                  </p>
                                              </div>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                onClick={() => handleDeleteKnowledge(item._id)}
                              >
                                <X className="h-4 w-4" />
                                          </Button>
                            </CardContent>
                          </Card>
                        ))}
                                                  </div>
                                                )}
                  </TabsContent>

                  {/* Strategy Tab */}
                  <TabsContent value="strategy" className="space-y-4 mt-4">
                    {/* Strategy Summary */}
                    <Card className="mb-4">
                      <CardHeader>
                        <CardTitle className="text-base">Campaign Strategy Overview</CardTitle>
                        <CardDescription>AI-determined strategy for this campaign</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid md:grid-cols-3 gap-4">
                                                  <div>
                            <Label className="text-xs text-muted-foreground">Strategy Type</Label>
                            <p className="text-sm font-medium mt-1">
                              {campaignDetails?.strategyType || "Net-new Outbound"}
                            </p>
                                                    </div>
                                                  <div>
                            <Label className="text-xs text-muted-foreground">Primary Goal</Label>
                            <p className="text-sm font-medium mt-1">
                              {campaignDetails?.primaryGoal || "Book Meeting"}
                                                    </p>
                                                    </div>
                                                  <div>
                            <Label className="text-xs text-muted-foreground">Channel Mix (AI-chosen)</Label>
                            <div className="flex gap-2 mt-1">
                              {(campaignDetails?.channelMix || ["Email", "LinkedIn", "Call"]).map((channel, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {channel}
                                                        </Badge>
                                                      ))}
                                                    </div>
                                                  </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Email Steps Section */}
                    <div className="flex items-center gap-2 px-1 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        AI Generated
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Email steps generated by AI based on campaign strategy
                      </span>
                                                </div>

                    <div className="flex gap-6">
                      <div className="w-64 shrink-0">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Email Steps</CardTitle>
                          </CardHeader>
                          <CardContent className="p-0">
                            <div className="space-y-1">
                              {campaignDetails?.templates.email_steps.map((step, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setSelectedMode(step.step_name)}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-muted/50 ${
                                    selectedMode === step.step_name
                                      ? "bg-primary text-primary-foreground"
                                      : ""
                                  }`}
                                >
                                  {step.step_name}
                                </button>
                              ))}
                                              </div>
                          </CardContent>
                        </Card>
                                                  </div>

                      <div className="flex-1 space-y-4">
                        {campaignDetails?.templates.email_steps
                          .filter((s) => s.step_name === selectedMode)
                          .map((step, idx) => (
                            <div key={idx} className="space-y-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    Construct Instructions
                                  </CardTitle>
                                  <CardDescription>
                                    How to structure this email
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <Textarea
                                    rows={4}
                                    value={step.construct_instructions}
                                    onChange={(e) => {
                                      const newSteps = [...campaignDetails.templates.email_steps];
                                      const stepIdx = newSteps.findIndex(
                                        (s) => s.step_name === selectedMode
                                      );
                                      newSteps[stepIdx].construct_instructions = e.target.value;
                                      setCampaignDetails({
                                        ...campaignDetails,
                                        templates: {
                                          ...campaignDetails.templates,
                                          email_steps: newSteps,
                                        },
                                      });
                                    }}
                                    onBlur={() =>
                                      handleSaveCampaignField(
                                        "templates",
                                        campaignDetails.templates
                                      )
                                    }
                                    placeholder="Define how to construct this email..."
                                  />
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base">
                                    Format Instructions
                                  </CardTitle>
                                  <CardDescription>
                                    Formatting and style guidelines
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <Textarea
                                    rows={4}
                                    value={step.format_instructions}
                                    onChange={(e) => {
                                      const newSteps = [...campaignDetails.templates.email_steps];
                                      const stepIdx = newSteps.findIndex(
                                        (s) => s.step_name === selectedMode
                                      );
                                      newSteps[stepIdx].format_instructions = e.target.value;
                                      setCampaignDetails({
                                        ...campaignDetails,
                                        templates: {
                                          ...campaignDetails.templates,
                                          email_steps: newSteps,
                                        },
                                      });
                                    }}
                                    onBlur={() =>
                                      handleSaveCampaignField(
                                        "templates",
                                        campaignDetails.templates
                                      )
                                    }
                                    placeholder="Define formatting rules..."
                                  />
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-base">Email Template</CardTitle>
                                  <CardDescription>
                                    Template with variables
                                  </CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <Textarea
                                    rows={10}
                                    value={step.template}
                                    onChange={(e) => {
                                      const newSteps = [...campaignDetails.templates.email_steps];
                                      const stepIdx = newSteps.findIndex(
                                        (s) => s.step_name === selectedMode
                                      );
                                      newSteps[stepIdx].template = e.target.value;
                                      setCampaignDetails({
                                        ...campaignDetails,
                                        templates: {
                                          ...campaignDetails.templates,
                                          email_steps: newSteps,
                                        },
                                      });
                                    }}
                                    onBlur={() =>
                                      handleSaveCampaignField(
                                        "templates",
                                        campaignDetails.templates
                                      )
                                    }
                                    placeholder="Subject: [Your subject]\n\nHi {prospect_name},\n\n..."
                                    className="font-mono text-sm"
                                  />
                                  <div className="mt-2">
                                    <Button variant="outline" size="sm">
                                      Generate sample email
                                    </Button>
                                        </div>
                                </CardContent>
                              </Card>
                                    </div>
                          ))}
                                  </div>
                                </div>
                  </TabsContent>

                  {/* Leads Tab */}
                  <TabsContent value="prospects" className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Leads</h3>
                        <p className="text-sm text-muted-foreground">
                          {campaignLeadRows.length} lead(s) in campaign
                        </p>
                      </div>
                      <Button onClick={() => setAddProspectsDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Leads
                      </Button>
                    </div>

                    {campaignLeadRows.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <p className="text-muted-foreground">
                            No leads yet. Add leads to start your campaign.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardContent className="p-0">
                          <LeadsTable
                            leads={campaignLeadRows}
                            onRowClick={setSelectedLeadId}
                            extraColumns={{
                              headers: [
                                <th key="ai-status" className="px-4 py-3 text-left text-xs font-medium">
                                  <div className="flex items-center gap-1">
                                    AI Status
                                    <Badge variant="secondary" className="text-[10px] px-1">AI</Badge>
                                  </div>
                                </th>,
                                <th key="step" className="px-4 py-3 text-left text-xs font-medium">
                                  Step
                                </th>,
                                <th key="emails-sent" className="px-4 py-3 text-left text-xs font-medium">
                                  Emails Sent
                                </th>,
                              ],
                              renderCells: (lead: any) => [
                                <td key="ai-status" className="px-4 py-3">
                                  {lead._aiStatus === "actively_pursue" && (
                                    <Badge variant="default" className="text-xs">
                                      Actively pursue
                                    </Badge>
                                  )}
                                  {lead._aiStatus === "pause_low_intent" && (
                                    <Badge variant="secondary" className="text-xs">
                                      Pause (low intent)
                                    </Badge>
                                  )}
                                  {lead._aiStatus === "escalate_to_call" && (
                                    <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                                      Escalate to call
                                    </Badge>
                                  )}
                                  {lead._aiStatus === "remove_from_campaign" && (
                                    <Badge variant="outline" className="text-xs border-red-500 text-red-600">
                                      Remove from campaign
                                    </Badge>
                                  )}
                                </td>,
                                <td key="step" className="px-4 py-3 text-sm">
                                  {lead._currentStep}
                                </td>,
                                <td key="emails-sent" className="px-4 py-3 text-sm">
                                  {lead._emailsSent}
                                </td>,
                              ],
                            }}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </TabsContent>

                  {/* Scheduling Tab */}
                  <TabsContent value="scheduling" className="space-y-4 mt-4">
                    {/* AI Override Notice */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                          AI-Adaptive Scheduling
                        </p>
                        <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                          Jazon may override timing per lead based on engagement patterns and intent signals. 
                          High-engagement leads may be contacted sooner, while low-engagement leads may be paused.
                          </p>
                        </div>
                      </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Max. outreach email count</CardTitle>
                        <CardDescription>
                          Maximum outreach emails sent to a lead (AI may adjust per lead)
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="number"
                          value={campaignDetails?.scheduling.max_touches || 7}
                          onChange={(e) =>
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    scheduling: {
                                      ...prev.scheduling,
                                      max_touches: parseInt(e.target.value) || 7,
                                    },
                                  }
                                : null
                            )
                          }
                          onBlur={() =>
                            handleSaveCampaignField(
                              "scheduling",
                              campaignDetails?.scheduling
                            )
                          }
                        />
                  </CardContent>
                </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Time Interval</CardTitle>
                        <CardDescription>
                          Time interval, in days, between consecutive emails to a lead
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Input
                          type="number"
                          value={campaignDetails?.scheduling.interval_days || 1}
                          onChange={(e) =>
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    scheduling: {
                                      ...prev.scheduling,
                                      interval_days: parseInt(e.target.value) || 1,
                                    },
                                  }
                                : null
                            )
                          }
                          onBlur={() =>
                            handleSaveCampaignField(
                              "scheduling",
                              campaignDetails?.scheduling
                            )
                          }
                        />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Time Window</CardTitle>
                        <CardDescription>
                          Hours between which emails can be sent
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label>Start time</Label>
                            <Input
                              type="time"
                              value={campaignDetails?.scheduling.time_window.start || "08:00"}
                              onChange={(e) =>
                                setCampaignDetails((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        scheduling: {
                                          ...prev.scheduling,
                                          time_window: {
                                            ...prev.scheduling.time_window,
                                            start: e.target.value,
                                          },
                                        },
                                      }
                                    : null
                                )
                              }
                              onBlur={() =>
                                handleSaveCampaignField(
                                  "scheduling",
                                  campaignDetails?.scheduling
                                )
                              }
                            />
                            </div>
                          <div>
                            <Label>End time</Label>
                            <Input
                              type="time"
                              value={campaignDetails?.scheduling.time_window.end || "17:00"}
                              onChange={(e) =>
                                setCampaignDetails((prev) =>
                                  prev
                                    ? {
                                        ...prev,
                                        scheduling: {
                                          ...prev.scheduling,
                                          time_window: {
                                            ...prev.scheduling.time_window,
                                            end: e.target.value,
                                          },
                                        },
                                      }
                                    : null
                                )
                              }
                              onBlur={() =>
                                handleSaveCampaignField(
                                  "scheduling",
                                  campaignDetails?.scheduling
                                )
                              }
                            />
                            </div>
                          </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Timezone</CardTitle>
                        <CardDescription>Select appropriate timezone</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Select
                          value={campaignDetails?.scheduling.timezone}
                          onValueChange={(value) => {
                            setCampaignDetails((prev) =>
                              prev
                                ? {
                                    ...prev,
                                    scheduling: {
                                      ...prev.scheduling,
                                      timezone: value,
                                    },
                                  }
                                : null
                            );
                            handleSaveCampaignField("scheduling", {
                              ...campaignDetails?.scheduling,
                              timezone: value,
                            });
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="America/New_York">
                              America/New_York (EST)
                            </SelectItem>
                            <SelectItem value="America/Los_Angeles">
                              America/Los_Angeles (PST)
                            </SelectItem>
                            <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                            <SelectItem value="Asia/Kolkata">Asia/Kolkata (+5:30)</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Days</CardTitle>
                        <CardDescription>Select the weekdays</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                            "Sunday",
                          ].map((day) => (
                            <div key={day} className="flex items-center gap-2">
                              <Checkbox
                                id={day}
                                checked={campaignDetails?.scheduling.allowed_days.includes(
                                  day
                                )}
                                onCheckedChange={(checked) => {
                                  const newDays = checked
                                    ? [...(campaignDetails?.scheduling.allowed_days || []), day]
                                    : campaignDetails?.scheduling.allowed_days.filter(
                                        (d) => d !== day
                                      ) || [];
                                  setCampaignDetails((prev) =>
                                    prev
                                      ? {
                                          ...prev,
                                          scheduling: {
                                            ...prev.scheduling,
                                            allowed_days: newDays,
                                          },
                                        }
                                      : null
                                  );
                                  handleSaveCampaignField("scheduling", {
                                    ...campaignDetails?.scheduling,
                                    allowed_days: newDays,
                                  });
                                }}
                              />
                              <Label htmlFor={day} className="cursor-pointer">
                                {day}
                              </Label>
                                </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Button onClick={() => handleSaveCampaignField("scheduling", campaignDetails?.scheduling)}>
                      Save Configuration
                    </Button>
                  </TabsContent>

                  {/* Activity Tab */}
                  <TabsContent value="activity" className="space-y-4 mt-4">
                    <div className="grid grid-cols-5 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Mails
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {activityData?.metrics.mails_sent || 0}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Replies
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">
                            {activityData?.metrics.replies || 0}
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Open
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {activityData?.metrics.opens || 0}
                          </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Click
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">
                            {activityData?.metrics.clicks || 0}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-muted-foreground">
                            Unsubscribe
                          </CardTitle>
                      </CardHeader>
                      <CardContent>
                          <div className="text-2xl font-bold">0</div>
                      </CardContent>
                    </Card>
                  </div>

                    <Card>
                      <CardHeader>
                        <CardTitle>Receipts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {activityData?.prospects && activityData.prospects.length > 0 ? (
                          <div className="space-y-2">
                            {activityData.prospects.map((prospect: any) => (
                              <div
                                key={prospect._id}
                                className="p-3 border rounded-md hover:bg-muted/20"
                              >
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{prospect.lead_name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      {prospect.lead_email}
                  </p>
                </div>
                                  <Badge variant="outline">{prospect.status}</Badge>
                                </div>
                                {prospect.history && prospect.history.length > 0 && (
                                  <div className="mt-2 text-xs text-muted-foreground">
                                    Last activity: {prospect.history[0].title}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-center py-8 text-muted-foreground">
                            No activity yet
                          </p>
                        )}
                      </CardContent>
                    </Card>

                    {/* AI Decisions Log */}
                    <Card>
                      <CardHeader>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <CardTitle>AI Decisions Log</CardTitle>
                  </div>
                        <CardDescription>
                          Automated decisions made by Jazon based on engagement and intent
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Sample AI decisions */}
                          <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="default" className="text-xs">
                                  Decision
                                </Badge>
                                <span className="text-sm font-medium">
                                  Paused outreach to John Smith
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                2 hours ago
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <strong>Reason:</strong> No opens after 3 emails. Low intent signal detected.
                            </p>
                          </div>

                          <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">
                                  Escalate
                                </Badge>
                                <span className="text-sm font-medium">
                                  Escalated Emily Davis to call
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                1 day ago
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <strong>Reason:</strong> Replied twice with positive signals. High intent detected.
                  </p>
                </div>

                          <div className="p-3 border rounded-lg bg-muted/30">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  Timing Adjusted
                                </Badge>
                                <span className="text-sm font-medium">
                                  Advanced next touch for Michael Chen
                                </span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                3 days ago
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              <strong>Reason:</strong> Engagement spike detected. Opened email 3 times.
                            </p>
                          </div>

                          {(!activityData?.aiDecisions || activityData.aiDecisions.length === 0) && (
                            <p className="text-center py-4 text-sm text-muted-foreground">
                              AI decisions will appear here as Jazon optimizes the campaign
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Create Campaign Dialog */}
      <Dialog open={createCampaignDialog} onOpenChange={(open) => {
        setCreateCampaignDialog(open);
        if (!open) {
          setNewCampaignName("");
          setCreateError("");
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Give your campaign a descriptive name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name</Label>
              <Input
                id="campaign-name"
                value={newCampaignName}
                onChange={(e) => {
                  setNewCampaignName(e.target.value);
                  setCreateError("");
                }}
                placeholder="e.g., Q1 Enterprise Outbound"
              />
              {createError && (
                <p className="text-sm text-destructive">{createError}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateCampaignDialog(false);
                setNewCampaignName("");
                setCreateError("");
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} disabled={isSaving || !newCampaignName.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {campaignToDelete
                ? "This will permanently delete the campaign and all associated data. This action cannot be undone."
                : `This will permanently delete ${selectedCampaignIds.length} campaign(s) and all associated data. This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDeleteDialogOpen(false);
                setCampaignToDelete(null);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (campaignToDelete) {
                  handleDeleteCampaign(campaignToDelete);
                } else {
                  handleBulkDelete();
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Knowledge Dialog */}
      <Dialog open={addKnowledgeDialog} onOpenChange={setAddKnowledgeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Knowledge Item</DialogTitle>
            <DialogDescription>Add a document, URL, or note to the knowledge base</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select
                value={knowledgeType}
                onValueChange={(value: "file" | "url" | "note") =>
                  setKnowledgeType(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="file">File</SelectItem>
                  <SelectItem value="url">URL</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {knowledgeType === "url" && (
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/case-study"
                />
              </div>
            )}

            {knowledgeType === "file" && (
              <div className="space-y-2">
                <Label>Upload File</Label>
                <Input type="file" accept=".pdf,.doc,.docx" />
                <p className="text-xs text-muted-foreground">
                  For demo: file metadata will be stored
                </p>
              </div>
            )}

            {knowledgeType === "note" && (
              <div className="space-y-2">
                <Label>Note</Label>
                <Textarea rows={4} placeholder="Add your note here..." />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddKnowledgeDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddKnowledge}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Leads Dialog */}
      <Dialog open={addProspectsDialog} onOpenChange={(open) => {
        setAddProspectsDialog(open);
        if (!open) {
          setShowLeadsSelection(false);
          setSelectedLeadIds([]);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Leads to Campaign</DialogTitle>
            <DialogDescription>
              {showLeadsSelection 
                ? "Select leads from your database to add to this campaign"
                : "Choose how you want to add leads to this campaign"}
            </DialogDescription>
          </DialogHeader>

          {!showLeadsSelection ? (
            // Method Selection
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="h-24 hover:border-primary hover:bg-primary/5 transition-colors"
                  onClick={handleOpenLeadsSelection}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Users className="h-6 w-6 text-primary" />
                    <span className="text-sm font-medium">From Existing Leads</span>
                    <span className="text-xs text-muted-foreground">Select from database</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 hover:border-primary hover:bg-primary/5 transition-colors"
                  disabled
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="h-6 w-6" />
                    <span className="text-sm font-medium">CSV Upload</span>
                    <span className="text-xs text-muted-foreground">Coming soon</span>
                  </div>
                </Button>
              </div>
            </div>
          ) : (
            // Leads Selection
            <div className="space-y-4 py-4">
              {/* Search and Stats */}
              <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search leads..."
                    className="pl-9"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedLeadIds.length} selected
                </div>
              </div>

              {/* Leads List */}
              <div className="border rounded-lg overflow-hidden max-h-[400px] overflow-y-auto">
                {isLoadingLeads ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : availableLeads.length === 0 ? (
                  <div className="py-12 text-center">
                    <p className="text-sm text-muted-foreground">
                      No available leads. All leads are already in this campaign.
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/40 border-b sticky top-0">
                        <tr>
                          <th className="px-4 py-3 text-left w-12">
                            <Checkbox
                              checked={selectedLeadIds.length === availableLeads.length && availableLeads.length > 0}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedLeadIds(availableLeads.map(l => l.id));
                                } else {
                                  setSelectedLeadIds([]);
                                }
                              }}
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Company</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Title</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">ICP Score</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Stage</th>
                          <th className="px-4 py-3 text-left text-xs font-medium">Source</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availableLeads.map((lead) => (
                          <tr 
                            key={lead.id}
                            className="border-b hover:bg-muted/30 transition-colors cursor-pointer"
                            onClick={() => handleToggleLeadSelection(lead.id)}
                          >
                            <td className="px-4 py-3">
                              <Checkbox
                                checked={selectedLeadIds.includes(lead.id)}
                                onCheckedChange={() => handleToggleLeadSelection(lead.id)}
                              />
                            </td>
                            <td className="px-4 py-3">
                              <p className="font-medium text-sm">{lead.name}</p>
                            </td>
                            <td className="px-4 py-3 text-sm">{lead.company}</td>
                            <td className="px-4 py-3 text-xs text-muted-foreground">{lead.title}</td>
                            <td className="px-4 py-3">
                              <Badge variant={
                                lead.icpScore >= 80 ? "default" : 
                                lead.icpScore >= 60 ? "secondary" : "outline"
                              }>
                                {lead.icpScore}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">
                                {lead.stage}
                              </Badge>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="text-xs">
                                {lead.source}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            {showLeadsSelection ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowLeadsSelection(false);
                    setSelectedLeadIds([]);
                  }}
                >
                  Back
                </Button>
                <Button 
                  onClick={handleAddSelectedLeads}
                  disabled={selectedLeadIds.length === 0 || isAddingLeads}
                >
                  {isAddingLeads ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    `Add ${selectedLeadIds.length} Lead${selectedLeadIds.length !== 1 ? 's' : ''}`
                  )}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setAddProspectsDialog(false)}>
                Cancel
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lead Details Sheet */}
      <Sheet open={!!selectedLeadId} onOpenChange={(open) => !open && setSelectedLeadId(null)}>
        <SheetContent className="w-[600px] sm:w-[700px] overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  {selectedLead.name}
                  <Badge variant={
                    selectedLead.icpScore >= 85 ? "default" : 
                    selectedLead.icpScore >= 70 ? "secondary" : "outline"
                  }>
                    ICP: {selectedLead.icpScore}
                  </Badge>
                </SheetTitle>
                <SheetDescription>
                  {selectedLead.title} at {selectedLead.company}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Campaign Context Section */}
                {campaignDetails && (
                  <Card className="border-primary/20 bg-primary/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Campaign Context
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Campaign</Label>
                        <p className="text-sm font-medium">{campaignDetails.name}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">AI Inclusion Reasoning</Label>
                        <p className="text-sm">
                          {campaignDetails.aiReasoning?.explanation || 
                           "This lead was added to the campaign based on ICP fit and strategic alignment with campaign objectives."}
                        </p>
                      </div>
                      {campaignLeadRows.find(l => l.id === selectedLeadId) && (
                        <div>
                          <Label className="text-xs text-muted-foreground">AI Status</Label>
                          <div className="mt-1">
                            {(() => {
                              const aiStatus = campaignLeadRows.find(l => l.id === selectedLeadId)?._aiStatus;
                              if (aiStatus === "actively_pursue") return <Badge variant="default" className="text-xs">Actively pursue</Badge>;
                              if (aiStatus === "pause_low_intent") return <Badge variant="secondary" className="text-xs">Pause (low intent)</Badge>;
                              if (aiStatus === "escalate_to_call") return <Badge variant="outline" className="text-xs border-blue-500 text-blue-600">Escalate to call</Badge>;
                              if (aiStatus === "remove_from_campaign") return <Badge variant="outline" className="text-xs border-red-500 text-red-600">Remove from campaign</Badge>;
                              return <Badge variant="default" className="text-xs">Actively pursue</Badge>;
                            })()}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Lead Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Lead Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Email</Label>
                        <p className="text-sm">{selectedLead.email}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Company</Label>
                        <p className="text-sm">{selectedLead.company}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Title</Label>
                        <p className="text-sm">{selectedLead.title}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Industry</Label>
                        <p className="text-sm">{selectedLead.industry}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">ICP Score</Label>
                        <p className="text-sm font-semibold">{selectedLead.icpScore}/100 - {
                          selectedLead.icpScore >= 85 ? "High fit" : 
                          selectedLead.icpScore >= 70 ? "Medium fit" : "Low fit"
                        }</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Source</Label>
                        <p className="text-sm">{selectedLead.source}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Recommendation */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">AI Recommendation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedLead.aiRecommendation}</p>
                    {selectedLead.triggers && selectedLead.triggers.length > 0 && (
                      <div className="mt-3">
                        <Label className="text-xs text-muted-foreground">Detected Signals</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedLead.triggers.map((trigger, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.push(`/research?leadId=${selectedLeadId}`)}
                  >
                    View Research & ICP
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}

export default function OutreachCampaignPageWrapper() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-muted-foreground">Loading...</div></div>}>
      <OutreachCampaignPage />
    </Suspense>
  );
}
