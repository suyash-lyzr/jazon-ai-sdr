import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import FieldOverride from "@/models/FieldOverride";
import OutreachEvent from "@/models/OutreachEvent";
import OutreachCampaign from "@/models/OutreachCampaign";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for PATCH /api/leads/${id}/outreach/override`
    );

    const leadId = id;
    const body = await request.json();
    const { scope, entity_id, path, value, updated_by, reason } = body;

    if (!scope || !entity_id || !path || value === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: scope, entity_id, path, value",
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

    // Save override
    const override = await (FieldOverride as any).setOverride(
      scope,
      entity_id,
      path,
      value,
      updated_by || "user",
      reason || ""
    );

    console.log(
      `✅ Field override saved: ${scope}.${path} for entity ${entity_id}`
    );

    // Log manual edit event
    const campaign = await OutreachCampaign.findOne({ lead_id: leadId });
    if (campaign) {
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
        title: `Manual edit: ${path}`,
        summary: `User manually updated ${scope} field: ${path}${reason ? `. Reason: ${reason}` : ""}`,
        badge: "Manual Override",
        metadata: {
          scope,
          entity_id,
          path,
          updated_by: updated_by || "user",
          reason: reason || "",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Field override saved successfully",
        override,
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

