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

export default function SalesforceIntegrationPage() {
  const router = useRouter();
  const [grantType, setGrantType] = useState("authorization_code");
  const [salesforceUrl, setSalesforceUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [credentialsSaved, setCredentialsSaved] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [securityExpanded, setSecurityExpanded] = useState(false);

  // Field mapping state
  const [fieldMappings, setFieldMappings] = useState({
    name: "FirstName",
    email: "Email",
    company: "Company",
    title: "Title",
    phone: "Phone",
    leadSource: "LeadSource",
    status: "Status",
  });

  const redirectUri = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/oauth/callback/salesforce`;

  const handleSaveCredentials = () => {
    if (!salesforceUrl || !consumerKey) {
      setTestResult("Please fill in Salesforce URL and Consumer Key");
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
    // In a real implementation, this would redirect to Salesforce OAuth
    // For demo purposes, simulate the connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      setTestResult("Successfully connected to Salesforce");
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
                  Salesforce Integration
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Connect your Salesforce CRM to sync leads, contacts, accounts,
                  and activities
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
                    Connect Salesforce to enable bidirectional sync between
                    Jazon and your CRM
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">
                          Read leads, contacts, and accounts
                        </strong>{" "}
                        from Salesforce for lead enrichment and ICP scoring
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">
                          Write qualification status and ICP scores
                        </strong>{" "}
                        back to Salesforce lead/contact records
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">
                          Sync account data
                        </strong>{" "}
                        (industry, size, region) for better targeting
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">
                          Log activities
                        </strong>{" "}
                        (emails, calls, meetings, tasks) to Salesforce timeline
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">
                          Create and update opportunities
                        </strong>{" "}
                        when leads are qualified and ready for AE handoff
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        <strong className="text-foreground">
                          Track email engagement
                        </strong>{" "}
                        and sync activity history for better outreach timing
                      </span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    Lyzr handles mapping, retries, and audit logging
                    automatically.
                  </p>
                </CardContent>
              </Card>

              {/* Salesforce OAuth Setup Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle>Salesforce OAuth Setup Instructions</CardTitle>
                  <CardDescription>
                    Follow these steps to create a Connected App in Salesforce
                    and connect it to Jazon
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
                          Navigate to Salesforce Setup
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Log in to your Salesforce org and click the gear icon
                          (⚙️) in the top right, then select{" "}
                          <strong>Setup</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        2
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Create a Connected App
                        </p>
                        <p className="text-xs text-muted-foreground">
                          In the Quick Find box, search for{" "}
                          <strong>"App Manager"</strong> and select it. Click{" "}
                          <strong>"New Connected App"</strong> and configure:
                        </p>
                        <ul className="text-xs text-muted-foreground ml-4 space-y-1 mt-2">
                          <li>
                            • <strong>Connected App Name:</strong> Jazon
                            Integration
                          </li>
                          <li>
                            • <strong>API Name:</strong> Jazon_Integration
                            (auto-populated)
                          </li>
                          <li>
                            • <strong>Contact Email:</strong> Your email address
                          </li>
                          <li>
                            • <strong>Enable OAuth Settings:</strong> Check this
                            box
                          </li>
                          <li>
                            • <strong>Callback URL:</strong> Copy the redirect
                            URI below
                          </li>
                          <li>
                            • <strong>Selected OAuth Scopes:</strong> Add
                            required scopes (see Security & Permissions section)
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        3
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Configure OAuth Policies
                        </p>
                        <p className="text-xs text-muted-foreground">
                          After saving, click <strong>"Manage"</strong> →{" "}
                          <strong>"Edit Policies"</strong>:
                        </p>
                        <ul className="text-xs text-muted-foreground ml-4 space-y-1 mt-2">
                          <li>
                            • <strong>Permitted Users:</strong> Admin approved
                            users are pre-authorized
                          </li>
                          <li>
                            • <strong>IP Relaxation:</strong> Relax IP
                            restrictions (or configure as needed)
                          </li>
                          <li>
                            • <strong>Refresh Token Policy:</strong> Refresh
                            token is valid until revoked
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        4
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Copy Consumer Key & Consumer Secret
                        </p>
                        <p className="text-xs text-muted-foreground">
                          After creating the Connected App, you'll see the{" "}
                          <strong>Consumer Key</strong> (this is your Client ID)
                          and <strong>Consumer Secret</strong> (this is your
                          Client Secret). Copy both values.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        5
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Enter credentials below
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Paste your Salesforce instance URL, Consumer Key, and
                          Consumer Secret in the form below and click "Save
                          Credentials"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                        6
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          Start OAuth authorization
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click "Start OAuth Setup" to authorize Jazon. After
                          authorizing, you'll be redirected back to complete the
                          connection
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Connect Salesforce */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect Salesforce</CardTitle>
                  <CardDescription>
                    Enter your Salesforce OAuth credentials to establish the
                    connection
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
                      <Label>Salesforce Instance URL</Label>
                      <Input
                        placeholder="https://yourinstance.salesforce.com"
                        value={salesforceUrl}
                        onChange={(e) => setSalesforceUrl(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your Salesforce org URL (e.g.,
                        https://yourinstance.salesforce.com or
                        https://yourinstance.my.salesforce.com)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>SF_CONSUMER_KEY (Client ID)</Label>
                      <Input
                        placeholder="Enter Consumer Key"
                        value={consumerKey}
                        onChange={(e) => setConsumerKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        This is the Consumer Key from your Connected App
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>SF_CONSUMER_SECRET (Client Secret)</Label>
                      <div className="relative">
                        <Input
                          type={showSecret ? "text" : "password"}
                          placeholder="Enter Consumer Secret"
                          value={consumerSecret}
                          onChange={(e) => setConsumerSecret(e.target.value)}
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
                        This is the Consumer Secret from your Connected App
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Redirect URI (Callback URL)</Label>
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
                        Copy this and paste it in your Connected App's Callback
                        URL field
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
                        disabled={
                          !credentialsSaved || isConnecting || isConnected
                        }
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
                        <Badge
                          variant={credentialsSaved ? "default" : "outline"}
                        >
                          {credentialsSaved ? "Saved" : "Not saved"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                          Integration:
                        </span>
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
                    <Badge variant="secondary">Read Leads</Badge>
                    <Badge variant="secondary">Read Contacts</Badge>
                    <Badge variant="secondary">Read Accounts</Badge>
                    <Badge variant="secondary">Write Records</Badge>
                    <Badge variant="secondary">Create Opportunities</Badge>
                    <Badge variant="secondary">Activity Logging</Badge>
                    <Badge variant="secondary">Email Tracking</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Sync Direction:</strong>{" "}
                    {isConnected ? "Bidirectional" : "Not configured"}
                  </p>
                </CardContent>
              </Card>

              {/* Security & Permissions */}
              <Card>
                <Collapsible
                  open={securityExpanded}
                  onOpenChange={setSecurityExpanded}
                >
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Security & Permissions</CardTitle>
                          <CardDescription>
                            Required OAuth scopes and permissions for this
                            integration
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
                          Required OAuth Scopes
                        </p>
                        <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                          <li>
                            • <code className="bg-muted px-1 rounded">api</code>{" "}
                            - Access and manage your data (api)
                          </li>
                          <li>
                            •{" "}
                            <code className="bg-muted px-1 rounded">
                              refresh_token
                            </code>{" "}
                            - Perform requests on your behalf at any time
                            (refresh_token, offline_access)
                          </li>
                          <li>
                            •{" "}
                            <code className="bg-muted px-1 rounded">full</code>{" "}
                            - Full access (full)
                          </li>
                        </ul>
                        <p className="text-xs text-muted-foreground mt-2">
                          These scopes allow Jazon to read and write leads,
                          contacts, accounts, and activities.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          Data Access
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Jazon will only access data necessary for lead
                          management, qualification, and outreach tracking. All
                          API calls are logged for audit purposes. The
                          integration respects Salesforce field-level security
                          and sharing rules.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">
                          OAuth Policies
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Ensure your Connected App has "Admin approved users
                          are pre-authorized" enabled for seamless
                          authentication.
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
                      <span>
                        Default lead/contact → lead mapping (name, email,
                        company, title)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        ICP score and qualification status field updates
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        Account data synchronization (industry, size, region)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        Opportunity creation for qualified leads ready for AE
                        handoff
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>
                        Activity logging (emails, calls, meetings, tasks) to
                        Salesforce timeline
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Retry logic and error handling for API calls</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      <span>Audit logging for compliance</span>
                    </li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    We auto-discover custom fields, record types, and picklist
                    values during the first sync.
                  </p>
                </CardContent>
              </Card>

              {/* Advanced - Field Mapping */}
              <Card>
                <CardHeader>
                  <CardTitle>Advanced — Field Mapping</CardTitle>
                  <CardDescription>
                    Modify field mappings for custom Salesforce fields or
                    different field names
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Name (First Name)</Label>
                      <Input
                        value={fieldMappings.name}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="FirstName"
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
                        placeholder="Email"
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
                        placeholder="Company"
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
                        placeholder="Title"
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
                        placeholder="Phone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Lead Source</Label>
                      <Input
                        value={fieldMappings.leadSource}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            leadSource: e.target.value,
                          }))
                        }
                        placeholder="LeadSource"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Input
                        value={fieldMappings.status}
                        onChange={(e) =>
                          setFieldMappings((prev) => ({
                            ...prev,
                            status: e.target.value,
                          }))
                        }
                        placeholder="Status"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Defaults work for most customers. Only edit if you use
                    custom fields or different field names.
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
