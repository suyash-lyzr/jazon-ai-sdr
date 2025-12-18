"use client"

import { useState } from "react"
import { JazonSidebar } from "@/components/jazon-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { mockQualificationData, mockLeads } from "@/lib/mock-data"
import { CheckCircle2, HelpCircle, AlertCircle, Target, TrendingUp, Calendar, DollarSign, User } from "lucide-react"

export default function QualificationPage() {
  const qualification = mockQualificationData.L001
  const lead = mockLeads.find(l => l.id === "L001")
  const [decision, setDecision] = useState<"ai" | "accepted" | "overridden">("ai")
  const [overrideText, setOverrideText] = useState("")

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-chart-2"
    if (confidence >= 60) return "text-chart-4"
    return "text-muted-foreground"
  }

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 80) return "bg-chart-2"
    if (confidence >= 60) return "bg-chart-4"
    return "bg-muted-foreground"
  }

  const getRecommendationConfig = (recommendation: string) => {
    switch (recommendation) {
      case "book_meeting":
        return {
          label: "Book Meeting",
          variant: "default" as const,
          icon: Calendar,
          color: "text-chart-2",
          bg: "bg-chart-2/10"
        }
      case "nurture":
        return {
          label: "Continue Nurture",
          variant: "secondary" as const,
          icon: TrendingUp,
          color: "text-chart-4",
          bg: "bg-chart-4/10"
        }
      case "disqualify":
        return {
          label: "Disqualify",
          variant: "outline" as const,
          icon: AlertCircle,
          color: "text-muted-foreground",
          bg: "bg-muted"
        }
      default:
        return {
          label: recommendation,
          variant: "outline" as const,
          icon: HelpCircle,
          color: "text-muted-foreground",
          bg: "bg-muted"
        }
    }
  }

  const recommendationConfig = getRecommendationConfig(qualification.recommendation)
  const RecommendationIcon = recommendationConfig.icon

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
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Qualification</h1>
              <p className="text-sm text-muted-foreground">
                Core differentiation: systematic BANT validation with confidence scoring
              </p>
            </div>

            {/* Lead Info */}
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
              </Card>
            )}

            {/* Overall Qualification Score */}
            <Card className={`border-2 ${recommendationConfig.bg} ${recommendationConfig.color.replace('text-', 'border-')}/20`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Qualification Assessment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div>
                    <div className="text-5xl font-bold">{qualification.overallScore}</div>
                    <p className="text-sm text-muted-foreground mt-1">Overall Score</p>
                  </div>
                  
                  <div className="flex-1">
                    <div className={`p-4 rounded-lg ${recommendationConfig.bg} flex items-center gap-3`}>
                      <RecommendationIcon className={`w-6 h-6 ${recommendationConfig.color}`} />
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          AI Recommendation
                        </p>
                        <p className={`text-lg font-semibold ${recommendationConfig.color}`}>
                          {recommendationConfig.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* BANT Criteria */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Need */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Target className="w-4 h-4" />
                      Need
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {qualification.need.known ? (
                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Badge variant={qualification.need.known ? "default" : "outline"}>
                        {qualification.need.known ? "Confirmed" : "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{qualification.need.value}</p>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Confidence Level
                      </span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(qualification.need.confidence)}`}>
                        {qualification.need.confidence}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceBg(qualification.need.confidence)}`}
                        style={{ width: `${qualification.need.confidence}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Calendar className="w-4 h-4" />
                      Timeline
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {qualification.timeline.known ? (
                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Badge variant={qualification.timeline.known ? "default" : "outline"}>
                        {qualification.timeline.known ? "Confirmed" : "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{qualification.timeline.value}</p>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Confidence Level
                      </span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(qualification.timeline.confidence)}`}>
                        {qualification.timeline.confidence}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceBg(qualification.timeline.confidence)}`}
                        style={{ width: `${qualification.timeline.confidence}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Authority */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <User className="w-4 h-4" />
                      Authority
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {qualification.authority.known ? (
                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Badge variant={qualification.authority.known ? "default" : "outline"}>
                        {qualification.authority.known ? "Confirmed" : "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{qualification.authority.value}</p>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Confidence Level
                      </span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(qualification.authority.confidence)}`}>
                        {qualification.authority.confidence}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceBg(qualification.authority.confidence)}`}
                        style={{ width: `${qualification.authority.confidence}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <DollarSign className="w-4 h-4" />
                      Budget
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      {qualification.budget.known ? (
                        <CheckCircle2 className="w-4 h-4 text-chart-2" />
                      ) : (
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      )}
                      <Badge variant={qualification.budget.known ? "default" : "outline"}>
                        {qualification.budget.known ? "Confirmed" : "Unknown"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">{qualification.budget.value}</p>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        Confidence Level
                      </span>
                      <span className={`text-sm font-semibold ${getConfidenceColor(qualification.budget.confidence)}`}>
                        {qualification.budget.confidence}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getConfidenceBg(qualification.budget.confidence)}`}
                        style={{ width: `${qualification.budget.confidence}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Reasoning */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle>AI Reasoning & Next Steps</CardTitle>
                <CardDescription>
                  Transparent explanation of qualification decision
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={decision === "accepted" ? "default" : "outline"}
                      onClick={() => setDecision("accepted")}
                    >
                      Accept AI Recommendation
                    </Button>
                    <Button
                      size="sm"
                      variant={decision === "overridden" ? "default" : "outline"}
                      onClick={() => setDecision("overridden")}
                    >
                      Override Decision (Admin demo)
                    </Button>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Why Jazon Recommends: {recommendationConfig.label}
                    </p>
                    <p className="text-sm">{qualification.reasoning}</p>
                    {decision === "accepted" && (
                      <p className="text-xs text-chart-2 mt-2">
                        Accepted by human reviewer for this demo lead.
                      </p>
                    )}
                    {decision === "overridden" && (
                      <div className="mt-3 space-y-2">
                        <Label className="text-xs">Override Reason (demo)</Label>
                        <Textarea
                          rows={2}
                          value={overrideText}
                          onChange={(e) => setOverrideText(e.target.value)}
                          placeholder="Explain why you are overriding the AI recommendation..."
                        />
                        <p className="text-xs text-muted-foreground">
                          In a production deployment this explanation would be logged for audit and model improvement.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                      Known vs Unknown Indicators
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-chart-2">Confirmed Factors</p>
                        <ul className="space-y-1">
                          {qualification.need.known && (
                            <li className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-chart-2" />
                              Need ({qualification.need.confidence}% confidence)
                            </li>
                          )}
                          {qualification.timeline.known && (
                            <li className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-chart-2" />
                              Timeline ({qualification.timeline.confidence}% confidence)
                            </li>
                          )}
                          {qualification.authority.known && (
                            <li className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-chart-2" />
                              Authority ({qualification.authority.confidence}% confidence)
                            </li>
                          )}
                          {qualification.budget.known && (
                            <li className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="w-3 h-3 text-chart-2" />
                              Budget ({qualification.budget.confidence}% confidence)
                            </li>
                          )}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-muted-foreground">Unknown Factors</p>
                        <ul className="space-y-1">
                          {!qualification.need.known && (
                            <li className="text-sm flex items-center gap-2">
                              <HelpCircle className="w-3 h-3 text-muted-foreground" />
                              Need
                            </li>
                          )}
                          {!qualification.timeline.known && (
                            <li className="text-sm flex items-center gap-2">
                              <HelpCircle className="w-3 h-3 text-muted-foreground" />
                              Timeline
                            </li>
                          )}
                          {!qualification.authority.known && (
                            <li className="text-sm flex items-center gap-2">
                              <HelpCircle className="w-3 h-3 text-muted-foreground" />
                              Authority
                            </li>
                          )}
                          {!qualification.budget.known && (
                            <li className="text-sm flex items-center gap-2">
                              <HelpCircle className="w-3 h-3 text-muted-foreground" />
                              Budget
                            </li>
                          )}
                          {[qualification.need.known, qualification.timeline.known, qualification.authority.known, qualification.budget.known].every(Boolean) && (
                            <li className="text-sm text-muted-foreground italic">All factors confirmed</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Qualification Stats */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg. Qualification Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">4.2 days</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    From first touch to qualified
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Qualification Pass Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">23.4%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Of engaged leads reach qualified status
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">False Positive Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3.1%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qualified leads that didn&apos;t convert
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

