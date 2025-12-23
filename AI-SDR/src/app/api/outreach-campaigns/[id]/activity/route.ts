import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignProspect from "@/models/OutreachCampaignProspect";
import OutreachEvent from "@/models/OutreachEvent";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/outreach-campaigns/[id]/activity - Get campaign activity
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for GET /api/outreach-campaigns/${id}/activity`
    );

    const campaign = await OutreachCampaignV2.findById(id);
    if (!campaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Campaign not found",
        },
        { status: 404 }
      );
    }

    // Fetch all prospects in campaign
    const prospects = await OutreachCampaignProspect.find({
      campaign_id: id,
    }).populate("lead_id");

    // Calculate aggregate metrics
    let totalEmails = 0;
    let totalOpens = 0;
    let totalClicks = 0;
    let totalReplies = 0;

    prospects.forEach((prospect) => {
      totalEmails += prospect.metrics.emails_sent || 0;
      totalOpens += prospect.metrics.emails_opened || 0;
      totalClicks += prospect.metrics.emails_clicked || 0;
      totalReplies += prospect.metrics.replies || 0;
    });

    // Fetch events for all prospects in campaign
    const leadIds = prospects.map((p) => p.lead_id);
    const events = await OutreachEvent.find({
      lead_id: { $in: leadIds },
    }).sort({ timestamp: -1 });

    // Group events by prospect
    const eventsByProspect: Record<string, typeof events> = {};
    events.forEach((event) => {
      const leadId = event.lead_id.toString();
      if (!eventsByProspect[leadId]) {
        eventsByProspect[leadId] = [];
      }
      eventsByProspect[leadId].push(event);
    });

    // Build prospects with history
    const prospectsWithHistory = prospects.map((prospect) => {
      const lead = prospect.lead_id as any;
      const leadId = lead._id.toString();
      const prospectEvents = eventsByProspect[leadId] || [];

      return {
        _id: prospect._id,
        lead_id: lead._id,
        lead_name: lead.name || "Unknown",
        lead_email: lead.email || "",
        lead_company: lead.company_name || "",
        status: prospect.status,
        metrics: prospect.metrics,
        history: prospectEvents.map((e) => ({
          id: e._id,
          eventType: e.event_type,
          timestamp: e.timestamp,
          actor: e.actor,
          title: e.title,
          summary: e.summary,
          badge: e.badge,
          channel: e.channel,
          metadata: e.metadata,
        })),
      };
    });

    return NextResponse.json(
      {
        success: true,
        metrics: {
          mails_sent: totalEmails,
          opens: totalOpens,
          clicks: totalClicks,
          replies: totalReplies,
          response_rate:
            totalEmails > 0
              ? Math.round((totalReplies / totalEmails) * 100)
              : 0,
        },
        prospects: prospectsWithHistory,
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

