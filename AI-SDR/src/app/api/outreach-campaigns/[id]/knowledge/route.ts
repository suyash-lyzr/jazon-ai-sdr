import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignKnowledgeItem from "@/models/OutreachCampaignKnowledgeItem";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/outreach-campaigns/[id]/knowledge - List knowledge items
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for GET /api/outreach-campaigns/${id}/knowledge`
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

    const knowledgeItems = await OutreachCampaignKnowledgeItem.find({
      campaign_id: id,
    }).sort({ createdAt: -1 });

    // Don't send file_data in list (too large)
    const itemsWithoutData = knowledgeItems.map((item) => ({
      _id: item._id,
      campaign_id: item.campaign_id,
      type: item.type,
      file_name: item.file_name,
      file_type: item.file_type,
      file_size: item.file_size,
      url: item.url,
      url_title: item.url_title,
      note_title: item.note_title,
      note_content: item.note_content,
      uploadedBy: item.uploadedBy,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        items: itemsWithoutData,
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

// POST /api/outreach-campaigns/[id]/knowledge - Add knowledge item
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for POST /api/outreach-campaigns/${id}/knowledge`
    );

    const body = await request.json();
    const { type, uploadedBy } = body;

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

    // Validate type
    if (!["file", "url", "note"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid type. Must be 'file', 'url', or 'note'",
        },
        { status: 400 }
      );
    }

    const itemData: Record<string, unknown> = {
      campaign_id: id,
      type,
      uploadedBy: uploadedBy || "user@example.com",
    };

    // Type-specific fields
    if (type === "file") {
      if (!body.file_name) {
        return NextResponse.json(
          {
            success: false,
            error: "file_name is required for file type",
          },
          { status: 400 }
        );
      }
      itemData.file_name = body.file_name;
      itemData.file_type = body.file_type || "FILE";
      itemData.file_size = body.file_size || 0;
      // Note: For demo, we're not storing actual file data
      // In production, use GridFS or external storage
    } else if (type === "url") {
      if (!body.url) {
        return NextResponse.json(
          {
            success: false,
            error: "url is required for url type",
          },
          { status: 400 }
        );
      }
      itemData.url = body.url;
      itemData.url_title = body.url_title || body.url;
    } else if (type === "note") {
      if (!body.note_title) {
        return NextResponse.json(
          {
            success: false,
            error: "note_title is required for note type",
          },
          { status: 400 }
        );
      }
      itemData.note_title = body.note_title;
      itemData.note_content = body.note_content || "";
    }

    const item = await OutreachCampaignKnowledgeItem.create(itemData);

    console.log(`✅ Added knowledge item to campaign ${id}`);

    return NextResponse.json(
      {
        success: true,
        item: {
          _id: item._id,
          type: item.type,
          file_name: item.file_name,
          file_type: item.file_type,
          file_size: item.file_size,
          url: item.url,
          url_title: item.url_title,
          note_title: item.note_title,
          note_content: item.note_content,
          createdAt: item.createdAt,
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

// DELETE /api/outreach-campaigns/[id]/knowledge - Delete knowledge item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const itemId = searchParams.get("itemId");

    console.log(
      `✅ Database connected for DELETE /api/outreach-campaigns/${id}/knowledge?itemId=${itemId}`
    );

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: "itemId query parameter is required",
        },
        { status: 400 }
      );
    }

    const item = await OutreachCampaignKnowledgeItem.findOneAndDelete({
      _id: itemId,
      campaign_id: id,
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Knowledge item not found",
        },
        { status: 404 }
      );
    }

    console.log(`✅ Deleted knowledge item ${itemId} from campaign ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: "Knowledge item deleted",
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

