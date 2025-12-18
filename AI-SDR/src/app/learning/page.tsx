"use client"

import { JazonSidebar } from "@/components/jazon-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockLearningData } from "@/lib/mock-data"
import { Brain, TrendingUp, TrendingDown, Lightbulb, AlertCircle, Settings } from "lucide-react"

export default function LearningPage() {
  const { weeklyInsights, whatWorked, whatDidntWork, modelImprovements } = mockLearningData

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
              <h1 className="text-3xl font-semibold text-foreground">Learning Loop</h1>
              <p className="text-sm text-muted-foreground">
                Continuous AI improvement through systematic analysis and adaptation
              </p>
            </div>

            {/* Weekly Summary */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  Weekly Learning Summary
                </CardTitle>
                <CardDescription>
                  {weeklyInsights.period}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Leads Analyzed
                    </p>
                    <p className="text-2xl font-bold">{weeklyInsights.leadsAnalyzed.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Changes Implemented
                    </p>
                    <p className="text-2xl font-bold text-chart-2">{weeklyInsights.changesImplemented}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Insights Generated
                    </p>
                    <p className="text-2xl font-bold">{whatWorked.length + whatDidntWork.length}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Model Updates
                    </p>
                    <p className="text-2xl font-bold">{modelImprovements.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What Worked */}
            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-chart-2" />
                  What Worked This Week
                </CardTitle>
                <CardDescription>
                  Successful patterns identified and scaled
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {whatWorked.map((insight, idx) => (
                    <div key={idx} className="border border-chart-2/20 rounded-lg p-4 bg-card">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-chart-2/10 text-chart-2">
                          <Lightbulb className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{insight.finding}</h4>
                            <p className="text-xs text-muted-foreground">{insight.data}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Action Taken
                              </p>
                              <p className="text-sm">{insight.action}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Expected Impact
                              </p>
                              <p className="text-sm font-medium text-chart-2">{insight.impact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* What Didn't Work */}
            <Card className="border-destructive/20 bg-destructive/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  What Didn&apos;t Work
                </CardTitle>
                <CardDescription>
                  Ineffective approaches identified and corrected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {whatDidntWork.map((insight, idx) => (
                    <div key={idx} className="border border-destructive/20 rounded-lg p-4 bg-card">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-destructive/10 text-destructive">
                          <AlertCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{insight.finding}</h4>
                            <p className="text-xs text-muted-foreground">{insight.data}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 border-t">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Action Taken
                              </p>
                              <p className="text-sm">{insight.action}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Expected Impact
                              </p>
                              <p className="text-sm font-medium">{insight.impact}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Model Improvements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Model Improvements
                </CardTitle>
                <CardDescription>
                  Algorithmic changes to core AI systems
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {modelImprovements.map((improvement, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <Badge variant="outline" className="mb-2">{improvement.area}</Badge>
                          <h4 className="font-semibold text-sm">{improvement.change}</h4>
                        </div>
                        <Badge variant={improvement.confidence === "High" ? "default" : "secondary"}>
                          {improvement.confidence} confidence
                        </Badge>
                      </div>
                      
                      <div className="pt-3 border-t">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                          Reasoning
                        </p>
                        <p className="text-sm">{improvement.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Learning Velocity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">5.2</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Changes per week (trending up)
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Performance Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">+18%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Qualification rate vs. 30 days ago
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Model Accuracy</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">91.3%</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ICP prediction accuracy
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Learning Philosophy */}
            <Card className="border-chart-4/20 bg-chart-4/5">
              <CardHeader>
                <CardTitle>Learning Philosophy</CardTitle>
                <CardDescription>
                  How Jazon continuously improves
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Data-Driven Insights</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Every interaction is analyzed for patterns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Statistical significance required before changes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>A/B testing for major strategy shifts</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Feedback loops from AE outcomes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Controlled Adaptation</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Gradual rollout of model changes</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Human review for high-impact modifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Rollback capability if performance degrades</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Transparent changelog of all improvements</span>
                      </li>
                    </ul>
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

