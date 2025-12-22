import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Company from "@/models/Company";
import ICPScore from "@/models/ICPScore";
import OutreachCampaign from "@/models/OutreachCampaign";
import OutreachStrategyRun from "@/models/OutreachStrategyRun";
import OutreachCopyRun from "@/models/OutreachCopyRun";
import OutreachEvent from "@/models/OutreachEvent";
import OutreachGuardrails from "@/models/OutreachGuardrails";
import FieldOverride from "@/models/FieldOverride";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Helper to merge overrides into an object
function applyOverrides(
  baseObject: any,
  overrides: Record<string, any>
): any {
  const result = JSON.parse(JSON.stringify(baseObject)); // Deep clone
  
  for (const [path, value] of Object.entries(overrides)) {
    const parts = path.split(/[\[\]\.]+/).filter(Boolean);
    let current = result;
    
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const nextPart = parts[i + 1];
      
      if (!current[part]) {
        current[part] = isNaN(Number(nextPart)) ? {} : [];
      }
      current = current[part];
    }
    
    current[parts[parts.length - 1]] = value;
  }
  
  return result;
}

// Helper to parse JSON that might be wrapped in markdown code fences
function parseMarkdownJSON(data: any): any {
  if (!data) return data;
  
  // If it's already a proper object (not a string), return as-is
  if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
    // Check if it has expected properties or if it's already parsed
    if (data.drafts || data.recommended_channel_sequence || data.status || data.strategy_status) {
      return data;
    }
  }
  
  // If it's a string, try to clean and parse it
  if (typeof data === 'string') {
    try {
      // Strip markdown code fences
      let cleaned = data.trim();
      cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "");
      cleaned = cleaned.replace(/\n?```\s*$/i, "");
      cleaned = cleaned.trim();
      
      // Only parse if it looks like JSON
      if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
        return JSON.parse(cleaned);
      }
    } catch (e) {
      console.warn("Could not parse markdown JSON:", e);
      return data;
    }
  }
  
  return data;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(`✅ Database connected for GET /api/leads/${id}/outreach`);

    const leadId = id;

    // Fetch lead with company and ICP score
    const lead = await Lead.findById(leadId)
      .populate("company_id")
      .populate("persona_id");

    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
        },
        { status: 404 }
      );
    }

    const company = lead.company_id as any;
    const icpScore = await ICPScore.findOne({ lead_id: leadId });

    // Fetch or create campaign
    let campaign = await OutreachCampaign.findOne({ lead_id: leadId });
    if (!campaign) {
      campaign = await OutreachCampaign.create({ lead_id: leadId });
    }

    // Fetch latest strategy run
    const strategyRun = await OutreachStrategyRun.findOne({ lead_id: leadId })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch latest copy run
    const copyRun = await OutreachCopyRun.findOne({ lead_id: leadId })
      .sort({ createdAt: -1 })
      .limit(1);

    // Fetch all events
    const events = await OutreachEvent.find({ lead_id: leadId }).sort({
      sort_order: 1,
    });

    // Fetch guardrails (lead-specific or global)
    const guardrails = await (OutreachGuardrails as any).getForLead(leadId);

    // Fetch overrides for strategy, copy, campaign, and guardrails
    const campaignOverrides = await (FieldOverride as any).getOverridesForEntity(
      "outreach_campaign",
      campaign._id
    );
    const strategyOverrides = strategyRun
      ? await (FieldOverride as any).getOverridesForEntity(
          "outreach_strategy",
          strategyRun._id
        )
      : {};
    const copyOverrides = copyRun
      ? await (FieldOverride as any).getOverridesForEntity(
          "outreach_copy",
          copyRun._id
        )
      : {};
    const guardrailsOverrides = await (
      FieldOverride as any
    ).getOverridesForEntity("outreach_guardrails", guardrails._id);

    // Apply overrides (manual always wins)
    const effectiveCampaign = applyOverrides(campaign.toObject(), campaignOverrides);
    
    // Parse strategy and copy outputs (in case they contain markdown-wrapped JSON from old data)
    console.log("🔍 Raw strategy_output type:", typeof strategyRun?.strategy_output);
    console.log("🔍 Raw strategy_output preview:", JSON.stringify(strategyRun?.strategy_output).substring(0, 100));
    console.log("🔍 Raw copy_output type:", typeof copyRun?.copy_output);
    console.log("🔍 Raw copy_output preview:", JSON.stringify(copyRun?.copy_output).substring(0, 100));
    
    const parsedStrategyOutput = strategyRun 
      ? parseMarkdownJSON(strategyRun.strategy_output)
      : null;
    const parsedCopyOutput = copyRun
      ? parseMarkdownJSON(copyRun.copy_output)
      : null;
    
    console.log("✅ Parsed strategy has drafts?", !!parsedStrategyOutput?.recommended_channel_sequence);
    console.log("✅ Parsed copy has drafts?", !!parsedCopyOutput?.drafts, "Count:", parsedCopyOutput?.drafts?.length);
    
    const effectiveStrategy = parsedStrategyOutput && strategyRun
      ? { ...applyOverrides(parsedStrategyOutput, strategyOverrides), _id: strategyRun._id }
      : null;
    const effectiveCopy = parsedCopyOutput && copyRun
      ? { ...applyOverrides(parsedCopyOutput, copyOverrides), _id: copyRun._id }
      : null;
    const effectiveGuardrails = applyOverrides(
      guardrails.toObject(),
      guardrailsOverrides
    );

    // Build response
    const response = {
      success: true,
      data: {
        lead: {
          _id: lead._id,
          name: lead.name,
          title: lead.title,
          email: lead.email,
          company: {
            name: company?.name || "Unknown",
          },
          icp_score: icpScore
            ? {
                icp_score: icpScore.icp_score,
                fit_tier: icpScore.fit_tier,
              }
            : null,
        },
        campaign: effectiveCampaign,
        strategy: effectiveStrategy,
        copy: effectiveCopy,
        events: events.map((e) => ({
          id: e._id,
          eventType: e.event_type,
          timestamp: e.timestamp,
          actor: e.actor,
          title: e.title,
          description: e.summary,
          badge: e.badge,
          channel: e.channel,
          direction: e.direction,
          content: e.content,
          metadata: e.metadata,
        })),
        guardrails: effectiveGuardrails,
      },
    };

    console.log(
      `✅ Retrieved outreach data for lead ${leadId} with ${events.length} events`
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error.message || "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}

