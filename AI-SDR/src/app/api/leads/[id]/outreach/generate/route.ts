import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import ResearchRun from "@/models/ResearchRun";
import ICPScore from "@/models/ICPScore";
import OutreachCampaign from "@/models/OutreachCampaign";
import OutreachStrategyRun from "@/models/OutreachStrategyRun";
import OutreachCopyRun from "@/models/OutreachCopyRun";
import OutreachEvent from "@/models/OutreachEvent";
import DetectedSignal from "@/models/DetectedSignal";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";
export const maxDuration = 300;

const LYXR_AGENT_API_URL =
  "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYXR_API_KEY = process.env.LYZR_API_KEY || "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const OUTREACH_STRATEGY_AGENT_ID = process.env.OUTREACH_STRATEGY_AGENT_ID || "69453743f6d93e181164e4d0";
const OUTREACH_COPY_AGENT_ID = process.env.OUTREACH_COPY_AGENT_ID || "6948162d2be72f04a7d64f65";
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

      if (ch === "\"") {
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
      let ch = input[i];

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

      if (ch === "\"") {
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
    const { id } = await params;
    console.log(
      `✅ Database connected for POST /api/leads/${id}/outreach/generate`
    );

    const leadId = id;

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

    if (!researchRun || !icpScore) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Research and ICP scoring must be completed before generating outreach",
        },
        { status: 400 }
      );
    }

    console.log(
      `📋 Generating outreach for lead: ${lead.name} (ICP: ${icpScore.icp_score})`
    );

    // Step 1: Call Outreach Strategy Agent
    console.log("🎯 Calling Outreach Strategy Agent...");

    // Fetch detected signals
    const detectedSignals = await DetectedSignal.find({ lead_id: leadId });

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

    // Generate unique session ID for this strategy run
    const strategySessionId = `strategy-${leadId}-${Date.now()}`;

    // Call Lyzr API
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

    // Parse the strategy response (strip markdown code fences if present)
    let strategyOutput;
    try {
      strategyOutput = parseFencedJsonOrThrow(
        strategyAgentData.response,
        "Strategy agent"
      );
    } catch (parseError) {
      console.warn(
        "⚠️ Could not parse strategy response as JSON, using raw response",
        parseError
      );
      strategyOutput = {
        strategy_status: "ERROR",
        blocking_reason: "Failed to parse agent response",
        raw_response: strategyAgentData.response,
      };
    }

    // Save strategy response to JSON file (for debugging)
    const outputDir = path.join(process.cwd(), "output");
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const strategyFileName = `outreach-strategy-agent-response-${leadId}-${timestamp}.json`;
    const strategyFilePath = path.join(outputDir, strategyFileName);

    fs.writeFileSync(
      strategyFilePath,
      JSON.stringify(
        {
          leadId: leadId,
          leadName: lead.name,
          leadCompany: (lead.company_id as any)?.name || "Unknown",
          timestamp: new Date().toISOString(),
          agentResponse: strategyAgentData,
          parsedStrategyData: strategyOutput,
          strategyInput: strategyInput,
        },
        null,
        2
      ),
      "utf-8"
    );

    console.log(`💾 Strategy response saved to: ${strategyFilePath}`);

    console.log("📊 Parsed Strategy Output:", JSON.stringify(strategyOutput, null, 2));

    // Save strategy run
    if (!strategyOutput || typeof strategyOutput !== "object") {
      throw new Error(
        "Strategy output is not an object after parsing; refusing to persist invalid strategy_output"
      );
    }

    const strategyRun = await OutreachStrategyRun.create({
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

    console.log(
      `✅ Outreach Strategy saved (status: ${strategyOutput.strategy_status})`
    );

    // Check if strategy blocks outreach
    if (strategyOutput.strategy_status === "NO_OUTREACH") {
      // Update campaign to reflect no outreach
      await OutreachCampaign.findOneAndUpdate(
        { lead_id: leadId },
        {
          status: "disqualified",
          final_decision: {
            status: "No outreach",
            reason: strategyOutput.reason || "Strategy determined no outreach",
          },
        },
        { upsert: true }
      );

      return NextResponse.json(
        {
          success: true,
          message: "Strategy generated but no outreach recommended",
          strategy_status: "NO_OUTREACH",
          reason: strategyOutput.reason,
        },
        { status: 200 }
      );
    }

    // Step 2: Call Outreach Copy Agent
    console.log("✍️ Calling Outreach Copy Agent...");

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
    };

    // Generate unique session ID for this copy run
    const copySessionId = `copy-${leadId}-${Date.now()}`;

    // Call Lyzr API
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

    // Parse the copy response (strip markdown code fences if present)
    let copyOutput;
    try {
      copyOutput = parseFencedJsonOrThrow(copyAgentData.response, "Copy agent");
    } catch (parseError) {
      console.warn(
        "⚠️ Could not parse copy response as JSON, using raw response",
        parseError
      );
      copyOutput = {
        status: "ERROR",
        drafts: [],
        raw_response: copyAgentData.response,
      };
    }

    // Save copy response to JSON file (for debugging)
    const copyTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const copyFileName = `outreach-copy-agent-response-${leadId}-${copyTimestamp}.json`;
    const copyFilePath = path.join(outputDir, copyFileName);

    fs.writeFileSync(
      copyFilePath,
      JSON.stringify(
        {
          leadId: leadId,
          leadName: lead.name,
          leadCompany: (lead.company_id as any)?.name || "Unknown",
          timestamp: new Date().toISOString(),
          agentResponse: copyAgentData,
          parsedCopyData: copyOutput,
          copyInput: copyInput,
          strategyRunId: strategyRun._id.toString(),
        },
        null,
        2
      ),
      "utf-8"
    );

    console.log(`💾 Copy response saved to: ${copyFilePath}`);

    console.log("📊 Parsed Copy Output:", JSON.stringify(copyOutput, null, 2));

    // Save copy run
    if (!copyOutput || typeof copyOutput !== "object") {
      throw new Error(
        "Copy output is not an object after parsing; refusing to persist invalid copy_output"
      );
    }

    const copyRun = await OutreachCopyRun.create({
      lead_id: leadId,
      strategy_run_id: strategyRun._id,
      copy_output: {
        ...copyOutput,
        copy_meta: {
          ...copyOutput.copy_meta,
          strategy_run_id: strategyRun._id.toString(),
        },
      },
    });

    console.log(`✅ Outreach Copy saved (status: ${copyOutput.status})`);

    // Step 3: Update campaign
    const totalSteps =
      strategyOutput.recommended_channel_sequence?.length || 0;
    const firstStep = strategyOutput.recommended_channel_sequence?.[0];

    await OutreachCampaign.findOneAndUpdate(
      { lead_id: leadId },
      {
        status: "active",
        current_phase: "Engagement",
        current_step_number: 1,
        next_planned_action: {
          label: firstStep?.goal || "Start outreach",
          scheduled_at: firstStep?.recommended_delay_hours
            ? new Date(Date.now() + firstStep.recommended_delay_hours * 3600000)
            : null,
        },
        final_decision: {
          status: "In progress",
          reason: "Outreach strategy generated and ready",
        },
      },
      { upsert: true, new: true }
    );

    // Step 4: Create initial events
    const campaign = await OutreachCampaign.findOne({ lead_id: leadId });
    
    // Get current max sort_order
    const lastEvent = await OutreachEvent.findOne({ lead_id: leadId }).sort({
      sort_order: -1,
    });
    let sortOrder = (lastEvent?.sort_order || 0) + 1;

    // Event: Strategy generated
    await OutreachEvent.create({
      lead_id: leadId,
      campaign_id: campaign!._id,
      event_type: "decision",
      actor: "AI",
      timestamp: new Date(),
      sort_order: sortOrder++,
      title: "Outreach strategy generated",
      summary: `AI-generated ${totalSteps}-step outreach strategy with channels: ${strategyOutput.recommended_channel_sequence
        ?.map((s: any) => s.channel)
        .join(", ")}. Strategy confidence: ${strategyOutput.confidence_level}.`,
      badge: "AI Decision",
      metadata: {
        strategy_run_id: strategyRun._id,
        total_steps: totalSteps,
        channels: strategyOutput.recommended_channel_sequence?.map(
          (s: any) => s.channel
        ),
        confidence: strategyOutput.confidence_level,
      },
    });

    // Event: Copy generated
    await OutreachEvent.create({
      lead_id: leadId,
      campaign_id: campaign!._id,
      event_type: "outreach",
      actor: "AI",
      timestamp: new Date(),
      sort_order: sortOrder++,
      title: "Outreach copy generated",
      summary: `AI-generated personalized copy for ${copyOutput.drafts?.length || 0} outreach steps. Copy confidence: ${copyOutput.confidence_level}.`,
      badge: "Outreach Prepared",
      metadata: {
        copy_run_id: copyRun._id,
        drafts_count: copyOutput.drafts?.length || 0,
        confidence: copyOutput.confidence_level,
      },
    });

    // Event: Outreach ready to start
    await OutreachEvent.create({
      lead_id: leadId,
      campaign_id: campaign!._id,
      event_type: "lifecycle",
      actor: "System",
      timestamp: new Date(),
      sort_order: sortOrder++,
      title: "Outreach campaign ready",
      summary: `Campaign configured and ready to execute. Next step: ${firstStep?.goal || "Begin outreach"}`,
      badge: "Campaign Ready",
      metadata: {
        next_step: firstStep?.goal,
        scheduled_at: campaign!.next_planned_action.scheduled_at,
      },
    });

    console.log(`✅ Outreach campaign generated for lead ${leadId}`);

    return NextResponse.json(
      {
        success: true,
        message: "Outreach strategy and copy generated successfully",
        data: {
          strategy_status: strategyOutput.strategy_status,
          copy_status: copyOutput.status,
          total_steps: totalSteps,
          campaign_status: "active",
        },
      },
      { status: 200 }
    );
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

