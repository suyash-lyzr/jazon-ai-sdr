// Mock data and types for Jazon AI SDR

export interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  title: string;
  icpScore: number;
  stage: string;
  channel: string;
  status: string;
  lastContact: string;
  aiRecommendation: string;
  industry: string;
  companySize: string;
  triggers: string[];
  source?: string;
  ingestedAt?: string;
  importedBy?: string;
  originTrigger?: string;
  sourceMetadata?: {
    apolloListName?: string;
    apolloPersonId?: string;
    hubspotContactId?: string;
    salesforceLeadId?: string;
  };
}

export interface DecisionEvent {
  id: string;
  timestamp: string;
  leadName: string;
  company: string;
  action: string;
  reason: string;
  type: "escalation" | "disqualified" | "meeting" | "stopped" | "qualified";
  impact: string;
}

export interface QualificationData {
  leadId: string;
  need: { value: string; confidence: number; known: boolean };
  timeline: { value: string; confidence: number; known: boolean };
  authority: { value: string; confidence: number; known: boolean };
  budget: { value: string; confidence: number; known: boolean };
  overallScore: number;
  recommendation: "book_meeting" | "nurture" | "disqualify";
  reasoning: string;
}

export interface Message {
  id: string;
  channel: "email" | "linkedin" | "voice" | "whatsapp";
  direction: "inbound" | "outbound";
  timestamp: string;
  content?: string;
  subject?: string;
  duration?: string;
  outcome?: string;
  summary?: string;
  objections?: string[];
  body?: string;
  personalizationTokens?: string[];
  scriptUsed?: string;
  aiGenerated?: boolean;
}

export interface Meeting {
  id: string;
  leadId: string;
  leadName: string;
  company: string;
  scheduledFor: string;
  status: "upcoming" | "completed" | "cancelled";
  handoffPack: {
    researchSummary: string;
    qualificationNotes: string[];
    objectionsRaised: string[];
    suggestedTalkTrack: string[];
    whyBooked: string;
  };
}

// Mock Leads Data
export const mockLeads: Lead[] = [
  {
    id: "L001",
    name: "Sarah Chen",
    email: "sarah.chen@accenture.com",
    company: "Accenture",
    title: "VP of Sales Operations",
    icpScore: 94,
    stage: "Qualification",
    channel: "Email → LinkedIn",
    status: "Active",
    lastContact: "2 hours ago",
    aiRecommendation: "Escalate to voice qualification call",
    industry: "Professional Services",
    companySize: "10,000+ employees",
    triggers: ["New CRM migration", "Expanding sales team", "Budget approved"],
    source: "Salesforce",
    ingestedAt: "7 days ago",
    importedBy: "System Sync",
    originTrigger: "Salesforce lead sync - new opportunity record",
  },
  {
    id: "L002",
    name: "Marcus Johnson",
    email: "m.johnson@deloitte.com",
    company: "Deloitte",
    title: "Director of Business Development",
    icpScore: 88,
    stage: "Engaged",
    channel: "Email",
    status: "Active",
    lastContact: "1 day ago",
    aiRecommendation: "Continue nurture sequence",
    industry: "Consulting",
    companySize: "10,000+ employees",
    triggers: ["Hiring SDR team", "Q1 planning"],
    source: "Salesforce",
    ingestedAt: "9 days ago",
    importedBy: "System Sync",
    originTrigger: "Marketing campaign: Q1 pipeline acceleration",
  },
  {
    id: "L003",
    name: "Lisa Park",
    email: "lisa.park@nttdata.com",
    company: "NTT Data",
    title: "Head of Revenue Operations",
    icpScore: 91,
    stage: "Meeting Scheduled",
    channel: "Voice",
    status: "High Priority",
    lastContact: "3 hours ago",
    aiRecommendation: "Prepare AE handoff",
    industry: "IT Services",
    companySize: "10,000+ employees",
    triggers: ["AI transformation initiative", "Sales automation RFP"],
    source: "HubSpot",
    ingestedAt: "3 days ago",
    importedBy: "RevOps",
    originTrigger: "RFP form submission on website",
  },
  {
    id: "L004",
    name: "David Kumar",
    email: "d.kumar@airasia.com",
    company: "AirAsia",
    title: "Commercial Director",
    icpScore: 76,
    stage: "Research",
    channel: "Email",
    status: "Active",
    lastContact: "4 days ago",
    aiRecommendation: "Validate ICP fit before outreach",
    industry: "Aviation",
    companySize: "5,000-10,000 employees",
    triggers: ["Digital transformation"],
    source: "CSV",
    ingestedAt: "12 days ago",
    importedBy: "SDR Manager",
    originTrigger: "Uploaded from trade-show attendee list",
  },
  {
    id: "L005",
    name: "Jennifer Wu",
    email: "j.wu@enterprise.com",
    company: "Enterprise Software Corp",
    title: "SVP Sales",
    icpScore: 45,
    stage: "Disqualified",
    channel: "N/A",
    status: "Stopped",
    lastContact: "1 week ago",
    aiRecommendation: "Low ICP score - wrong market segment",
    industry: "Software",
    companySize: "500-1,000 employees",
    triggers: [],
    source: "Manual",
    ingestedAt: "2 weeks ago",
    importedBy: "AE Team",
    originTrigger: "Manually added from referral",
  },
  {
    id: "L006",
    name: "Robert Mitchell",
    email: "r.mitchell@pwc.com",
    company: "PwC",
    title: "Sales Operations Lead",
    icpScore: 88,
    stage: "Engaged",
    channel: "Email → LinkedIn",
    status: "Active",
    lastContact: "1 day ago",
    aiRecommendation: "Continue nurturing - high intent signals",
    industry: "Professional Services",
    companySize: "10,000+ employees",
    triggers: ["Evaluating sales automation", "Recent LinkedIn engagement", "RevOps hiring"],
    source: "Apollo",
    ingestedAt: "5 days ago",
    importedBy: "Outbound Sync",
    originTrigger: "Apollo list: Enterprise Sales Ops – Q1",
    sourceMetadata: {
      apolloListName: "Enterprise Sales Ops – Q1",
      apolloPersonId: "APL-5f3a8b9c",
    },
  },
  {
    id: "L007",
    name: "Jennifer Taylor",
    email: "j.taylor@thoughtworks.com",
    company: "Thoughtworks",
    title: "VP of Business Development",
    icpScore: 82,
    stage: "Research",
    channel: "Email",
    status: "Active",
    lastContact: "Not contacted yet",
    aiRecommendation: "Strong fit - initiate outreach sequence",
    industry: "Technology Consulting",
    companySize: "5,000-10,000 employees",
    triggers: ["Sales process optimization", "Hiring SDR team"],
    source: "Apollo",
    ingestedAt: "2 days ago",
    importedBy: "Outbound Sync",
    originTrigger: "Apollo list: US Mid-Market RevOps Leaders",
    sourceMetadata: {
      apolloListName: "US Mid-Market RevOps Leaders",
      apolloPersonId: "APL-7d2c9a1f",
    },
  },
  {
    id: "L008",
    name: "Michael Thompson",
    email: "m.thompson@cognizant.com",
    company: "Cognizant",
    title: "Chief Revenue Officer",
    icpScore: 96,
    stage: "Qualification",
    channel: "Email → Voice",
    status: "High Priority",
    lastContact: "6 hours ago",
    aiRecommendation: "Voice call scheduled - prepare for BANT",
    industry: "IT Services",
    companySize: "10,000+ employees",
    triggers: ["Active vendor evaluation", "Budget allocated", "Q1 decision timeline"],
    source: "Apollo",
    ingestedAt: "4 days ago",
    importedBy: "Outbound Sync",
    originTrigger: "Apollo list: Enterprise Sales Ops – Q1",
    sourceMetadata: {
      apolloListName: "Enterprise Sales Ops – Q1",
      apolloPersonId: "APL-9e4f7b2a",
    },
  },
];

// Mock Decision Feed
export const mockDecisionFeed: DecisionEvent[] = [
  {
    id: "D001",
    timestamp: "2 hours ago",
    leadName: "Sarah Chen",
    company: "Accenture",
    action: "Escalated to voice qualification",
    reason:
      "High engagement on LinkedIn, responded positively to budget timeline questions, ICP score 94",
    type: "escalation",
    impact: "30% higher qualification rate when voice is used at this stage",
  },
  {
    id: "D002",
    timestamp: "5 hours ago",
    leadName: "Michael Roberts",
    company: "Tech Solutions Inc",
    action: "Stopped outreach",
    reason:
      "Low ICP score (42), company size below threshold, budget signals negative",
    type: "stopped",
    impact: "Saved 6 follow-up touches, prevented wasted AE time",
  },
  {
    id: "D003",
    timestamp: "Yesterday",
    leadName: "Lisa Park",
    company: "NTT Data",
    action: "Meeting booked with AE",
    reason:
      "Fully qualified: confirmed need, authority, timeline (Q1), and budget allocated",
    type: "meeting",
    impact: "94% probability of pipeline opportunity based on similar profiles",
  },
  {
    id: "D004",
    timestamp: "Yesterday",
    leadName: "Robert Martinez",
    company: "Global Logistics LLC",
    action: "Qualified prospect",
    reason:
      "Strong need signals, decision maker confirmed, timeline within 3 months",
    type: "qualified",
    impact: "Moving to AE calendar for demo scheduling",
  },
  {
    id: "D005",
    timestamp: "2 days ago",
    leadName: "Amanda Foster",
    company: "Regional Bank",
    action: "Disqualified early",
    reason: "No decision authority, no budget allocated for this fiscal year",
    type: "disqualified",
    impact:
      "Saved 12 days of nurture cycle, freed capacity for higher-value leads",
  },
];

// Mock KPI Data
export const mockKPIs = {
  leadsProcessed: {
    value: 2847,
    change: "+12%",
    trend: "up" as const,
  },
  qualificationRate: {
    value: "23.4%",
    change: "+5.2%",
    trend: "up" as const,
  },
  meetingsBooked: {
    value: 127,
    change: "+18%",
    trend: "up" as const,
  },
  earlyDisqualified: {
    value: 1243,
    change: "+8%",
    trend: "up" as const,
    impact: "Saved 342 AE hours",
  },
  icpAccuracy: {
    value: "91%",
    change: "+3%",
    trend: "up" as const,
  },
  voiceEscalations: {
    value: 89,
    change: "+15%",
    trend: "up" as const,
    successRate: "67%",
  },
};

// Mock qualification data
export const mockQualificationData: Record<string, QualificationData> = {
  L001: {
    leadId: "L001",
    need: {
      value: "Scaling outbound sales, need AI to handle initial qualification",
      confidence: 92,
      known: true,
    },
    timeline: {
      value: "Q1 2024 - Active evaluation",
      confidence: 88,
      known: true,
    },
    authority: {
      value: "Economic buyer - VP level, confirmed budget authority",
      confidence: 95,
      known: true,
    },
    budget: {
      value: "Budget allocated, $250K-500K range indicated",
      confidence: 78,
      known: true,
    },
    overallScore: 88,
    recommendation: "book_meeting",
    reasoning:
      "High confidence across all BANT criteria. Voice call revealed strong urgency and clear buying authority. Recommended for immediate AE engagement.",
  },
};

// Mock conversation timeline
export const mockConversations: Record<string, Message[]> = {
  L001: [
    {
      id: "M001",
      channel: "email",
      direction: "outbound",
      timestamp: "5 days ago",
      subject: "AI-powered sales qualification for Accenture",
      content:
        "Hi Sarah, noticed Accenture is expanding the sales operations team. We help enterprises like yours automate initial qualification...",
      body: `Hi Sarah,

I noticed **Accenture** is expanding the **sales operations team** by 40% in Q1.

We help enterprises like yours automate initial qualification so your SDR team can focus on high-value conversations instead of manual outreach.

Our AI SDR platform:
• Automatically qualifies leads using BANT criteria
• Engages prospects across email, LinkedIn, and voice
• Hands off ready-to-close opportunities to your AE team

Would you be open to a 15-minute conversation about how we've helped companies like **Deloitte** and **NTT Data** scale their SDR operations?

Best,
Jazon AI SDR`,
      personalizationTokens: ["company", "hiring signals", "role"],
      aiGenerated: true,
    },
    {
      id: "M002",
      channel: "email",
      direction: "inbound",
      timestamp: "4 days ago",
      subject: "Re: AI-powered sales qualification for Accenture",
      content:
        "Interesting timing. We're actually evaluating solutions in this space. Can you share more about how it integrates with Salesforce?",
      body: `Interesting timing. We're actually evaluating solutions in this space. Can you share more about how it integrates with Salesforce?

We need something that can handle our complex sales workflows and integrate with our existing tech stack.

Thanks,
Sarah`,
    },
    {
      id: "M003",
      channel: "linkedin",
      direction: "outbound",
      timestamp: "3 days ago",
      content:
        "Thanks for the response, Sarah. Our Salesforce integration is bi-directional and handles...",
      body: `Thanks for the response, Sarah! Our **Salesforce integration** is bi-directional and handles:

✓ Lead enrichment + scoring
✓ Activity logging
✓ Opportunity creation
✓ Custom field mapping

Perfect for **professional services** firms with complex workflows like Accenture.

Would you like me to send over a technical overview specific to your Salesforce instance?`,
      personalizationTokens: ["company", "industry", "tech stack"],
      aiGenerated: true,
    },
    {
      id: "M004",
      channel: "voice",
      direction: "outbound",
      timestamp: "2 hours ago",
      duration: "18 minutes",
      outcome: "Qualified",
      summary:
        "Sarah confirmed active evaluation with 3 vendors. Budget allocated ($300K range), decision timeline is Q1. She is the economic buyer with final approval authority. Needs to see ROI projections and enterprise security documentation.",
      objections: [
        "Integration complexity with existing tech stack",
        "Data privacy concerns for client information",
        "Internal IT approval process timeline",
      ],
      scriptUsed: `**Opening:**
Hi Sarah, this is Jazon AI calling about sales automation for Accenture. Do you have 15 minutes?

**Discovery:**
- What's driving your SDR expansion in Q1?
- How are you currently handling qualification?
- What integration requirements do you have?

**Qualification Questions:**
- Budget: "What's allocated for this initiative?"
- Authority: "Who else is involved in the decision?"
- Timeline: "When are you looking to make a decision?"

**Objection Handling:**
- Integration: "Our Salesforce connector is pre-built for enterprise deployments"
- Security: "SOC 2 Type II certified, full audit trail"

**Next Steps:**
- Schedule demo with technical team
- Share security documentation
- Provide ROI calculator`,
      aiGenerated: true,
    },
  ],
  L002: [
    {
      id: "M101",
      channel: "email",
      direction: "outbound",
      timestamp: "6 days ago",
      subject: "Scaling SDR operations at Deloitte",
      content:
        "Hi Marcus, saw Deloitte is hiring 20+ SDRs. Our AI SDR platform helps enterprises scale qualification without linear headcount growth...",
      body: `Hi Marcus,

I saw **Deloitte** is hiring 20+ SDRs across North America.

Instead of scaling linearly with headcount, what if you could 3x qualification capacity with AI?

Our platform:
• Automates qualification across email, LinkedIn, voice
• Hands off only sales-ready opportunities to your team
• Proven results: 60% faster ramp time for new SDRs

Interested in a quick call?`,
      personalizationTokens: ["company", "hiring signals"],
      aiGenerated: true,
    },
    {
      id: "M102",
      channel: "email",
      direction: "outbound",
      timestamp: "4 days ago",
      subject: "Case study: How Accenture scaled SDR operations",
      content:
        "Following up on my previous message. Would love to show you how we've helped similar professional services firms...",
      body: `Marcus,

Following up on my previous note about scaling SDR operations.

Thought you might find this helpful: **Accenture** recently used our platform to scale from 12 to 50 SDRs without proportional headcount growth.

Key results:
• 60% reduction in SDR ramp time
• 40% increase in qualified pipeline
• 80% of routine qualification automated

Would you like me to send the full case study?`,
      personalizationTokens: ["competitor case study", "industry"],
      aiGenerated: true,
    },
    {
      id: "M103",
      channel: "linkedin",
      direction: "outbound",
      timestamp: "2 days ago",
      content:
        "Marcus, I noticed your recent post about sales automation. Our platform might be a good fit for Deloitte's expansion plans.",
      body: `Marcus, I noticed your recent post about **sales automation**.

Our AI SDR platform might be a perfect fit for **Deloitte's** expansion plans — especially if you're evaluating ways to scale qualification without proportional headcount.

Happy to share how we've helped similar **consulting firms** achieve 3x qualification capacity.

Interested in connecting?`,
      personalizationTokens: ["social signal", "company", "industry"],
      aiGenerated: true,
    },
  ],
  L003: [
    {
      id: "M201",
      channel: "email",
      direction: "outbound",
      timestamp: "3 days ago",
      subject: "AI transformation at NTT Data",
      content:
        "Hi Lisa, NTT Data's AI transformation initiative caught our attention. We help IT services firms automate initial sales qualification...",
      body: `Hi Lisa,

**NTT Data's** AI transformation initiative caught our attention.

We help **IT services firms** automate initial sales qualification so your team can focus on high-value client conversations.

Relevant for your RFP:
• Transparent AI decision-making (no "black box")
• Pre-built Salesforce connector for enterprise deployments
• Case studies from similar-sized services firms

Open to a brief call this week?`,
      personalizationTokens: ["company", "AI initiative", "RFP signal"],
      aiGenerated: true,
    },
    {
      id: "M202",
      channel: "email",
      direction: "inbound",
      timestamp: "2 days ago",
      subject: "Re: AI transformation at NTT Data",
      content:
        "Thanks for reaching out. We're actively evaluating solutions. Can you send more information about integration capabilities?",
      body: `Thanks for reaching out.

We're actively evaluating solutions as part of our Q1 planning. Can you send more information about integration capabilities and security compliance?

We need something that integrates cleanly with Salesforce and doesn't require extensive customization.

Best,
Lisa`,
    },
    {
      id: "M203",
      channel: "linkedin",
      direction: "outbound",
      timestamp: "1 day ago",
      content:
        "Lisa, following up on your email. I've prepared a custom integration overview for NTT Data's Salesforce instance.",
      body: `Lisa, following up on your email.

I've prepared a custom integration overview for **NTT Data's Salesforce instance**.

Covers:
• Bi-directional sync architecture
• SOC 2 compliance details
• Similar IT services firm deployments

Should I send it over, or would a quick call work better?`,
      personalizationTokens: ["company", "tech stack", "security concerns"],
      aiGenerated: true,
    },
    {
      id: "M204",
      channel: "voice",
      direction: "outbound",
      timestamp: "5 hours ago",
      duration: "22 minutes",
      outcome: "Qualified",
      summary:
        "Lisa confirmed RFP published for sales automation. Budget: $400K allocated, potential for $600K expansion. Decision timeline: End of Q1. She owns budget, CRO approval is formality. Key concern: Explainability and integration experience.",
      objections: [
        "Previous vendor had poor integration experience",
        "Needs explainability for compliance",
        "Wants case studies from similar-sized services firms",
      ],
      scriptUsed: `**Opening:**
Hi Lisa, thanks for taking the time. I wanted to dive deeper into NTT Data's sales automation needs.

**Discovery:**
- Tell me about the RFP timeline
- What went wrong with the previous vendor?
- What are your top 3 requirements?

**Qualification:**
- Budget: Confirmed $400K allocated
- Authority: Lisa owns budget, CRO approval is formality
- Timeline: Decision by end of Q1

**Address Objections:**
- Integration: "We have a proven track record with Salesforce Enterprise"
- Explainability: "Every AI decision is transparent and auditable"
- Case studies: "I'll share 3 IT services firm examples"

**Close:**
Schedule technical demo with integration team`,
      aiGenerated: true,
    },
  ],
};

// Mock meetings
export const mockMeetings: Meeting[] = [
  {
    id: "M001",
    leadId: "L003",
    leadName: "Lisa Park",
    company: "NTT Data",
    scheduledFor: "Tomorrow, 2:00 PM EST",
    status: "upcoming",
    handoffPack: {
      researchSummary:
        "NTT Data is undergoing major AI transformation initiative. 15,000+ employee IT services firm with strong APAC presence. Recently published RFP for sales automation. Lisa leads revenue operations and reports to CRO. Budget cycle reset in January.",
      qualificationNotes: [
        "Confirmed need: Scaling SDR team from 12 to 50, can't hire fast enough",
        "Timeline: Decision by end of Q1, implementation in Q2",
        "Authority: Lisa owns the budget, final approval from CRO (formality)",
        "Budget: $400K allocated, potential for $600K if ROI is demonstrated",
      ],
      objectionsRaised: [
        "Concerned about AI 'black box' - needs explainability",
        "Previous vendor had poor integration experience",
        "Wants to see case studies from similar-sized services firms",
      ],
      suggestedTalkTrack: [
        "Lead with explainability - our decision transparency is unique",
        "Reference Accenture case study (similar profile)",
        "Offer integration workshop with their Salesforce team",
        "Discuss phased rollout approach to minimize risk",
      ],
      whyBooked:
        "Lisa expressed strong urgency, has budget and authority, timeline aligns with our sales cycle. She specifically requested a demo after reviewing our ROI calculator. High intent signal.",
    },
  },
  {
    id: "M002",
    leadId: "L006",
    leadName: "James Anderson",
    company: "Financial Services Group",
    scheduledFor: "Dec 20, 10:00 AM EST",
    status: "upcoming",
    handoffPack: {
      researchSummary:
        "Mid-market financial services firm expanding into new markets. 2,500 employees, growing sales team. James is Head of Sales, reporting to CEO. Company raised Series C last quarter.",
      qualificationNotes: [
        "Need: Current SDR team can't keep up with inbound volume from recent marketing push",
        "Timeline: Want to pilot in Q1, full rollout Q2",
        "Authority: James is decision maker, needs CEO sign-off for >$200K",
        "Budget: $150K confirmed, potential for more in Q2",
      ],
      objectionsRaised: [
        "Prefers to start with small pilot",
        "Needs fast time-to-value",
        "Team is non-technical, worried about complexity",
      ],
      suggestedTalkTrack: [
        "Emphasize quick pilot program (30 days)",
        "Show ease of use - no technical skills required",
        "Highlight fast ROI from early disqualification",
        "Discuss expansion path if pilot succeeds",
      ],
      whyBooked:
        "James reached out inbound after CEO forwarded our content. Strong buying signals and active evaluation. Good fit for pilot-to-expansion model.",
    },
  },
];

export const mockICPData = {
  companyAnalysis: {
    name: "Accenture",
    industry: "Professional Services & Consulting",
    size: "738,000 employees globally",
    revenue: "$64.1B (FY2023)",
    structure: "Public company, global operations across 120 countries",
    techStack:
      "Salesforce (primary CRM), Microsoft Dynamics, various marketing automation tools",
    salesMotion:
      "Complex B2B sales, long sales cycles, multi-stakeholder decisions",
  },
  personaAnalysis: {
    title: "VP of Sales Operations",
    seniority: "Senior Management",
    reportingStructure: "Reports to Chief Revenue Officer",
    responsibilities: [
      "Sales process optimization",
      "Sales technology stack management",
      "Team performance analytics",
      "Revenue operations strategy",
    ],
    painPoints: [
      "Scaling challenges with manual qualification processes",
      "Inconsistent lead quality from marketing",
      "Long ramp time for new SDRs",
      "Difficulty measuring SDR efficiency",
    ],
    decisionAuthority:
      "Economic buyer for sales tools <$500K, influencer for larger deals",
  },
  triggers: [
    {
      type: "organizational",
      signal: "Expanding sales team by 40% in Q1",
      source: "LinkedIn job postings, company announcements",
      strength: "high",
      recency: "Active (last 30 days)",
    },
    {
      type: "technical",
      signal: "CRM migration to Salesforce Enterprise",
      source: "Tech community posts, vendor announcements",
      strength: "high",
      recency: "In progress",
    },
    {
      type: "financial",
      signal: "Budget approved for sales enablement tools",
      source: "Conversation insights from initial calls",
      strength: "medium",
      recency: "Confirmed in last call",
    },
  ],
  icpScore: {
    overall: 94,
    breakdown: {
      companyFit: {
        score: 95,
        factors: [
          { name: "Company size", value: 100, weight: 30 },
          { name: "Industry match", value: 90, weight: 25 },
          { name: "Tech stack compatibility", value: 95, weight: 20 },
          { name: "Geographic presence", value: 95, weight: 15 },
          { name: "Growth trajectory", value: 90, weight: 10 },
        ],
      },
      personaFit: {
        score: 92,
        factors: [
          { name: "Decision authority", value: 95, weight: 35 },
          { name: "Pain point alignment", value: 90, weight: 30 },
          { name: "Seniority level", value: 92, weight: 20 },
          { name: "Department fit", value: 90, weight: 15 },
        ],
      },
      timingFit: {
        score: 96,
        factors: [
          { name: "Active triggers", value: 100, weight: 40 },
          { name: "Budget cycle", value: 95, weight: 30 },
          { name: "Urgency signals", value: 92, weight: 30 },
        ],
      },
    },
    explanation:
      "Exceptional fit across all dimensions. Large enterprise with clear need for sales automation, active budget, and decision maker identified. Strong buying signals and timeline alignment. This profile historically converts at 78% rate from qualified to closed.",
  },
};

export const mockOutreachStrategies = [
  {
    id: "OS001",
    leadName: "Sarah Chen",
    company: "Accenture",
    status: "Active",
    currentStep: 4,
    totalSteps: 6,
    channelStrategy: [
      {
        channel: "Email",
        step: "1-2",
        status: "completed",
        goal: "Initial awareness and value proposition",
      },
      {
        channel: "LinkedIn",
        step: "3",
        status: "completed",
        goal: "Build relationship, share relevant content",
      },
      {
        channel: "Voice",
        step: "4",
        status: "active",
        goal: "Deep qualification and objection handling",
        reasoning:
          "High engagement on previous channels, ICP score warrants personal touch",
      },
    ],
    messages: [
      {
        step: 1,
        channel: "Email",
        subject: "AI-powered sales qualification for Accenture",
        preview: "Hi Sarah, I noticed Accenture is expanding...",
        personalization: [
          "Company name and recent hiring activity",
          "Role-specific pain point (scaling challenges)",
          "Industry-specific use case",
        ],
        sent: true,
        result: "Opened 3 times",
      },
      {
        step: 2,
        channel: "Email",
        subject: "How Deloitte reduced SDR ramp time by 60%",
        preview: "Following up on my previous email...",
        personalization: [
          "Competitor case study",
          "Specific metric (ramp time)",
          "Professional services industry focus",
        ],
        sent: true,
        result: "Clicked case study link, replied",
      },
    ],
    guardrails: {
      maxTouches: 8,
      voiceEscalationAllowed: true,
      voiceEscalationTrigger: "High ICP + engagement on 2+ channels",
      stopConditions: [
        "Explicit opt-out",
        "No engagement after 6 touches",
        "ICP score drops below 60",
      ],
    },
  },
];

export const mockLearningData = {
  weeklyInsights: {
    period: "Dec 10-17, 2024",
    leadsAnalyzed: 847,
    changesImplemented: 5,
  },
  whatWorked: [
    {
      finding: "Voice escalation at qualification stage",
      data: "Leads escalated to voice had 34% higher qualification rate",
      action: "Increased voice escalation threshold from ICP 85 to ICP 80",
      impact: "Expected 15% more qualified leads per week",
    },
    {
      finding: "Industry-specific case studies in email step 2",
      data: "Email 2 click rate improved from 12% to 23% with targeted case studies",
      action: "Automated case study matching based on lead industry",
      impact: "Higher engagement in nurture sequence",
    },
    {
      finding: "LinkedIn engagement before email follow-up",
      data: "Leads engaged on LinkedIn responded 2.1x more to subsequent emails",
      action:
        "Adjusted sequence: LinkedIn touchpoint now required before email 3",
      impact: "Improved email response rates",
    },
  ],
  whatDidntWork: [
    {
      finding: "Generic pricing questions in initial emails",
      data: "Emails mentioning pricing in first touch had 41% lower response rate",
      action: "Removed pricing discussion from templates 1-2, moved to step 4+",
      impact: "Cleaner value-first messaging",
    },
    {
      finding: "Weekend outreach attempts",
      data: "Saturday/Sunday emails had 67% lower open rates, 89% lower response",
      action: "Disabled weekend sends, queue for Monday morning instead",
      impact: "Better engagement, more respectful approach",
    },
  ],
  modelImprovements: [
    {
      area: "ICP Scoring",
      change: "Added 'recent funding' as a positive signal (+8 points)",
      reason: "Funded companies converted 2.4x more often in last 90 days",
      confidence: "High",
    },
    {
      area: "Qualification Logic",
      change: "Budget confirmation now required for enterprise deals >$300K",
      reason:
        "Lost 3 late-stage deals due to budget constraints not caught early",
      confidence: "High",
    },
    {
      area: "Channel Priority",
      change: "Email-first for ICP 60-79, LinkedIn-first for ICP 80+",
      reason: "Higher ICP leads more responsive on LinkedIn",
      confidence: "Medium",
    },
  ],
};

export const mockCRMSync = {
  connectionStatus: "Connected",
  lastSync: "2 minutes ago",
  platform: "Salesforce Enterprise",
  syncFrequency: "Real-time",
  fieldMappings: [
    {
      jazonField: "ICP Score",
      crmField: "Lead_Score__c",
      direction: "Jazon → CRM",
      syncStatus: "Active",
    },
    {
      jazonField: "Qualification Status",
      crmField: "Qualification_Status__c",
      direction: "Jazon → CRM",
      syncStatus: "Active",
    },
    {
      jazonField: "AI Recommendation",
      crmField: "Next_Best_Action__c",
      direction: "Jazon → CRM",
      syncStatus: "Active",
    },
    {
      jazonField: "Last Contact Channel",
      crmField: "Last_Activity_Type__c",
      direction: "Jazon → CRM",
      syncStatus: "Active",
    },
    {
      jazonField: "Lead Owner",
      crmField: "OwnerId",
      direction: "CRM → Jazon",
      syncStatus: "Active",
    },
    {
      jazonField: "Company Data",
      crmField: "Account",
      direction: "Bidirectional",
      syncStatus: "Active",
    },
  ],
  recentWrites: [
    {
      timestamp: "2 minutes ago",
      record: "Sarah Chen - Accenture",
      field: "Qualification_Status__c",
      oldValue: "Engaged",
      newValue: "Voice Qualification",
      triggeredBy: "Jazon AI - Voice escalation decision",
    },
    {
      timestamp: "15 minutes ago",
      record: "Lisa Park - NTT Data",
      field: "Next_Best_Action__c",
      oldValue: "Continue Nurture",
      newValue: "Prepare AE Handoff",
      triggeredBy: "Jazon AI - Meeting scheduled",
    },
    {
      timestamp: "1 hour ago",
      record: "Michael Roberts - Tech Solutions",
      field: "Lead_Score__c",
      oldValue: "65",
      newValue: "42",
      triggeredBy: "Jazon AI - ICP re-evaluation",
    },
  ],
  readPermissions: [
    "Lead fields: Name, Email, Company, Title, Phone",
    "Account fields: Industry, Company Size, Revenue",
    "Activity history: Emails, Calls, Meetings",
    "Campaign membership and source data",
  ],
  writePermissions: [
    "Custom fields: Lead Score, Qualification Status, Next Best Action",
    "Activity logging: Jazon touchpoints and AI decisions",
    "Task creation: Follow-up reminders for AE team",
    "Lead status updates: Based on qualification outcomes",
  ],
};
