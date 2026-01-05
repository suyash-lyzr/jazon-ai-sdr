// Load environment variables first
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import mongoose from "mongoose";
import connectDB from "../lib/mongodb";
import OutreachCampaignV2 from "../models/OutreachCampaignV2";
import OutreachCampaignProspect from "../models/OutreachCampaignProspect";
import OutreachEvent from "../models/OutreachEvent";
import Lead from "../models/Lead";

/**
 * Seed demo activity for a campaign
 * Usage: CAMPAIGN_ID=<id> npm run seed:demo-activity
 */

// Helper to generate random timestamp within last N days
function randomDateInLastDays(days: number): Date {
  const now = Date.now();
  const daysMs = days * 24 * 60 * 60 * 1000;
  const randomMs = Math.random() * daysMs;
  return new Date(now - randomMs);
}

// Helper to pick random item from array
function randomPick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Sample email subjects and bodies for demo
const emailSubjects = [
  "Quick question about your digital transformation initiatives",
  "Struggling with proving ROI for digital/AI initiatives?",
  "Thought this might be relevant for Accenture",
  "Following up: AI-powered sales workflows",
  "Re: Our conversation about sales automation",
];

const emailBodies = [
  `Hi {{name}},

I work with teams that sell digital solutions into complex enterprise accounts, where one of the recurring challenges is proving ROI and business outcomes for digital/AI initiatives across multiple stakeholders.

LYZR helps sales and GTM teams package and communicate outcome-driven narratives more consistently—so sellers can differentiate solutions, align stakeholders faster, and reduce proposal back-and-forth.

Would you be open to a brief conversation to see if this is relevant for your Digital Solutions motion at {{company}}?

Best,
Alex Morgan
Senior SDR, LYZR`,

  `Hi {{name}},

Following up on my previous note about AI-powered sales workflows.

I noticed {{company}} recently expanded its digital consulting practice. Many firms at this stage face challenges with sales team productivity and deal velocity.

We've helped similar organizations reduce proposal time by 40% and improve win rates through better stakeholder alignment.

Would it make sense to explore this for your team?

Best,
Alex Morgan`,

  `Hi {{name}},

In enterprise digital solutions sales, one recurring challenge is proving clear ROI and business outcomes for digital/AI initiatives—especially when multiple stakeholders need to align and the cycle is long.

LYZR helps teams reduce proposal and stakeholder complexity by packaging AI workflows and outcomes into a clearer, repeatable story your field teams can take to customers (with security and platform stakeholders in mind).

Open to a brief conversation to see if this could help your Digital Solutions motions at {{company}}?

Best,
Alex Morgan
Senior SDR, LYZR`,
];

const linkedInMessages = [
  "Hi {{name}}, I came across your profile and noticed you're leading digital transformation initiatives at {{company}}. I work with similar teams to streamline their sales processes. Would love to connect!",
  "{{name}}, saw your recent post about enterprise sales challenges. We help teams like yours reduce proposal complexity and improve stakeholder alignment. Let's connect?",
  "Hi {{name}}, working with GTM leaders at firms like {{company}} to improve digital sales outcomes. Would be great to exchange ideas—open to connecting?",
];

const aiDecisionReasons = [
  {
    decision: "Paused outreach to John Smith",
    reason: "No opens after 3 emails. Low intent signal detected.",
    type: "pause_low_intent",
  },
  {
    decision: "Escalated Emily Davis to call",
    reason: "Replied twice with positive signals. High intent detected.",
    type: "escalate_to_call",
  },
  {
    decision: "Advanced next touch for Michael Chen",
    reason: "Engagement spike detected. Opened email 3 times.",
    type: "timing_adjusted",
  },
  {
    decision: "Removed from campaign",
    reason: "Unsubscribed. Removing from all sequences.",
    type: "remove_from_campaign",
  },
  {
    decision: "Increased cadence",
    reason: "Strong engagement. Moving to next step earlier.",
    type: "timing_adjusted",
  },
];

async function seedDemoActivity() {
  try {
    console.log("🌱 Starting demo activity seeding...");
    await connectDB();

    // Get campaign ID from env or find by name
    const campaignId =
      process.env.CAMPAIGN_ID ||
      (
        await OutreachCampaignV2.findOne({
          name: { $regex: /demo/i },
        })
      )?._id?.toString();

    if (!campaignId) {
      console.error("❌ No campaign found. Set CAMPAIGN_ID env var or create a campaign with 'demo' in the name.");
      process.exit(1);
    }

    console.log(`📋 Using campaign: ${campaignId}`);

    // Get all prospects in campaign
    const prospects = await OutreachCampaignProspect.find({
      campaign_id: campaignId,
    }).populate("lead_id");

    if (prospects.length === 0) {
      console.error("❌ No prospects in campaign. Add some leads first.");
      process.exit(1);
    }

    console.log(`👥 Found ${prospects.length} prospects`);

    // Clear existing demo events
    await OutreachEvent.deleteMany({
      campaign_id: campaignId,
      "metadata.source": "demo_seed",
    });
    console.log("🗑️  Cleared existing demo events");

    let totalEvents = 0;
    let sortOrder = 1;

    // Generate events for each prospect
    for (const prospect of prospects) {
      const lead = prospect.lead_id as any;
      const leadName = lead.name || "Unknown";
      const companyName = lead.company_name || "their company";

      // Determine activity level (some active, some less)
      const activityLevel = Math.random();
      let eventsToGenerate = [];

      if (activityLevel > 0.7) {
        // High engagement: multiple emails, opens, clicks, reply
        eventsToGenerate = [
          "email_sent",
          "email_opened",
          "email_sent",
          "email_opened",
          "email_clicked",
          "email_sent",
          "email_opened",
          "email_replied",
        ];
        prospect.status = "replied";
        prospect.aiStatus = "escalate_to_call";
      } else if (activityLevel > 0.4) {
        // Medium engagement: emails, some opens
        eventsToGenerate = [
          "email_sent",
          "email_opened",
          "email_sent",
          "email_opened",
          "linkedin_sent",
        ];
        prospect.status = "active";
        prospect.aiStatus = "actively_pursue";
      } else if (activityLevel > 0.2) {
        // Low engagement: emails sent, no opens
        eventsToGenerate = ["email_sent", "email_sent", "email_sent"];
        prospect.status = "paused";
        prospect.aiStatus = "pause_low_intent";
      } else {
        // Very low or unsubscribed
        eventsToGenerate = ["email_sent", "email_unsubscribed"];
        prospect.status = "disqualified";
        prospect.aiStatus = "remove_from_campaign";
      }

      // Reset metrics
      prospect.metrics = {
        emails_sent: 0,
        emails_opened: 0,
        emails_clicked: 0,
        linkedin_sent: 0,
        voice_calls: 0,
        replies: 0,
        last_touch_at: null,
        next_touch_at: null,
      };

      const events: any[] = [];
      let lastTimestamp = randomDateInLastDays(14);

      for (const eventType of eventsToGenerate) {
        // Create timestamp (sequential)
        const timestamp = new Date(lastTimestamp.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000);
        lastTimestamp = timestamp;

        let event: any = {
          lead_id: lead._id,
          campaign_id: campaignId,
          timestamp,
          sort_order: sortOrder++,
          actor: "AI" as const,
          metadata: {
            source: "demo_seed",
          },
        };

        switch (eventType) {
          case "email_sent":
            const subject = randomPick(emailSubjects);
            const body = randomPick(emailBodies)
              .replace(/\{\{name\}\}/g, leadName.split(" ")[0] || leadName)
              .replace(/\{\{company\}\}/g, companyName);

            event = {
              ...event,
              event_type: "outreach",
              title: "Email sent",
              summary: `Pain Point Email sent to ${leadName}`,
              badge: "Email",
              channel: "Email",
              direction: "outbound",
              content: {
                subject,
                body,
              },
            };
            prospect.metrics.emails_sent++;
            prospect.metrics.last_touch_at = timestamp;
            prospect.current_step++;
            break;

          case "email_opened":
            event = {
              ...event,
              event_type: "engagement",
              title: "Email opened",
              summary: `${leadName} opened the email`,
              badge: "Opened",
              channel: "Email",
              direction: "inbound",
            };
            prospect.metrics.emails_opened++;
            break;

          case "email_clicked":
            event = {
              ...event,
              event_type: "engagement",
              title: "Link clicked",
              summary: `${leadName} clicked a link in the email`,
              badge: "Clicked",
              channel: "Email",
              direction: "inbound",
              metadata: {
                ...event.metadata,
                link_url: "https://lyzr.ai/demo",
              },
            };
            prospect.metrics.emails_clicked++;
            break;

          case "email_replied":
            event = {
              ...event,
              event_type: "engagement",
              title: "Reply received",
              summary: `${leadName} replied: "This looks interesting. Can we schedule a call next week?"`,
              badge: "Reply",
              channel: "Email",
              direction: "inbound",
              content: {
                body: "This looks interesting. Can we schedule a call next week to discuss further? I'd like to understand how this could work for our digital consulting practice.",
              },
            };
            prospect.metrics.replies++;
            break;

          case "linkedin_sent":
            const linkedInMsg = randomPick(linkedInMessages)
              .replace(/\{\{name\}\}/g, leadName.split(" ")[0] || leadName)
              .replace(/\{\{company\}\}/g, companyName);

            event = {
              ...event,
              event_type: "outreach",
              title: "LinkedIn message sent",
              summary: `Connection request sent to ${leadName}`,
              badge: "LinkedIn",
              channel: "LinkedIn",
              direction: "outbound",
              content: {
                body: linkedInMsg,
              },
            };
            prospect.metrics.linkedin_sent++;
            prospect.metrics.last_touch_at = timestamp;
            break;

          case "email_unsubscribed":
            event = {
              ...event,
              event_type: "outcome",
              title: "Unsubscribed",
              summary: `${leadName} unsubscribed from emails`,
              badge: "Unsubscribed",
              channel: "Email",
              direction: "inbound",
            };
            break;

          default:
            continue;
        }

        events.push(event);
        totalEvents++;
      }

      // Add 1-2 AI decision events for some prospects
      if (Math.random() > 0.5 && eventsToGenerate.length > 2) {
        const decision = randomPick(aiDecisionReasons);
        const aiEvent = {
          lead_id: lead._id,
          campaign_id: campaignId,
          event_type: "decision" as const,
          actor: "AI" as const,
          timestamp: new Date(lastTimestamp.getTime() + Math.random() * 24 * 60 * 60 * 1000),
          sort_order: sortOrder++,
          title: decision.decision,
          summary: decision.reason,
          badge: "AI Decision",
          channel: "",
          metadata: {
            source: "demo_seed",
            decision_type: decision.type,
          },
        };
        events.push(aiEvent);
        totalEvents++;
      }

      // Save all events for this prospect
      if (events.length > 0) {
        await OutreachEvent.insertMany(events);
      }

      // Update prospect metrics
      await prospect.save();
    }

    // Update campaign aggregate metrics
    const campaign = await OutreachCampaignV2.findById(campaignId);
    if (campaign) {
      const allProspects = await OutreachCampaignProspect.find({
        campaign_id: campaignId,
      });

      let totalEmails = 0;
      let totalReplies = 0;
      let totalActive = 0;
      let totalReplied = 0;
      let totalBooked = 0;

      allProspects.forEach((p) => {
        totalEmails += p.metrics.emails_sent;
        totalReplies += p.metrics.replies;
        if (p.status === "active") totalActive++;
        if (p.status === "replied") totalReplied++;
        if (p.status === "booked") totalBooked++;
      });

      campaign.metrics = {
        total_prospects: allProspects.length,
        active_prospects: totalActive,
        replied_prospects: totalReplied,
        booked_prospects: totalBooked,
        response_rate: totalEmails > 0 ? Math.round((totalReplies / totalEmails) * 100) : 0,
      };

      await campaign.save();
      console.log("📊 Updated campaign metrics");
    }

    console.log(`✅ Seeded ${totalEvents} demo events for ${prospects.length} prospects`);
    console.log("🎉 Demo activity seeding complete!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding demo activity:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  seedDemoActivity();
}

export default seedDemoActivity;
