"use client"

import { useState, useMemo } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useJazonApp } from "@/context/jazon-app-context"
import { useRouter } from "next/navigation"
import {
  Search,
  Sparkles,
  Filter,
  Database,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Loader2,
  Shield,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react"

// Mock outbound search results
const mockOutboundResults = [
  {
    id: "OB001",
    name: "Alexandra Chen",
    email: "alexandra.chen@capgemini.com",
    company: "Capgemini",
    title: "VP of Sales Operations",
    industry: "IT Services",
    companySize: "10,000+ employees",
    location: "San Francisco, CA",
    icpScore: 89,
    intentSignals: ["Hiring SDR team", "Sales automation evaluation", "Recent LinkedIn engagement"],
    apolloPersonId: "APL-abc123",
  },
  {
    id: "OB002",
    name: "James Rodriguez",
    email: "j.rodriguez@infosys.com",
    company: "Infosys",
    title: "Head of Revenue Operations",
    industry: "IT Services",
    companySize: "10,000+ employees",
    location: "New York, NY",
    icpScore: 92,
    intentSignals: ["Active vendor evaluation", "Budget allocated", "Q1 decision timeline"],
    apolloPersonId: "APL-def456",
  },
  {
    id: "OB003",
    name: "Priya Sharma",
    email: "priya.sharma@wipro.com",
    company: "Wipro",
    title: "Director of Sales Enablement",
    industry: "IT Services",
    companySize: "10,000+ employees",
    location: "Austin, TX",
    icpScore: 85,
    intentSignals: ["Sales process optimization", "RevOps expansion"],
    apolloPersonId: "APL-ghi789",
  },
  {
    id: "OB004",
    name: "Michael Chang",
    email: "m.chang@tcs.com",
    company: "Tata Consultancy Services",
    title: "Chief Revenue Officer",
    industry: "IT Services",
    companySize: "10,000+ employees",
    location: "Chicago, IL",
    icpScore: 78,
    intentSignals: ["Digital transformation initiative"],
    apolloPersonId: "APL-jkl012",
  },
]

export default function OutboundLeadsPage() {
  const { leads, setLeads } = useJazonApp()
  const router = useRouter()
  const [aiSearchQuery, setAiSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<typeof mockOutboundResults>([])
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())
  const [isIngesting, setIsIngesting] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  
  // Advanced filters
  const [filterIndustry, setFilterIndustry] = useState<string>("all")
  const [filterCompanySize, setFilterCompanySize] = useState<string>("all")
  const [filterLocation, setFilterLocation] = useState<string>("all")
  const [minIcpScore, setMinIcpScore] = useState<number>(70)

  // Demo: Check if Apollo is connected (in real app, this would come from context/state)
  const apolloConnected = true // For demo purposes

  const handleSearch = () => {
    if (!aiSearchQuery.trim()) return
    if (!apolloConnected) return

    setIsSearching(true)
    // Simulate AI search
    setTimeout(() => {
      setSearchResults(mockOutboundResults)
      setIsSearching(false)
    }, 2000)
  }

  const toggleResultSelection = (resultId: string) => {
    const newSelected = new Set(selectedResults)
    if (newSelected.has(resultId)) {
      newSelected.delete(resultId)
    } else {
      newSelected.add(resultId)
    }
    setSelectedResults(newSelected)
  }

  const handleIngestSelected = () => {
    if (selectedResults.size === 0) return

    setIsIngesting(true)
    // Simulate ingestion
    setTimeout(() => {
      const newLeads = Array.from(selectedResults).map((resultId) => {
        const result = searchResults.find((r) => r.id === resultId)!
        return {
          id: `APOLLO-${Date.now()}-${resultId}`,
          name: result.name,
          email: result.email,
          company: result.company,
          title: result.title,
          icpScore: result.icpScore,
          stage: "Research",
          channel: "Email",
          status: "Active",
          lastContact: "Not contacted yet",
          aiRecommendation: "Validate ICP fit before outreach",
          industry: result.industry,
          companySize: result.companySize,
          triggers: result.intentSignals,
          source: "Apollo",
          ingestedAt: "Just now",
          importedBy: "Outbound Discovery",
          originTrigger: `Apollo outbound search: ${aiSearchQuery}`,
          sourceMetadata: {
            apolloListName: "Outbound Discovery",
            apolloPersonId: result.apolloPersonId,
          },
        }
      })

      setLeads((prev) => [...prev, ...newLeads])
      setIsIngesting(false)
      setSelectedResults(new Set())
      setSearchResults([])
      setAiSearchQuery("")
      
      // Navigate to All Leads to see the ingested leads
      router.push("/leads")
    }, 1500)
  }

  const filteredResults = useMemo(() => {
    return searchResults.filter((result) => {
      if (filterIndustry !== "all" && result.industry !== filterIndustry) return false
      if (filterCompanySize !== "all" && result.companySize !== filterCompanySize) return false
      if (result.icpScore < minIcpScore) return false
      return true
    })
  }, [searchResults, filterIndustry, filterCompanySize, minIcpScore])

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
          <div className="flex flex-1 flex-col gap-6 p-4 md:gap-8 md:p-6">
            {/* Page Header */}
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold text-foreground">Outbound Leads</h1>
              <p className="text-sm text-muted-foreground">
                Discover new outbound prospects using AI, powered by Apollo.io
              </p>
            </div>

            {/* Enterprise Guardrail Banner */}
            <Alert className="border-chart-3/30 bg-chart-3/5">
              <Shield className="h-4 w-4 text-chart-3" />
              <AlertDescription className="text-sm">
                <strong>Outbound discovery powered by Apollo.io.</strong> Outreach executed by Jazon.
                Apollo is read-only. All messaging, logging, and compliance are managed by Jazon.
              </AlertDescription>
            </Alert>

            {/* Apollo Connection Status */}
            {!apolloConnected && (
              <Card className="border-destructive/30 bg-destructive/5">
                <CardContent className="py-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">Apollo.io Not Connected</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Connect Apollo in Setup → Lead Sources to enable outbound lead discovery.
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push("/setup")}
                      >
                        Go to Setup
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Search Section */}
            {apolloConnected && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI-Powered Search
                  </CardTitle>
                  <CardDescription>
                    Describe your ideal prospect in natural language. Jazon will search Apollo and
                    return qualified leads with ICP scores and intent signals.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Search Query</Label>
                    <Textarea
                      placeholder="e.g., 'VP of Sales Operations at enterprise IT services companies evaluating sales automation tools'"
                      rows={3}
                      value={aiSearchQuery}
                      onChange={(e) => setAiSearchQuery(e.target.value)}
                      disabled={isSearching}
                    />
                    <p className="text-xs text-muted-foreground">
                      Be specific about role, company size, industry, and buying signals for best
                      results.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleSearch}
                      disabled={!aiSearchQuery.trim() || isSearching}
                      className="gap-2"
                    >
                      {isSearching ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Searching Apollo...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4" />
                          Search Apollo
                        </>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                    </Button>
                  </div>

                  {/* Advanced Filters */}
                  {showAdvancedFilters && (
                    <div className="border rounded-lg p-4 space-y-4 bg-muted/30">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Industry</Label>
                          <Select value={filterIndustry} onValueChange={setFilterIndustry}>
                            <SelectTrigger>
                              <SelectValue placeholder="All industries" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Industries</SelectItem>
                              <SelectItem value="IT Services">IT Services</SelectItem>
                              <SelectItem value="Professional Services">Professional Services</SelectItem>
                              <SelectItem value="Technology Consulting">Technology Consulting</SelectItem>
                              <SelectItem value="Software">Software</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Company Size</Label>
                          <Select value={filterCompanySize} onValueChange={setFilterCompanySize}>
                            <SelectTrigger>
                              <SelectValue placeholder="All sizes" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Sizes</SelectItem>
                              <SelectItem value="10,000+ employees">10,000+ employees</SelectItem>
                              <SelectItem value="5,000-10,000 employees">5,000-10,000 employees</SelectItem>
                              <SelectItem value="1,000-5,000 employees">1,000-5,000 employees</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Minimum ICP Score</Label>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={minIcpScore}
                            onChange={(e) => setMinIcpScore(Number(e.target.value))}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Search Results</CardTitle>
                      <CardDescription>
                        {filteredResults.length} prospect{filteredResults.length !== 1 ? "s" : ""} found
                        {selectedResults.size > 0 && ` • ${selectedResults.size} selected`}
                      </CardDescription>
                    </div>
                    {selectedResults.size > 0 && (
                      <Button
                        onClick={handleIngestSelected}
                        disabled={isIngesting}
                        className="gap-2"
                      >
                        {isIngesting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Ingesting...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-4 h-4" />
                            Ingest {selectedResults.size} Lead{selectedResults.size !== 1 ? "s" : ""}
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">
                            <input
                              type="checkbox"
                              checked={filteredResults.length > 0 && selectedResults.size === filteredResults.length}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedResults(new Set(filteredResults.map((r) => r.id)))
                                } else {
                                  setSelectedResults(new Set())
                                }
                              }}
                              className="rounded border-border"
                            />
                          </TableHead>
                          <TableHead>Prospect</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>ICP Score</TableHead>
                          <TableHead>Intent Signals</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredResults.map((result) => (
                          <TableRow key={result.id}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={selectedResults.has(result.id)}
                                onChange={() => toggleResultSelection(result.id)}
                                className="rounded border-border"
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{result.name}</p>
                                <p className="text-xs text-muted-foreground">{result.title}</p>
                                <p className="text-xs text-muted-foreground">{result.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{result.company}</p>
                                <p className="text-xs text-muted-foreground">{result.industry}</p>
                                <p className="text-xs text-muted-foreground">{result.location}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex flex-col items-center gap-1">
                                      <div
                                        className={`flex items-center justify-center w-12 h-12 rounded-lg ${
                                          result.icpScore >= 85
                                            ? "bg-chart-2/10"
                                            : result.icpScore >= 70
                                            ? "bg-chart-4/10"
                                            : "bg-muted"
                                        }`}
                                      >
                                        <span
                                          className={`text-lg font-bold ${
                                            result.icpScore >= 85
                                              ? "text-chart-2"
                                              : result.icpScore >= 70
                                              ? "text-chart-4"
                                              : "text-muted-foreground"
                                          }`}
                                        >
                                          {result.icpScore}
                                        </span>
                                      </div>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {result.icpScore >= 85 ? "High fit" : result.icpScore >= 70 ? "Medium fit" : "Low fit"}
                                      </Badge>
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>ICP score calculated from company size, industry, role, and intent signals</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1.5">
                                {result.intentSignals.map((signal, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {signal}
                                  </Badge>
                                ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredResults.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No results match your filters. Try adjusting your criteria.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* How It Works */}
            {apolloConnected && searchResults.length === 0 && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-sm">How Outbound Discovery Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Search className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">1. Search</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Describe your ideal prospect in natural language
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">2. AI Analysis</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Jazon searches Apollo and calculates ICP scores
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <TrendingUp className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">3. Review</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Review prospects with ICP scores and intent signals
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium">4. Ingest</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Selected leads flow into Research & ICP automatically
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

