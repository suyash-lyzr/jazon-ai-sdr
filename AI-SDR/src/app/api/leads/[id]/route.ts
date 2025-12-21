import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Company from "@/models/Company";
import Persona from "@/models/Persona";
import Technographic from "@/models/Technographic";
import ResearchRun from "@/models/ResearchRun";
import Citation from "@/models/Citation";
import DetectedSignal from "@/models/DetectedSignal";
import ICPScore from "@/models/ICPScore";
import ICPFactorBreakdown from "@/models/ICPFactorBreakdown";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(`✅ Database connected for GET /api/leads/${id}`);

    const leadId = id;

    // Fetch lead with populated company and persona
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

    const company = lead.company_id as any;
    const persona = lead.persona_id as any;

    // Fetch technographics for the company
    const technographics = await Technographic.find({
      company_id: company._id,
    });

    // Fetch research run for the lead
    const researchRun = await ResearchRun.findOne({ lead_id: lead._id });

    // Fetch citations if research run exists
    let citations = [];
    if (researchRun) {
      citations = await Citation.find({ research_run_id: researchRun._id });
    }

    // Fetch detected signals for the lead
    const detectedSignals = await DetectedSignal.find({ lead_id: lead._id });

    // Fetch ICP score for the lead
    const icpScore = await ICPScore.findOne({ lead_id: lead._id });

    // Fetch ICP factor breakdowns if ICP score exists
    let factorBreakdowns = null;
    if (icpScore) {
      const breakdowns = await ICPFactorBreakdown.find({
        icp_score_id: icpScore._id,
      });
      factorBreakdowns = {
        companyFit: breakdowns.find((b) => b.category === "companyFit"),
        personaFit: breakdowns.find((b) => b.category === "personaFit"),
        timingFit: breakdowns.find((b) => b.category === "timingFit"),
      };
    }

    // Build comprehensive response
    const enrichedLead = {
      _id: lead._id,
      name: lead.name,
      title: lead.title,
      email: lead.email,
      status: lead.status,
      source: lead.source,
      source_metadata: lead.source_metadata,
      company: {
        _id: company._id,
        name: company.name,
        domain: company.domain,
        website_url: company.website_url,
        linkedin_url: company.linkedin_url,
        industry: company.industry,
        company_size: company.company_size,
        headquarters: company.headquarters,
        structure: company.structure,
        sales_motion: company.sales_motion,
        keywords: company.keywords,
        confidence: company.confidence,
        technographics: technographics,
      },
      persona: {
        _id: persona._id,
        full_name: persona.full_name,
        email: persona.email,
        linkedin_url: persona.linkedin_url,
        title: persona.title,
        seniority: persona.seniority,
        department: persona.department,
        location: persona.location,
        reports_to: persona.reports_to,
        decision_authority: persona.decision_authority,
        responsibilities: persona.responsibilities,
        pain_points: persona.pain_points,
        confidence: persona.confidence,
      },
      research_run: researchRun
        ? {
            _id: researchRun._id,
            research_meta: researchRun.research_meta,
            citations: citations,
            createdAt: researchRun.createdAt,
            updatedAt: researchRun.updatedAt,
          }
        : null,
      detected_signals: detectedSignals,
      icp_score: icpScore
        ? {
            _id: icpScore._id,
            icp_score: icpScore.icp_score,
            fit_tier: icpScore.fit_tier,
            score_breakdown: icpScore.score_breakdown,
            strengths: icpScore.strengths,
            risks: icpScore.risks,
            gaps: icpScore.gaps,
            confidence_level: icpScore.confidence_level,
            scoring_meta: icpScore.scoring_meta,
            factor_breakdown: factorBreakdowns,
            createdAt: icpScore.createdAt,
            updatedAt: icpScore.updatedAt,
          }
        : null,
      createdAt: lead.createdAt,
      updatedAt: lead.updatedAt,
    };

    console.log(`✅ Retrieved lead ${leadId} with full normalized data`);

    return NextResponse.json(
      {
        success: true,
        lead: enrichedLead,
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(`✅ Database connected for DELETE /api/leads/${id}`);

    const leadId = id;

    // Find the lead first
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

    console.log(`🗑️ Deleting lead: ${lead.name} (${leadId})`);

    // Step 1: Delete ICP factor breakdowns
    const icpScore = await ICPScore.findOne({ lead_id: leadId });
    if (icpScore) {
      const factorBreakdownsDeleted = await ICPFactorBreakdown.deleteMany({
        icp_score_id: icpScore._id,
      });
      console.log(
        `  ✓ Deleted ${factorBreakdownsDeleted.deletedCount} ICP factor breakdowns`
      );
    }

    // Step 2: Delete ICP score
    const icpScoreDeleted = await ICPScore.deleteOne({ lead_id: leadId });
    console.log(`  ✓ Deleted ${icpScoreDeleted.deletedCount} ICP score`);

    // Step 3: Delete citations (via research run)
    const researchRun = await ResearchRun.findOne({ lead_id: leadId });
    if (researchRun) {
      const citationsDeleted = await Citation.deleteMany({
        research_run_id: researchRun._id,
      });
      console.log(`  ✓ Deleted ${citationsDeleted.deletedCount} citations`);
    }

    // Step 4: Delete detected signals
    const signalsDeleted = await DetectedSignal.deleteMany({
      lead_id: leadId,
    });
    console.log(`  ✓ Deleted ${signalsDeleted.deletedCount} detected signals`);

    // Step 5: Delete research run
    const researchRunDeleted = await ResearchRun.deleteOne({
      lead_id: leadId,
    });
    console.log(
      `  ✓ Deleted ${researchRunDeleted.deletedCount} research run`
    );

    // Step 6: Check if company and persona are used by other leads
    const companyId = lead.company_id;
    const personaId = lead.persona_id;

    // Count other leads using the same company
    const otherLeadsWithCompany = await Lead.countDocuments({
      company_id: companyId,
      _id: { $ne: leadId },
    });

    // Count other leads using the same persona
    const otherLeadsWithPersona = await Lead.countDocuments({
      persona_id: personaId,
      _id: { $ne: leadId },
    });

    // Step 7: Delete the lead
    await Lead.findByIdAndDelete(leadId);
    console.log(`  ✓ Deleted lead`);

    // Step 8: Delete company if no other leads use it
    if (otherLeadsWithCompany === 0) {
      // Delete technographics for this company
      const techsDeleted = await Technographic.deleteMany({
        company_id: companyId,
      });
      console.log(`  ✓ Deleted ${techsDeleted.deletedCount} technographics`);

      // Delete company
      await Company.findByIdAndDelete(companyId);
      console.log(`  ✓ Deleted company (no other leads using it)`);
    } else {
      console.log(
        `  ⚠️ Company not deleted (${otherLeadsWithCompany} other lead(s) using it)`
      );
    }

    // Step 9: Delete persona if no other leads use it
    if (otherLeadsWithPersona === 0) {
      await Persona.findByIdAndDelete(personaId);
      console.log(`  ✓ Deleted persona (no other leads using it)`);
    } else {
      console.log(
        `  ⚠️ Persona not deleted (${otherLeadsWithPersona} other lead(s) using it)`
      );
    }

    console.log(`✅ Successfully deleted lead ${leadId} and all related data`);

    return NextResponse.json(
      {
        success: true,
        message: "Lead and all related data deleted successfully",
        deleted: {
          lead: true,
          icp_score: icpScoreDeleted.deletedCount > 0,
          factor_breakdowns: icpScore ? true : false,
          research_run: researchRunDeleted.deletedCount > 0,
          citations: researchRun ? true : false,
          detected_signals: signalsDeleted.deletedCount > 0,
          company: otherLeadsWithCompany === 0,
          persona: otherLeadsWithPersona === 0,
          technographics: otherLeadsWithCompany === 0,
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
