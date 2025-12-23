// Shared lead UI mapping functions
// Used by both /leads and /outreach to ensure consistent lead display

export interface LeadRow {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  icpScore: number;
  stage: string;
  channel: string;
  status: string;
  lastContact: string;
  aiRecommendation: string;
  industry: string;
  companySize: string;
  triggers: string[];
  source: string;
  ingestedAt: string;
  importedBy: string;
  originTrigger: string;
  _dbLead?: any; // Full DB object reference for detailed views
}

/**
 * Maps enriched database lead (from /api/leads) to UI LeadRow format
 */
export function dbLeadToLeadRow(enrichedLead: any): LeadRow {
  return {
    id: enrichedLead._id,
    name: enrichedLead.name,
    email: enrichedLead.email || "N/A",
    company: enrichedLead.company?.name || "Unknown",
    title: enrichedLead.title,
    icpScore: enrichedLead.icp_score?.icp_score || 0,
    stage: "Qualification", // All DB leads shown are icp_scored
    channel: "Email",
    status: "Active",
    lastContact: "Not contacted yet",
    aiRecommendation: enrichedLead.icp_score?.strengths?.[0] || "Processing...",
    industry: enrichedLead.company?.industry || "Unknown",
    companySize: enrichedLead.company?.company_size?.employee_count 
      ? `${enrichedLead.company.company_size.employee_count.toLocaleString()} employees`
      : "Unknown",
    triggers: enrichedLead.detected_signals?.map((s: any) => s.signal) || [],
    source: enrichedLead.source || "CSV",
    ingestedAt: new Date(enrichedLead.createdAt).toLocaleDateString(),
    importedBy: "CSV Upload",
    originTrigger: "CSV upload from Setup page",
    _dbLead: enrichedLead, // Keep full reference
  };
}

/**
 * Maps mock lead (from app-context) to UI LeadRow format
 */
export function mockLeadToLeadRow(mockLead: any): LeadRow {
  return {
    id: mockLead.id,
    name: mockLead.name,
    email: mockLead.email || "N/A",
    company: mockLead.company,
    title: mockLead.title,
    icpScore: mockLead.icpScore,
    stage: mockLead.stage,
    channel: mockLead.channel,
    status: mockLead.status,
    lastContact: mockLead.lastContact,
    aiRecommendation: mockLead.aiRecommendation,
    industry: mockLead.industry,
    companySize: mockLead.companySize,
    triggers: mockLead.triggers || [],
    source: mockLead.source || "Mock",
    ingestedAt: mockLead.ingestedAt || new Date().toLocaleDateString(),
    importedBy: mockLead.importedBy || "System",
    originTrigger: mockLead.originTrigger || "Mock data",
    _dbLead: null, // Mock leads don't have DB object
  };
}

/**
 * Get ICP score color class
 */
export function getIcpScoreColor(score: number): string {
  if (score >= 85) return "text-chart-2";
  if (score >= 70) return "text-chart-4";
  return "text-muted-foreground";
}

/**
 * Get ICP score background class
 */
export function getIcpScoreBg(score: number): string {
  if (score >= 85) return "bg-chart-2/10";
  if (score >= 70) return "bg-chart-4/10";
  return "bg-muted";
}

/**
 * Get ICP score label
 */
export function getIcpScoreLabel(score: number): string {
  if (score >= 85) return "High fit";
  if (score >= 70) return "Medium fit";
  return "Low fit";
}

/**
 * Get stage badge variant color
 */
export function getStageColor(stage: string): "default" | "secondary" | "outline" {
  switch (stage) {
    case "Qualification": return "default";
    case "Meeting Scheduled": return "default";
    case "Engaged": return "secondary";
    case "Disqualified": return "outline";
    default: return "outline";
  }
}

/**
 * Get stage explanation for tooltip
 */
export function getStageExplanation(stage: string): string {
  switch (stage) {
    case "Research": return "AI validating ICP fit before initiating outreach";
    case "Engaged": return "AI nurturing with multi-channel sequence";
    case "Qualification": return "AI validating BANT signals (Need, Authority, Timeline, Budget)";
    case "Meeting Scheduled": return "Fully qualified - AI prepared AE handoff";
    case "Disqualified": return "AI determined low fit - saved AE time";
    default: return "AI processing lead";
  }
}

