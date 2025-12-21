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
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const LYXR_AGENT_API_URL =
  "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYXR_API_KEY = "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const RESEARCH_AGENT_ID = "69451f56d9c1eef9bdbd3957";
const ICP_AGENT_ID = "6945269078787390cded7e01";
const USER_ID = "suyash@lyzr.ai";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected for lead refresh");

    // Get request body to check if specific lead ID is provided
    const body = await request.json().catch(() => ({}));
    const leadId = body.leadId || null;

    // Fetch leads from database with populated company and persona
    let leads;
    if (leadId) {
      // Fetch specific lead
      leads = await Lead.find({ _id: leadId })
        .populate("company_id")
        .populate("persona_id");
      console.log(`📋 Fetching specific lead: ${leadId}`);
    } else {
      // Fetch all leads with status "uploaded" (not yet researched)
      leads = await Lead.find({ status: "uploaded" })
        .populate("company_id")
        .populate("persona_id");
      console.log(`📋 Found ${leads.length} leads with status "uploaded"`);
    }

    if (!leads || leads.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No leads found to refresh",
          processed: 0,
          responses: [],
        },
        { status: 200 }
      );
    }

    // Process each lead
    const responses = [];
    const errors = [];

    for (const lead of leads) {
      try {
        const company = lead.company_id as any;
        const persona = lead.persona_id as any;

        // Prepare lead data for the agent
        const leadData = {
          name: lead.name,
          title: lead.title,
          company: company.name,
          email: lead.email || "",
        };

        // Generate unique session IDs for this lead
        const researchSessionId = `${RESEARCH_AGENT_ID}-${lead._id.toString()}-${Date.now()}`;

        // Prepare the message with lead data for the Research Agent
        const message = `Please perform research and enrichment for the following lead:

Name: ${leadData.name}, 
Title: ${leadData.title}, 
Company: ${leadData.company}, 
Email: ${leadData.email || "Not provided"}
`;

        console.log(
          `\n🔍 Processing lead: ${leadData.name} (${leadData.company})`
        );
        console.log(`📤 Sending to Research Agent...`);

        // Call the Research & Enrichment Agent
        const agentResponse = await fetch(LYXR_AGENT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": LYXR_API_KEY,
          },
          body: JSON.stringify({
            user_id: USER_ID,
            agent_id: RESEARCH_AGENT_ID,
            session_id: researchSessionId,
            message: message,
          }),
        });

        if (!agentResponse.ok) {
          const errorText = await agentResponse.text();
          throw new Error(
            `Agent API error: ${agentResponse.status} - ${errorText}`
          );
        }

        const researchAgentData = await agentResponse.json();

        console.log(`✅ Research Agent response received for ${leadData.name}`);

        // Parse the research response (it's a JSON string in the response field)
        let researchData;
        try {
          if (typeof researchAgentData.response === "string") {
            researchData = JSON.parse(researchAgentData.response);
          } else {
            researchData = researchAgentData.response;
          }
        } catch (parseError) {
          console.warn(
            "⚠️ Could not parse research response as JSON, using raw response"
          );
          researchData = researchAgentData.response;
        }

        // Save research response to JSON file (for debugging)
        const outputDir = path.join(process.cwd(), "output");
        if (!fs.existsSync(outputDir)) {
          fs.mkdirSync(outputDir, { recursive: true });
        }

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const researchFileName = `research-agent-response-${lead._id.toString()}-${timestamp}.json`;
        const researchFilePath = path.join(outputDir, researchFileName);

        fs.writeFileSync(
          researchFilePath,
          JSON.stringify(
            {
              leadId: lead._id.toString(),
              leadName: leadData.name,
              leadCompany: leadData.company,
              timestamp: new Date().toISOString(),
              agentResponse: researchAgentData,
              parsedResearchData: researchData,
            },
            null,
            2
          ),
          "utf-8"
        );

        console.log(`💾 Research response saved to: ${researchFilePath}`);

        // Step 1: Update Company with research data
        if (researchData.CompanyProfile) {
          const companyProfile = researchData.CompanyProfile;
          await Company.findByIdAndUpdate(company._id, {
            domain: companyProfile.domain || company.domain,
            website_url: companyProfile.website_url || company.website_url,
            linkedin_url: companyProfile.linkedin_url || company.linkedin_url,
            industry: companyProfile.industry || company.industry,
            company_size: companyProfile.company_size || company.company_size,
            headquarters: companyProfile.headquarters || company.headquarters,
            structure: companyProfile.structure || company.structure,
            sales_motion: companyProfile.sales_motion || company.sales_motion,
            keywords: companyProfile.keywords || company.keywords,
            confidence: companyProfile.confidence || company.confidence,
          });
          console.log(`✅ Company ${company._id} updated`);
        }

        // Step 2: Update Persona with research data
        if (researchData.PersonaProfile) {
          const personaProfile = researchData.PersonaProfile;
          await Persona.findByIdAndUpdate(persona._id, {
            full_name: personaProfile.full_name || persona.full_name,
            email: personaProfile.email || persona.email,
            linkedin_url:
              personaProfile.linkedin_url || persona.linkedin_url,
            title: personaProfile.title || persona.title,
            seniority: personaProfile.seniority || persona.seniority,
            department: personaProfile.department || persona.department,
            location: personaProfile.location || persona.location,
            reports_to: personaProfile.reports_to || persona.reports_to,
            decision_authority:
              personaProfile.decision_authority || persona.decision_authority,
            responsibilities:
              personaProfile.responsibilities || persona.responsibilities,
            pain_points: personaProfile.pain_points || persona.pain_points,
            confidence: personaProfile.confidence || persona.confidence,
          });
          console.log(`✅ Persona ${persona._id} updated`);
        }

        // Step 3: Create/update Technographics
        if (
          researchData.CompanyProfile &&
          researchData.CompanyProfile.technographics
        ) {
          // Delete existing technographics for this company
          await Technographic.deleteMany({ company_id: company._id });

          // Create new technographics
          for (const tech of researchData.CompanyProfile.technographics) {
            await Technographic.create({
              company_id: company._id,
              name: tech.name,
              category: tech.category,
              confidence: tech.confidence,
              source: tech.source,
            });
          }
          console.log(
            `✅ Created ${researchData.CompanyProfile.technographics.length} technographics`
          );
        }

        // Step 4: Create/update ResearchRun
        const researchRun = await ResearchRun.findOneAndUpdate(
          { lead_id: lead._id },
          {
            lead_id: lead._id,
            company_id: company._id,
            persona_id: persona._id,
            research_meta: researchData.ResearchMeta || {},
          },
          { upsert: true, new: true }
        );
        console.log(`✅ ResearchRun ${researchRun._id} created/updated`);

        // Step 5: Create Citations
        if (
          researchData.ResearchMeta &&
          researchData.ResearchMeta.citations
        ) {
          // Delete existing citations for this research run
          await Citation.deleteMany({ research_run_id: researchRun._id });

          // Create new citations
          for (const citation of researchData.ResearchMeta.citations) {
            await Citation.create({
              research_run_id: researchRun._id,
              source_name: citation.source_name,
              url: citation.url,
              accessed_at_utc: citation.accessed_at_utc,
            });
          }
          console.log(
            `✅ Created ${researchData.ResearchMeta.citations.length} citations`
          );
        }

        // Step 6: Create DetectedSignals
        if (researchData.DetectedSignals) {
          // Delete existing signals for this lead
          await DetectedSignal.deleteMany({ lead_id: lead._id });

          // Create new signals
          for (const signal of researchData.DetectedSignals) {
            await DetectedSignal.create({
              lead_id: lead._id,
              research_run_id: researchRun._id,
              type: signal.type,
              signal: signal.signal,
              source: signal.source,
              strength: signal.strength,
              recency: signal.recency,
              evidence: signal.evidence,
            });
          }
          console.log(
            `✅ Created ${researchData.DetectedSignals.length} detected signals`
          );
        }

        // Update lead status to "researched"
        await Lead.findByIdAndUpdate(lead._id, { status: "researched" });

        // Step 7: Call ICP Scoring Agent
        console.log(`\n📊 Calling ICP Scoring Agent for ${leadData.name}...`);

        const icpSessionId = `${ICP_AGENT_ID}-${lead._id.toString()}-${Date.now()}`;

        const icpMessage = `Please perform ICP scoring for the following lead based on the research data:

Lead Information:
- Name: ${leadData.name}
- Title: ${leadData.title}
- Company: ${leadData.company}
- Email: ${leadData.email || "Not provided"}

Research Data:
${JSON.stringify(researchData, null, 2)}`;

        // Call the ICP Scoring Agent
        const icpAgentResponse = await fetch(LYXR_AGENT_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": LYXR_API_KEY,
          },
          body: JSON.stringify({
            user_id: USER_ID,
            agent_id: ICP_AGENT_ID,
            session_id: icpSessionId,
            message: icpMessage,
          }),
        });

        if (!icpAgentResponse.ok) {
          const errorText = await icpAgentResponse.text();
          throw new Error(
            `ICP Agent API error: ${icpAgentResponse.status} - ${errorText}`
          );
        }

        const icpAgentData = await icpAgentResponse.json();

        console.log(`✅ ICP Agent response received for ${leadData.name}`);

        // Parse the ICP response
        let icpData;
        try {
          if (typeof icpAgentData.response === "string") {
            icpData = JSON.parse(icpAgentData.response);
          } else {
            icpData = icpAgentData.response;
          }
        } catch (parseError) {
          console.warn(
            "⚠️ Could not parse ICP response as JSON, using raw response"
          );
          icpData = icpAgentData.response;
        }

        // Save ICP response to JSON file
        const icpFileName = `icp-agent-response-${lead._id.toString()}-${timestamp}.json`;
        const icpFilePath = path.join(outputDir, icpFileName);

        fs.writeFileSync(
          icpFilePath,
          JSON.stringify(
            {
              leadId: lead._id.toString(),
              leadName: leadData.name,
              timestamp: new Date().toISOString(),
              agentResponse: icpAgentData,
              parsedIcpData: icpData,
            },
            null,
            2
          ),
          "utf-8"
        );

        console.log(`💾 ICP response saved to: ${icpFilePath}`);

        // Step 8: Create/update ICPScore
        const icpScore = await ICPScore.findOneAndUpdate(
          { lead_id: lead._id },
          {
            lead_id: lead._id,
            icp_score: icpData.icp_score,
            fit_tier: icpData.fit_tier,
            score_breakdown: icpData.score_breakdown,
            strengths: icpData.strengths,
            risks: icpData.risks,
            gaps: icpData.gaps,
            confidence_level: icpData.confidence_level,
            scoring_meta: icpData.scoring_meta,
          },
          { upsert: true, new: true }
        );
        console.log(`✅ ICPScore ${icpScore._id} created/updated`);

        // Step 9: Create ICPFactorBreakdowns
        if (icpData.factor_breakdown) {
          // Delete existing factor breakdowns
          await ICPFactorBreakdown.deleteMany({ icp_score_id: icpScore._id });

          // Create factor breakdowns for each category
          for (const category of [
            "companyFit",
            "personaFit",
            "timingFit",
          ] as const) {
            if (icpData.factor_breakdown[category]) {
              await ICPFactorBreakdown.create({
                icp_score_id: icpScore._id,
                category: category,
                score: icpData.factor_breakdown[category].score,
                factors: icpData.factor_breakdown[category].factors,
              });
            }
          }
          console.log(`✅ Created ICP factor breakdowns`);
        }

        // Update lead status to "icp_scored"
        await Lead.findByIdAndUpdate(lead._id, { status: "icp_scored" });

        console.log(
          `✅ Lead ${lead._id} processing complete with normalized data`
        );

        responses.push({
          leadId: lead._id.toString(),
          leadName: leadData.name,
          leadCompany: leadData.company,
          researchFile: researchFilePath,
          icpFile: icpFilePath,
        });
      } catch (error: any) {
        console.error(`❌ Error processing lead ${lead._id}:`, error);
        errors.push({
          leadId: lead._id.toString(),
          leadName: lead.name,
          error: error.message || "Unknown error",
        });
      }
    }

    // Save summary
    const summaryTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const summaryFileName = `refresh-summary-${summaryTimestamp}.json`;
    const outputDir = path.join(process.cwd(), "output");
    const summaryFilePath = path.join(outputDir, summaryFileName);

    fs.writeFileSync(
      summaryFilePath,
      JSON.stringify(
        {
          timestamp: new Date().toISOString(),
          summary: {
            totalProcessed: responses.length,
            totalFailed: errors.length,
            totalLeads: responses.length + errors.length,
          },
          responses: responses,
          errors: errors,
        },
        null,
        2
      ),
      "utf-8"
    );

    console.log(`\n📊 Refresh Summary:`);
    console.log(`  ✅ Successfully processed: ${responses.length} leads`);
    console.log(`  ❌ Errors: ${errors.length} leads`);
    console.log(`  💾 Summary saved to: ${summaryFilePath}`);

    return NextResponse.json(
      {
        success: true,
        message: `Processed ${responses.length} lead(s) with normalized schema`,
        processed: responses.length,
        failed: errors.length,
        responses: responses,
        errors: errors.length > 0 ? errors : undefined,
        summaryFile: summaryFilePath,
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
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
