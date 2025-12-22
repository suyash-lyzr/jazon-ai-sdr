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
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useJazonApp } from "@/context/jazon-app-context";
import { Lead } from "@/lib/mock-data";
import { Upload, Database, Building2, Settings2, Loader2, Mic, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const csvFields = ["name", "email", "company", "title", "phone"] as const;

type CsvField = (typeof csvFields)[number];

type MappingState = Record<CsvField, string>;

const defaultMapping: MappingState = {
  name: "name",
  email: "email",
  company: "company",
  title: "title",
  phone: "phone",
};

type KnowledgeDocument = {
  id: string;
  name: string;
  type: string;
};

export default function SetupPage() {
  const router = useRouter();
  const {
    companyProfile,
    setCompanyProfile,
    agentInstructions,
    setAgentInstructions,
    setLeads,
    leads,
  } = useJazonApp();

  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [mapping, setMapping] = useState<MappingState>(defaultMapping);
  const [isImporting, setIsImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);

  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>([]);
  const [knowledgeUrls, setKnowledgeUrls] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState("");
  const [knowledgeNotes, setKnowledgeNotes] = useState("");

  const [salesforceStatus, setSalesforceStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");
  const [hubspotStatus, setHubspotStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");

  // Voice Agent Script state
  const [voiceScript, setVoiceScript] = useState({
    opening: "",
    qualificationQuestions: "",
    objectionHandling: "",
    disqualificationRules: "",
    escalationCriteria: "",
    complianceDisclaimer: "",
  });
  const [allowImprovisation, setAllowImprovisation] = useState(false);

  // Apollo configuration state
  const [apolloEnabled, setApolloEnabled] = useState(false);
  const [apolloWorkspace, setApolloWorkspace] = useState("enterprise-sales-ops-q1");
  const [apolloAutoIngest, setApolloAutoIngest] = useState(true);

  const handleCsvUpload = (file: File) => {
    // Store the file for later use
    setCsvFile(file);
    
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (!lines.length) return;

      const headers = lines[0].split(",").map((h) => h.trim());
      const rows = lines
        .slice(1, 6)
        .map((line) => line.split(",").map((c) => c.trim()));
      setCsvHeaders(headers);
      setCsvPreview(rows);
      setImportMessage(null);
    };
    reader.readAsText(file);
  };

  const inferDocumentType = (fileName: string): string => {
    const lower = fileName.toLowerCase();
    if (lower.includes("case")) return "Case Study";
    if (lower.includes("price")) return "Pricing";
    if (
      lower.includes("security") ||
      lower.includes("risk") ||
      lower.includes("compliance")
    )
      return "Security / Compliance";
    if (lower.includes("objection")) return "Objection Handling";
    if (lower.includes("deck") || lower.includes("overview"))
      return "Product Overview";
    return "General Enablement";
  };

  const handleKnowledgeUpload = (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    const files = Array.from(fileList);
    const docs: KnowledgeDocument[] = files.map((file, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: file.name,
      type: inferDocumentType(file.name),
    }));
    setKnowledgeDocs((prev) => [...prev, ...docs]);
  };

  const handleAddUrl = () => {
    const value = urlInput.trim();
    if (!value) return;
    setKnowledgeUrls((prev) => [...prev, value]);
    setUrlInput("");
  };

  const handleImport = async () => {
    if (!csvFile || !csvPreview.length || !csvHeaders.length) {
      setImportMessage("Please upload a CSV file first.");
      return;
    }

    setIsImporting(true);
    setImportMessage("Uploading and processing leads…");

    try {
      // Create FormData to send the original file and mapping
      // The API will handle CSV parsing and field mapping
      const formData = new FormData();
      formData.append("file", csvFile);
      formData.append("mapping", JSON.stringify(mapping));

      console.log("📤 Sending CSV file to API:", csvFile.name);
      console.log("🗺️ Field mapping:", mapping);

      // Call the API endpoint
      const response = await fetch("/api/leads/upload", {
        method: "POST",
        body: formData,
      });

      console.log("📥 API Response status:", response.status);

      const result = await response.json();
      console.log("📥 API Response data:", result);

      if (!response.ok) {
        throw new Error(result.error || result.message || "Failed to import leads");
      }

      // Check if leads were actually created
      if (!result.success) {
        throw new Error(result.message || "Import failed");
      }

      // Success - show success message
      const createdCount = result.summary?.created || result.leads?.length || 0;
      const failedCount = result.summary?.failed || 0;

      if (createdCount === 0) {
        setImportMessage(
          `No leads were imported. ${failedCount > 0 ? `${failedCount} failed.` : "Please check your CSV format."}`
        );
      } else {
        const successMsg = `Successfully imported ${createdCount} lead${createdCount !== 1 ? "s" : ""} to database.${failedCount > 0 ? ` ${failedCount} failed.` : ""}`;
        setImportMessage(successMsg);
      }

      // Log success to console
      if (result.leads && result.leads.length > 0) {
        console.log("✅ Leads saved to database:", result.leads);
        result.leads.forEach((lead: any) => {
          console.log(`  - ${lead.name} (${lead.company}) - ID: ${lead.id}`);
        });
      }

      // Show errors if any
      if (result.errors && result.errors.length > 0) {
        console.warn("⚠️ Some leads failed to import:", result.errors);
        result.errors.forEach((error: any) => {
          console.warn(`  - Row ${error.row}: ${error.error}`);
        });
      }
    } catch (error: any) {
      console.error("❌ Import error:", error);
      setImportMessage(
        `Error: ${error.message || "Failed to import leads. Please check the browser console for details."}`
      );
    } finally {
      setIsImporting(false);
    }
  };

  const simulateConnect = (target: "salesforce" | "hubspot") => {
    if (target === "hubspot") {
      // Redirect to HubSpot integration page
      router.push("/integrations/hubspot");
      return;
    }
    if (target === "salesforce") {
      // Redirect to Salesforce integration page
      router.push("/integrations/salesforce");
      return;
    }
    const setStatus =
      target === "salesforce" ? setSalesforceStatus : setHubspotStatus;
    setStatus("connecting");
    setTimeout(() => {
      setStatus("connected");
    }, 900);
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
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Setup</h1>
              <p className="text-sm text-muted-foreground">
                Configure lead sources, company context, and how Jazon behaves
                before going live.
              </p>
            </div>

            <Tabs defaultValue="sources" className="space-y-6">
              <TabsList>
                <TabsTrigger value="sources">Lead Sources</TabsTrigger>
                <TabsTrigger value="company">Company &amp; Product</TabsTrigger>
                <TabsTrigger value="agent">Agent Instructions</TabsTrigger>
              </TabsList>

              <TabsContent value="sources" className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Manual Lead Upload
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Use CSV upload for pilots, proof-of-concept environments,
                      or one-time imports when CRM integrations are not yet
                      enabled.
                    </p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Manual CSV Upload
                      </CardTitle>
                      <CardDescription>
                        Use CSV to load leads into Jazon for this workspace.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Upload CSV
                        </Label>
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleCsvUpload(file);
                          }}
                        />
                        <p className="text-xs text-muted-foreground">
                          Expecting a header row with at least name, email, and
                          company.
                        </p>
                      </div>

                      {csvHeaders.length > 0 && (
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                              Field Mapping
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Map your CSV columns to Jazon fields.
                            </p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {csvFields.map((field) => (
                              <div key={field} className="space-y-1">
                                <Label className="text-xs capitalize">
                                  {field}
                                </Label>
                                <Select
                                  value={mapping[field]}
                                  onValueChange={(val) =>
                                    setMapping((prev) => ({
                                      ...prev,
                                      [field]: val,
                                    }))
                                  }
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue placeholder="Select column" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {csvHeaders.map((h) => (
                                      <SelectItem key={h} value={h}>
                                        {h}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            ))}
                          </div>

                          {csvPreview.length > 0 && (
                            <div className="space-y-2">
                              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                Preview (first 5 rows)
                              </p>
                              <div className="border rounded-md max-h-40 overflow-auto text-xs">
                                <table className="w-full border-collapse">
                                  <thead className="bg-muted/40">
                                    <tr>
                                      {csvHeaders.map((h) => (
                                        <th
                                          key={h}
                                          className="px-2 py-1 text-left font-medium"
                                        >
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {csvPreview.map((row, idx) => (
                                      <tr key={idx} className="border-t">
                                        {row.map((cell, cidx) => (
                                          <td key={cidx} className="px-2 py-1">
                                            {cell}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          <Button
                            size="sm"
                            className="w-full"
                            disabled={isImporting || !csvPreview.length}
                            onClick={handleImport}
                          >
                            {isImporting
                              ? "Importing leads…"
                              : "Import Leads"}
                          </Button>

                          {importMessage && (
                            <p className="text-xs text-muted-foreground">
                              {importMessage}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      CRM &amp; Lead Source Integrations
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Connect your primary systems of record. These connections
                      power lead ingestion, enrichment, and CRM updates.
                    </p>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        Salesforce
                      </CardTitle>
                        <CardDescription>
                          Demo connection for enterprise CRM lead sync.
                        </CardDescription>
                    </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          {salesforceStatus === "disconnected" && (
                            <>
                              <Badge variant="outline">Not connected</Badge>
                              <Button
                                size="sm"
                                onClick={() => simulateConnect("salesforce")}
                              >
                                Connect
                              </Button>
                            </>
                          )}
                          {salesforceStatus === "connecting" && (
                            <>
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs text-muted-foreground">
                                  Connecting to Salesforce…
                                </span>
                              </div>
                            </>
                          )}
                          {salesforceStatus === "connected" && (
                            <>
                      <Badge variant="default">Connected (Demo)</Badge>
                              <span className="text-xs text-muted-foreground">
                                Last synced just now
                              </span>
                            </>
                          )}
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">
                            Jazon reads:
                          </p>
                          <p>
                            • Lead and contact fields (name, email, company,
                            title)
                          </p>
                          <p>• Account data (industry, size, region)</p>
                          <p>• Activity history (emails, calls, meetings)</p>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">
                            Jazon writes:
                          </p>
                          <p>• Qualification status and ICP score</p>
                          <p>• Next best action and AI recommendations</p>
                          <p>• Logged activities for outreach and follow-up</p>
                        </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="w-4 h-4" />
                        HubSpot
                      </CardTitle>
                        <CardDescription>
                          Demo connection for marketing and lifecycle leads.
                        </CardDescription>
                    </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                          {hubspotStatus === "disconnected" && (
                            <>
                              <Badge variant="outline">Not connected</Badge>
                              <Button
                                size="sm"
                                onClick={() => simulateConnect("hubspot")}
                              >
                                Connect
                              </Button>
                            </>
                          )}
                          {hubspotStatus === "connecting" && (
                            <>
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-xs text-muted-foreground">
                                  Connecting to HubSpot…
                                </span>
                              </div>
                            </>
                          )}
                          {hubspotStatus === "connected" && (
                            <>
                      <Badge variant="default">Connected (Demo)</Badge>
                              <span className="text-xs text-muted-foreground">
                                Last synced just now
                              </span>
                            </>
                          )}
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">
                            Jazon reads:
                          </p>
                          <p>• Lifecycle stage and lead source</p>
                          <p>• Campaign and email engagement history</p>
                          <p>• Form submissions and key properties</p>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p className="font-medium text-foreground">
                            Jazon writes:
                          </p>
                          <p>• Qualification outcome and reason</p>
                          <p>• Primary outreach channel and status</p>
                          <p>• Notes for SDR and AE follow-up tasks</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h2 className="text-sm font-semibold text-foreground">
                      Outbound Lead Sources
                    </h2>
                      <p className="text-xs text-muted-foreground">
                      Connect Apollo.io to automatically pull high-intent outbound leads
                    </p>
                  </div>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-4 h-4" />
                        Apollo.io
                      </CardTitle>
                      <CardDescription>
                        Read-only connection for outbound lead sourcing
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/30">
                        <div className="flex items-center gap-3">
                          <Switch
                            checked={apolloEnabled}
                            onCheckedChange={setApolloEnabled}
                            id="apollo-enabled"
                          />
                          <div>
                            <Label htmlFor="apollo-enabled" className="text-sm font-medium cursor-pointer">
                              Enable Apollo for outbound leads
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              {apolloEnabled ? "Apollo leads will be auto-ingested and enriched" : "Apollo integration is disabled"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {apolloEnabled && (
                        <>
                          <div className="space-y-2">
                            <Label>Select Apollo Workspace / Lists</Label>
                            <Select
                              value={apolloWorkspace}
                              onValueChange={setApolloWorkspace}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="us-mid-market">US Mid-Market RevOps Leaders</SelectItem>
                                <SelectItem value="enterprise-sales-ops-q1">Enterprise Sales Ops – Q1</SelectItem>
                                <SelectItem value="saas-decision-makers">SaaS Decision Makers</SelectItem>
                                <SelectItem value="fortune-500-revops">Fortune 500 Revenue Operations</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-xs text-muted-foreground">
                              Jazon will pull leads from this Apollo list for analysis and outreach
                            </p>
                          </div>

                          <div className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg border border-border/30">
                            <Switch
                              checked={apolloAutoIngest}
                              onCheckedChange={setApolloAutoIngest}
                              id="apollo-auto-ingest"
                            />
                            <div className="flex-1">
                              <Label htmlFor="apollo-auto-ingest" className="text-sm font-medium cursor-pointer">
                                Auto-ingest new leads daily
                              </Label>
                              <p className="text-xs text-muted-foreground mt-1">
                                Jazon will automatically sync new leads from the selected Apollo list every 24 hours
                              </p>
                            </div>
                          </div>

                          <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
                            <p className="text-sm text-foreground mb-2 font-medium">How it works:</p>
                            <ul className="space-y-1.5 text-xs text-muted-foreground">
                              <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Jazon pulls leads from selected Apollo lists</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Automatically enriches with ICP scoring and trigger detection</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>Routes qualified leads through the Outreach Campaign</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span><strong>All outreach is executed by Jazon</strong> (not Apollo sequences)</span>
                              </li>
                            </ul>
                          </div>
                        </>
                      )}

                      {!apolloEnabled && (
                        <div className="text-center py-6">
                          <p className="text-sm text-muted-foreground">
                            Enable Apollo to start ingesting outbound leads from your saved lists
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

              </TabsContent>

              <TabsContent value="company" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      Company &amp; Product Context
                    </CardTitle>
                    <CardDescription>
                      Jazon uses this information to personalize research,
                      outreach, and qualification.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Company Name</Label>
                        <Input
                          value={companyProfile.companyName}
                          onChange={(e) =>
                            setCompanyProfile((prev) => ({
                              ...prev,
                              companyName: e.target.value,
                            }))
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Website</Label>
                        <Input
                          value={companyProfile.website}
                          onChange={(e) =>
                            setCompanyProfile((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Product Description</Label>
                      <Textarea
                        rows={3}
                        value={companyProfile.productDescription}
                        onChange={(e) =>
                          setCompanyProfile((prev) => ({
                            ...prev,
                            productDescription: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Target Customers</Label>
                      <Textarea
                        rows={2}
                        value={companyProfile.targetCustomers}
                        onChange={(e) =>
                          setCompanyProfile((prev) => ({
                            ...prev,
                            targetCustomers: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Use Case</Label>
                      <Textarea
                        rows={2}
                        value={companyProfile.primaryUseCase}
                        onChange={(e) =>
                          setCompanyProfile((prev) => ({
                            ...prev,
                            primaryUseCase: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Key Value Propositions</Label>
                      <Textarea
                        rows={3}
                        value={companyProfile.valueProps}
                        onChange={(e) =>
                          setCompanyProfile((prev) => ({
                            ...prev,
                            valueProps: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Values are stored locally in this session for demo
                      purposes.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Company Knowledge Base</CardTitle>
                    <CardDescription>
                      Jazon uses your internal documents and links to align
                      research, outreach, qualification, and objection handling
                      with your company&apos;s messaging.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Upload company documents</Label>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.pptm,.key"
                        multiple
                        onChange={(e) => handleKnowledgeUpload(e.target.files)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: product overviews, case studies, pricing
                        decks, objection handling guides, security or compliance
                        documents.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Add relevant URLs</Label>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          placeholder="https://company.com/product"
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                        />
                        <Button
                          type="button"
                          onClick={handleAddUrl}
                          className="sm:w-auto w-full"
                        >
                          Add URL
                        </Button>
                      </div>
                      {knowledgeUrls.length === 0 && (
                        <p className="text-xs text-muted-foreground">
                          Examples: https://company.com/product,
                          https://company.com/customers
                        </p>
                      )}
                      {knowledgeUrls.length > 0 && (
                        <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                          {knowledgeUrls.map((url) => (
                            <li key={url} className="truncate">
                              {url}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Additional context for the AI (optional)</Label>
                      <Textarea
                        rows={3}
                        placeholder="Internal positioning, messaging nuances, or things to avoid saying."
                        value={knowledgeNotes}
                        onChange={(e) => setKnowledgeNotes(e.target.value)}
                      />
                    </div>

                    {knowledgeDocs.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          Uploaded documents
                        </p>
                        <div className="border rounded-md divide-y">
                          {knowledgeDocs.map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between px-3 py-2 text-sm"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-medium">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {doc.type} • Used by Outreach Campaign,
                                  Qualification &amp; AE handoff (demo)
                                </p>
                              </div>
                              <span className="text-xs font-medium text-chart-2">
                                Indexed (Demo)
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {knowledgeDocs.length === 0 && (
                      <p className="text-xs text-muted-foreground">
                        When you add documents and URLs here, Jazon will treat
                        them as the source of truth for how to speak about your
                        product in outreach, qualification, and AE handoff packs
                        (demo only, no data leaves this session).
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agent" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings2 className="w-4 h-4" />
                      Agent Instructions
                    </CardTitle>
                    <CardDescription>
                      Control how Jazon behaves across outreach, qualification,
                      and workflow decisions.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Outreach Tone</Label>
                        <Select
                          value={agentInstructions.tone}
                          onValueChange={(val) =>
                            setAgentInstructions((prev) => ({
                              ...prev,
                              tone: val as typeof agentInstructions.tone,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="formal">Formal</SelectItem>
                            <SelectItem value="consultative">
                              Consultative
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Qualification Strictness</Label>
                        <Select
                          value={agentInstructions.qualificationStrictness}
                          onValueChange={(val) =>
                            setAgentInstructions((prev) => ({
                              ...prev,
                              qualificationStrictness:
                                val as typeof agentInstructions.qualificationStrictness,
                            }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Allowed Channels</Label>
                      <div className="flex flex-wrap gap-2 text-sm">
                        <Button
                          type="button"
                          variant={
                            agentInstructions.allowedChannels.email
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setAgentInstructions((prev) => ({
                              ...prev,
                              allowedChannels: {
                                ...prev.allowedChannels,
                                email: !prev.allowedChannels.email,
                              },
                            }))
                          }
                        >
                          Email
                        </Button>
                        <Button
                          type="button"
                          variant={
                            agentInstructions.allowedChannels.linkedin
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setAgentInstructions((prev) => ({
                              ...prev,
                              allowedChannels: {
                                ...prev.allowedChannels,
                                linkedin: !prev.allowedChannels.linkedin,
                              },
                            }))
                          }
                        >
                          LinkedIn
                        </Button>
                        <Button
                          type="button"
                          variant={
                            agentInstructions.allowedChannels.voice
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setAgentInstructions((prev) => ({
                              ...prev,
                              allowedChannels: {
                                ...prev.allowedChannels,
                                voice: !prev.allowedChannels.voice,
                              },
                            }))
                          }
                        >
                          Voice
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Voice Escalation Rules</Label>
                      <Textarea
                        rows={3}
                        value={agentInstructions.voiceEscalationRules}
                        onChange={(e) =>
                          setAgentInstructions((prev) => ({
                            ...prev,
                            voiceEscalationRules: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Industries to Exclude</Label>
                      <Textarea
                        rows={2}
                        value={agentInstructions.excludedIndustries}
                        onChange={(e) =>
                          setAgentInstructions((prev) => ({
                            ...prev,
                            excludedIndustries: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <p className="text-xs text-muted-foreground">
                      These instructions are surfaced in Outreach Campaign,
                      Qualification reasoning, and Workflow for explainability.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        <div>
                          <CardTitle>Voice Agent Script</CardTitle>
                          <CardDescription className="mt-1">
                            Define exactly what the AI voice agent is allowed to say
                            during live calls
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="text-xs">
                          Active
                        </Badge>
                        <Button size="sm" variant="outline">
                          Save Script
                        </Button>
                        <Button size="sm" variant="ghost">
                          Reset to Default (Demo)
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Opening Statement</Label>
                      <Textarea
                        rows={4}
                        placeholder={`Hi {{first_name}}, this is Jazon calling on behalf of {{company_name}}. The reason for my call is to understand how you're currently handling {{pain_point}} and see if it makes sense to explore a conversation further.`}
                        value={voiceScript.opening}
                        onChange={(e) =>
                          setVoiceScript((prev) => ({
                            ...prev,
                            opening: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Use variables: {"{"}first_name{"}"}, {"{"}company_name
                        {"}"}, {"{"}pain_point{"}"}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Qualification Questions</Label>
                      <Textarea
                        rows={5}
                        placeholder={`- How are you currently handling inbound lead qualification?\n- What tools are you using today?\n- Are you evaluating alternatives this quarter?`}
                        value={voiceScript.qualificationQuestions}
                        onChange={(e) =>
                          setVoiceScript((prev) => ({
                            ...prev,
                            qualificationQuestions: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        List key questions to uncover Budget, Authority, Need, and
                        Timeline
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Objection Handling Guidelines</Label>
                      <Textarea
                        rows={4}
                        placeholder={`If the prospect raises concerns about AI accuracy, explain explainability, audit logs, and human override. Do not argue. Offer examples.`}
                        value={voiceScript.objectionHandling}
                        onChange={(e) =>
                          setVoiceScript((prev) => ({
                            ...prev,
                            objectionHandling: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Specify how the AI should respond to common objections
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Disqualification Rules</Label>
                      <Textarea
                        rows={3}
                        placeholder={`Politely exit the call if budget is clearly below $X or authority is not reachable.`}
                        value={voiceScript.disqualificationRules}
                        onChange={(e) =>
                          setVoiceScript((prev) => ({
                            ...prev,
                            disqualificationRules: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Define clear conditions for ending a call early
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Escalation to AE Criteria</Label>
                      <Textarea
                        rows={3}
                        placeholder={`Escalate only when Budget + Authority + Timeline are verbally confirmed.`}
                        value={voiceScript.escalationCriteria}
                        onChange={(e) =>
                          setVoiceScript((prev) => ({
                            ...prev,
                            escalationCriteria: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Specify requirements for AE handoff after voice call
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Compliance & Safety Disclaimer</Label>
                      <Textarea
                        rows={3}
                        placeholder={`This call may be recorded for quality and training purposes. Follow regional compliance rules.`}
                        value={voiceScript.complianceDisclaimer}
                        onChange={(e) =>
                          setVoiceScript((prev) => ({
                            ...prev,
                            complianceDisclaimer: e.target.value,
                          }))
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        Add required legal or regulatory disclosures
                      </p>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-xs text-muted-foreground mb-4">
                        This script is followed verbatim by the AI voice agent and
                        is logged for audit purposes.
                      </p>

                      <div className="flex items-start gap-3">
                        <Switch
                          checked={allowImprovisation}
                          onCheckedChange={setAllowImprovisation}
                          id="improvisation-toggle"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor="improvisation-toggle"
                            className="text-sm font-medium cursor-pointer"
                          >
                            Allow limited AI improvisation within script boundaries
                          </Label>
                          <p className="text-xs text-muted-foreground mt-1">
                            AI may paraphrase but will not change intent or claims.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
