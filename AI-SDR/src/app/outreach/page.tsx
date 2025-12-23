"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

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
}

interface Prospect {
  _id: string;
  lead_id: string;
  lead_name: string;
  lead_email: string;
  lead_title: string;
  lead_company: string;
  status: string;
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

export default function OutreachCampaignPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
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

  // Fetch campaigns on mount
  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Handle deep link with leadId
  useEffect(() => {
    const leadId = searchParams.get("leadId");
    if (leadId && campaigns.length === 0) {
      // Auto-create campaign and add lead
      handleAutoCreateCampaign(leadId);
    }
  }, [searchParams, campaigns]);

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
      }
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setIsSaving(false);
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

  const filteredCampaigns = useMemo(() => {
    if (!searchQuery) return campaigns;
    return campaigns.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [campaigns, searchQuery]);

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
                                className="border-b hover:bg-muted/20 cursor-pointer"
                                onClick={() => setSelectedCampaignId(campaign._id)}
                              >
                                <td className="px-4 py-3 font-medium">{campaign.name}</td>
                                <td className="px-4 py-3">
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
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  {campaign.metrics.total_prospects} total,{" "}
                                  {campaign.metrics.active_prospects} active
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-sm font-medium">
                                    {campaign.metrics.response_rate}%
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-muted-foreground">
                                  {new Date(campaign.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3">
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

                <Tabs defaultValue="campaign" className="w-full">
                  <TabsList>
                    <TabsTrigger value="campaign">Campaign</TabsTrigger>
                    <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
                    <TabsTrigger value="mode">Mode</TabsTrigger>
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

                  {/* Mode Tab */}
                  <TabsContent value="mode" className="space-y-4 mt-4">
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
                          {prospects.length} lead(s) in campaign
                                </p>
                              </div>
                      <Button onClick={() => setAddProspectsDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Leads
                      </Button>
                            </div>

                    {prospects.length === 0 ? (
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
                          <div className="border rounded-md">
                            <table className="w-full">
                              <thead className="bg-muted/40 border-b">
                                <tr>
                                  <th className="px-4 py-3 text-left text-xs font-medium">
                                    Name
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium">
                                    Email
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium">
                                    Company
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium">
                                    Status
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium">
                                    Step
                                  </th>
                                  <th className="px-4 py-3 text-left text-xs font-medium">
                                    Emails Sent
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {prospects.map((prospect) => (
                                  <tr key={prospect._id} className="border-b">
                                    <td className="px-4 py-3">{prospect.lead_name}</td>
                                    <td className="px-4 py-3 text-sm text-muted-foreground">
                                      {prospect.lead_email}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {prospect.lead_company}
                                    </td>
                                    <td className="px-4 py-3">
                                      <Badge variant="outline">{prospect.status}</Badge>
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {prospect.current_step}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                      {prospect.metrics.emails_sent}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                        </div>
                  </CardContent>
                </Card>
                    )}
                  </TabsContent>

                  {/* Scheduling Tab */}
                  <TabsContent value="scheduling" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Max. outreach email count</CardTitle>
                        <CardDescription>
                          Maximum outreach emails sent to a lead
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
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Create Campaign Dialog */}
      <Dialog open={createCampaignDialog} onOpenChange={setCreateCampaignDialog}>
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
                onChange={(e) => setNewCampaignName(e.target.value)}
                placeholder="e.g., Q1 Enterprise Outbound"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCreateCampaignDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign} disabled={isSaving}>
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
      <Dialog open={addProspectsDialog} onOpenChange={setAddProspectsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Leads</DialogTitle>
            <DialogDescription>
              Add leads to this campaign from existing leads or CSV upload
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-20">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs">From Existing Leads</span>
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="flex flex-col items-center gap-2">
                  <Upload className="h-5 w-5" />
                  <span className="text-xs">CSV Upload</span>
                </div>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Demo: Select method to add leads
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProspectsDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
