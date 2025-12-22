import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
// Import models in order to ensure they're registered before use
import Company from "@/models/Company";
import Persona from "@/models/Persona";
import Lead from "@/models/Lead";
import Technographic from "@/models/Technographic";
import DetectedSignal from "@/models/DetectedSignal";
import ICPScore from "@/models/ICPScore";
import ICPFactorBreakdown from "@/models/ICPFactorBreakdown";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    console.log("✅ Database connected for GET /api/leads");

    // Ensure models are registered (Next.js hot reload fix)
    // Access the models to ensure they're registered
    const _companyModel = mongoose.models.Company || Company;
    const _personaModel = mongoose.models.Persona || Persona;
    
    if (!_companyModel || !_personaModel) {
      throw new Error("Required models (Company, Persona) are not registered");
    }

    // Fetch only leads that have completed research and ICP scoring
    const leads = await Lead.find({ status: "icp_scored" })
      .populate("company_id")
      .populate("persona_id")
      .sort({ createdAt: -1 });

    // For each lead, fetch related data
    const enrichedLeads = await Promise.all(
      leads.map(async (lead) => {
        const company = lead.company_id as any;
        const persona = lead.persona_id as any;

        // Fetch technographics for the company
        const technographics = await Technographic.find({
          company_id: company._id,
        });

        // Fetch detected signals for the lead
        const detectedSignals = await DetectedSignal.find({
          lead_id: lead._id,
        });

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

        return {
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
              }
            : null,
          createdAt: lead.createdAt,
          updatedAt: lead.updatedAt,
        };
      })
    );

    console.log(`✅ Retrieved ${enrichedLeads.length} leads with full data`);

    return NextResponse.json(
      {
        success: true,
        leads: enrichedLeads,
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
