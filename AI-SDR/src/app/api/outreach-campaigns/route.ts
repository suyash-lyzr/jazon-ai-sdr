import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignProspect from "@/models/OutreachCampaignProspect";

export const runtime = "nodejs";

// GET /api/outreach-campaigns - List all campaigns
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    console.log("✅ Database connected for GET /api/outreach-campaigns");

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");

    // Build query
    const query: Record<string, unknown> = {};
    if (status && ["active", "paused", "completed", "archived"].includes(status)) {
      query.status = status;
    }

    // Fetch campaigns
    const campaigns = await OutreachCampaignV2.find(query).sort({ createdAt: -1 });

    // For each campaign, fetch prospect counts
    const campaignsWithMetrics = await Promise.all(
      campaigns.map(async (campaign) => {
        const prospects = await OutreachCampaignProspect.find({
          campaign_id: campaign._id,
        });

        const totalProspects = prospects.length;
        const activeProspects = prospects.filter(
          (p) => p.status === "active"
        ).length;
        const repliedProspects = prospects.filter(
          (p) => p.status === "replied" || p.status === "booked"
        ).length;
        const bookedProspects = prospects.filter(
          (p) => p.status === "booked"
        ).length;

        const responseRate =
          totalProspects > 0
            ? Math.round((repliedProspects / totalProspects) * 100)
            : 0;

        // Update cached metrics in campaign
        await OutreachCampaignV2.findByIdAndUpdate(campaign._id, {
          "metrics.total_prospects": totalProspects,
          "metrics.active_prospects": activeProspects,
          "metrics.replied_prospects": repliedProspects,
          "metrics.booked_prospects": bookedProspects,
          "metrics.response_rate": responseRate,
        });

        return {
          _id: campaign._id,
          name: campaign.name,
          status: campaign.status,
          mode: campaign.mode,
          metrics: {
            total_prospects: totalProspects,
            active_prospects: activeProspects,
            replied_prospects: repliedProspects,
            booked_prospects: bookedProspects,
            response_rate: responseRate,
          },
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        campaigns: campaignsWithMetrics,
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

// POST /api/outreach-campaigns - Create new campaign
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    console.log("✅ Database connected for POST /api/outreach-campaigns");

    const body = await request.json();
    const { name, createdBy, autoName } = body;

    // Auto-generate name if requested
    const campaignName =
      name ||
      (autoName
        ? `Campaign - ${new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}`
        : "Untitled Campaign");

    // Check for duplicate campaign name (case-insensitive)
    const existingCampaign = await OutreachCampaignV2.findOne({
      name: { $regex: new RegExp(`^${campaignName.trim()}$`, "i") },
    });

    if (existingCampaign) {
      return NextResponse.json(
        {
          success: false,
          error: "Duplicate campaign name",
          message: `A campaign with the name "${campaignName}" already exists. Please choose a different name.`,
        },
        { status: 409 }
      );
    }

    // Create campaign
    const campaign = await OutreachCampaignV2.create({
      name: campaignName.trim(),
      createdBy: createdBy || "user@example.com",
      status: "active",
    });

    console.log(`✅ Created campaign ${campaign._id}: ${campaign.name}`);

    return NextResponse.json(
      {
        success: true,
        campaign: {
          _id: campaign._id,
          name: campaign.name,
          status: campaign.status,
          mode: campaign.mode,
          metrics: campaign.metrics,
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
        },
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

// DELETE /api/outreach-campaigns - Bulk delete campaigns
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    console.log("✅ Database connected for DELETE /api/outreach-campaigns (bulk)");

    const body = await request.json();
    const { campaignIds } = body;

    if (!campaignIds || !Array.isArray(campaignIds) || campaignIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request",
          message: "campaignIds array is required",
        },
        { status: 400 }
      );
    }

    // Delete campaigns and all related prospects
    const deleteResult = await OutreachCampaignV2.deleteMany({
      _id: { $in: campaignIds },
    });

    await OutreachCampaignProspect.deleteMany({
      campaign_id: { $in: campaignIds },
    });

    console.log(`✅ Deleted ${deleteResult.deletedCount} campaign(s) and related data`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully deleted ${deleteResult.deletedCount} campaign(s)`,
        deletedCount: deleteResult.deletedCount,
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

