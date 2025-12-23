import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import OutreachCampaignV2 from "../models/OutreachCampaignV2";
import OutreachCampaignProspect from "../models/OutreachCampaignProspect";
import OutreachCampaignKnowledgeItem from "../models/OutreachCampaignKnowledgeItem";
import Lead from "../models/Lead";
import Company from "../models/Company";
import Persona from "../models/Persona";
import ICPScore from "../models/ICPScore";
import DetectedSignal from "../models/DetectedSignal";
import { mockLeads } from "../lib/mock-data";

async function seedDemoCampaign() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Step 1: Clear all existing campaigns and prospects
    console.log("\n🗑️  Clearing existing campaigns...");
    await OutreachCampaignV2.deleteMany({});
    await OutreachCampaignProspect.deleteMany({});
    await OutreachCampaignKnowledgeItem.deleteMany({});
    console.log("✓ Cleared all campaigns, prospects, and knowledge items");

    // Step 2: Upsert mock leads into MongoDB
    console.log("\n📝 Upserting mock leads into MongoDB...");
    const leadIds: string[] = [];

    for (const mockLead of mockLeads) {
      // Create or find Company
      const company = await Company.findOneAndUpdate(
        { name: mockLead.company },
        {
          name: mockLead.company,
          industry: mockLead.industry,
          company_size: {
            employee_count: mockLead.companySize.includes("10,000+") ? 15000 : 
                           mockLead.companySize.includes("5,000") ? 7500 :
                           mockLead.companySize.includes("500") ? 750 : 500,
            employee_count_confidence: "High",
          },
          confidence: "High",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Create or find Persona
      const persona = await Persona.findOneAndUpdate(
        { email: mockLead.email },
        {
          full_name: mockLead.name,
          email: mockLead.email,
          title: mockLead.title,
          seniority: mockLead.title.includes("VP") || mockLead.title.includes("Chief") ? "VP" : 
                     mockLead.title.includes("Director") ? "Director" : 
                     mockLead.title.includes("Head") ? "Director" : "Manager",
          confidence: "High",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      // Create or find Lead
      const lead = await Lead.findOneAndUpdate(
        { 
          company_id: company._id,
          persona_id: persona._id,
        },
        {
          name: mockLead.name,
          title: mockLead.title,
          email: mockLead.email,
          company_id: company._id,
          persona_id: persona._id,
          status: "icp_scored",
          source: mockLead.source || "Mock",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      leadIds.push(lead._id.toString());

      // Create or update ICP Score
      await ICPScore.findOneAndUpdate(
        { lead_id: lead._id },
        {
          lead_id: lead._id,
          icp_score: mockLead.icpScore,
          fit_tier: mockLead.icpScore >= 85 ? "Tier 1 - High Fit" : 
                    mockLead.icpScore >= 70 ? "Tier 2 - Medium Fit" : 
                    "Tier 3 - Low Fit",
          strengths: [mockLead.aiRecommendation],
          risks: [],
          gaps: [],
          confidence_level: "high",
        },
        { upsert: true, new: true }
      );

      // Create detected signals
      if (mockLead.triggers && mockLead.triggers.length > 0) {
        for (const trigger of mockLead.triggers) {
          await DetectedSignal.findOneAndUpdate(
            { lead_id: lead._id, signal: trigger },
            {
              lead_id: lead._id,
              signal: trigger,
              signal_type: "growth_signal",
              confidence: 0.9,
              source: "research_agent",
            },
            { upsert: true, new: true }
          );
        }
      }

      console.log(`  ✓ Upserted mock lead: ${mockLead.name} (${lead._id})`);
    }

    // Step 3: Get all DB leads (existing + newly upserted mock)
    console.log("\n📊 Fetching all leads from DB...");
    const allLeads = await Lead.find({ status: "icp_scored" });
    console.log(`✓ Found ${allLeads.length} total leads (${mockLeads.length} from mock, ${allLeads.length - mockLeads.length} existing DB leads)`);

    // Step 4: Create one demo campaign
    console.log("\n🎯 Creating demo campaign...");
    const demoCampaign = await OutreachCampaignV2.create({
      name: "Demo Campaign (All Leads)",
      status: "active",
      mode: "Sales Mode",
      createdBy: "demo@lyzr.ai",
      aiReasoning: {
        objective: "Comprehensive outbound campaign",
        avgICPScore: 82,
        explanation: "This demo campaign showcases Jazon's AI-driven approach across a diverse set of leads with varying ICP scores, company sizes, and industries. The campaign demonstrates how Jazon adapts messaging and timing based on individual lead characteristics.",
        approach: "Value-led with adaptive personalization",
        riskFlags: ["Mixed ICP tiers", "Multiple industries require varied messaging"],
      },
      strategyType: "Net-new Outbound",
      primaryGoal: "Book Meeting",
      channelMix: ["Email", "LinkedIn", "Call"],
      agentProfile: {
        agent_name: "Alex Morgan",
        agent_designation: "Senior SDR",
        agent_contact: "alex.morgan@lyzr.ai",
        seller_name: "LYZR",
      },
      instructions: {
        construct: "Lead with value and ROI. Personalize based on industry and role.",
        format: "Keep emails concise (under 150 words). Use bullet points for clarity.",
        personalization: "Reference company news, hiring trends, and specific pain points from research.",
        additional_notes: "Adapt tone based on seniority: more consultative for C-suite, more tactical for managers.",
      },
      templates: {
        email_steps: [
          {
            step_name: "Pain Point Email",
            construct_instructions: "Identify and address the primary pain point based on research.",
            format_instructions: "Subject: Question format. Body: 3 paragraphs max.",
            template: "Subject: Struggling with {pain_point}?\n\nHi {prospect_name},\n\nI noticed {company_name} is {context_from_research}. Many companies at this stage face challenges with {pain_point}.\n\nWe help teams like yours solve this by {value_prop}.\n\nWould you be open to a brief call?\n\nBest,\n{agent_name}",
          },
          {
            step_name: "Agitation Email",
            construct_instructions: "Amplify the pain point with data and consequences.",
            format_instructions: "Use metrics and specific examples.",
            template: "Subject: The real cost of {pain_point}\n\nHi {prospect_name},\n\nFollowing up on my previous note. Research shows companies dealing with {pain_point} typically see:\n• {negative_outcome_1}\n• {negative_outcome_2}\n• {negative_outcome_3}\n\nIs {company_name} experiencing any of these?\n\nHappy to share how we've helped similar companies.\n\nBest,\n{agent_name}",
          },
          {
            step_name: "Initial Solution Email",
            construct_instructions: "Present solution with customer proof.",
            format_instructions: "Focus on outcomes, not features.",
            template: "Subject: How {similar_company} solved {pain_point}\n\nHi {prospect_name},\n\n{similar_company} recently used LYZR to solve {pain_point}. Results:\n✓ {result_1}\n✓ {result_2}\n✓ {result_3}\n\nWould a quick demo make sense?\n\nBest,\n{agent_name}",
          },
          {
            step_name: "Customer Proof Email",
            construct_instructions: "Share case study or testimonial.",
            format_instructions: "Quantify results.",
            template: "Subject: Case study: {customer_name}\n\nHi {prospect_name},\n\nJust published a case study showing how {customer_name} achieved {key_result} using LYZR.\n\nFull story: [link]\n\nThought this might be relevant for {company_name}?\n\nBest,\n{agent_name}",
          },
          {
            step_name: "Data Points Email",
            construct_instructions: "Share relevant industry data or benchmarks.",
            format_instructions: "Lead with data, make it actionable.",
            template: "Subject: Industry benchmark data\n\nHi {prospect_name},\n\nInteresting data: {statistic}% of companies in your industry are facing {challenge}.\n\nWe're helping teams overcome this challenge. Would you like to see how?\n\nBest,\n{agent_name}",
          },
          {
            step_name: "Address Concerns Email",
            construct_instructions: "Proactively address common objections.",
            format_instructions: "Acknowledge concern, then resolve with facts.",
            template: "Subject: Common questions about LYZR\n\nHi {prospect_name},\n\nThe most common questions we get:\n• {question_1} ({answer_1})\n• {question_2} ({answer_2})\n\nWhat questions do you have?\n\nBest,\n{agent_name}",
          },
          {
            step_name: "First Offer Email",
            construct_instructions: "Make clear, low-friction offer.",
            format_instructions: "One clear CTA.",
            template: "Subject: 15-minute demo for {company_name}?\n\nHi {prospect_name},\n\nFinal note: I'd like to offer a complimentary 15-minute demo tailored to {company_name}.\n\nInterested? Just reply with a time that works.\n\nBest,\n{agent_name}",
          },
        ],
        linkedin_template: "Hi {prospect_name}, noticed your work at {company_name}. We help similar companies with {pain_point}. Would love to connect.",
        voice_template: "1. Intro\n2. Purpose: Help with {pain_point}\n3. Qualify\n4. Value prop\n5. Close with CTA",
      },
      scheduling: {
        max_touches: 7,
        interval_days: 2,
        time_window: { start: "09:00", end: "17:00" },
        timezone: "America/New_York",
        allowed_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    });

    console.log(`✅ Created demo campaign: ${demoCampaign.name} (${demoCampaign._id})`);

    // Step 5: Add all leads as prospects
    console.log("\n👥 Adding all leads as prospects...");
    let addedCount = 0;

    for (const lead of allLeads) {
      try {
        await OutreachCampaignProspect.create({
          campaign_id: demoCampaign._id,
          lead_id: lead._id,
          status: "active",
          aiStatus: "actively_pursue",
          current_step: 0,
        });
        addedCount++;
      } catch (error) {
        // Skip duplicates
        console.log(`  ⚠️  Skipped duplicate: ${lead._id}`);
      }
    }

    console.log(`✓ Added ${addedCount} prospects to campaign`);

    // Step 6: Add sample knowledge base items
    console.log("\n📚 Adding knowledge base items...");
    await OutreachCampaignKnowledgeItem.create({
      campaign_id: demoCampaign._id,
      type: "url",
      name: "Product Demo",
      url: "https://lyzr.ai/demo",
      uploadedBy: "demo@lyzr.ai",
    });

    await OutreachCampaignKnowledgeItem.create({
      campaign_id: demoCampaign._id,
      type: "note",
      note_title: "Campaign Notes",
      content: "This campaign demonstrates Jazon's AI-driven outreach capabilities across diverse lead profiles.",
      uploadedBy: "demo@lyzr.ai",
    });

    console.log("✓ Added 2 knowledge base items");

    // Update campaign metrics
    demoCampaign.metrics.total_prospects = addedCount;
    demoCampaign.metrics.active_prospects = addedCount;
    await demoCampaign.save();

    console.log("\n✨ Demo campaign seeding complete!");
    console.log(`📊 Campaign: "${demoCampaign.name}"`);
    console.log(`   - ${addedCount} leads (${mockLeads.length} from mock data + ${addedCount - mockLeads.length} from existing DB)`);
    console.log(`   - Agent: ${demoCampaign.agentProfile.agent_name}`);
    console.log(`   - Strategy: ${demoCampaign.strategyType}`);
    console.log(`   - AI reasoning configured`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo campaign:", error);
    process.exit(1);
  }
}

seedDemoCampaign();

