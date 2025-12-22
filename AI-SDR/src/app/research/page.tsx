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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockICPData } from "@/lib/mock-data";
import { useJazonApp } from "@/context/jazon-app-context";
import {
  Building2,
  User,
  Zap,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Rocket,
  RefreshCw,
  UserCheck,
  ExternalLink,
  Edit3,
  Plus,
} from "lucide-react";

export default function ResearchPage() {
  const { leads: mockLeads } = useJazonApp();
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{
    company: boolean;
    persona: boolean;
    timing: boolean;
  }>({
    company: false,
    persona: false,
    timing: false,
  });
  const [dbLeads, setDbLeads] = useState<any[]>([]);
  const [selectedLeadData, setSelectedLeadData] = useState<any>(null);
  const [isLoadingLead, setIsLoadingLead] = useState(false);
  const [editSidebar, setEditSidebar] = useState<{
    open: boolean;
    section: "company" | "persona" | null;
  }>({
    open: false,
    section: null,
  });
  const [editFormData, setEditFormData] = useState<any>({});
  const [isSaving, setIsSaving] = useState(false);

  // Fetch leads from database on mount
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        const data = await response.json();

        if (data.success && data.leads) {
          // Transform database leads (using normalized schema)
          const transformedLeads = data.leads.map((dbLead: any) => ({
            id: dbLead._id,
            name: dbLead.name,
            company: dbLead.company?.name || "Unknown",
            icpScore: dbLead.icp_score?.icp_score || 0,
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

  // Default to highest ICP score lead
  const defaultLead = useMemo(() => {
    if (leads.length === 0) return null;
    return leads.reduce((highest, lead) =>
      lead.icpScore > highest.icpScore ? lead : highest
    );
  }, [leads]);

  const selectedLead = selectedLeadId
    ? leads.find((l) => l.id === selectedLeadId) || defaultLead
    : defaultLead;

  // Fetch full lead data when selection changes
  useEffect(() => {
    const fetchLeadData = async () => {
      if (!selectedLead || !selectedLead._dbLead) {
        setSelectedLeadData(null);
        return;
      }

      setIsLoadingLead(true);
      try {
        const response = await fetch(`/api/leads/${selectedLead.id}`);
        const data = await response.json();

        if (data.success) {
          setSelectedLeadData(data.lead);
        }
      } catch (error) {
        console.error("Error fetching lead data:", error);
      } finally {
        setIsLoadingLead(false);
      }
    };

    fetchLeadData();
  }, [selectedLead?.id]);

  // Open edit sidebar
  const openEditSidebar = (section: "company" | "persona") => {
    if (!selectedLeadData) return;

    let initialData = {};

    // Helper to safely convert values to strings
    const safeString = (value: any): string => {
      if (value === null || value === undefined) return "";
      if (typeof value === "string") return value;
      if (typeof value === "object") {
        // If it's an object, try to extract meaningful data
        if (value.city && value.state) return `${value.city}, ${value.state}`;
        if (value.city) return value.city;
        if (value.country) return value.country;
        return "";
      }
      return String(value);
    };

    if (section === "company") {
      initialData = {
        industry: safeString(selectedLeadData.company?.industry),
        employee_count:
          selectedLeadData.company?.company_size?.employee_count || "",
        annual_revenue_usd:
          selectedLeadData.company?.company_size?.annual_revenue_usd || "",
        keywords: (selectedLeadData.company?.keywords || []).join("\n"),
        sales_motion: safeString(selectedLeadData.company?.sales_motion),
        headquarters: safeString(selectedLeadData.company?.headquarters),
        linkedin_url: safeString(selectedLeadData.company?.linkedin_url),
        website_url: safeString(selectedLeadData.company?.website_url),
      };
    } else if (section === "persona") {
      initialData = {
        seniority: safeString(selectedLeadData.persona?.seniority),
        reports_to: safeString(selectedLeadData.persona?.reports_to),
        department: safeString(selectedLeadData.persona?.department),
        location: safeString(selectedLeadData.persona?.location),
        responsibilities: (
          selectedLeadData.persona?.responsibilities || []
        ).join("\n"),
        pain_points: (selectedLeadData.persona?.pain_points || []).join("\n"),
        decision_authority_rationale: safeString(
          selectedLeadData.persona?.decision_authority?.rationale
        ),
        decision_maker_likelihood: safeString(
          selectedLeadData.persona?.decision_authority
            ?.decision_maker_likelihood
        ),
      };
    }

    setEditFormData(initialData);
    setEditSidebar({ open: true, section });
  };

  // Save all edited fields in the section
  const saveEditedSection = async () => {
    if (!selectedLead || !selectedLead._dbLead || !editSidebar.section) return;

    setIsSaving(true);
    try {
      const updates: Array<{
        field: string;
        value: any;
        target: string;
      }> = [];

      if (editSidebar.section === "company") {
        // Prepare company updates
        if (editFormData.industry) {
          updates.push({
            field: "industry",
            value: editFormData.industry,
            target: "company",
          });
        }
        if (editFormData.employee_count) {
          updates.push({
            field: "employee_count",
            value: parseFloat(editFormData.employee_count),
            target: "company.company_size",
          });
        }
        if (editFormData.annual_revenue_usd) {
          updates.push({
            field: "annual_revenue_usd",
            value: parseFloat(editFormData.annual_revenue_usd),
            target: "company.company_size",
          });
        }
        if (editFormData.keywords) {
          const keywordsArray = editFormData.keywords
            .split("\n")
            .map((k: string) => k.trim())
            .filter((k: string) => k.length > 0);
          updates.push({
            field: "keywords",
            value: keywordsArray,
            target: "company",
          });
        }
        if (editFormData.sales_motion) {
          updates.push({
            field: "sales_motion",
            value: editFormData.sales_motion,
            target: "company",
          });
        }
        if (editFormData.headquarters) {
          updates.push({
            field: "headquarters",
            value: editFormData.headquarters,
            target: "company",
          });
        }
        if (editFormData.linkedin_url) {
          updates.push({
            field: "linkedin_url",
            value: editFormData.linkedin_url,
            target: "company",
          });
        }
        if (editFormData.website_url) {
          updates.push({
            field: "website_url",
            value: editFormData.website_url,
            target: "company",
          });
        }
      } else if (editSidebar.section === "persona") {
        // Prepare persona updates
        if (editFormData.seniority) {
          updates.push({
            field: "seniority",
            value: editFormData.seniority,
            target: "persona",
          });
        }
        if (editFormData.reports_to) {
          updates.push({
            field: "reports_to",
            value: editFormData.reports_to,
            target: "persona",
          });
        }
        if (editFormData.department) {
          updates.push({
            field: "department",
            value: editFormData.department,
            target: "persona",
          });
        }
        if (editFormData.location) {
          updates.push({
            field: "location",
            value: editFormData.location,
            target: "persona",
          });
        }
        if (editFormData.responsibilities) {
          const respArray = editFormData.responsibilities
            .split("\n")
            .map((r: string) => r.trim())
            .filter((r: string) => r.length > 0);
          updates.push({
            field: "responsibilities",
            value: respArray,
            target: "persona",
          });
        }
        if (editFormData.pain_points) {
          const painArray = editFormData.pain_points
            .split("\n")
            .map((p: string) => p.trim())
            .filter((p: string) => p.length > 0);
          updates.push({
            field: "pain_points",
            value: painArray,
            target: "persona",
          });
        }
        if (editFormData.decision_authority_rationale) {
          updates.push({
            field: "rationale",
            value: editFormData.decision_authority_rationale,
            target: "persona.decision_authority",
          });
        }
        if (editFormData.decision_maker_likelihood) {
          updates.push({
            field: "decision_maker_likelihood",
            value: editFormData.decision_maker_likelihood,
            target: "persona.decision_authority",
          });
        }
      }

      // Execute all updates
      for (const update of updates) {
        await fetch(`/api/leads/${selectedLead.id}/update-field`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(update),
        });
      }

      // Refresh lead data
      const refreshResponse = await fetch(`/api/leads/${selectedLead.id}`);
      const refreshData = await refreshResponse.json();
      if (refreshData.success) {
        setSelectedLeadData(refreshData.lead);
      }

      setEditSidebar({ open: false, section: null });
    } catch (error) {
      console.error("Error saving fields:", error);
      alert("Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  // Use real data if available, otherwise use mock data (using normalized schema)
  const { companyAnalysis, personaAnalysis, triggers, icpScore } =
    selectedLeadData?.icp_score && selectedLeadData?.company
      ? {
          icpScore: {
            overall: selectedLeadData.icp_score?.icp_score || 0,
            breakdown: {
              companyFit: {
                score:
                  selectedLeadData.icp_score.score_breakdown?.company_fit || 0,
                factors: selectedLeadData.icp_score.factor_breakdown?.companyFit
                  ?.factors || [
                  { name: "Company size", value: 0, weight: 30 },
                  { name: "Industry match", value: 0, weight: 25 },
                  { name: "Tech stack compatibility", value: 0, weight: 20 },
                ],
              },
              personaFit: {
                score:
                  selectedLeadData.icp_score.score_breakdown?.persona_fit || 0,
                factors: selectedLeadData.icp_score.factor_breakdown?.personaFit
                  ?.factors || [
                  { name: "Decision authority", value: 0, weight: 35 },
                  { name: "Seniority level", value: 0, weight: 20 },
                ],
              },
              timingFit: {
                score:
                  selectedLeadData.icp_score.score_breakdown?.timing_fit || 0,
                factors: selectedLeadData.icp_score.factor_breakdown?.timingFit
                  ?.factors || [
                  { name: "Active triggers", value: 0, weight: 40 },
                ],
              },
            },
            explanation:
              selectedLeadData.icp_score.strengths?.join(". ") ||
              "No explanation available",
          },
          companyAnalysis: {
            name: selectedLeadData.company?.name || "Unknown",
            industry: selectedLeadData.company?.industry || "Unknown",
            size: selectedLeadData.company?.company_size?.employee_count
              ? `${selectedLeadData.company.company_size.employee_count.toLocaleString()} employees globally`
              : "Unknown",
            revenue: selectedLeadData.company?.company_size?.annual_revenue_usd
              ? `$${(
                  selectedLeadData.company.company_size.annual_revenue_usd /
                  1000000000
                ).toFixed(1)}B`
              : "Unknown",
            structure: selectedLeadData.company?.company_size?.is_public
              ? `Public company${
                  selectedLeadData.company.company_size.ticker
                    ? ` (${selectedLeadData.company.company_size.ticker})`
                    : ""
                }`
              : "Private company",
            techStack:
              selectedLeadData.company?.technographics
                ?.map((tech: any) => tech.name)
                .join(", ") || "Unknown",
            salesMotion: selectedLeadData.company?.sales_motion || "Unknown",
          },
          personaAnalysis: {
            title: selectedLeadData.title || "Unknown",
            seniority: selectedLeadData.persona?.seniority || "Unknown",
            reportingStructure:
              selectedLeadData.persona?.reports_to || "Unknown",
            responsibilities: selectedLeadData.persona?.responsibilities || [],
            painPoints: selectedLeadData.persona?.pain_points || [],
            decisionAuthority:
              selectedLeadData.persona?.decision_authority?.rationale ||
              (selectedLeadData.persona?.decision_authority
                ?.decision_maker_likelihood
                ? `Decision maker likelihood: ${selectedLeadData.persona.decision_authority.decision_maker_likelihood}`
                : "Unknown"),
          },
          triggers: (selectedLeadData.detected_signals || []).map(
            (signal: any) => ({
              type: signal.type || "general",
              signal: signal.signal || "Signal detected",
              source: signal.source || "Research",
              strength: signal.strength?.toLowerCase() || "medium",
              recency: signal.recency || "Detected in research",
            })
          ),
        }
      : mockICPData;

  const getFitLabel = (score: number) => {
    if (score >= 85) return "Excellent Fit";
    if (score >= 70) return "Good Fit";
    return "Weak Fit";
  };

  const getFitColor = (score: number) => {
    if (score >= 85) return "text-chart-2";
    if (score >= 70) return "text-chart-4";
    return "text-muted-foreground";
  };

  const getConfidenceBadge = (confidence: "high" | "medium" | "low") => {
    const variants = {
      high: { variant: "default" as const, icon: CheckCircle2 },
      medium: { variant: "secondary" as const, icon: AlertCircle },
      low: { variant: "outline" as const, icon: AlertCircle },
    };
    const { variant, icon: Icon } = variants[confidence];
    return { variant, Icon };
  };

  // AI Summary bullets based on ICP score
  const aiSummaryBullets = useMemo(() => {
    if (!selectedLead) return [];
    const bullets = [];

    if (selectedLead.icpScore >= 85) {
      bullets.push(
        "Strong enterprise fit based on company size and tech stack compatibility"
      );
      bullets.push(
        "Confirmed decision-maker with budget authority for sales tools"
      );
      bullets.push("Active buying signals detected in the last 30 days");
      if (selectedLead.stage === "Qualification") {
        bullets.push(
          "High likelihood to convert if engaged via voice escalation"
        );
      }
      bullets.push("Historical conversion rate of 78% for similar profiles");
    } else if (selectedLead.icpScore >= 70) {
      bullets.push("Moderate fit with some alignment gaps in company profile");
      bullets.push(
        "Decision authority confirmed but budget timeline uncertain"
      );
      bullets.push(
        "Some buying signals present but not as strong as high-fit leads"
      );
    } else {
      bullets.push(
        "Weak fit - company size or industry may not align with ideal customer profile"
      );
      bullets.push("Limited buying signals detected");
      bullets.push("May require extended nurture cycle before qualification");
    }

    return bullets;
  }, [selectedLead]);

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
                  Research & ICP Analysis
                </h1>
                <p className="text-sm text-muted-foreground">
                  Deep intelligence gathering to prove AI understanding
                </p>
              </div>
              <div className="flex items-center gap-2 min-w-0 max-w-md">
                <label className="text-xs text-muted-foreground shrink-0">
                  Lead:
                </label>
                <Select
                  value={selectedLeadId || defaultLead?.id || ""}
                  onValueChange={setSelectedLeadId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose a lead to analyze" />
                  </SelectTrigger>
                  <SelectContent>
                    {leads
                      .sort((a, b) => b.icpScore - a.icpScore)
                      .map((lead) => (
                        <SelectItem key={lead.id} value={lead.id}>
                          <div className="flex items-center justify-between w-full gap-4">
                            <span className="font-medium">{lead.name}</span>
                            <span className="text-muted-foreground">
                              {lead.company}
                            </span>
                            <Badge variant="outline" className="ml-auto">
                              ICP {lead.icpScore}
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
                {/* Lead Context Header - Simplified */}
                <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                      <div>
                        <div
                          className={`text-5xl font-bold ${getFitColor(
                            selectedLead.icpScore
                          )}`}
                        >
                          {selectedLead.icpScore}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 text-center">
                          out of 100
                        </p>
                      </div>
                      <div className="h-12 w-px bg-border" />
                      <div>
                        <h2 className="text-xl font-semibold mb-1">
                          {selectedLead.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {selectedLead.title} at {selectedLead.company}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          selectedLead.icpScore >= 85
                            ? "default"
                            : selectedLead.icpScore >= 70
                            ? "secondary"
                            : "outline"
                        }
                        className="text-sm"
                      >
                        {getFitLabel(selectedLead.icpScore)}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>Updated 2 hours ago</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>AI Summary</CardTitle>
                    <CardDescription>
                      Key insights explaining why this lead is a{" "}
                      {selectedLead.icpScore >= 85
                        ? "strong"
                        : selectedLead.icpScore >= 70
                        ? "moderate"
                        : "weak"}{" "}
                      fit
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {aiSummaryBullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 text-sm"
                        >
                          <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 shrink-0" />
                          <span className="text-foreground leading-relaxed">
                            {bullet}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Company Analysis */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Company Analysis
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {companyAnalysis.name}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            LinkedIn
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            CRM
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Perplexity
                          </Badge>
                          </div>
                          {selectedLeadData && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditSidebar("company")}
                              className="h-6 px-2 gap-1.5 text-xs"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Industry
                            </p>
                            <p className="text-sm font-medium">
                              {companyAnalysis.industry}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Company Size
                            </p>
                            <p className="text-sm font-medium">
                              {companyAnalysis.size}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Annual Revenue
                            </p>
                            <p className="text-sm font-medium">
                              {companyAnalysis.revenue}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Structure
                            </p>
                            <p className="text-sm font-medium">
                              {companyAnalysis.structure}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Tech Stack
                          </p>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              Verified
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {companyAnalysis.techStack}
                        </p>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Sales Motion
                          </p>
                          <div className="flex gap-1">
                            <Badge variant="outline" className="text-xs">
                              AI Inferred
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {companyAnalysis.salesMotion}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Persona Analysis */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Persona Analysis
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {personaAnalysis.title}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="flex items-center gap-1">
                          <Badge variant="secondary" className="text-xs">
                            LinkedIn
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Conversations
                          </Badge>
                          </div>
                          {selectedLeadData && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditSidebar("persona")}
                              className="h-6 px-2 gap-1.5 text-xs"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Seniority
                            </p>
                            <p className="text-sm font-medium">
                              {personaAnalysis.seniority}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">
                              Reports To
                            </p>
                            <p className="text-sm font-medium">
                              {personaAnalysis.reportingStructure}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Key Responsibilities
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Verified
                          </Badge>
                        </div>
                        <ul className="space-y-2">
                          {personaAnalysis.responsibilities.map((resp, idx) => (
                            <li
                              key={idx}
                              className="text-sm flex items-start gap-2"
                            >
                              <span className="text-primary mt-0.5">•</span>
                              <span className="leading-relaxed">{resp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Pain Points
                          </p>
                          <Badge variant="outline" className="text-xs">
                            AI Inferred
                          </Badge>
                        </div>
                        <ul className="space-y-2">
                          {personaAnalysis.painPoints.map((pain, idx) => (
                            <li
                              key={idx}
                              className="text-sm flex items-start gap-2"
                            >
                              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 shrink-0" />
                              <span className="leading-relaxed">{pain}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                            Decision Authority
                          </p>
                          <Badge variant="outline" className="text-xs">
                            Confirmed
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">
                          {personaAnalysis.decisionAuthority}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Detected Triggers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-chart-4" />
                      Detected Triggers
                    </CardTitle>
                    <CardDescription>
                      Real-time buying signals indicating readiness to engage
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {triggers.map((trigger, idx) => (
                        <div
                          key={idx}
                          className="bg-muted/20 rounded-lg p-4 border border-border/50"
                        >
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  trigger.strength === "high"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {trigger.type}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {trigger.strength} strength
                              </Badge>
                            </div>
                            <Badge
                              variant="default"
                              className="text-xs bg-chart-2 shrink-0"
                            >
                              Used in ICP scoring
                            </Badge>
                          </div>
                          <p className="font-medium text-sm mb-3 leading-relaxed">
                            {trigger.signal}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/30">
                            <div className="flex items-center gap-1">
                              <span>Source:</span>
                              <span className="font-medium">
                                {trigger.source}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{trigger.recency}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* ICP Score Breakdown - Collapsible */}
                <Card>
                  <CardHeader>
                    <CardTitle>ICP Score Breakdown</CardTitle>
                    <CardDescription>
                      Expand each category to view detailed factor analysis with
                      weighted scoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Company Fit */}
                    <Collapsible
                      open={expandedSections.company}
                      onOpenChange={(open) =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          company: open,
                        }))
                      }
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border border-border/50">
                          <div className="flex items-center gap-3">
                            {expandedSections.company ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <h3 className="font-semibold text-base">
                              Company Fit
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Score:
                            </span>
                            <span className="text-2xl font-bold text-chart-2">
                              {icpScore.breakdown.companyFit.score}
                            </span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4">
                        <div className="space-y-3 px-4 pb-2">
                          {icpScore.breakdown.companyFit.factors.map(
                            (factor, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-foreground">
                                    {factor.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {factor.value}/100 ({factor.weight}% weight)
                                  </span>
                                </div>
                                <Progress
                                  value={factor.value}
                                  className="h-2"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Persona Fit */}
                    <Collapsible
                      open={expandedSections.persona}
                      onOpenChange={(open) =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          persona: open,
                        }))
                      }
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border border-border/50">
                          <div className="flex items-center gap-3">
                            {expandedSections.persona ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <h3 className="font-semibold text-base">
                              Persona Fit
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Score:
                            </span>
                            <span className="text-2xl font-bold text-chart-2">
                              {icpScore.breakdown.personaFit.score}
                            </span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4">
                        <div className="space-y-3 px-4 pb-2">
                          {icpScore.breakdown.personaFit.factors.map(
                            (factor, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-foreground">
                                    {factor.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {factor.value}/100 ({factor.weight}% weight)
                                  </span>
                                </div>
                                <Progress
                                  value={factor.value}
                                  className="h-2"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {/* Timing Fit */}
                    <Collapsible
                      open={expandedSections.timing}
                      onOpenChange={(open) =>
                        setExpandedSections((prev) => ({
                          ...prev,
                          timing: open,
                        }))
                      }
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between p-4 hover:bg-muted/30 rounded-lg transition-colors border border-border/50">
                          <div className="flex items-center gap-3">
                            {expandedSections.timing ? (
                              <ChevronDown className="w-4 h-4 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            )}
                            <h3 className="font-semibold text-base">
                              Timing Fit
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                              Score:
                            </span>
                            <span className="text-2xl font-bold text-chart-2">
                              {icpScore.breakdown.timingFit.score}
                            </span>
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pt-4">
                        <div className="space-y-3 px-4 pb-2">
                          {icpScore.breakdown.timingFit.factors.map(
                            (factor, idx) => (
                              <div key={idx} className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-foreground">
                                    {factor.name}
                                  </span>
                                  <span className="text-xs text-muted-foreground">
                                    {factor.value}/100 ({factor.weight}% weight)
                                  </span>
                                </div>
                                <Progress
                                  value={factor.value}
                                  className="h-2"
                                />
                              </div>
                            )
                          )}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>

                {/* Research → Action Bridge */}
                <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                  <div className="flex items-start justify-between gap-6 mb-4">
                    <div>
                      <h3 className="font-semibold mb-1">Next Actions</h3>
                      <p className="text-sm text-muted-foreground">
                        Use this research to drive revenue workflows
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button size="default" className="gap-2">
                      <Rocket className="w-4 h-4" />
                      Start outreach using this research
                    </Button>
                    <Button variant="outline" size="default" className="gap-2">
                      <RefreshCw className="w-4 h-4" />
                      Re-run research
                    </Button>
                    <Button variant="outline" size="default" className="gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Override AI decision
                    </Button>
                    <Button variant="outline" size="default" className="gap-2">
                      <UserCheck className="w-4 h-4" />
                      Send to AE for review
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Edit Sidebar */}
        <Sheet
          open={editSidebar.open}
          onOpenChange={(open) => setEditSidebar({ ...editSidebar, open })}
        >
          <SheetContent className="w-[600px] sm:w-[800px] overflow-y-auto">
            <SheetHeader className="px-6">
              <SheetTitle className="text-xl font-semibold">
                Edit {editSidebar.section === "company" ? "Company" : "Persona"}{" "}
                Information
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                Update the fields below. All fields are prefilled with AI
                research data and can be edited.
              </SheetDescription>
            </SheetHeader>

            <div className="px-6 py-6 space-y-6">
              {editSidebar.section === "company" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="industry" className="text-sm font-medium">
                      Industry
                    </Label>
                    <Input
                      id="industry"
                      value={editFormData.industry || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          industry: e.target.value,
                        })
                      }
                      placeholder="e.g., E-commerce, SaaS, Manufacturing"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="employee_count"
                      className="text-sm font-medium"
                    >
                      Employee Count
                    </Label>
                    <Input
                      id="employee_count"
                      type="number"
                      value={editFormData.employee_count || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          employee_count: e.target.value,
                        })
                      }
                      placeholder="e.g., 500"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="annual_revenue_usd"
                      className="text-sm font-medium"
                    >
                      Annual Revenue (USD)
                    </Label>
                    <Input
                      id="annual_revenue_usd"
                      type="number"
                      value={editFormData.annual_revenue_usd || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          annual_revenue_usd: e.target.value,
                        })
                      }
                      placeholder="e.g., 50000000"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="headquarters"
                      className="text-sm font-medium"
                    >
                      Headquarters
                    </Label>
                    <Input
                      id="headquarters"
                      value={editFormData.headquarters || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          headquarters: e.target.value,
                        })
                      }
                      placeholder="e.g., San Francisco, CA"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin_url"
                      className="text-sm font-medium"
                    >
                      LinkedIn URL
                    </Label>
                    <Input
                      id="linkedin_url"
                      value={editFormData.linkedin_url || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          linkedin_url: e.target.value,
                        })
                      }
                      placeholder="https://linkedin.com/company/..."
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="website_url"
                      className="text-sm font-medium"
                    >
                      Website URL
                    </Label>
                    <Input
                      id="website_url"
                      value={editFormData.website_url || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          website_url: e.target.value,
                        })
                      }
                      placeholder="https://example.com"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="keywords" className="text-sm font-medium">
                      Tech Stack / Keywords (one per line)
                    </Label>
                    <Textarea
                      id="keywords"
                      value={editFormData.keywords || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          keywords: e.target.value,
                        })
                      }
                      rows={6}
                      placeholder="Salesforce&#10;HubSpot&#10;AWS&#10;React"
                      className="w-full resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="sales_motion"
                      className="text-sm font-medium"
                    >
                      Sales Motion
                    </Label>
                    <Textarea
                      id="sales_motion"
                      value={editFormData.sales_motion || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          sales_motion: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Describe the company's sales approach..."
                      className="w-full resize-none"
                    />
                  </div>
                </>
              )}

              {editSidebar.section === "persona" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="seniority" className="text-sm font-medium">
                      Seniority
                    </Label>
                    <Input
                      id="seniority"
                      value={editFormData.seniority || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          seniority: e.target.value,
                        })
                      }
                      placeholder="e.g., VP, Director, Manager"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reports_to" className="text-sm font-medium">
                      Reports To
                    </Label>
                    <Input
                      id="reports_to"
                      value={editFormData.reports_to || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          reports_to: e.target.value,
                        })
                      }
                      placeholder="e.g., Chief Revenue Officer"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-sm font-medium">
                      Department
                    </Label>
                    <Input
                      id="department"
                      value={editFormData.department || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          department: e.target.value,
                        })
                      }
                      placeholder="e.g., Sales, Marketing, Operations"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-sm font-medium">
                      Location
                    </Label>
                    <Input
                      id="location"
                      value={editFormData.location || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          location: e.target.value,
                        })
                      }
                      placeholder="e.g., New York, NY"
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="responsibilities"
                      className="text-sm font-medium"
                    >
                      Key Responsibilities (one per line)
                    </Label>
                    <Textarea
                      id="responsibilities"
                      value={editFormData.responsibilities || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          responsibilities: e.target.value,
                        })
                      }
                      rows={6}
                      placeholder="Sales process optimization&#10;Team management&#10;Revenue forecasting"
                      className="w-full resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="pain_points"
                      className="text-sm font-medium"
                    >
                      Pain Points (one per line)
                    </Label>
                    <Textarea
                      id="pain_points"
                      value={editFormData.pain_points || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          pain_points: e.target.value,
                        })
                      }
                      rows={6}
                      placeholder="Manual data entry&#10;Lack of automation&#10;Poor lead quality"
                      className="w-full resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="decision_authority_rationale"
                      className="text-sm font-medium"
                    >
                      Decision Authority Rationale
                    </Label>
                    <Textarea
                      id="decision_authority_rationale"
                      value={editFormData.decision_authority_rationale || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          decision_authority_rationale: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Explain decision-making authority..."
                      className="w-full resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="decision_maker_likelihood"
                      className="text-sm font-medium"
                    >
                      Decision Maker Likelihood
                    </Label>
                    <Input
                      id="decision_maker_likelihood"
                      value={editFormData.decision_maker_likelihood || ""}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          decision_maker_likelihood: e.target.value,
                        })
                      }
                      placeholder="e.g., High, Medium, Low"
                      className="w-full"
                    />
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
                  onClick={saveEditedSection}
                  disabled={isSaving}
                  className="flex-1"
                >
                  {isSaving ? "Saving..." : "Save All Changes"}
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  );
}
