import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ResearchRun from "@/models/ResearchRun";
import ICPScore from "@/models/ICPScore";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignProspect from "@/models/OutreachCampaignProspect";
import OutreachCampaignKnowledgeItem from "@/models/OutreachCampaignKnowledgeItem";
import OutreachStrategyRun from "@/models/OutreachStrategyRun";
import DetectedSignal from "@/models/DetectedSignal";

export const runtime = "nodejs";
export const maxDuration = 300;

const LYXR_AGENT_API_URL =
  "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYXR_API_KEY =
  process.env.LYZR_API_KEY || "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const OUTREACH_STRATEGY_AGENT_ID =
  process.env.OUTREACH_STRATEGY_AGENT_ID || "69453743f6d93e181164e4d0";
const OUTREACH_COPY_AGENT_ID =
  process.env.OUTREACH_COPY_AGENT_ID || "6948162d2be72f04a7d64f65";
const USER_ID = process.env.LYZR_USER_ID || "suyash@lyzr.ai";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function parseFencedJsonOrThrow(raw: unknown, label: string): any {
  // If agent already returned an object, just use it.
  if (raw && typeof raw === "object") return raw;

  const escapeNewlinesInsideStrings = (input: string) => {
    let out = "";
    let inString = false;
    let escaped = false;

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        out += ch;
        escaped = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        out += ch;
        continue;
      }

      // JSON does not allow literal newlines inside string literals.
      if (inString && ch === "\n") {
        out += "\\n";
        continue;
      }
      if (inString && ch === "\r") {
        out += "\\r";
        continue;
      }

      out += ch;
    }

    return out;
  };

  const repairMismatchedBrackets = (input: string) => {
    let out = "";
    const stack: string[] = [];
    let inString = false;
    let escaped = false;

    const pushExpected = (open: string) => {
      if (open === "{") stack.push("}");
      else if (open === "[") stack.push("]");
    };

    const isOpener = (ch: string) => ch === "{" || ch === "[";
    const isCloser = (ch: string) => ch === "}" || ch === "]";

    for (let i = 0; i < input.length; i++) {
      const ch = input[i];

      if (escaped) {
        out += ch;
        escaped = false;
        continue;
      }

      if (ch === "\\") {
        out += ch;
        escaped = true;
        continue;
      }

      if (ch === '"') {
        inString = !inString;
        out += ch;
        continue;
      }

      if (inString) {
        out += ch;
        continue;
      }

      // Outside strings: maintain bracket stack and repair mismatches by inserting expected closers.
      if (isOpener(ch)) {
        pushExpected(ch);
        out += ch;
        continue;
      }

      if (isCloser(ch)) {
        // If the closer doesn't match, prefer REPLACING it with what we expected.
        if (stack.length > 0 && stack[stack.length - 1] !== ch) {
          // Replace mismatched closer with expected closer (do NOT emit the wrong one).
          out += stack.pop();
          continue;
        }
        if (stack.length > 0 && stack[stack.length - 1] === ch) stack.pop();
        out += ch;
        continue;
      }

      out += ch;
    }

    // If still unclosed, close everything at the end.
    while (stack.length > 0) out += stack.pop();
    return out;
  };

  if (typeof raw !== "string") {
    throw new Error(
      `${label}: expected string or object response, got ${typeof raw}`
    );
  }

  // Common Lyzr behavior: markdown fenced JSON in a string.
  const trimmed = raw.trim();

  // If it starts with ```...```, strip outer fences.
  const stripOuterFences = (s: string) =>
    s
      .replace(/^```(?:json)?\s*\n?/i, "")
      .replace(/\n?```\s*$/i, "")
      .trim();

  let candidate = stripOuterFences(trimmed);

  // If still not valid JSON-looking, try extracting a fenced block from anywhere.
  if (!(candidate.startsWith("{") || candidate.startsWith("["))) {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (match?.[1]) {
      candidate = match[1].trim();
    }
  }

  if (!(candidate.startsWith("{") || candidate.startsWith("["))) {
    throw new Error(`${label}: could not locate JSON in agent response`);
  }

  // Agents sometimes include literal newlines inside quoted strings (invalid JSON).
  // Sanitize by escaping \n/\r inside string literals before parsing.
  const sanitized = escapeNewlinesInsideStrings(candidate);
  try {
    return JSON.parse(sanitized);
  } catch (e) {
    // Agents also occasionally mismatch brackets (e.g., close an array with `}`).
    // Best-effort repair: balance brackets outside strings and retry.
    const repaired = repairMismatchedBrackets(sanitized);
    return JSON.parse(repaired);
  }
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id: campaignId } = await params;
    console.log(
      `✅ Database connected for POST /api/outreach-campaigns/${campaignId}/preview-email`
    );

    const body = await request.json();
    const { step_name } = body;

    if (!step_name) {
      return NextResponse.json(
        {
          success: false,
          error: "step_name is required",
        },
        { status: 400 }
      );
    }

    // Load campaign
    const campaign = await OutreachCampaignV2.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 }
      );
    }

    // Load first prospect (by createdAt ascending)
    const firstProspect = await OutreachCampaignProspect.findOne({
      campaign_id: campaignId,
    }).sort({ createdAt: 1 });

    if (!firstProspect) {
      return NextResponse.json(
        {
          success: false,
          error: "No prospects in campaign. Please add at least one lead.",
        },
        { status: 400 }
      );
    }

    const leadId = firstProspect.lead_id;

    // Fetch lead with populated data
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

    // Fetch research run and ICP score
    const researchRun = await ResearchRun.findOne({ lead_id: leadId });
    const icpScore = await ICPScore.findOne({ lead_id: leadId });

    // GUARDRAILS: Research and ICP must exist
    if (!researchRun || !icpScore) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Research and ICP scoring must be completed for this lead before generating copy",
        },
        { status: 400 }
      );
    }

    console.log(
      `📋 Generating preview email for lead: ${lead.name} (ICP: ${icpScore.icp_score})`
    );

    // GUARDRAILS: Check disqualification
    if (
      icpScore.fit_tier === "Disqualified" ||
      icpScore.icp_score < 40
    ) {
      return NextResponse.json(
        {
          success: true,
          status: "NO_OUTREACH",
          reason: "Lead is disqualified or ICP score too low",
        },
        { status: 200 }
      );
    }

    // Fetch detected signals
    const detectedSignals = await DetectedSignal.find({ lead_id: leadId });

    // Check if we have a strategy run, if not, generate one
    let strategyRun = await OutreachStrategyRun.findOne({ lead_id: leadId });
    let strategyOutput: any;

    if (!strategyRun) {
      console.log("🎯 No strategy found, generating new strategy...");

      const strategyInput = {
        lead: {
          name: lead.name,
          title: lead.title,
          email: lead.email,
        },
        company: (lead.company_id as any).toObject(),
        persona: (lead.persona_id as any).toObject(),
        research: researchRun.research_meta,
        icp_score: {
          icp_score: icpScore.icp_score,
          fit_tier: icpScore.fit_tier,
          score_breakdown: icpScore.score_breakdown,
          strengths: icpScore.strengths,
          risks: icpScore.risks,
        },
        detected_signals: detectedSignals.map((s) => s.toObject()),
      };

      const strategySessionId = `strategy-${leadId}-${Date.now()}`;

      const strategyAgentResponse = await fetch(LYXR_AGENT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": LYXR_API_KEY,
        },
        body: JSON.stringify({
          user_id: USER_ID,
          agent_id: OUTREACH_STRATEGY_AGENT_ID,
          session_id: strategySessionId,
          message: JSON.stringify(strategyInput),
        }),
      });

      if (!strategyAgentResponse.ok) {
        const errorText = await strategyAgentResponse.text();
        throw new Error(
          `Strategy Agent API error: ${strategyAgentResponse.status} - ${errorText}`
        );
      }

      const strategyAgentData = await strategyAgentResponse.json();

      try {
        strategyOutput = parseFencedJsonOrThrow(
          strategyAgentData.response,
          "Strategy agent"
        );
      } catch (parseError) {
        console.warn(
          "⚠️ Could not parse strategy response as JSON",
          parseError
        );
        strategyOutput = {
          strategy_status: "ERROR",
          blocking_reason: "Failed to parse agent response",
          raw_response: strategyAgentData.response,
        };
      }

      // Save strategy run for future use
      if (strategyOutput && typeof strategyOutput === "object") {
        strategyRun = await OutreachStrategyRun.create({
          lead_id: leadId,
          research_run_id: researchRun._id,
          icp_score_id: icpScore._id,
          strategy_output: {
            ...strategyOutput,
            strategy_meta: {
              ...strategyOutput.strategy_meta,
              inputs_used: {
                research_run_id: researchRun._id.toString(),
                icp_score_id: icpScore._id.toString(),
              },
            },
          },
        });
      }

      console.log(`✅ Strategy generated (status: ${strategyOutput.strategy_status})`);
    } else {
      strategyOutput = strategyRun.strategy_output;
      console.log(`✅ Using existing strategy (status: ${strategyOutput.strategy_status})`);
    }

    // GUARDRAILS: Check if strategy blocks outreach
    if (strategyOutput.strategy_status === "NO_OUTREACH") {
      return NextResponse.json(
        {
          success: true,
          status: "NO_OUTREACH",
          reason: strategyOutput.reason || "Strategy determined no outreach",
        },
        { status: 200 }
      );
    }

    // Fetch campaign knowledge items
    const knowledgeItems = await OutreachCampaignKnowledgeItem.find({
      campaign_id: campaignId,
    });

    // Find the step template
    const stepTemplate = campaign.templates.email_steps.find(
      (s) => s.step_name === step_name
    );

    // Ensure strategyRun exists
    if (!strategyRun) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate or retrieve strategy",
        },
        { status: 500 }
      );
    }

    // Build the copy agent input
    const copyInput = {
      lead: {
        name: lead.name,
        title: lead.title,
        email: lead.email,
      },
      company: (lead.company_id as any).toObject(),
      persona: (lead.persona_id as any).toObject(),
      research: researchRun.research_meta,
      icp_score: {
        icp_score: icpScore.icp_score,
        fit_tier: icpScore.fit_tier,
      },
      strategy: strategyOutput,
      strategy_run_id: strategyRun._id.toString(),
      knowledge_base: knowledgeItems.map((item) => ({
        type: item.type,
        url: item.url,
        url_title: item.url_title,
        note_title: item.note_title,
        note_content: item.note_content,
      })),
      ui_copy_inputs: {
        construct_instructions: stepTemplate?.construct_instructions || campaign.instructions.construct,
        format_instructions: stepTemplate?.format_instructions || campaign.instructions.format,
        email_template: stepTemplate?.template || "",
        step_name: step_name,
      },
      agent_profile: campaign.agentProfile,
    };

    console.log("✍️ Calling Outreach Copy Agent...");

    const copySessionId = `copy-preview-${leadId}-${Date.now()}`;

    const copyAgentResponse = await fetch(LYXR_AGENT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": LYXR_API_KEY,
      },
      body: JSON.stringify({
        user_id: USER_ID,
        agent_id: OUTREACH_COPY_AGENT_ID,
        session_id: copySessionId,
        message: JSON.stringify(copyInput),
      }),
    });

    if (!copyAgentResponse.ok) {
      const errorText = await copyAgentResponse.text();
      throw new Error(
        `Copy Agent API error: ${copyAgentResponse.status} - ${errorText}`
      );
    }

    const copyAgentData = await copyAgentResponse.json();

    let copyOutput;
    try {
      copyOutput = parseFencedJsonOrThrow(copyAgentData.response, "Copy agent");
    } catch (parseError) {
      console.warn(
        "⚠️ Could not parse copy response as JSON",
        parseError
      );
      copyOutput = {
        status: "ERROR",
        drafts: [],
        raw_response: copyAgentData.response,
      };
    }

    console.log("✅ Copy agent response parsed");

    return NextResponse.json(
      {
        success: true,
        lead_name: lead.name,
        lead_company: (lead.company_id as any)?.name || "Unknown",
        copy_output: copyOutput,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: error instanceof Error ? error.message : "An unexpected error occurred",
      },
      { status: 500 }
    );
  }
}
