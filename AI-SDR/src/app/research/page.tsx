"use client"

import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockICPData } from "@/lib/mock-data"
import { Building2, User, Zap } from "lucide-react"

export default function ResearchPage() {
  const { companyAnalysis, personaAnalysis, triggers, icpScore } = mockICPData

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
              <h1 className="text-3xl font-semibold text-foreground">Research & ICP Analysis</h1>
              <p className="text-sm text-muted-foreground">
                Deep intelligence gathering to prove AI understanding
              </p>
            </div>

            {/* Overall ICP Score */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle>Overall ICP Score</CardTitle>
                <CardDescription>
                  Comprehensive fit analysis for Sarah Chen at Accenture
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-8">
                  <div>
                    <div className="text-6xl font-bold text-primary">{icpScore.overall}</div>
                    <p className="text-sm text-muted-foreground mt-1">out of 100</p>
                  </div>
                  <div className="flex-1 space-y-4 pb-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Company Fit</span>
                          <span className="text-sm text-muted-foreground">{icpScore.breakdown.companyFit.score}</span>
                        </div>
                        <Progress value={icpScore.breakdown.companyFit.score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Persona Fit</span>
                          <span className="text-sm text-muted-foreground">{icpScore.breakdown.personaFit.score}</span>
                        </div>
                        <Progress value={icpScore.breakdown.personaFit.score} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">Timing Fit</span>
                          <span className="text-sm text-muted-foreground">{icpScore.breakdown.timingFit.score}</span>
                        </div>
                        <Progress value={icpScore.breakdown.timingFit.score} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-card rounded-lg border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                    Explainability
                  </p>
                  <p className="text-sm">{icpScore.explanation}</p>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Company Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Company Analysis
                  </CardTitle>
                  <CardDescription>{companyAnalysis.name}</CardDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">LinkedIn</Badge>
                    <Badge variant="secondary">CRM</Badge>
                    <Badge variant="outline">Perplexity</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Industry
                      </p>
                      <p className="text-sm font-medium">{companyAnalysis.industry}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Company Size
                      </p>
                      <p className="text-sm font-medium">{companyAnalysis.size}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Annual Revenue
                      </p>
                      <p className="text-sm font-medium">{companyAnalysis.revenue}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Structure
                      </p>
                      <p className="text-sm font-medium">{companyAnalysis.structure}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Tech Stack
                    </p>
                    <p className="text-sm">{companyAnalysis.techStack}</p>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Sales Motion
                    </p>
                    <p className="text-sm">{companyAnalysis.salesMotion}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Persona Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Persona Analysis
                  </CardTitle>
                  <CardDescription>{personaAnalysis.title}</CardDescription>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary">LinkedIn</Badge>
                    <Badge variant="secondary">Conversations</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Seniority
                      </p>
                      <p className="text-sm font-medium">{personaAnalysis.seniority}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                        Reports To
                      </p>
                      <p className="text-sm font-medium">{personaAnalysis.reportingStructure}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Key Responsibilities
                    </p>
                    <ul className="space-y-1">
                      {personaAnalysis.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Pain Points
                    </p>
                    <ul className="space-y-1">
                      {personaAnalysis.painPoints.map((pain, idx) => (
                        <li key={idx} className="text-sm flex items-start gap-2">
                          <span className="text-destructive mt-1">•</span>
                          <span>{pain}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Decision Authority
                    </p>
                    <p className="text-sm">{personaAnalysis.decisionAuthority}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Detected Triggers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Detected Triggers
                </CardTitle>
                <CardDescription>
                  Real-time buying signals indicating readiness to engage
                </CardDescription>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Badge variant="secondary">LinkedIn</Badge>
                  <Badge variant="secondary">CRM</Badge>
                  <Badge variant="outline">Conversations</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {triggers.map((trigger, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={trigger.strength === "high" ? "default" : "secondary"}>
                              {trigger.type}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {trigger.strength} strength
                            </Badge>
                          </div>
                          <p className="font-medium text-sm mt-2">{trigger.signal}</p>
                        </div>
                        <Badge variant="outline" className="text-xs whitespace-nowrap">
                          {trigger.recency}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Source:</span>
                        <span>{trigger.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Detailed ICP Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>ICP Score Breakdown</CardTitle>
                <CardDescription>
                  Detailed factor analysis with weighted scoring
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Company Fit */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Company Fit</h3>
                    <span className="text-2xl font-bold text-primary">
                      {icpScore.breakdown.companyFit.score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {icpScore.breakdown.companyFit.factors.map((factor, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{factor.name}</span>
                          <span className="font-medium">{factor.value}/100 ({factor.weight}% weight)</span>
                        </div>
                        <Progress value={factor.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Persona Fit */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Persona Fit</h3>
                    <span className="text-2xl font-bold text-primary">
                      {icpScore.breakdown.personaFit.score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {icpScore.breakdown.personaFit.factors.map((factor, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{factor.name}</span>
                          <span className="font-medium">{factor.value}/100 ({factor.weight}% weight)</span>
                        </div>
                        <Progress value={factor.value} className="h-1.5" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timing Fit */}
                <div className="pt-4 border-t">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">Timing Fit</h3>
                    <span className="text-2xl font-bold text-primary">
                      {icpScore.breakdown.timingFit.score}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {icpScore.breakdown.timingFit.factors.map((factor, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{factor.name}</span>
                          <span className="font-medium">{factor.value}/100 ({factor.weight}% weight)</span>
                        </div>
                        <Progress value={factor.value} className="h-1.5" />
                      </div>
                    ))}
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

