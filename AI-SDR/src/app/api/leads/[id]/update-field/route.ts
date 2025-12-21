import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Company from "@/models/Company";
import Persona from "@/models/Persona";
import Technographic from "@/models/Technographic";
import DetectedSignal from "@/models/DetectedSignal";
import ResearchRun from "@/models/ResearchRun";
import Lead from "@/models/Lead";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for PATCH /api/leads/${id}/update-field`
    );

    const body = await request.json();
    const { field, value, target } = body;

    if (!field || value === undefined || !target) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: field, value, target",
        },
        { status: 400 }
      );
    }

    // Find the lead first
    const lead = await Lead.findById(id);
    if (!lead) {
      return NextResponse.json(
        {
          success: false,
          error: "Lead not found",
        },
        { status: 404 }
      );
    }

    let updateResult = null;

    // Update based on target collection
    switch (target) {
      case "company":
        updateResult = await Company.findByIdAndUpdate(
          lead.company_id,
          { [field]: value },
          { new: true, runValidators: true }
        );
        break;

      case "persona":
        updateResult = await Persona.findByIdAndUpdate(
          lead.persona_id,
          { [field]: value },
          { new: true, runValidators: true }
        );
        break;

      case "company.company_size":
        // Handle nested company_size updates
        updateResult = await Company.findByIdAndUpdate(
          lead.company_id,
          { [`company_size.${field.replace("company_size.", "")}`]: value },
          { new: true, runValidators: true }
        );
        break;

      case "persona.decision_authority":
        // Handle nested decision_authority updates
        updateResult = await Persona.findByIdAndUpdate(
          lead.persona_id,
          {
            [`decision_authority.${field.replace("decision_authority.", "")}`]:
              value,
          },
          { new: true, runValidators: true }
        );
        break;

      case "technographic":
        // Add a new technographic
        if (field === "add") {
          const techData = value as {
            name: string;
            category: string;
            confidence: string;
          };
          updateResult = await Technographic.create({
            company_id: lead.company_id,
            name: techData.name,
            category: techData.category,
            confidence: techData.confidence,
            source: "Manual Entry",
          });
        }
        break;

      case "detected_signal":
        // Add a new detected signal
        if (field === "add") {
          const signalData = value as {
            type: string;
            signal: string;
            source: string;
            strength: string;
            recency: string;
          };

          // Find the research run for this lead
          const researchRun = await ResearchRun.findOne({ lead_id: id });
          if (!researchRun) {
            return NextResponse.json(
              {
                success: false,
                error: "No research run found for this lead",
              },
              { status: 400 }
            );
          }

          updateResult = await DetectedSignal.create({
            lead_id: id,
            research_run_id: researchRun._id,
            type: signalData.type,
            signal: signalData.signal,
            source: signalData.source || "Manual Entry",
            strength: signalData.strength,
            recency: signalData.recency,
            evidence: [],
          });
        }
        break;

      case "lead":
        // Update lead directly
        updateResult = await Lead.findByIdAndUpdate(
          id,
          { [field]: value },
          { new: true, runValidators: true }
        );
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: `Unknown target: ${target}`,
          },
          { status: 400 }
        );
    }

    console.log(`✅ Updated ${target}.${field} for lead ${id}`);

    return NextResponse.json(
      {
        success: true,
        message: `Successfully updated ${field}`,
        updated: updateResult,
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
