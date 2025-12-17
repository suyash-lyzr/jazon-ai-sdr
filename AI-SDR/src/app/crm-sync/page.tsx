"use client"

import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockCRMSync } from "@/lib/mock-data"
import { 
  Database, 
  CheckCircle2, 
  RefreshCw, 
  ArrowLeftRight, 
  ArrowRight, 
  ArrowLeft,
  Shield,
  Eye,
  Edit
} from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function CRMSyncPage() {
  const getDirectionIcon = (direction: string) => {
    switch (direction) {
      case "Jazon → CRM": return <ArrowRight className="w-4 h-4" />
      case "CRM → Jazon": return <ArrowLeft className="w-4 h-4" />
      case "Bidirectional": return <ArrowLeftRight className="w-4 h-4" />
      default: return <ArrowRight className="w-4 h-4" />
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
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">CRM Sync</h1>
              <p className="text-sm text-muted-foreground">
                Enterprise-grade integration with full transparency and control
              </p>
            </div>

            {/* Connection Status */}
            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5" />
                      {mockCRMSync.platform}
                    </CardTitle>
                    <CardDescription>
                      Last synced: {mockCRMSync.lastSync}
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
                      Sync Frequency
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
                    <p className="text-sm font-medium">{mockCRMSync.fieldMappings.length} fields</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      Records Synced Today
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
                  Complete transparency on what data flows between Jazon and your CRM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Jazon Field</TableHead>
                      <TableHead>CRM Field</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Sync Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockCRMSync.fieldMappings.map((mapping, idx) => (
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
                <CardTitle>Recent CRM Writes</CardTitle>
                <CardDescription>
                  Audit trail of all data written to your CRM by Jazon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockCRMSync.recentWrites.map((write, idx) => (
                    <div key={idx} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-sm">{write.record}</h4>
                          <p className="text-xs text-muted-foreground mt-1">
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
                        <p className="text-sm">{write.triggeredBy}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Permissions & Governance */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-chart-2/20 bg-chart-2/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Eye className="w-4 h-4" />
                    Read Permissions
                  </CardTitle>
                  <CardDescription>
                    Data Jazon can read from your CRM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockCRMSync.readPermissions.map((permission, idx) => (
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
                    Write Permissions
                  </CardTitle>
                  <CardDescription>
                    Data Jazon can write to your CRM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {mockCRMSync.writePermissions.map((permission, idx) => (
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
                  <CardTitle className="text-sm">Total Records Synced</CardTitle>
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

