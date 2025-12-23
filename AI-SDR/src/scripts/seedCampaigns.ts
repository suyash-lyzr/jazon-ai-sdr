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

const sampleCampaigns = [
  {
    name: "Q1 Enterprise Outbound - 2024",
    status: "active",
    mode: "Sales Mode",
    aiReasoning: {
      objective: "Net-new outbound",
      avgICPScore: 88,
      explanation: "Enterprise companies at Series B+ stage are actively hiring for AI/ML roles, indicating strong intent and budget for AI infrastructure. This campaign targets decision-makers with proven pain points around scaling AI from prototype to production.",
      approach: "Value-led",
      riskFlags: ["Longer sales cycles (6-9 months)", "Multiple stakeholders required"],
    },
    strategyType: "Net-new Outbound",
    primaryGoal: "Book Meeting",
    channelMix: ["Email", "LinkedIn", "Call"],
    agentProfile: {
      agent_name: "Sarah Chen",
      agent_designation: "Senior SDR",
      agent_contact: "sarah.chen@lyzr.ai",
      seller_name: "LYZR",
    },
    instructions: {
      construct: "Focus on ROI and business impact. Lead with value, not features.",
      format: "Keep emails concise (under 150 words). Use bullet points for clarity.",
      personalization: "Always reference company recent news or hiring trends. Mention specific pain points from research.",
      additional_notes: "Target VP+ level at Series B+ companies. Focus on AI infrastructure challenges.",
    },
    templates: {
      email_steps: [
        {
          step_name: "Pain Point Email",
          construct_instructions: "Start with a specific pain point we've identified from research. Show empathy and understanding of their challenges.",
          format_instructions: "Subject line: Question format. Body: 3 short paragraphs. End with a question.",
          template: "Subject: Struggling with AI agent scalability?\n\nHi {prospect_name},\n\nI noticed {company_name} is hiring rapidly for AI/ML roles. Many teams at this stage hit a wall when their AI agents need to scale from prototype to production.\n\nWe've helped companies like Acme Corp reduce their AI deployment time by 70% while maintaining enterprise-grade reliability.\n\nWould you be open to a quick call to explore if we could help {company_name} avoid similar scaling challenges?\n\nBest,\nSarah",
        },
        {
          step_name: "Agitation Email",
          construct_instructions: "Amplify the pain point. Show the cost of inaction. Create urgency.",
          format_instructions: "Use data points and specific metrics. Keep it factual, not fear-mongering.",
          template: "Subject: Re: AI infrastructure costs\n\nHi {prospect_name},\n\nFollowing up on my previous note. I wanted to share something that might be relevant.\n\nOur research shows that companies scaling AI without proper infrastructure typically see:\n• 3-5x higher cloud costs than necessary\n• 40% of engineering time spent on DevOps instead of features\n• 6-9 month delays to production\n\nIs {company_name} experiencing any of these challenges?\n\nHappy to share how we've helped similar companies.\n\nBest,\nSarah",
        },
        {
          step_name: "Initial Solution Email",
          construct_instructions: "Present LYZR as the solution. Focus on outcomes, not features.",
          format_instructions: "Use a case study approach. Quantify results.",
          template: "Subject: How Acme Corp deployed 15 AI agents in 30 days\n\nHi {prospect_name},\n\nI thought you'd find this relevant: Acme Corp (Series B, similar scale to {company_name}) recently used LYZR to deploy 15 production AI agents in just 30 days.\n\nKey results:\n✓ 70% faster deployment\n✓ 50% reduction in infrastructure costs\n✓ Zero DevOps bottlenecks\n\nWould a 15-minute call to discuss their approach make sense?\n\nBest,\nSarah",
        },
        {
          step_name: "Customer Proof Email",
          construct_instructions: "Share customer success stories and social proof.",
          format_instructions: "Use logos, testimonials, and specific metrics.",
          template: "Subject: {company_name} + LYZR?\n\nHi {prospect_name},\n\nQuick update: we just published a case study showing how TechCorp went from 0 to 20 production AI agents using LYZR.\n\nThey're now processing 1M+ AI requests/day with 99.9% uptime.\n\nFull story: [link to case study]\n\nWorth a quick chat to see if we could help {company_name} achieve similar results?\n\nBest,\nSarah",
        },
        {
          step_name: "Data Points Email",
          construct_instructions: "Share relevant data, benchmarks, or insights about their industry or challenge.",
          format_instructions: "Lead with data. Make it actionable.",
          template: "Subject: AI deployment benchmark data\n\nHi {prospect_name},\n\nWe recently surveyed 200 companies deploying AI agents. The top performers share 3 common traits:\n\n1. Automated CI/CD for AI models\n2. Built-in observability from day 1\n3. Production-grade security by default\n\nDoes {company_name} have these in place?\n\nI can share the full report if helpful.\n\nBest,\nSarah",
        },
        {
          step_name: "Address Concerns Email",
          construct_instructions: "Proactively address common objections or concerns.",
          format_instructions: "Acknowledge the concern, then resolve it with facts.",
          template: "Subject: Common questions about LYZR\n\nHi {prospect_name},\n\nI realize you might have questions about whether LYZR is right for {company_name}.\n\nThe most common questions we get:\n• \"Can it integrate with our existing stack?\" (Yes - API-first design)\n• \"What about security?\" (SOC 2 Type II, GDPR compliant)\n• \"How long to see results?\" (Most teams ship first agent in 2 weeks)\n\nWhat concerns do you have?\n\nBest,\nSarah",
        },
        {
          step_name: "First Offer Email",
          construct_instructions: "Make a clear, low-friction offer to start the conversation.",
          format_instructions: "One clear CTA. Make it easy to say yes.",
          template: "Subject: 15-minute AI infrastructure audit?\n\nHi {prospect_name},\n\nFinal note from me: I'd like to offer {company_name} a complimentary 15-minute AI infrastructure audit.\n\nWe'll review your current setup and share specific recommendations - no strings attached.\n\nInterested? Just reply with a couple of times that work.\n\nBest,\nSarah",
        },
      ],
      linkedin_template: "Hi {prospect_name}, noticed your work on AI at {company_name}. We're helping similar companies scale their AI agents to production 3x faster. Would love to connect and share insights.",
      voice_template: "1. Introduction: Hi {prospect_name}, this is Sarah from LYZR.\n\n2. Purpose: Quick call about how we're helping companies like yours deploy AI agents faster.\n\n3. Qualification: Are you currently working on AI/ML initiatives?\n\n4. Value prop: We help teams go from prototype to production in weeks, not months.\n\n5. Close: Would a brief conversation make sense?",
    },
    scheduling: {
      max_touches: 7,
      interval_days: 2,
      time_window: { start: "09:00", end: "17:00" },
      timezone: "America/New_York",
      allowed_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  {
    name: "SaaS Mid-Market - Product-Led Growth",
    status: "active",
    mode: "Sales Mode",
    aiReasoning: {
      objective: "Product-led expansion",
      avgICPScore: 82,
      explanation: "Mid-market SaaS companies with product-led growth models need developer-friendly AI tools. These companies value speed to market and developer experience over enterprise features. Campaign focuses on technical decision-makers (Directors/Managers) with hands-on involvement.",
      approach: "Product-led",
      riskFlags: ["High technical scrutiny", "Long evaluation periods"],
    },
    strategyType: "Product-Led Growth",
    primaryGoal: "Start Conversation",
    channelMix: ["Email", "LinkedIn"],
    agentProfile: {
      agent_name: "Marcus Rodriguez",
      agent_designation: "SDR Team Lead",
      agent_contact: "marcus.r@lyzr.ai",
      seller_name: "LYZR",
    },
    instructions: {
      construct: "Lead with product value and quick wins. Reference their tech stack.",
      format: "Casual but professional. Use short sentences. Heavy personalization.",
      personalization: "Mention their current tools (from technographics). Reference their role and recent activity.",
      additional_notes: "Target Director/Manager level. Focus on developer experience and time-to-value.",
    },
    templates: {
      email_steps: [
        {
          step_name: "Pain Point Email",
          construct_instructions: "Identify developer productivity pain points. Show understanding of their stack.",
          format_instructions: "Conversational tone. Keep it under 100 words.",
          template: "Subject: Faster AI agent development for {company_name}?\n\nHey {prospect_name},\n\nSaw you're using [current tool] for AI. Quick question: how much time does your team spend on deployment and monitoring vs. building features?\n\nWe're helping teams cut deployment time by 70% so devs can focus on what matters.\n\nWorth a quick chat?\n\nMarcus",
        },
        {
          step_name: "Agitation Email",
          construct_instructions: "Highlight the opportunity cost of slow development cycles.",
          format_instructions: "Use relatable developer pain points.",
          template: "Subject: Your devs deserve better AI tools\n\n{prospect_name},\n\nJust following up. Most teams we talk to say their developers spend 60% of time on infrastructure and only 40% building AI features.\n\nThat's backwards.\n\nLYZR flips that ratio. Interested in seeing how?\n\nMarcus",
        },
        {
          step_name: "Initial Solution Email",
          construct_instructions: "Show the product in action. Offer a demo or trial.",
          format_instructions: "Action-oriented. Clear next step.",
          template: "Subject: See LYZR in action (5 min demo)\n\nHi {prospect_name},\n\nI put together a quick 5-minute video showing how to deploy your first AI agent with LYZR.\n\n[Demo link]\n\nNo fluff, just the product. Let me know what you think?\n\nMarcus",
        },
        {
          step_name: "Customer Proof Email",
          construct_instructions: "Share similar company success stories.",
          format_instructions: "Peer-to-peer social proof.",
          template: "Subject: How similar SaaS companies use LYZR\n\n{prospect_name},\n\nThought you'd appreciate this: 3 SaaS companies similar to {company_name} shared how they use LYZR:\n\n• CompanyA: Automated 80% of support tickets\n• CompanyB: Built 10 AI agents in 1 month\n• CompanyC: Reduced AI costs by 60%\n\nWant to see their full stories?\n\nMarcus",
        },
        {
          step_name: "Data Points Email",
          construct_instructions: "Share product metrics or benchmarks.",
          format_instructions: "Data-driven but digestible.",
          template: "Subject: AI development benchmarks\n\n{prospect_name},\n\nInteresting data: Teams using LYZR ship AI features 3.2x faster than industry average.\n\nKey factors:\n→ No-code agent builder (70% faster)\n→ Built-in monitoring (saves 20 hrs/week)\n→ One-click deployment (vs. days of DevOps)\n\nCurious how {company_name} compares?\n\nMarcus",
        },
        {
          step_name: "Address Concerns Email",
          construct_instructions: "Address technical concerns proactively.",
          format_instructions: "Technical but accessible.",
          template: "Subject: Technical Q&A about LYZR\n\n{prospect_name},\n\nCommon technical questions:\n\nQ: Does it work with our stack?\nA: API-first. Integrates with any backend.\n\nQ: Can we self-host?\nA: Yes, or use our cloud.\n\nQ: Learning curve?\nA: Your team can ship first agent same day.\n\nWhat else would you want to know?\n\nMarcus",
        },
        {
          step_name: "First Offer Email",
          construct_instructions: "Offer a trial or hands-on demo.",
          format_instructions: "Low friction. Easy yes.",
          template: "Subject: Free 14-day trial for {company_name}?\n\n{prospect_name},\n\nLast note: I'd love to set up {company_name} with a free 14-day trial.\n\nNo credit card. Full platform access. We'll even help you build your first agent.\n\nGame?\n\nMarcus",
        },
      ],
      linkedin_template: "Hey {prospect_name}! Saw your post about {topic}. We're helping similar teams ship AI features faster. Mind if I share how?",
      voice_template: "1. Hi, Marcus from LYZR\n2. Calling about faster AI development for {company_name}\n3. Quick question: how long does it take your team to deploy an AI feature?\n4. We help teams do it in days, not months\n5. Worth a quick call?",
    },
    scheduling: {
      max_touches: 6,
      interval_days: 3,
      time_window: { start: "10:00", end: "18:00" },
      timezone: "America/Los_Angeles",
      allowed_days: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    },
  },
  {
    name: "Startup Founders - Early Stage",
    status: "active",
    mode: "Sales Mode",
    aiReasoning: {
      objective: "Net-new outbound",
      avgICPScore: 75,
      explanation: "Early-stage founders need fast, cost-effective AI infrastructure. This campaign targets high-intent prospects with resource constraints who value speed to market. Focus on quick wins and low-friction adoption.",
      approach: "Value-led",
      riskFlags: ["Early-stage founders (limited budget)", "Low historical reply rate for similar ICPs"],
    },
    strategyType: "Net-new Outbound",
    primaryGoal: "Book Meeting",
    channelMix: ["Email", "LinkedIn"],
    agentProfile: {
      agent_name: "Priya Sharma",
      agent_designation: "Founder SDR",
      agent_contact: "priya.sharma@lyzr.ai",
      seller_name: "LYZR",
    },
    instructions: {
      construct: "Founder-to-founder tone. Focus on speed and capital efficiency.",
      format: "Very brief. Respect their time. Get to the point.",
      personalization: "Reference their recent funding, hiring, or product launches.",
      additional_notes: "Target founders and founding team members at Pre-seed to Series A.",
    },
    templates: {
      email_steps: [
        {
          step_name: "Pain Point Email",
          construct_instructions: "Acknowledge the founder's resource constraints and speed needs.",
          format_instructions: "Super short. Under 75 words.",
          template: "Subject: Ship AI features faster?\n\n{prospect_name},\n\nCongrats on the recent funding! Building AI features as a startup is tough - you need speed but can't compromise quality.\n\nWe help startups ship production AI in days. Acme went 0→production in 2 weeks.\n\nQuick chat?\n\nPriya",
        },
        {
          step_name: "Agitation Email",
          construct_instructions: "Highlight the opportunity cost and competitive risk.",
          format_instructions: "Urgent but not pushy.",
          template: "Subject: Your competitors are shipping AI fast\n\n{prospect_name},\n\nQuick follow-up: saw 3 companies in your space launch AI features this month.\n\nSpeed matters. We can help you catch up (or get ahead).\n\n15 min call?\n\nPriya",
        },
        {
          step_name: "Initial Solution Email",
          construct_instructions: "Show how fast they can get results.",
          format_instructions: "Emphasize speed and ease.",
          template: "Subject: 1 week to your first AI agent\n\n{prospect_name},\n\nLYZR = AI platform for startups who need to move fast.\n\nDay 1: Setup\nDay 2-5: Build\nDay 6-7: Deploy\n\nNo AI/ML team required.\n\nInterested?\n\nPriya",
        },
        {
          step_name: "Customer Proof Email",
          construct_instructions: "Share startup success stories and metrics.",
          format_instructions: "Focus on outcomes, not process.",
          template: "Subject: Startups like {company_name} using LYZR\n\n{prospect_name},\n\n5 startups launched AI features with LYZR last month:\n\n• 2 seed-stage\n• 3 Series A\n• Average time: 12 days\n• Zero ML hires needed\n\nYou could be next?\n\nPriya",
        },
        {
          step_name: "Data Points Email",
          construct_instructions: "Share relevant benchmarks for startups.",
          format_instructions: "Quick stats. Actionable insights.",
          template: "Subject: AI adoption stats for startups\n\n{prospect_name},\n\nLatest data:\n\n→ 78% of Series A companies now use AI features\n→ Average dev time: 6 weeks (without LYZR)\n→ With LYZR: 2 weeks\n\nWhere does {company_name} stand?\n\nPriya",
        },
        {
          step_name: "Address Concerns Email",
          construct_instructions: "Address startup-specific concerns (cost, complexity, time).",
          format_instructions: "Reassuring and practical.",
          template: "Subject: Common concerns about LYZR\n\n{prospect_name},\n\nStartup founders usually ask:\n\n\"Too expensive?\" → Startup pricing available\n\"Too complex?\" → No-code builder\n\"Takes too long?\" → First agent in days\n\nWhat's holding you back?\n\nPriya",
        },
        {
          step_name: "First Offer Email",
          construct_instructions: "Make an irresistible, low-risk offer.",
          format_instructions: "Single clear CTA.",
          template: "Subject: Free startup package for {company_name}\n\n{prospect_name},\n\nFinal offer: Free startup package for {company_name}.\n\nIncludes:\n✓ 3 months free\n✓ Onboarding support\n✓ Priority support\n\nInterested? Reply with \"YES\"\n\nPriya",
        },
      ],
      linkedin_template: "{prospect_name} - saw your launch on PH. Congrats! We help startups add AI features fast. Chat?",
      voice_template: "1. Hi, Priya from LYZR\n2. Congrats on your funding\n3. Help startups ship AI features in weeks\n4. Worth a quick call?\n5. Great, when works?",
    },
    scheduling: {
      max_touches: 5,
      interval_days: 2,
      time_window: { start: "08:00", end: "20:00" },
      timezone: "America/Los_Angeles",
      allowed_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
];

const sampleKnowledgeItems = [
  {
    type: "url",
    url: "https://lyzr.ai/case-studies/acme-corp",
    url_title: "Acme Corp Case Study - 70% Faster AI Deployment",
  },
  {
    type: "url",
    url: "https://lyzr.ai/whitepapers/ai-infrastructure-guide",
    url_title: "Complete Guide to AI Infrastructure",
  },
  {
    type: "note",
    note_title: "Objection Handling Guide",
    note_content: "Common objections and responses:\n\n1. 'Too expensive' → ROI calculator shows 3x cost savings\n2. 'Too complex' → Demo shows first agent in 30 mins\n3. 'Not right time' → Opportunity cost of waiting",
  },
  {
    type: "file",
    file_name: "LYZR-Product-Overview.pdf",
    file_type: "PDF",
    file_size: 245000,
  },
  {
    type: "file",
    file_name: "Security-Compliance-Doc.pdf",
    file_type: "PDF",
    file_size: 180000,
  },
];

async function seedCampaigns() {
  try {
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Clear existing campaigns (optional - comment out if you want to keep existing)
    // await OutreachCampaignV2.deleteMany({});
    // await OutreachCampaignProspect.deleteMany({});
    // await OutreachCampaignKnowledgeItem.deleteMany({});
    // console.log("🗑️  Cleared existing campaigns");

    // Create sample campaigns
    for (const campaignData of sampleCampaigns) {
      const campaign = await OutreachCampaignV2.create({
        ...campaignData,
        createdBy: "demo@lyzr.ai",
      });
      console.log(`✅ Created campaign: ${campaign.name}`);

      // Add 2-3 knowledge items per campaign
      const knowledgeItemsToAdd = sampleKnowledgeItems.slice(0, 3);
      for (const item of knowledgeItemsToAdd) {
        await OutreachCampaignKnowledgeItem.create({
          campaign_id: campaign._id,
          ...item,
          uploadedBy: "demo@lyzr.ai",
        });
      }
      console.log(`  📚 Added ${knowledgeItemsToAdd.length} knowledge items`);

      // Find or create sample leads to add as prospects
      const sampleLeadData = [
        {
          name: "John Smith",
          email: "john.smith@techcorp.com",
          title: "VP Engineering",
          company: "TechCorp Inc",
        },
        {
          name: "Emily Davis",
          email: "emily.davis@innovate.io",
          title: "CTO",
          company: "Innovate.io",
        },
        {
          name: "Michael Chen",
          email: "michael.chen@startupxyz.com",
          title: "Founder & CEO",
          company: "StartupXYZ",
        },
      ];

      for (const leadData of sampleLeadData) {
        // Find or create company
        let company = await Company.findOne({ name: leadData.company });
        if (!company) {
          company = await Company.create({ name: leadData.company });
        }

        // Find or create persona
        let persona = await Persona.findOne({ email: leadData.email });
        if (!persona) {
          persona = await Persona.create({
            full_name: leadData.name,
            email: leadData.email,
            title: leadData.title,
          });
        }

        // Find or create lead
        let lead = await Lead.findOne({ email: leadData.email });
        if (!lead) {
          lead = await Lead.create({
            name: leadData.name,
            email: leadData.email,
            title: leadData.title,
            company_name: leadData.company,
            company_id: company._id,
            persona_id: persona._id,
            stage: "Research",
          });
        }

        // Add lead to campaign as prospect (if not already added)
        const existingProspect = await OutreachCampaignProspect.findOne({
          campaign_id: campaign._id,
          lead_id: lead._id,
        });

        if (!existingProspect) {
          await OutreachCampaignProspect.create({
            campaign_id: campaign._id,
            lead_id: lead._id,
            status: "active",
            current_step: Math.floor(Math.random() * 3), // Random step 0-2
            metrics: {
              emails_sent: Math.floor(Math.random() * 3),
              emails_opened: Math.floor(Math.random() * 2),
              replies: Math.random() > 0.7 ? 1 : 0,
            },
          });
        }
      }
      console.log(`  👥 Added ${sampleLeadData.length} prospects`);
    }

    console.log("\n✨ Campaign seeding complete!");
    console.log(`📊 Created ${sampleCampaigns.length} campaigns with:`);
    console.log(`   - Agent profiles`);
    console.log(`   - Email templates for all 7 steps`);
    console.log(`   - Knowledge base items`);
    console.log(`   - Sample prospects`);
    console.log(`   - Scheduling configuration`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding campaigns:", error);
    process.exit(1);
  }
}

// Run the seed function
seedCampaigns();

