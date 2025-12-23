import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignProspect from "@/models/OutreachCampaignProspect";
import Lead from "@/models/Lead";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/outreach-campaigns/[id]/prospects - List prospects in campaign
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for GET /api/outreach-campaigns/${id}/prospects`
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

    // Fetch prospects with populated lead data
    const prospects = await OutreachCampaignProspect.find({
      campaign_id: id,
    }).populate("lead_id");

    const prospectsWithDetails = prospects.map((prospect) => {
      const lead = prospect.lead_id as any;
      return {
        _id: prospect._id,
        prospect_id: prospect._id,
        lead_id: lead._id,
        lead_name: lead.name || "Unknown",
        lead_email: lead.email || "",
        lead_title: lead.title || "",
        lead_company: lead.company_name || "",
        status: prospect.status,
        aiStatus: prospect.aiStatus || "actively_pursue",
        current_step: prospect.current_step,
        metrics: prospect.metrics,
        notes: prospect.notes,
        addedAt: prospect.addedAt,
        updatedAt: prospect.updatedAt,
      };
    });

    return NextResponse.json(
      {
        success: true,
        prospects: prospectsWithDetails,
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

// POST /api/outreach-campaigns/[id]/prospects - Add prospects to campaign
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for POST /api/outreach-campaigns/${id}/prospects`
    );

    const body = await request.json();
    const leadIds = body.leadIds || body.lead_ids; // Support both formats

    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "leadIds must be a non-empty array",
        },
        { status: 400 }
      );
    }

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

    // Validate all leads exist
    const leads = await Lead.find({ _id: { $in: leadIds } });
    if (leads.length !== leadIds.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Some lead IDs are invalid",
        },
        { status: 400 }
      );
    }

    // Add prospects (skip duplicates) with AI status
    const prospectsToCreate = leadIds.map((lead_id: string) => ({
      campaign_id: id,
      lead_id: lead_id,
      status: "active",
      aiStatus: "actively_pursue",
      current_step: 0,
    }));

    const results = await Promise.allSettled(
      prospectsToCreate.map((prospect) =>
        OutreachCampaignProspect.create(prospect)
      )
    );

    const added = results.filter((r) => r.status === "fulfilled").length;
    const skipped = results.filter((r) => r.status === "rejected").length;

    console.log(
      `✅ Added ${added} prospects to campaign ${id} (${skipped} duplicates skipped)`
    );

    return NextResponse.json(
      {
        success: true,
        message: `Added ${added} prospect(s) to campaign`,
        added,
        skipped,
      },
      { status: 201 }
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

// DELETE /api/outreach-campaigns/[id]/prospects/[leadId] - Remove prospect from campaign
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const url = new URL(request.url);
    const leadId = url.pathname.split("/").pop();

    console.log(
      `✅ Database connected for DELETE /api/outreach-campaigns/${id}/prospects/${leadId}`
    );

    const prospect = await OutreachCampaignProspect.findOneAndDelete({
      campaign_id: id,
      lead_id: leadId,
    });

    if (!prospect) {
      return NextResponse.json(
        {
          success: false,
          error: "Prospect not found in campaign",
        },
        { status: 404 }
      );
    }

    console.log(`✅ Removed prospect ${leadId} from campaign ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Prospect removed from campaign",
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

