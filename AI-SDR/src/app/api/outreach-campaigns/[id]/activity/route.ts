import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import OutreachCampaignV2 from "@/models/OutreachCampaignV2";
import OutreachCampaignProspect from "@/models/OutreachCampaignProspect";
import OutreachEvent from "@/models/OutreachEvent";

export const runtime = "nodejs";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/outreach-campaigns/[id]/activity - Get campaign performance metrics
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const { id } = await params;
    console.log(
      `✅ Database connected for GET /api/outreach-campaigns/${id}/activity`
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

    // Fetch all prospects in campaign
    const prospects = await OutreachCampaignProspect.find({
      campaign_id: id,
    }).populate("lead_id");

    // Calculate aggregate metrics
    let totalEmails = 0;
    let totalOpens = 0;
    let totalClicks = 0;
    let totalReplies = 0;
    let totalLinkedIn = 0;
    let totalCalls = 0;
    let meetingsBooked = 0;
    let unsubscribes = 0;

    // Channel-wise metrics
    const channelMetrics: Record<string, any> = {
      Email: { sent: 0, opened: 0, replied: 0, booked: 0 },
      LinkedIn: { sent: 0, opened: 0, replied: 0, booked: 0 },
      Call: { sent: 0, opened: 0, replied: 0, booked: 0 },
      WhatsApp: { sent: 0, opened: 0, replied: 0, booked: 0 },
    };

    // Step-wise email metrics
    const stepMetrics: Record<string, any> = {};
    const emailSteps = campaign.templates?.email_steps || [];
    emailSteps.forEach((step) => {
      stepMetrics[step.step_name] = {
        sent: 0,
        opened: 0,
        replied: 0,
        dropoff: 0,
      };
    });

    // Funnel stages
    let contacted = 0;
    let opened = 0;
    let replied = 0;
    let qualified = 0;

    prospects.forEach((prospect) => {
      // Aggregate totals
      totalEmails += prospect.metrics.emails_sent || 0;
      totalOpens += prospect.metrics.emails_opened || 0;
      totalClicks += prospect.metrics.emails_clicked || 0;
      totalReplies += prospect.metrics.replies || 0;
      totalLinkedIn += prospect.metrics.linkedin_sent || 0;
      totalCalls += prospect.metrics.voice_calls || 0;

      // Channel metrics
      if (prospect.metrics.emails_sent > 0) {
        channelMetrics.Email.sent += prospect.metrics.emails_sent;
        channelMetrics.Email.opened += prospect.metrics.emails_opened || 0;
        channelMetrics.Email.replied += prospect.metrics.replies || 0;
      }
      if (prospect.metrics.linkedin_sent > 0) {
        channelMetrics.LinkedIn.sent += prospect.metrics.linkedin_sent;
      }
      if (prospect.metrics.voice_calls > 0) {
        channelMetrics.Call.sent += prospect.metrics.voice_calls;
      }

      // Funnel metrics
      if (prospect.metrics.emails_sent > 0 || prospect.metrics.linkedin_sent > 0 || prospect.metrics.voice_calls > 0) {
        contacted++;
      }
      if (prospect.metrics.emails_opened > 0) {
        opened++;
      }
      if (prospect.metrics.replies > 0) {
        replied++;
      }
      if (prospect.status === "booked") {
        meetingsBooked++;
        qualified++;
        channelMetrics.Email.booked++;
      }

      // Step-wise metrics (simplified - based on current_step)
      const currentStep = prospect.current_step;
      if (currentStep > 0 && currentStep <= emailSteps.length) {
        const stepName = emailSteps[currentStep - 1]?.step_name;
        if (stepName && stepMetrics[stepName]) {
          stepMetrics[stepName].sent++;
          if (prospect.metrics.emails_opened > 0) {
            stepMetrics[stepName].opened++;
          }
          if (prospect.metrics.replies > 0) {
            stepMetrics[stepName].replied++;
          }
        }
      }
    });

    // Calculate rates
    const openRate = totalEmails > 0 ? Math.round((totalOpens / totalEmails) * 100) : null;
    const replyRate = totalEmails > 0 ? Math.round((totalReplies / totalEmails) * 100) : null;

    // Calculate channel-wise rates
    Object.keys(channelMetrics).forEach((channel) => {
      const ch = channelMetrics[channel];
      ch.openRate = ch.sent > 0 ? Math.round((ch.opened / ch.sent) * 100) : null;
      ch.replyRate = ch.sent > 0 ? Math.round((ch.replied / ch.sent) * 100) : null;
    });

    // Calculate step-wise rates and drop-offs
    emailSteps.forEach((step, index) => {
      const stepName = step.step_name;
      if (stepMetrics[stepName]) {
        const sm = stepMetrics[stepName];
        sm.openRate = sm.sent > 0 ? Math.round((sm.opened / sm.sent) * 100) : null;
        sm.replyRate = sm.sent > 0 ? Math.round((sm.replied / sm.sent) * 100) : null;
        
        // Drop-off: % of leads that didn't move to next step
        if (index < emailSteps.length - 1) {
          const nextStepName = emailSteps[index + 1].step_name;
          const nextStepSent = stepMetrics[nextStepName]?.sent || 0;
          sm.dropoffRate = sm.sent > 0 ? Math.round(((sm.sent - nextStepSent) / sm.sent) * 100) : null;
        }
      }
    });

    // Generate AI insights
    const insights: string[] = [];
    
    // Insight 1: Best performing email step
    let bestStep = { name: "", rate: 0 };
    Object.keys(stepMetrics).forEach((stepName) => {
      const rate = stepMetrics[stepName].replyRate || 0;
      if (rate > bestStep.rate) {
        bestStep = { name: stepName, rate };
      }
    });
    if (bestStep.name && bestStep.rate > 0) {
      insights.push(`"${bestStep.name}" drives the highest reply rate (${bestStep.rate}%).`);
    }

    // Insight 2: Overall conversion insight
    if (totalEmails > 0 && meetingsBooked > 0) {
      const conversionRate = ((meetingsBooked / prospects.length) * 100).toFixed(1);
      insights.push(`Campaign converts at ${conversionRate}% from leads to meetings.`);
    }

    // Insight 3: Engagement insight
    if (openRate && openRate > 0) {
      if (openRate > 50) {
        insights.push(`Strong email engagement detected with ${openRate}% open rate.`);
      } else if (openRate < 20) {
        insights.push(`Low email engagement (${openRate}% open rate) suggests targeting or messaging optimization needed.`);
      }
    }

    // Insight 4: Reply rate insight
    if (replyRate && replyRate > 0) {
      if (replyRate > 10) {
        insights.push(`High reply rate (${replyRate}%) indicates strong message-market fit.`);
      }
    }

    // Fetch events for all prospects in campaign
    const leadIds = prospects.map((p) => p.lead_id);
    const events = await OutreachEvent.find({
      lead_id: { $in: leadIds },
    }).sort({ timestamp: -1 });

    // Group events by prospect
    const eventsByProspect: Record<string, typeof events> = {};
    events.forEach((event) => {
      const leadId = event.lead_id.toString();
      if (!eventsByProspect[leadId]) {
        eventsByProspect[leadId] = [];
      }
      eventsByProspect[leadId].push(event);
    });

    // Build prospects with history and outcome
    const prospectsWithHistory = prospects.map((prospect) => {
      const lead = prospect.lead_id as any;
      const leadId = lead._id.toString();
      const prospectEvents = eventsByProspect[leadId] || [];

      // Determine outcome
      let outcome = "No response";
      if (prospect.status === "booked") {
        outcome = "Booked";
      } else if (prospect.status === "disqualified") {
        outcome = "Disqualified";
      } else if (prospect.metrics.replies > 0) {
        outcome = "Replied";
      }

      // Get last message timestamp
      const lastMessageEvent = prospectEvents.find(
        (e) => e.event_type === "outreach" && e.direction === "outbound"
      );

      return {
        _id: prospect._id,
        lead_id: lead._id,
        lead_name: lead.name || "Unknown",
        lead_email: lead.email || "",
        lead_title: lead.title || "",
        lead_company: lead.company_name || "",
        status: prospect.status,
        current_step: prospect.current_step,
        metrics: prospect.metrics,
        outcome,
        last_message_sent: lastMessageEvent?.timestamp || prospect.metrics.last_touch_at || null,
        history: prospectEvents.map((e) => ({
          id: e._id,
          eventType: e.event_type,
          timestamp: e.timestamp,
          actor: e.actor,
          title: e.title,
          summary: e.summary,
          badge: e.badge,
          channel: e.channel,
          direction: e.direction,
          content: e.content,
          metadata: e.metadata,
        })),
      };
    });

    // Format events for activity feed
    const formattedEvents = events.map((event) => {
      const lead = prospects.find((p: any) => p.lead_id._id.toString() === event.lead_id.toString())?.lead_id as any;
      return {
        id: event._id,
        type: event.event_type,
        title: event.title,
        description: event.summary,
        lead_name: lead?.name || "Unknown",
        lead_company: lead?.company_name || "",
        channel: event.channel,
        badge: event.badge,
        direction: event.direction,
        timestamp: event.timestamp,
        actor: event.actor,
        content: event.content,
        metadata: event.metadata,
      };
    });

    return NextResponse.json(
      {
        success: true,
        metrics: {
          total_leads: prospects.length,
          mails_sent: totalEmails,
          opens: totalOpens,
          clicks: totalClicks,
          replies: totalReplies,
          meetings_booked: meetingsBooked,
          unsubscribes,
          open_rate: openRate,
          reply_rate: replyRate,
          response_rate:
            totalEmails > 0
              ? Math.round((totalReplies / totalEmails) * 100)
              : 0,
        },
        funnel: {
          leads_added: prospects.length,
          contacted,
          opened,
          replied,
          qualified,
          meetings_booked: meetingsBooked,
        },
        channelMetrics,
        stepMetrics,
        insights,
        prospects: prospectsWithHistory,
        events: formattedEvents,
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

