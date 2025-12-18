"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";

export default function ResearchPage() {
  const { leads } = useJazonApp();
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

  // Use mock data for now - in production this would come from API based on selectedLead
  const { companyAnalysis, personaAnalysis, triggers, icpScore } = mockICPData;

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
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Building2 className="w-5 h-5" />
                            Company Analysis
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {companyAnalysis.name}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
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
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            Persona Analysis
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {personaAnalysis.title}
                          </CardDescription>
                        </div>
                        <div className="flex gap-1">
                          <Badge variant="secondary" className="text-xs">
                            LinkedIn
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            Conversations
                          </Badge>
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
      </SidebarInset>
    </SidebarProvider>
  );
}
