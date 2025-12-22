"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { JazonSidebar } from "@/components/jazon-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Database,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  Copy,
  ChevronDown,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function HubSpotIntegrationPage() {
  const router = useRouter();
  const [grantType, setGrantType] = useState("authorization_code");
  const [hubspotUrl, setHubspotUrl] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [securityExpanded, setSecurityExpanded] = useState(false);

  // Field mapping state
  const [fieldMappings, setFieldMappings] = useState({
    name: "firstname",
    email: "email",
    company: "company",
    title: "jobtitle",
    phone: "phone",
    lifecycleStage: "lifecyclestage",
    leadSource: "hs_lead_status",
  });

  const redirectUri = `${typeof window !== "undefined" ? window.location.origin : ""}/oauth/callback/hubspot`;

  const handleSaveCredentials = () => {
    if (!hubspotUrl || !clientId) {
      setTestResult("Please fill in HubSpot URL and Client ID");
      return;
    }
    setCredentialsSaved(true);
    setTestResult("Credentials saved successfully");
  };

  const handleStartOAuth = () => {
    if (!credentialsSaved) {
      setTestResult("Please save credentials first");
      return;
    }
    setIsConnecting(true);
    // In a real implementation, this would redirect to HubSpot OAuth
    // For demo purposes, simulate the connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setTestResult("Successfully connected to HubSpot");
    }, 2000);
  };

  const handleTestConnection = async () => {
    if (!credentialsSaved) {
      setTestResult("Please save credentials first");
      return;
    }
    setIsTesting(true);
    setTestResult(null);
    // Simulate API test
    setTimeout(() => {
      setIsTesting(false);
      setTestResult("Connection test successful");
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
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
        <div className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/setup")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Setup
              </Button>
              <div className="flex-1">
                <h1 className="text-3xl font-semibold text-foreground">
                  HubSpot Integration
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your HubSpot CRM to sync leads, contacts, and activities
                </p>
              </div>
              <Badge variant={isConnected ? "default" : "outline"}>
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>

            <div className="space-y-6">
              {/* What this integration enables */}
              <Card>
                <CardHeader>
                  <CardTitle>What this integration enables</CardTitle>
                  <CardDescription>
                    Connect HubSpot to enable bidirectional sync between Jazon and your CRM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">Read contacts and companies</strong> from HubSpot for lead enrichment and ICP scoring
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">Write qualification status and ICP scores</strong> back to HubSpot contact properties
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">Sync lifecycle stage and lead source</strong> for better lead routing
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">Log outreach activities</strong> (emails, calls, meetings) to HubSpot timeline
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">Create and update deals</strong> when leads are qualified and ready for AE handoff
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">Track email engagement</strong> (opens, clicks) from HubSpot for better outreach timing
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    Lyzr handles mapping, retries, and audit logging automatically.
                  </p>
                </CardContent>
              </Card>

              {/* HubSpot OAuth Setup Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>HubSpot OAuth Setup Instructions</CardTitle>
                  <CardDescription>
                    Follow these steps to create an OAuth app in HubSpot and connect it to Jazon
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        1
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Navigate to HubSpot Developer Portal
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Go to{" "}
                          <a
                            href="https://app.hubspot.com/private-apps"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            app.hubspot.com/private-apps
                            <ExternalLink className="w-3 h-3" />
                          </a>{" "}
                          or navigate to Settings → Integrations → Private Apps
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        2
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Create a new Private App
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click "Create a private app" and configure:
                        </p>
                        <ul className="text-xs text-muted-foreground ml-4 space-y-1 mt-2">
                          <li>• <strong>Name:</strong> Jazon Integration</li>
                          <li>• <strong>Redirect URI:</strong> Copy the redirect URI below</li>
                          <li>• <strong>Scopes:</strong> Select the required scopes (see Security & Permissions section)</li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        3
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Copy Client ID & Client Secret
                        </p>
                        <p className="text-xs text-muted-foreground">
                          After creating the app, copy the Client ID and Client Secret from the app settings page
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        4
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Enter credentials below
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Paste your HubSpot URL, Client ID, and Client Secret in the form below and click "Save Credentials"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        5
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Start OAuth authorization
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click "Start OAuth Setup" to authorize Jazon. After authorizing, you'll be redirected back to complete the connection
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connect HubSpot */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect HubSpot</CardTitle>
                  <CardDescription>
                    Enter your HubSpot OAuth credentials to establish the connection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Grant Type</Label>
                      <Select value={grantType} onValueChange={setGrantType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="authorization_code">
                            Authorization Code (interactive)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>HubSpot Account URL</Label>
                      <Input
                        placeholder="https://app.hubspot.com"
                        value={hubspotUrl}
                        onChange={(e) => setHubspotUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your HubSpot account URL (e.g., https://app.hubspot.com)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>HS_CLIENT_ID</Label>
                      <Input
                        placeholder="Enter Client ID"
                        value={clientId}
                        onChange={(e) => setClientId(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>HS_CLIENT_SECRET</Label>
                      <div className="relative">
                        <Input
                          type={showSecret ? "text" : "password"}
                          placeholder="Enter Client Secret"
                          value={clientSecret}
                          onChange={(e) => setClientSecret(e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowSecret(!showSecret)}
                        >
                          {showSecret ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Optional for authorization code flow
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Redirect URI</Label>
                      <div className="flex gap-2">
                        <Input
                          readOnly
                          value={redirectUri}
                          className="font-mono text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(redirectUri)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Copy this and paste it in your HubSpot app's redirect URI field
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleSaveCredentials}
                        disabled={credentialsSaved}
                      >
                        {credentialsSaved ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Credentials Saved
                          </>
                        ) : (
                          "Save Credentials"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleStartOAuth}
                        disabled={!credentialsSaved || isConnecting || isConnected}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Connecting...
                          </>
                        ) : (
                          "Start OAuth Setup"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleTestConnection}
                        disabled={!credentialsSaved || isTesting}
                      >
                        {isTesting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          "Test Connection"
                        )}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={credentialsSaved ? "default" : "outline"}>
                          {credentialsSaved ? "Saved" : "Not saved"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Integration:</span>
                        <Badge variant={isConnected ? "default" : "outline"}>
                          {isConnected ? "Connected" : "Not connected"}
                        </Badge>
                      </div>
                    </div>

                    {testResult && (
                      <Alert>
                        <AlertDescription>{testResult}</AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Capabilities & Quick Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Capabilities & Quick Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary">Read Contacts</Badge>
                    <Badge variant="secondary">Read Companies</Badge>
                    <Badge variant="secondary">Write Properties</Badge>
                    <Badge variant="secondary">Create Deals</Badge>
                    <Badge variant="secondary">Timeline Events</Badge>
                    <Badge variant="secondary">Email Engagement</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Sync Direction:</strong>{" "}
                    {isConnected ? "Bidirectional" : "Not configured"}
                  </p>
                </CardContent>
              </Card>

              {/* Security & Permissions */}
              <Card>
                <Collapsible open={securityExpanded} onOpenChange={setSecurityExpanded}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Security & Permissions</CardTitle>
                          <CardDescription>
                            Required OAuth scopes and permissions for this integration
                          </CardDescription>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            securityExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          Required Scopes
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                          <li>• <code className="bg-muted px-1 rounded">contacts</code> - Read and write contacts</li>
                          <li>• <code className="bg-muted px-1 rounded">companies</code> - Read and write companies</li>
                          <li>• <code className="bg-muted px-1 rounded">deals</code> - Create and update deals</li>
                          <li>• <code className="bg-muted px-1 rounded">timeline</code> - Create timeline events</li>
                          <li>• <code className="bg-muted px-1 rounded">email</code> - Read email engagement data</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          Data Access
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Jazon will only access data necessary for lead management, qualification, and outreach tracking. 
                          All API calls are logged for audit purposes.
                        </p>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>

              {/* Automatic Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle>Automatic Configuration Handled by Lyzr</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Default contact → lead mapping (name, email, company, title)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>ICP score and qualification status property updates</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Lifecycle stage and lead source synchronization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Deal creation for qualified leads ready for AE handoff</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Timeline event logging for all outreach activities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Retry logic and webhook validation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Audit logging for compliance</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    We auto-discover custom properties and deal pipelines during the first sync.
                  </p>
                </CardContent>
              </Card>

              {/* Advanced - Field Mapping */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced — Field Mapping</CardTitle>
                  <CardDescription>
                    Modify field mappings for custom HubSpot properties or different field names
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        value={fieldMappings.name}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="firstname"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={fieldMappings.email}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="email"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input
                        value={fieldMappings.company}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            company: e.target.value,
                          }))
                        }
                        placeholder="company"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        value={fieldMappings.title}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        placeholder="jobtitle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={fieldMappings.phone}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lifecycle Stage</Label>
                      <Input
                        value={fieldMappings.lifecycleStage}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            lifecycleStage: e.target.value,
                          }))
                        }
                        placeholder="lifecyclestage"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Defaults work for most customers. Only edit if you use custom properties or different field names.
                  </p>
                  <Button variant="outline" size="sm">
                    Save mappings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

