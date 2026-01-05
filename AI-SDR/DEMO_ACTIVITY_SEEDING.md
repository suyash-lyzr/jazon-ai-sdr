# Demo Activity Seeding Guide

This guide explains how to seed realistic demo activity data for enterprise demos.

## What Gets Seeded

The script generates:
- ✉️ **Email events** (sent, opened, clicked, replied, unsubscribed)
- 💼 **LinkedIn messages** (connection requests)
- 🤖 **AI decision logs** (paused, escalated, timing adjusted)
- 📊 **Updated prospect metrics** (emails sent/opened/clicked, replies)
- 📈 **Campaign-level aggregated metrics**

## Prerequisites

1. **MongoDB connection** must be configured (`.env.local` with `MONGODB_URI`)
2. **Campaign exists** with at least one lead added
3. **Leads have been scored** (status: `icp_scored`)

## How to Run

### Option 1: Auto-detect Demo Campaign (by name)

The script will automatically find a campaign with "demo" in its name:

```bash
npm run seed:demo-activity
```

### Option 2: Specify Campaign ID

If you want to seed a specific campaign:

```bash
CAMPAIGN_ID=<your-campaign-id> npm run seed:demo-activity
```

To get a campaign ID:
1. Go to your Campaigns page
2. Click on a campaign
3. Copy the ID from the URL: `/outreach/campaigns/<ID>`

## What the Script Does

### For Each Prospect in the Campaign:

1. **Determines activity level** (random distribution):
   - **High engagement** (30%): Multiple emails, opens, clicks, reply → Status: `replied`, AI: `escalate_to_call`
   - **Medium engagement** (30%): Emails, opens, LinkedIn → Status: `active`, AI: `actively_pursue`
   - **Low engagement** (20%): Emails sent, no opens → Status: `paused`, AI: `pause_low_intent`
   - **Unsubscribed** (20%): Email sent, then unsubscribed → Status: `disqualified`, AI: `remove_from_campaign`

2. **Creates realistic events** with:
   - Real email subject lines and bodies (personalized with lead name/company)
   - LinkedIn connection messages
   - Timestamps spread over the last 14 days
   - Proper sequencing (can't click before opening)

3. **Updates metrics** on each prospect:
   - `emails_sent`, `emails_opened`, `emails_clicked`
   - `linkedin_sent`, `replies`
   - `last_touch_at`, `next_touch_at`
   - `current_step`

4. **Adds AI decision logs** (50% of prospects get 1-2 decisions):
   - "Paused outreach to John Smith - No opens after 3 emails"
   - "Escalated Emily Davis to call - Replied twice with positive signals"
   - "Advanced next touch for Michael Chen - Engagement spike detected"

5. **Updates campaign aggregate metrics**:
   - Total emails sent
   - Response rate
   - Active/replied/booked prospect counts

## Demo Email Content

The script uses realistic enterprise sales messaging:

### Sample Email Subjects:
- "Quick question about your digital transformation initiatives"
- "Struggling with proving ROI for digital/AI initiatives?"
- "Following up: AI-powered sales workflows"

### Sample Email Body (excerpt):
```
Hi Pradeep,

I work with teams that sell digital solutions into complex enterprise
accounts, where one of the recurring challenges is proving ROI and
business outcomes for digital/AI initiatives across multiple stakeholders.

LYZR helps sales and GTM teams package and communicate outcome-driven
narratives more consistently—so sellers can differentiate solutions,
align stakeholders faster, and reduce proposal back-and-forth.

Would you be open to a brief conversation to see if this is relevant
for your Digital Solutions motion at Accenture?

Best,
Alex Morgan
Senior SDR, LYZR
```

## Viewing the Results

After seeding:

1. **Go to Campaign → Activity tab**
2. You'll see:
   - 📊 **Metrics cards**: Mails, Replies, Opens, Clicks, Unsubscribe counts
   - 📋 **Receipts list**: Each prospect with their last activity
   - 🤖 **AI Decisions Log**: Recent AI decisions with reasoning

## Re-running / Clearing Data

The script automatically:
- ✅ **Clears previous demo data** (events with `metadata.source = "demo_seed"`)
- ✅ **Resets prospect metrics** before generating new data
- ✅ **Preserves real activity** (non-demo events are untouched)

So you can safely run it multiple times to refresh the demo.

## Safety Notes

- ✅ No actual emails/messages are sent (all simulated)
- ✅ Demo events are tagged with `metadata.source: "demo_seed"`
- ✅ Only affects the specified campaign
- ✅ Does not modify lead research or ICP scores

## Troubleshooting

### "No campaign found"
- **Solution**: Create a campaign with "demo" in the name, OR specify `CAMPAIGN_ID=<id>`

### "No prospects in campaign"
- **Solution**: Add at least one lead to the campaign via the "Leads" tab

### "Research and ICP scoring must be completed"
- **Solution**: Ensure leads have been through research & scoring (status: `icp_scored`)

## Example Output

```bash
$ npm run seed:demo-activity

🌱 Starting demo activity seeding...
✅ Database connected successfully
📋 Using campaign: 694a73e1922e310fef7f7b98
👥 Found 9 prospects
🗑️  Cleared existing demo events
📊 Updated campaign metrics
✅ Seeded 127 demo events for 9 prospects
🎉 Demo activity seeding complete!
```

## For Enterprise Demos

This creates a realistic, "lived-in" campaign that shows:
- Active outreach in progress
- Varied prospect engagement levels
- AI making intelligent decisions
- Clear metrics and ROI visibility
- Professional, enterprise-appropriate messaging

Perfect for showing potential clients how Jazon AI SDR operates in production! 🚀
