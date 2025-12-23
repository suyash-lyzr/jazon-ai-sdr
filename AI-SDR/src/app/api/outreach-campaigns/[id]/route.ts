import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignProspect from "@/models/OutreachCampaignProspect";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/outreach-campaigns/[id] - Get campaign details
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(`✅ Database connected for GET /api/outreach-campaigns/${id}`);

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

    // Fetch prospect counts
    const prospects = await OutreachCampaignProspect.find({
      campaign_id: campaign._id,
    });

    const totalProspects = prospects.length;
    const activeProspects = prospects.filter((p) => p.status === "active").length;
    const repliedProspects = prospects.filter(
      (p) => p.status === "replied" || p.status === "booked"
    ).length;
    const bookedProspects = prospects.filter((p) => p.status === "booked").length;
    const responseRate =
      totalProspects > 0
        ? Math.round((repliedProspects / totalProspects) * 100)
        : 0;

    return NextResponse.json(
      {
        success: true,
        campaign: {
          _id: campaign._id,
          name: campaign.name,
          status: campaign.status,
          mode: campaign.mode,
          createdBy: campaign.createdBy,
          scheduling: campaign.scheduling,
          agentProfile: campaign.agentProfile,
          instructions: campaign.instructions,
          templates: campaign.templates,
          metrics: {
            total_prospects: totalProspects,
            active_prospects: activeProspects,
            replied_prospects: repliedProspects,
            booked_prospects: bookedProspects,
            response_rate: responseRate,
          },
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
        },
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

// PATCH /api/outreach-campaigns/[id] - Update campaign
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(`✅ Database connected for PATCH /api/outreach-campaigns/${id}`);

    const body = await request.json();

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

    // Update allowed fields
    const updateFields: Record<string, unknown> = {};

    if (body.name !== undefined) updateFields.name = body.name;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.mode !== undefined) updateFields.mode = body.mode;
    if (body.scheduling !== undefined) updateFields.scheduling = body.scheduling;
    if (body.agentProfile !== undefined)
      updateFields.agentProfile = body.agentProfile;
    if (body.instructions !== undefined)
      updateFields.instructions = body.instructions;
    if (body.templates !== undefined) updateFields.templates = body.templates;

    const updatedCampaign = await OutreachCampaignV2.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    console.log(`✅ Updated campaign ${id}`);

    return NextResponse.json(
      {
        success: true,
        campaign: updatedCampaign,
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

// DELETE /api/outreach-campaigns/[id] - Delete campaign
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(`✅ Database connected for DELETE /api/outreach-campaigns/${id}`);

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

    // Delete campaign and all related data
    await OutreachCampaignV2.findByIdAndDelete(id);
    await OutreachCampaignProspect.deleteMany({ campaign_id: id });

    console.log(`✅ Deleted campaign ${id} and all related data`);

    return NextResponse.json(
      {
        success: true,
        message: "Campaign deleted successfully",
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

