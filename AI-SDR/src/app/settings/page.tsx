"use client"

import { JazonSidebar } from "@/components/jazon-sidebar"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  Target, 
  Shield, 
  Phone, 
  FileCheck, 
  Users,
  Save
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function SettingsPage() {
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
              <h1 className="text-3xl font-semibold text-foreground">Settings & Admin</h1>
              <p className="text-sm text-muted-foreground">
                Governance controls for enterprise deployments
              </p>
            </div>

            <Tabs defaultValue="icp" className="space-y-4">
              <TabsList>
                <TabsTrigger value="icp" className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  ICP Definition
                </TabsTrigger>
                <TabsTrigger value="qualification" className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Qualification Rules
                </TabsTrigger>
                <TabsTrigger value="voice" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Voice Escalation
                </TabsTrigger>
                <TabsTrigger value="compliance" className="flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Compliance
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Team & Roles
                </TabsTrigger>
              </TabsList>

              {/* ICP Definition Tab */}
              <TabsContent value="icp" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Ideal Customer Profile Criteria</CardTitle>
                    <CardDescription>
                      Define the characteristics of your ideal customer to guide AI scoring
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="company-size">Company Size (Employees)</Label>
                          <Input id="company-size" placeholder="e.g., 1000-10000" defaultValue="1000+" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="revenue">Annual Revenue</Label>
                          <Input id="revenue" placeholder="e.g., $50M+" defaultValue="$50M+" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="industries">Target Industries</Label>
                        <Input 
                          id="industries" 
                          placeholder="Comma-separated list" 
                          defaultValue="Professional Services, IT Services, Consulting, Financial Services"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="personas">Target Personas</Label>
                        <Textarea 
                          id="personas" 
                          placeholder="Describe ideal decision makers..."
                          defaultValue="VP/Director level in Sales, Revenue Operations, or Business Development. Budget authority for sales tools. Responsible for SDR team management."
                          rows={3}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tech-stack">Required Tech Stack</Label>
                        <Input 
                          id="tech-stack" 
                          placeholder="e.g., Salesforce, HubSpot" 
                          defaultValue="Salesforce, HubSpot, Microsoft Dynamics"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="exclusions">Exclusion Criteria</Label>
                        <Textarea 
                          id="exclusions" 
                          placeholder="Companies or segments to exclude..."
                          defaultValue="Competitors in SDR automation space, companies with <100 employees, non-profit organizations"
                          rows={2}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save ICP Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Scoring Weights</CardTitle>
                    <CardDescription>
                      Adjust how different factors contribute to overall ICP score
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Company Size", weight: 30 },
                        { name: "Industry Match", weight: 25 },
                        { name: "Tech Stack Fit", weight: 20 },
                        { name: "Persona Seniority", weight: 15 },
                        { name: "Geographic Presence", weight: 10 }
                      ].map((factor) => (
                        <div key={factor.name} className="flex items-center gap-4">
                          <div className="flex-1">
                            <Label className="text-sm">{factor.name}</Label>
                          </div>
                          <div className="w-20">
                            <Input type="number" defaultValue={factor.weight} className="text-right" />
                          </div>
                          <span className="text-sm text-muted-foreground w-8">%</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Qualification Rules Tab */}
              <TabsContent value="qualification" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>BANT Qualification Thresholds</CardTitle>
                    <CardDescription>
                      Set confidence thresholds required for each BANT criteria
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {[
                      { criteria: "Need", threshold: 80, required: true },
                      { criteria: "Timeline", threshold: 75, required: true },
                      { criteria: "Authority", threshold: 85, required: true },
                      { criteria: "Budget", threshold: 70, required: false }
                    ].map((item) => (
                      <div key={item.criteria} className="space-y-3 pb-4 border-b last:border-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Label className="font-semibold">{item.criteria}</Label>
                            {item.required && <Badge variant="default" className="text-xs">Required</Badge>}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm text-muted-foreground">Required for qualification</Label>
                            <Switch defaultChecked={item.required} />
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Label className="text-sm text-muted-foreground w-32">Min. Confidence</Label>
                          <Input type="number" defaultValue={item.threshold} className="w-20 text-right" />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </div>
                    ))}

                    <div className="pt-4 flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Qualification Rules
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Auto-Disqualification Rules</CardTitle>
                    <CardDescription>
                      Conditions that automatically disqualify a lead
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "ICP score below 60",
                        "No response after 6 touches",
                        "Explicit budget constraint identified",
                        "No decision authority after 3 qualification attempts",
                        "Timeline beyond 12 months"
                      ].map((rule, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm">{rule}</span>
                          <Switch defaultChecked />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Voice Escalation Tab */}
              <TabsContent value="voice" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Voice Escalation Rules</CardTitle>
                    <CardDescription>
                      Define when Jazon should escalate to voice-based qualification
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Enable Voice Escalation</p>
                          <p className="text-sm text-muted-foreground">Allow Jazon to initiate voice calls for qualification</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="space-y-2">
                        <Label>Minimum ICP Score for Voice</Label>
                        <div className="flex items-center gap-4">
                          <Input type="number" defaultValue="80" className="w-20 text-right" />
                          <span className="text-sm text-muted-foreground">ICP score threshold</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Required Engagement Before Voice</Label>
                        <div className="flex items-center gap-4">
                          <Input type="number" defaultValue="2" className="w-20 text-right" />
                          <span className="text-sm text-muted-foreground">positive interactions on other channels</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Voice Escalation Triggers</Label>
                        {[
                          "Lead responds positively to budget questions",
                          "Decision maker engagement confirmed",
                          "Timeline urgency detected",
                          "Manual override by SDR manager"
                        ].map((trigger, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <Switch defaultChecked={idx < 3} />
                            <span className="text-sm">{trigger}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button>
                        <Save className="w-4 h-4 mr-2" />
                        Save Voice Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-chart-4/20 bg-chart-4/5">
                  <CardHeader>
                    <CardTitle>Voice Best Practices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Voice should be used as escalation tool, not primary channel</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Reserve voice for high-ICP leads showing engagement signals</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-chart-4 mt-0.5">•</span>
                        <span>Use voice to accelerate qualification, not for cold outreach</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Compliance Tab */}
              <TabsContent value="compliance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Compliance & Audit Logs</CardTitle>
                    <CardDescription>
                      Track all AI decisions for regulatory compliance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Enable Audit Logging</p>
                          <p className="text-sm text-muted-foreground">Log all AI decisions and data access</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">GDPR Compliance Mode</p>
                          <p className="text-sm text-muted-foreground">Enhanced data protection for EU contacts</p>
                        </div>
                        <Switch defaultChecked />
                      </div>

                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Require Opt-in for Outreach</p>
                          <p className="text-sm text-muted-foreground">Only contact leads with explicit consent</p>
                        </div>
                        <Switch />
                      </div>

                      <div className="space-y-2">
                        <Label>Data Retention Period</Label>
                        <div className="flex items-center gap-4">
                          <Input type="number" defaultValue="24" className="w-20 text-right" />
                          <span className="text-sm text-muted-foreground">months</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Audit Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Event Type</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-sm">2024-12-17 14:32</TableCell>
                          <TableCell><Badge variant="outline">Settings Change</Badge></TableCell>
                          <TableCell>admin@company.com</TableCell>
                          <TableCell className="text-sm">Updated ICP threshold</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">2024-12-17 12:15</TableCell>
                          <TableCell><Badge variant="outline">Data Access</Badge></TableCell>
                          <TableCell>Jazon AI</TableCell>
                          <TableCell className="text-sm">Synced 127 leads from CRM</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-sm">2024-12-17 09:45</TableCell>
                          <TableCell><Badge variant="outline">AI Decision</Badge></TableCell>
                          <TableCell>Jazon AI</TableCell>
                          <TableCell className="text-sm">Escalated lead to voice (ICP: 94)</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Team & Roles Tab */}
              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>Manage user access and permissions</CardDescription>
                      </div>
                      <Button>Add Team Member</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Alex Morgan</TableCell>
                          <TableCell>alex.morgan@company.com</TableCell>
                          <TableCell><Badge variant="default">Admin</Badge></TableCell>
                          <TableCell className="text-sm">2 hours ago</TableCell>
                          <TableCell><Badge variant="default">Active</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Sarah Wilson</TableCell>
                          <TableCell>sarah.wilson@company.com</TableCell>
                          <TableCell><Badge variant="secondary">SDR Manager</Badge></TableCell>
                          <TableCell className="text-sm">5 hours ago</TableCell>
                          <TableCell><Badge variant="default">Active</Badge></TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Mike Chen</TableCell>
                          <TableCell>mike.chen@company.com</TableCell>
                          <TableCell><Badge variant="outline">Viewer</Badge></TableCell>
                          <TableCell className="text-sm">1 day ago</TableCell>
                          <TableCell><Badge variant="default">Active</Badge></TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Role Permissions</CardTitle>
                    <CardDescription>
                      Define what each role can access and modify
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { role: "Admin", permissions: "Full access to all features and settings" },
                        { role: "SDR Manager", permissions: "View all leads, modify qualification rules, manage voice escalations" },
                        { role: "SDR", permissions: "View assigned leads, update lead status, limited settings access" },
                        { role: "Viewer", permissions: "Read-only access to dashboards and reports" }
                      ].map((item) => (
                        <div key={item.role} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant={item.role === "Admin" ? "default" : "secondary"}>
                              {item.role}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.permissions}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

