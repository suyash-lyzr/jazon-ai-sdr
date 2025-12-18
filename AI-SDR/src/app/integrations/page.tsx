"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { JazonSidebar } from "@/components/jazon-sidebar"
import { JazonHeader } from "@/components/jazon-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Database,
  Link2,
  Phone,
  CalendarDays,
  Mail,
  Upload,
  Search,
  Sparkles,
  MessageSquare,
  Shield,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Circle,
  ExternalLink,
  X,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Integration {
  id: string
  name: string
  permissions: string
  usedFor: string
  icon: React.ElementType
  category: string
}

const integrations: Integration[] = [
  // Lead Sources
  {
    id: "apollo",
    name: "Apollo.io",
    permissions: "Read-only",
    usedFor: "Outbound lead sourcing from saved lists and campaigns",
    icon: Search,
    category: "lead-sources",
  },
  {
    id: "salesforce",
    name: "Salesforce",
    permissions: "Read / Write",
    usedFor: "Primary CRM for lead ingestion and opportunity tracking",
    icon: Database,
    category: "lead-sources",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    permissions: "Read / Write",
    usedFor: "Alternative CRM for contact management and workflows",
    icon: Database,
    category: "lead-sources",
  },
  {
    id: "csv-upload",
    name: "CSV Upload",
    permissions: "Write",
    usedFor: "Bulk lead imports from events or external lists",
    icon: Upload,
    category: "lead-sources",
  },
  // Research & Enrichment
  {
    id: "linkedin",
    name: "LinkedIn",
    permissions: "Read",
    usedFor: "Company research, persona insights, and buying signals",
    icon: Link2,
    category: "research",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    permissions: "Act (AI)",
    usedFor: "External context and real-time industry research",
    icon: Sparkles,
    category: "research",
  },
  {
    id: "crm-data",
    name: "CRM Historical Data",
    permissions: "Read",
    usedFor: "Historical activity, account segments, and deal pipelines",
    icon: Database,
    category: "research",
  },
  // Outreach Channels
  {
    id: "email",
    name: "Email",
    permissions: "Send / Log",
    usedFor: "Primary outbound email communication channel",
    icon: Mail,
    category: "outreach",
  },
  {
    id: "linkedin-messaging",
    name: "LinkedIn Messaging",
    permissions: "Send / Log",
    usedFor: "Social outreach and multi-channel engagement",
    icon: MessageSquare,
    category: "outreach",
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    permissions: "Send / Log",
    usedFor: "Regional messaging and follow-up communications",
    icon: MessageSquare,
    category: "outreach",
  },
  {
    id: "phone",
    name: "Phone (Voice)",
    permissions: "Call / Log",
    usedFor: "Voice qualification and objection handling calls",
    icon: Phone,
    category: "outreach",
  },
  // Scheduling
  {
    id: "google-calendar",
    name: "Google Calendar",
    permissions: "Create / Update",
    usedFor: "Calendar-aware meeting scheduling and automated reminders",
    icon: CalendarDays,
    category: "scheduling",
  },
  {
    id: "outlook-calendar",
    name: "Microsoft Outlook Calendar",
    permissions: "Create / Update",
    usedFor: "Enterprise calendar integration for Microsoft 365 users",
    icon: CalendarDays,
    category: "scheduling",
  },
]

export default function IntegrationsPage() {
  const [connectionStates, setConnectionStates] = useState<Record<string, "disconnected" | "connecting" | "connected">>(() => {
    const initial: Record<string, "disconnected" | "connecting" | "connected"> = {}
    integrations.forEach((integration) => {
      initial[integration.id] = "disconnected"
    })
    return initial
  })

  const [apolloModalOpen, setApolloModalOpen] = useState(false)
  const [apolloApiKey, setApolloApiKey] = useState("")

  const handleConnect = (id: string) => {
    // Apollo requires a modal with API key input
    if (id === "apollo") {
      setApolloModalOpen(true)
      return
    }
    
    setConnectionStates((prev) => ({ ...prev, [id]: "connecting" }))
    setTimeout(() => {
      setConnectionStates((prev) => ({ ...prev, [id]: "connected" }))
    }, 1500)
  }

  const handleApolloConnect = () => {
    setApolloModalOpen(false)
    setConnectionStates((prev) => ({ ...prev, apollo: "connecting" }))
    
    setTimeout(() => {
      setConnectionStates((prev) => ({ ...prev, apollo: "connected" }))
      setApolloApiKey("")
    }, 2500)
  }

  // Calculate connection stats
  const connectedCount = useMemo(() => {
    return Object.values(connectionStates).filter((state) => state === "connected").length
  }, [connectionStates])

  const totalCount = integrations.length

  // Group integrations by category
  const leadSources = integrations.filter((i) => i.category === "lead-sources")
  const research = integrations.filter((i) => i.category === "research")
  const outreach = integrations.filter((i) => i.category === "outreach")
  const scheduling = integrations.filter((i) => i.category === "scheduling")

  // Calculate category health
  const getCategoryHealth = (categoryIntegrations: Integration[]) => {
    const connected = categoryIntegrations.filter((i) => connectionStates[i.id] === "connected").length
    if (connected === 0) return "disconnected"
    if (connected === categoryIntegrations.length) return "healthy"
    return "partial"
  }

  const renderIntegrationCard = (integration: Integration) => {
    const state = connectionStates[integration.id]
    const Icon = integration.icon

    return (
      <div key={integration.id} className="border rounded-lg p-4 flex flex-col gap-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Icon className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-sm">{integration.name}</p>
              {integration.category === "research" && integration.permissions.includes("Read") && (
                <p className="text-xs text-muted-foreground mt-0.5">Read-only</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {state === "disconnected" && (
              <Button size="sm" variant="outline" onClick={() => handleConnect(integration.id)}>
                Connect
              </Button>
            )}
            {state === "connecting" && (
              <Button size="sm" variant="outline" disabled>
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Authorizing...
              </Button>
            )}
            {state === "connected" && (
              <Badge variant="default" className="text-xs gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Connected (Demo)
              </Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-xs">
          <div>
            <span className="font-medium text-foreground">Permissions:</span>
            <span className="text-muted-foreground ml-1.5">{integration.permissions}</span>
          </div>
          <div>
            <span className="font-medium text-foreground">Used for:</span>
            <span className="text-muted-foreground ml-1.5">{integration.usedFor}</span>
          </div>
        </div>
      </div>
    )
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
          <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Integrations</h1>
              <p className="text-sm text-muted-foreground">
                Unified view of how Jazon connects to your systems across the SDR lifecycle
              </p>
            </div>

            {/* Data Flow Summary */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getCategoryHealth(leadSources) === "healthy" ? "bg-chart-2" : getCategoryHealth(leadSources) === "partial" ? "bg-chart-4" : "bg-muted-foreground/30"}`} />
                      <span className="text-xs font-medium">Lead Sources</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getCategoryHealth(research) === "healthy" ? "bg-chart-2" : getCategoryHealth(research) === "partial" ? "bg-chart-4" : "bg-muted-foreground/30"}`} />
                      <span className="text-xs font-medium">Research</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getCategoryHealth(outreach) === "healthy" ? "bg-chart-2" : getCategoryHealth(outreach) === "partial" ? "bg-chart-4" : "bg-muted-foreground/30"}`} />
                      <span className="text-xs font-medium">Outreach</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full ${getCategoryHealth(scheduling) === "healthy" ? "bg-chart-2" : getCategoryHealth(scheduling) === "partial" ? "bg-chart-4" : "bg-muted-foreground/30"}`} />
                      <span className="text-xs font-medium">Meetings</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                      <span className="text-xs font-medium">CRM</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">SDR Data Flow</p>
                    <p className="text-sm font-medium">Visual architecture overview</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Integration Health Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Integration Health Overview
                </CardTitle>
                <CardDescription>
                  {connectedCount} / {totalCount} integrations connected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Lead Sources</p>
                    <Badge variant={getCategoryHealth(leadSources) === "healthy" ? "default" : getCategoryHealth(leadSources) === "partial" ? "secondary" : "outline"}>
                      {getCategoryHealth(leadSources) === "healthy" ? "Healthy" : getCategoryHealth(leadSources) === "partial" ? "Partial" : "Disconnected"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Research & Enrichment</p>
                    <Badge variant={getCategoryHealth(research) === "healthy" ? "default" : getCategoryHealth(research) === "partial" ? "secondary" : "outline"}>
                      {getCategoryHealth(research) === "healthy" ? "Healthy" : getCategoryHealth(research) === "partial" ? "Partial" : "Disconnected"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Outreach Channels</p>
                    <Badge variant={getCategoryHealth(outreach) === "healthy" ? "default" : getCategoryHealth(outreach) === "partial" ? "secondary" : "outline"}>
                      {getCategoryHealth(outreach) === "healthy" ? "Healthy" : getCategoryHealth(outreach) === "partial" ? "Partial" : "Disconnected"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Scheduling</p>
                    <Badge variant={getCategoryHealth(scheduling) === "healthy" ? "default" : getCategoryHealth(scheduling) === "partial" ? "secondary" : "outline"}>
                      {getCategoryHealth(scheduling) === "healthy" ? "Healthy" : getCategoryHealth(scheduling) === "partial" ? "Partial" : "Disconnected"}
                    </Badge>
                  </div>
                </div>
                {connectedCount === 0 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Warnings: None
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Lead Sources */}
            <Card>
              <CardHeader>
                <CardTitle>Lead Sources</CardTitle>
                <CardDescription>
                  Where leads come from • <Badge variant="outline" className="text-xs">Ingestion</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {leadSources.map(renderIntegrationCard)}
              </CardContent>
            </Card>

            {/* Research & Enrichment */}
            <Card>
              <CardHeader>
                <CardTitle>Research & Enrichment</CardTitle>
                <CardDescription>
                  How Jazon gets context • Read-only where applicable
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {research.map(renderIntegrationCard)}
              </CardContent>
            </Card>

            {/* Outreach Channels */}
            <Card>
              <CardHeader>
                <CardTitle>Outreach Channels</CardTitle>
                <CardDescription>
                  How Jazon communicates with prospects
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {outreach.map(renderIntegrationCard)}
              </CardContent>
            </Card>

            {/* Scheduling & Meetings */}
            <Card>
              <CardHeader>
                <CardTitle>Scheduling & Meetings</CardTitle>
                <CardDescription>
                  How meetings get booked
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {scheduling.map(renderIntegrationCard)}
              </CardContent>
            </Card>

            {/* CRM Sync - Link to dedicated page */}
            <Card className="border-chart-2/20 bg-chart-2/5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>CRM Sync</CardTitle>
                    <CardDescription>
                      System of record for all Jazon activities
                    </CardDescription>
                  </div>
                  <Link href="/crm-sync">
                    <Button variant="outline" size="sm">
                      View CRM Sync
                      <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Database className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Salesforce & HubSpot</p>
                      <p className="text-xs text-muted-foreground">Bidirectional sync with full audit trail</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground border-t pt-3">
                    Field-level sync rules and audit logs are managed in CRM Sync. All writes are logged with full transparency.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Signal Banner */}
            <Alert className="border-muted">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-sm text-muted-foreground">
                All integrations follow least-privilege access, are fully auditable, and can be revoked at any time.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </SidebarInset>

      {/* Apollo Connection Modal */}
      <Dialog open={apolloModalOpen} onOpenChange={setApolloModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Connect Apollo.io</DialogTitle>
            <DialogDescription>
              Jazon connects to Apollo using read-only API access to ingest outbound leads from saved lists.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="apollo-api-key">Apollo API Key</Label>
              <Input
                id="apollo-api-key"
                type="password"
                placeholder="Enter your Apollo API key..."
                value={apolloApiKey}
                onChange={(e) => setApolloApiKey(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Your API key is used for read-only access to people data, company data, and saved lists only.
              </p>
            </div>
            <div className="bg-muted/30 rounded-lg p-3 border border-border/30">
              <p className="text-xs font-medium text-foreground mb-1">What Jazon can access:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Saved lists and sequences (read-only)</li>
                <li>• People and company profile data (read-only)</li>
                <li>• Contact information for enrichment (read-only)</li>
              </ul>
              <p className="text-xs font-medium text-foreground mt-2 mb-1">What Jazon cannot do:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>• Send emails via Apollo</li>
                <li>• Modify sequences or campaigns</li>
                <li>• Access your usage credits</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApolloModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApolloConnect} disabled={!apolloApiKey.trim()}>
              Connect
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

