import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import OutreachCampaign from "@/models/OutreachCampaign";
import OutreachEvent from "@/models/OutreachEvent";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for POST /api/leads/${id}/outreach/control`
    );

    const leadId = id;
    const body = await request.json();
    const { action, reason } = body;

    if (!action) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required field: action",
        },
        { status: 400 }
      );
    }

    // Validate action
    const validActions = ["pause", "stop", "force_voice", "send_to_ae"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Must be one of: ${validActions.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // Validate lead exists
    const lead = await Lead.findById(leadId);
    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
        },
        { status: 404 }
      );
    }

    // Fetch or create campaign
    let campaign = await OutreachCampaign.findOne({ lead_id: leadId });
    if (!campaign) {
      campaign = await OutreachCampaign.create({ lead_id: leadId });
    }

    // Execute action
    let newStatus = campaign.status;
    let eventTitle = "";
    let eventSummary = "";

    switch (action) {
      case "pause":
        newStatus = "paused";
        eventTitle = "Outreach paused by user";
        eventSummary = `All scheduled outreach actions paused. ${reason ? `Reason: ${reason}` : ""}`;
        break;

      case "stop":
        newStatus = "stopped";
        eventTitle = "Outreach stopped by user";
        eventSummary = `All outreach stopped and scheduled actions cancelled. ${reason ? `Reason: ${reason}` : ""}`;
        break;

      case "force_voice":
        eventTitle = "Voice escalation forced by user";
        eventSummary = `User manually triggered voice escalation for next touch. ${reason ? `Reason: ${reason}` : ""}`;
        // Don't change campaign status, just log event
        break;

      case "send_to_ae":
        eventTitle = "Sent to AE for review";
        eventSummary = `Lead manually sent to AE for review. ${reason ? `Reason: ${reason}` : ""}`;
        break;
    }

    // Update campaign if status changed
    if (newStatus !== campaign.status) {
      await OutreachCampaign.findByIdAndUpdate(campaign._id, {
        status: newStatus,
      });
    }

    // Log control action event
    const lastEvent = await OutreachEvent.findOne({ lead_id: leadId }).sort({
      sort_order: -1,
    });
    const sortOrder = (lastEvent?.sort_order || 0) + 1;

    await OutreachEvent.create({
      lead_id: leadId,
      campaign_id: campaign._id,
      event_type: "decision",
      actor: "Human",
      timestamp: new Date(),
      sort_order: sortOrder,
      title: eventTitle,
      summary: eventSummary,
      badge: "Human Control",
      metadata: {
        action,
        reason: reason || "",
        previous_status: campaign.status,
        new_status: newStatus,
      },
    });

    console.log(`✅ Control action '${action}' logged for lead ${leadId}`);

    return NextResponse.json(
      {
        success: true,
        message: `Control action '${action}' executed successfully`,
        new_status: newStatus,
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

