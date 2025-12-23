// Shared Leads Table Component
// Used by both /leads and /outreach to ensure consistent lead display

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Search,
  Database,
  Upload,
  ArrowUpDown,
  Mail,
  Phone,
  MessageSquare,
  HelpCircle,
  Clock,
} from "lucide-react";
import {
  LeadRow,
  getIcpScoreColor,
  getIcpScoreBg,
  getIcpScoreLabel,
  getStageColor,
  getStageExplanation,
} from "@/lib/lead-ui";

interface LeadsTableProps {
  leads: LeadRow[];
  onRowClick: (leadId: string) => void;
  extraColumns?: {
    headers: React.ReactNode[];
    renderCells: (lead: LeadRow) => React.ReactNode[];
  };
}

const getChannelIcon = (channel: string) => {
  if (channel.includes("Email")) return <Mail className="w-3 h-3" />;
  if (channel.includes("Voice")) return <Phone className="w-3 h-3" />;
  if (channel.includes("LinkedIn")) return <MessageSquare className="w-3 h-3" />;
  return <Mail className="w-3 h-3" />;
};

export function LeadsTable({ leads, onRowClick, extraColumns }: LeadsTableProps) {
  return (
    <div className="overflow-x-auto w-full" style={{ maxWidth: "calc(100vw - var(--sidebar-width) - 2rem)" }}>
      <TooltipProvider>
        <Table className="min-w-max">
          <TableHeader>
            <TableRow>
              <TableHead>Lead</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  ICP Score
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </TableHead>
              <TableHead>Stage</TableHead>
              <TableHead>Lead Source</TableHead>
              <TableHead>Ingestion Date</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Last Contact</TableHead>
              {extraColumns?.headers}
              <TableHead className="font-semibold">
                <div className="flex items-center gap-1.5">
                  AI Recommendation
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Hover over recommendations to see why Jazon made this decision</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow 
                key={lead.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onRowClick(lead.id)}
              >
                <TableCell>
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-xs text-muted-foreground">{lead.title}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{lead.company}</p>
                    <p className="text-xs text-muted-foreground">{lead.industry}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex flex-col items-center gap-1">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${getIcpScoreBg(lead.icpScore)}`}>
                          <span className={`text-lg font-bold ${getIcpScoreColor(lead.icpScore)}`}>
                            {lead.icpScore}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {getIcpScoreLabel(lead.icpScore)}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {lead.icpScore >= 85 ? "High fit" : lead.icpScore >= 70 ? "Medium fit" : "Low fit"} - {lead.icpScore}/100 ICP score
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={getStageColor(lead.stage)} className="cursor-help">
                        {lead.stage}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{getStageExplanation(lead.stage)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {lead.source === "Apollo" && <Search className="w-3.5 h-3.5 text-chart-3" />}
                    {lead.source === "Salesforce" && <Database className="w-3.5 h-3.5 text-primary" />}
                    {lead.source === "HubSpot" && <Database className="w-3.5 h-3.5 text-chart-2" />}
                    {lead.source === "CSV" && <Upload className="w-3.5 h-3.5 text-muted-foreground" />}
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      {lead.source}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{lead.ingestedAt}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    {getChannelIcon(lead.channel)}
                    <span className="text-sm text-muted-foreground">{lead.channel}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{lead.lastContact}</span>
                  </div>
                </TableCell>
                {extraColumns && extraColumns.renderCells(lead)}
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="max-w-xs cursor-help">
                        <p className="text-sm font-medium line-clamp-2">
                          {lead.aiRecommendation}
                        </p>
                        {lead.triggers && lead.triggers.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {lead.triggers.slice(0, 2).map((trigger: string, i: number) => (
                              <Badge key={i} variant="secondary" className="text-[10px] px-1 py-0">
                                {trigger}
                              </Badge>
                            ))}
                            {lead.triggers.length > 2 && (
                              <Badge variant="secondary" className="text-[10px] px-1 py-0">
                                +{lead.triggers.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-sm">
                      <div className="space-y-2">
                        <p className="font-medium">AI Reasoning:</p>
                        <p>{lead.aiRecommendation}</p>
                        {lead.triggers && lead.triggers.length > 0 && (
                          <>
                            <p className="font-medium mt-2">Detected Signals:</p>
                            <ul className="text-xs space-y-1">
                              {lead.triggers.map((trigger: string, i: number) => (
                                <li key={i}>• {trigger}</li>
                              ))}
                            </ul>
                          </>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
    </div>
  );
}

