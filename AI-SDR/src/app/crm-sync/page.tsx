"use client"

import { useState, useMemo } from "react"
import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockCRMSync } from "@/lib/mock-data"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeftRight, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  Eye,
  Edit,
  Filter,
  Sparkles,
  Settings,
  User,
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type CRMType = "salesforce" | "hubspot"
type WriteFilter = "all" | "ai" | "system" | "manual"

export default function CRMSyncPage() {
  const [selectedCRM, setSelectedCRM] = useState<CRMType>("salesforce")
  const [writeFilter, setWriteFilter] = useState<WriteFilter>("all")

  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "Jazon → CRM": return <ArrowRight className="w-4 h-4" />
      case "CRM → Jazon": return <ArrowLeft className="w-4 h-4" />
      case "Bidirectional": return <ArrowLeftRight className="w-4 h-4" />
      default: return <ArrowRight className="w-4 h-4" />
    }
  }

  // CRM-specific data
  const crmData = useMemo(() => {
    if (selectedCRM === "salesforce") {
      return {
        platform: "Salesforce Enterprise",
        plan: "Enterprise",
        fieldMappings: [
          {
            jazonField: "ICP Score",
            crmField: "Lead_Score__c",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Used for lead prioritization",
          },
          {
            jazonField: "Qualification Status",
            crmField: "Qualification_Status__c",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Guides AE follow-up actions",
          },
          {
            jazonField: "AI Recommendation",
            crmField: "Next_Best_Action__c",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Surfaces AI-driven next steps",
          },
          {
            jazonField: "Last Contact Channel",
            crmField: "Last_Activity_Type__c",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Tracks engagement channel",
          },
          {
            jazonField: "Lead Owner",
            crmField: "OwnerId",
            direction: "CRM → Jazon",
            syncStatus: "Active",
            purpose: "Syncs ownership for handoff",
          },
          {
            jazonField: "Company Data",
            crmField: "Account",
            direction: "Bidirectional",
            syncStatus: "Active",
            purpose: "Keeps company info current",
          },
        ],
        recentWrites: [
          {
            timestamp: "2 minutes ago",
            record: "Sarah Chen - Accenture",
            field: "Qualification_Status__c",
            oldValue: "Engaged",
            newValue: "Voice Qualification",
            triggeredBy: "Jazon AI - Voice escalation decision",
            type: "ai" as const,
          },
          {
            timestamp: "15 minutes ago",
            record: "Lisa Park - NTT Data",
            field: "Next_Best_Action__c",
            oldValue: "Continue Nurture",
            newValue: "Prepare AE Handoff",
            triggeredBy: "Jazon AI - Meeting scheduled",
            type: "ai" as const,
          },
          {
            timestamp: "1 hour ago",
            record: "Michael Roberts - Tech Solutions",
            field: "Lead_Score__c",
            oldValue: "65",
            newValue: "42",
            triggeredBy: "Jazon AI - ICP re-evaluation",
            type: "ai" as const,
          },
          {
            timestamp: "2 hours ago",
            record: "David Kim - Enterprise Corp",
            field: "OwnerId",
            oldValue: "Sarah Mitchell",
            newValue: "John Davis",
            triggeredBy: "System - CRM territory reassignment",
            type: "system" as const,
          },
          {
            timestamp: "3 hours ago",
            record: "Emma Wilson - Global Tech",
            field: "Lead_Score__c",
            oldValue: "Auto-calculated: 87",
            newValue: "92",
            triggeredBy: "Manual Override - Sales Manager adjustment",
            type: "manual" as const,
          },
        ],
        readPermissions: [
          "Lead fields: Name, Email, Company, Title, Phone",
          "Account fields: Industry, Company Size, Revenue",
          "Opportunity data for account context",
          "Activity history: Emails, Calls, Meetings",
          "Campaign membership and source data",
        ],
        writePermissions: [
          "Custom Lead fields: Lead Score, Qualification Status, Next Best Action",
          "Activity logging: Jazon touchpoints and AI decisions",
          "Task creation: Follow-up reminders for AE team",
          "Lead status updates based on qualification outcomes",
        ],
        terminology: {
          records: "Leads",
          accounts: "Accounts",
          deals: "Opportunities",
        },
      }
    } else {
      return {
        platform: "HubSpot Pro",
        plan: "Pro",
        fieldMappings: [
          {
            jazonField: "ICP Score",
            crmField: "lead_score",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Used for lead prioritization",
          },
          {
            jazonField: "Qualification Status",
            crmField: "qualification_status",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Guides AE follow-up actions",
          },
          {
            jazonField: "AI Recommendation",
            crmField: "next_best_action",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Surfaces AI-driven next steps",
          },
          {
            jazonField: "Last Contact Channel",
            crmField: "last_activity_type",
            direction: "Jazon → CRM",
            syncStatus: "Active",
            purpose: "Tracks engagement channel",
          },
          {
            jazonField: "Contact Owner",
            crmField: "hubspot_owner_id",
            direction: "CRM → Jazon",
            syncStatus: "Active",
            purpose: "Syncs ownership for handoff",
          },
          {
            jazonField: "Company Data",
            crmField: "associated_company",
            direction: "Bidirectional",
            syncStatus: "Active",
            purpose: "Keeps company info current",
          },
        ],
        recentWrites: [
          {
            timestamp: "2 minutes ago",
            record: "Sarah Chen - Accenture",
            field: "qualification_status",
            oldValue: "Engaged",
            newValue: "Voice Qualification",
            triggeredBy: "Jazon AI - Voice escalation decision",
            type: "ai" as const,
          },
          {
            timestamp: "15 minutes ago",
            record: "Lisa Park - NTT Data",
            field: "next_best_action",
            oldValue: "Continue Nurture",
            newValue: "Prepare AE Handoff",
            triggeredBy: "Jazon AI - Meeting scheduled",
            type: "ai" as const,
          },
          {
            timestamp: "1 hour ago",
            record: "Michael Roberts - Tech Solutions",
            field: "lead_score",
            oldValue: "65",
            newValue: "42",
            triggeredBy: "Jazon AI - ICP re-evaluation",
            type: "ai" as const,
          },
          {
            timestamp: "2 hours ago",
            record: "David Kim - Enterprise Corp",
            field: "hubspot_owner_id",
            oldValue: "Sarah Mitchell",
            newValue: "John Davis",
            triggeredBy: "System - HubSpot workflow reassignment",
            type: "system" as const,
          },
          {
            timestamp: "3 hours ago",
            record: "Emma Wilson - Global Tech",
            field: "lead_score",
            oldValue: "Auto-calculated: 87",
            newValue: "92",
            triggeredBy: "Manual Override - Sales Manager adjustment",
            type: "manual" as const,
          },
        ],
        readPermissions: [
          "Contact fields: Name, Email, Company, Job Title, Phone",
          "Company fields: Industry, Company Size, Annual Revenue",
          "Deal data for account context",
          "Engagement history: Emails, Calls, Meetings",
          "List membership and source tracking",
        ],
        writePermissions: [
          "Custom Contact properties: Lead Score, Qualification Status, Next Best Action",
          "Timeline events: Jazon touchpoints and AI decisions",
          "Task creation: Follow-up reminders for sales team",
          "Contact lifecycle stage updates based on qualification",
        ],
        terminology: {
          records: "Contacts",
          accounts: "Companies",
          deals: "Deals",
        },
      }
    }
  }, [selectedCRM])

  // Filter recent writes
  const filteredWrites = useMemo(() => {
    if (writeFilter === "all") return crmData.recentWrites
    return crmData.recentWrites.filter((write) => write.type === writeFilter)
  }, [crmData.recentWrites, writeFilter])

  // Get filter icon
  const getFilterIcon = (type: WriteFilter) => {
    switch (type) {
      case "ai": return <Sparkles className="w-3.5 h-3.5" />
      case "system": return <Settings className="w-3.5 h-3.5" />
      case "manual": return <User className="w-3.5 h-3.5" />
      default: return <Filter className="w-3.5 h-3.5" />
    }
  }

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
            {/* Page Header with CRM Selector */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-semibold text-foreground">CRM Sync</h1>
                <p className="text-sm text-muted-foreground">
                  Enterprise-grade integration with full transparency and control
                </p>
              </div>
              <div className="flex items-center gap-2 min-w-0 max-w-xs">
                <label className="text-xs text-muted-foreground shrink-0">CRM:</label>
                <Select
                  value={selectedCRM}
                  onValueChange={(value) => setSelectedCRM(value as CRMType)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select CRM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">Salesforce</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hubspot">
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        <span className="font-medium">HubSpot</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Connection Status */}
            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      {crmData.platform}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span>Plan: {crmData.plan}</span>
                      <span>•</span>
                      <span>Last synced: {mockCRMSync.lastSync}</span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-chart-2" />
                    <Badge variant="default">{mockCRMSync.connectionStatus}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Sync Mode
                    </p>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-chart-2" />
                      <p className="text-sm font-medium">{mockCRMSync.syncFrequency}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Fields Mapped
                    </p>
                    <p className="text-sm font-medium">{crmData.fieldMappings.length} fields</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      {crmData.terminology.records} Synced Today
                    </p>
                    <p className="text-sm font-medium">847</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Sync Health
                    </p>
                    <Badge variant="default" className="text-xs">Healthy</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Field Mappings */}
            <Card>
              <CardHeader>
                <CardTitle>Field Mappings</CardTitle>
                <CardDescription>
                  Complete transparency on what data flows between Jazon and your {selectedCRM === "salesforce" ? "Salesforce" : "HubSpot"} CRM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jazon Field</TableHead>
                      <TableHead>CRM Field</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Sync Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {crmData.fieldMappings.map((mapping, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="font-medium">{mapping.jazonField}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {mapping.crmField}
                          </code>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDirectionIcon(mapping.direction)}
                            <span className="text-sm">{mapping.direction}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {mapping.purpose}
                        </TableCell>
                        <TableCell>
                          <Badge variant={mapping.syncStatus === "Active" ? "default" : "outline"}>
                            {mapping.syncStatus}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Writes */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Recent CRM Writes</CardTitle>
                    <CardDescription>
                      Audit trail of all data written to your {selectedCRM === "salesforce" ? "Salesforce" : "HubSpot"} CRM
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={writeFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWriteFilter("all")}
                      className="h-8"
                    >
                      {getFilterIcon("all")}
                      <span className="ml-1.5">All</span>
                    </Button>
                    <Button
                      variant={writeFilter === "ai" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWriteFilter("ai")}
                      className="h-8"
                    >
                      {getFilterIcon("ai")}
                      <span className="ml-1.5">AI-Triggered</span>
                    </Button>
                    <Button
                      variant={writeFilter === "system" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWriteFilter("system")}
                      className="h-8"
                    >
                      {getFilterIcon("system")}
                      <span className="ml-1.5">System-Triggered</span>
                    </Button>
                    <Button
                      variant={writeFilter === "manual" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setWriteFilter("manual")}
                      className="h-8"
                    >
                      {getFilterIcon("manual")}
                      <span className="ml-1.5">Manual Override</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredWrites.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No {writeFilter !== "all" ? writeFilter + "-triggered " : ""}writes found
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWrites.map((write, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold text-sm">{write.record}</h4>
                              <Badge variant="outline" className="text-xs">
                                {write.type === "ai" ? "AI" : write.type === "system" ? "System" : "Manual"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Field: <code className="bg-muted px-1.5 py-0.5 rounded">{write.field}</code>
                            </p>
                          </div>
                          <span className="text-xs text-muted-foreground">{write.timestamp}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              Previous Value
                            </p>
                            <p className="text-sm">{write.oldValue}</p>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                              New Value
                            </p>
                            <p className="text-sm font-medium text-primary">{write.newValue}</p>
                          </div>
                        </div>

                        <div className="pt-3 border-t">
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                            Triggered By
                          </p>
                          <div className="flex items-center gap-2">
                            {write.type === "ai" && <Sparkles className="w-3.5 h-3.5 text-primary" />}
                            {write.type === "system" && <Settings className="w-3.5 h-3.5 text-muted-foreground" />}
                            {write.type === "manual" && <User className="w-3.5 h-3.5 text-chart-4" />}
                            <p className="text-sm">{write.triggeredBy}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Permissions & Governance */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-chart-2/20 bg-chart-2/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="w-4 h-4" />
                    What Jazon Can Read
                  </CardTitle>
                  <CardDescription>
                    Data Jazon reads from your {selectedCRM === "salesforce" ? "Salesforce" : "HubSpot"} to inform decisions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {crmData.readPermissions.map((permission, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-2 mt-0.5 flex-shrink-0" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Edit className="w-4 h-4" />
                    What Jazon Can Write
                  </CardTitle>
                  <CardDescription>
                    Data Jazon writes back to your {selectedCRM === "salesforce" ? "Salesforce" : "HubSpot"} for team visibility
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {crmData.writePermissions.map((permission, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Governance & Compliance */}
            <Card className="border-chart-4/20 bg-chart-4/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Governance & Compliance
                </CardTitle>
                <CardDescription>
                  Enterprise controls for data integrity and auditability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Data Governance</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>All writes are logged with full audit trail</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>Field-level permissions enforced</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>Read-only mode available for sensitive fields</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>Rollback capability for accidental changes</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold">Compliance Features</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>SOC 2 Type II certified integration</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>GDPR compliant data handling</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>Encryption in transit and at rest</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-chart-4 mt-0.5 flex-shrink-0" />
                        <span>Role-based access control (RBAC)</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sync Statistics */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Total {crmData.terminology.records} Synced</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">12,847</div>
                  <p className="text-xs text-muted-foreground mt-1">Lifetime</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Sync Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-chart-2">99.97%</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Avg Sync Latency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">1.2s</div>
                  <p className="text-xs text-muted-foreground mt-1">Real-time sync</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">Failed Syncs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

