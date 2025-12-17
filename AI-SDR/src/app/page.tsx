"use client";

import { useState, useEffect } from "react";
import { JazonSidebar } from "@/components/jazon-sidebar";
import { JazonHeader } from "@/components/jazon-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { mockKPIs, mockDecisionFeed } from "@/lib/mock-data";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  PhoneCall,
  Calendar,
  StopCircle,
} from "lucide-react";

const getDecisionIcon = (type: string) => {
  switch (type) {
    case "escalation":
      return <PhoneCall className="w-4 h-4" />;
    case "meeting":
      return <Calendar className="w-4 h-4" />;
    case "qualified":
      return <CheckCircle2 className="w-4 h-4" />;
    case "disqualified":
      return <XCircle className="w-4 h-4" />;
    case "stopped":
      return <StopCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getDecisionBadgeVariant = (type: string) => {
  switch (type) {
    case "escalation":
      return "default";
    case "meeting":
      return "default";
    case "qualified":
      return "secondary";
    case "disqualified":
      return "outline";
    case "stopped":
      return "outline";
    default:
      return "outline";
  }
};

export default function Dashboard() {
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [animatedValues, setAnimatedValues] = useState({
    aeHoursSaved: 342,
    lowQualityMeetingsPrevented: 89,
    qualifiedPipelineInfluenced: 127,
  });

  // Simulate subtle value updates in simulation mode
  useEffect(() => {
    if (!isSimulationMode) return;

    const interval = setInterval(() => {
      setAnimatedValues((prev) => ({
        aeHoursSaved: prev.aeHoursSaved + Math.floor(Math.random() * 3),
        lowQualityMeetingsPrevented:
          prev.lowQualityMeetingsPrevented + Math.floor(Math.random() * 2),
        qualifiedPipelineInfluenced:
          prev.qualifiedPipelineInfluenced + Math.floor(Math.random() * 2),
      }));
    }, 8000); // Update every 8 seconds

    return () => clearInterval(interval);
  }, [isSimulationMode]);

  // Calculate executive summary values
  const executiveSummary = {
    aeHoursSaved: isSimulationMode ? animatedValues.aeHoursSaved : 342,
    lowQualityMeetingsPrevented: isSimulationMode
      ? animatedValues.lowQualityMeetingsPrevented
      : 89,
    qualifiedPipelineInfluenced: isSimulationMode
      ? animatedValues.qualifiedPipelineInfluenced
      : mockKPIs.meetingsBooked.value,
  };

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
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-foreground">
                  Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Business impact overview and AI decision transparency
                </p>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Label
                    htmlFor="simulation-mode"
                    className="text-xs text-muted-foreground cursor-pointer"
                  >
                    {isSimulationMode ? "Simulation Mode (Demo)" : "Live Mode"}
                  </Label>
                  <Switch
                    id="simulation-mode"
                    checked={isSimulationMode}
                    onCheckedChange={setIsSimulationMode}
                  />
                </div>
                {isSimulationMode && (
                  <Badge variant="outline" className="text-xs">
                    Demo
                  </Badge>
                )}
              </div>
            </div>

            {/* Executive Value Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Business Impact Summary
                </CardTitle>
                <CardDescription>
                  High-level outcomes driven by Jazon&apos;s autonomous SDR
                  decisions.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-1">
                <div className="rounded-xl border bg-muted/30">
                  <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x">
                    <div className="p-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Estimated AE hours saved
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums text-foreground">
                        {executiveSummary.aeHoursSaved.toLocaleString()}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Through early disqualification of low-fit leads
                      </p>
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Qualified pipeline influenced
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums text-foreground">
                        {executiveSummary.qualifiedPipelineInfluenced}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Meetings booked with fully qualified prospects
                      </p>
                    </div>

                    <div className="p-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        Low-quality meetings prevented
                      </p>
                      <p className="mt-2 text-4xl font-semibold tracking-tight tabular-nums text-foreground">
                        {executiveSummary.lowQualityMeetingsPrevented}
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Based on ICP scoring and qualification logic
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Leads Processed
                  </CardTitle>
                  {mockKPIs.leadsProcessed.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockKPIs.leadsProcessed.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-chart-2">
                      {mockKPIs.leadsProcessed.change}
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Qualification Rate
                  </CardTitle>
                  {mockKPIs.qualificationRate.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockKPIs.qualificationRate.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-chart-2">
                      {mockKPIs.qualificationRate.change}
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Meetings Booked
                  </CardTitle>
                  {mockKPIs.meetingsBooked.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockKPIs.meetingsBooked.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-chart-2">
                      {mockKPIs.meetingsBooked.change}
                    </span>
                    from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Early Disqualified
                  </CardTitle>
                  {mockKPIs.earlyDisqualified.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-chart-2" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-destructive" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockKPIs.earlyDisqualified.value.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockKPIs.earlyDisqualified.impact}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quality Metrics */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    ICP Accuracy
                  </CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-chart-2" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockKPIs.icpAccuracy.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-chart-2">
                      {mockKPIs.icpAccuracy.change}
                    </span>
                    from last month
                  </p>
                  <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-chart-2"
                      style={{ width: mockKPIs.icpAccuracy.value }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Voice Escalations
                  </CardTitle>
                  <PhoneCall className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {mockKPIs.voiceEscalations.value}
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <span className="text-chart-2">
                      {mockKPIs.voiceEscalations.change}
                    </span>
                    from last month
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Success rate:{" "}
                    <span className="font-medium text-foreground">
                      {mockKPIs.voiceEscalations.successRate}
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">CRM Sync</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Healthy</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Real-time updates to Salesforce / HubSpot (demo).
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Outreach Channels</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Email, LinkedIn, and voice providers are connected.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Voice Engine</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Used only when escalation rules are met.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Learning Loop</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-medium">Running</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Weekly model updates based on recent outcomes.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* AI Decisions & Explainability */}
            <Card className="mt-2">
              <CardHeader>
                <CardTitle>AI Decisions & Explainability</CardTitle>
                <CardDescription>
                  Every action Jazon takes is logged with reasoning and expected
                  business impact.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockDecisionFeed.map((decision) => (
                    <div
                      key={decision.id}
                      className="flex gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <div className="flex flex-col items-center gap-2 pt-1">
                        <div
                          className={`p-2 rounded-full ${
                            decision.type === "escalation"
                              ? "bg-primary/10 text-primary"
                              : decision.type === "meeting"
                              ? "bg-chart-2/10 text-chart-2"
                              : decision.type === "qualified"
                              ? "bg-chart-2/10 text-chart-2"
                              : decision.type === "disqualified"
                              ? "bg-muted text-muted-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {getDecisionIcon(decision.type)}
                        </div>
                        <div className="h-full w-px bg-border" />
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">
                                {decision.action}
                              </h4>
                              <Badge
                                variant={getDecisionBadgeVariant(decision.type)}
                                className="text-xs"
                              >
                                {decision.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {decision.leadName} • {decision.company}
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {decision.timestamp}
                          </span>
                        </div>

                        <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Why Jazon did this
                            </p>
                            <p className="text-sm text-foreground">
                              {decision.reason}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-border/50">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Expected Impact
                            </p>
                            <p className="text-sm text-foreground">
                              {decision.impact}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
