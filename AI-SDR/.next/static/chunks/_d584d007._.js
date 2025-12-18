(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/mock-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Mock data and types for Jazon AI SDR
__turbopack_context__.s([
    "mockCRMSync",
    ()=>mockCRMSync,
    "mockConversations",
    ()=>mockConversations,
    "mockDecisionFeed",
    ()=>mockDecisionFeed,
    "mockICPData",
    ()=>mockICPData,
    "mockKPIs",
    ()=>mockKPIs,
    "mockLeads",
    ()=>mockLeads,
    "mockLearningData",
    ()=>mockLearningData,
    "mockMeetings",
    ()=>mockMeetings,
    "mockOutreachStrategies",
    ()=>mockOutreachStrategies,
    "mockQualificationData",
    ()=>mockQualificationData
]);
const mockLeads = [
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
        triggers: [
            "New CRM migration",
            "Expanding sales team",
            "Budget approved"
        ],
        source: "Salesforce",
        ingestedAt: "7 days ago",
        importedBy: "System Sync",
        originTrigger: "Salesforce lead sync - new opportunity record"
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
        triggers: [
            "Hiring SDR team",
            "Q1 planning"
        ],
        source: "Salesforce",
        ingestedAt: "9 days ago",
        importedBy: "System Sync",
        originTrigger: "Marketing campaign: Q1 pipeline acceleration"
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
        triggers: [
            "AI transformation initiative",
            "Sales automation RFP"
        ],
        source: "HubSpot",
        ingestedAt: "3 days ago",
        importedBy: "RevOps",
        originTrigger: "RFP form submission on website"
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
        triggers: [
            "Digital transformation"
        ],
        source: "CSV",
        ingestedAt: "12 days ago",
        importedBy: "SDR Manager",
        originTrigger: "Uploaded from trade-show attendee list"
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
        originTrigger: "Manually added from referral"
    }
];
const mockDecisionFeed = [
    {
        id: "D001",
        timestamp: "2 hours ago",
        leadName: "Sarah Chen",
        company: "Accenture",
        action: "Escalated to voice qualification",
        reason: "High engagement on LinkedIn, responded positively to budget timeline questions, ICP score 94",
        type: "escalation",
        impact: "30% higher qualification rate when voice is used at this stage"
    },
    {
        id: "D002",
        timestamp: "5 hours ago",
        leadName: "Michael Roberts",
        company: "Tech Solutions Inc",
        action: "Stopped outreach",
        reason: "Low ICP score (42), company size below threshold, budget signals negative",
        type: "stopped",
        impact: "Saved 6 follow-up touches, prevented wasted AE time"
    },
    {
        id: "D003",
        timestamp: "Yesterday",
        leadName: "Lisa Park",
        company: "NTT Data",
        action: "Meeting booked with AE",
        reason: "Fully qualified: confirmed need, authority, timeline (Q1), and budget allocated",
        type: "meeting",
        impact: "94% probability of pipeline opportunity based on similar profiles"
    },
    {
        id: "D004",
        timestamp: "Yesterday",
        leadName: "Robert Martinez",
        company: "Global Logistics LLC",
        action: "Qualified prospect",
        reason: "Strong need signals, decision maker confirmed, timeline within 3 months",
        type: "qualified",
        impact: "Moving to AE calendar for demo scheduling"
    },
    {
        id: "D005",
        timestamp: "2 days ago",
        leadName: "Amanda Foster",
        company: "Regional Bank",
        action: "Disqualified early",
        reason: "No decision authority, no budget allocated for this fiscal year",
        type: "disqualified",
        impact: "Saved 12 days of nurture cycle, freed capacity for higher-value leads"
    }
];
const mockKPIs = {
    leadsProcessed: {
        value: 2847,
        change: "+12%",
        trend: "up"
    },
    qualificationRate: {
        value: "23.4%",
        change: "+5.2%",
        trend: "up"
    },
    meetingsBooked: {
        value: 127,
        change: "+18%",
        trend: "up"
    },
    earlyDisqualified: {
        value: 1243,
        change: "+8%",
        trend: "up",
        impact: "Saved 342 AE hours"
    },
    icpAccuracy: {
        value: "91%",
        change: "+3%",
        trend: "up"
    },
    voiceEscalations: {
        value: 89,
        change: "+15%",
        trend: "up",
        successRate: "67%"
    }
};
const mockQualificationData = {
    L001: {
        leadId: "L001",
        need: {
            value: "Scaling outbound sales, need AI to handle initial qualification",
            confidence: 92,
            known: true
        },
        timeline: {
            value: "Q1 2024 - Active evaluation",
            confidence: 88,
            known: true
        },
        authority: {
            value: "Economic buyer - VP level, confirmed budget authority",
            confidence: 95,
            known: true
        },
        budget: {
            value: "Budget allocated, $250K-500K range indicated",
            confidence: 78,
            known: true
        },
        overallScore: 88,
        recommendation: "book_meeting",
        reasoning: "High confidence across all BANT criteria. Voice call revealed strong urgency and clear buying authority. Recommended for immediate AE engagement."
    }
};
const mockConversations = {
    L001: [
        {
            id: "M001",
            channel: "email",
            direction: "outbound",
            timestamp: "5 days ago",
            subject: "AI-powered sales qualification for Accenture",
            content: "Hi Sarah, noticed Accenture is expanding the sales operations team. We help enterprises like yours automate initial qualification...",
            body: "Hi Sarah,\n\nI noticed **Accenture** is expanding the **sales operations team** by 40% in Q1.\n\nWe help enterprises like yours automate initial qualification so your SDR team can focus on high-value conversations instead of manual outreach.\n\nOur AI SDR platform:\n• Automatically qualifies leads using BANT criteria\n• Engages prospects across email, LinkedIn, and voice\n• Hands off ready-to-close opportunities to your AE team\n\nWould you be open to a 15-minute conversation about how we've helped companies like **Deloitte** and **NTT Data** scale their SDR operations?\n\nBest,\nJazon AI SDR",
            personalizationTokens: [
                "company",
                "hiring signals",
                "role"
            ],
            aiGenerated: true
        },
        {
            id: "M002",
            channel: "email",
            direction: "inbound",
            timestamp: "4 days ago",
            subject: "Re: AI-powered sales qualification for Accenture",
            content: "Interesting timing. We're actually evaluating solutions in this space. Can you share more about how it integrates with Salesforce?",
            body: "Interesting timing. We're actually evaluating solutions in this space. Can you share more about how it integrates with Salesforce?\n\nWe need something that can handle our complex sales workflows and integrate with our existing tech stack.\n\nThanks,\nSarah"
        },
        {
            id: "M003",
            channel: "linkedin",
            direction: "outbound",
            timestamp: "3 days ago",
            content: "Thanks for the response, Sarah. Our Salesforce integration is bi-directional and handles...",
            body: "Thanks for the response, Sarah! Our **Salesforce integration** is bi-directional and handles:\n\n✓ Lead enrichment + scoring\n✓ Activity logging\n✓ Opportunity creation\n✓ Custom field mapping\n\nPerfect for **professional services** firms with complex workflows like Accenture.\n\nWould you like me to send over a technical overview specific to your Salesforce instance?",
            personalizationTokens: [
                "company",
                "industry",
                "tech stack"
            ],
            aiGenerated: true
        },
        {
            id: "M004",
            channel: "voice",
            direction: "outbound",
            timestamp: "2 hours ago",
            duration: "18 minutes",
            outcome: "Qualified",
            summary: "Sarah confirmed active evaluation with 3 vendors. Budget allocated ($300K range), decision timeline is Q1. She is the economic buyer with final approval authority. Needs to see ROI projections and enterprise security documentation.",
            objections: [
                "Integration complexity with existing tech stack",
                "Data privacy concerns for client information",
                "Internal IT approval process timeline"
            ],
            scriptUsed: '**Opening:**\nHi Sarah, this is Jazon AI calling about sales automation for Accenture. Do you have 15 minutes?\n\n**Discovery:**\n- What\'s driving your SDR expansion in Q1?\n- How are you currently handling qualification?\n- What integration requirements do you have?\n\n**Qualification Questions:**\n- Budget: "What\'s allocated for this initiative?"\n- Authority: "Who else is involved in the decision?"\n- Timeline: "When are you looking to make a decision?"\n\n**Objection Handling:**\n- Integration: "Our Salesforce connector is pre-built for enterprise deployments"\n- Security: "SOC 2 Type II certified, full audit trail"\n\n**Next Steps:**\n- Schedule demo with technical team\n- Share security documentation\n- Provide ROI calculator',
            aiGenerated: true
        }
    ],
    L002: [
        {
            id: "M101",
            channel: "email",
            direction: "outbound",
            timestamp: "6 days ago",
            subject: "Scaling SDR operations at Deloitte",
            content: "Hi Marcus, saw Deloitte is hiring 20+ SDRs. Our AI SDR platform helps enterprises scale qualification without linear headcount growth...",
            body: "Hi Marcus,\n\nI saw **Deloitte** is hiring 20+ SDRs across North America.\n\nInstead of scaling linearly with headcount, what if you could 3x qualification capacity with AI?\n\nOur platform:\n• Automates qualification across email, LinkedIn, voice\n• Hands off only sales-ready opportunities to your team\n• Proven results: 60% faster ramp time for new SDRs\n\nInterested in a quick call?",
            personalizationTokens: [
                "company",
                "hiring signals"
            ],
            aiGenerated: true
        },
        {
            id: "M102",
            channel: "email",
            direction: "outbound",
            timestamp: "4 days ago",
            subject: "Case study: How Accenture scaled SDR operations",
            content: "Following up on my previous message. Would love to show you how we've helped similar professional services firms...",
            body: "Marcus,\n\nFollowing up on my previous note about scaling SDR operations.\n\nThought you might find this helpful: **Accenture** recently used our platform to scale from 12 to 50 SDRs without proportional headcount growth.\n\nKey results:\n• 60% reduction in SDR ramp time\n• 40% increase in qualified pipeline\n• 80% of routine qualification automated\n\nWould you like me to send the full case study?",
            personalizationTokens: [
                "competitor case study",
                "industry"
            ],
            aiGenerated: true
        },
        {
            id: "M103",
            channel: "linkedin",
            direction: "outbound",
            timestamp: "2 days ago",
            content: "Marcus, I noticed your recent post about sales automation. Our platform might be a good fit for Deloitte's expansion plans.",
            body: "Marcus, I noticed your recent post about **sales automation**.\n\nOur AI SDR platform might be a perfect fit for **Deloitte's** expansion plans — especially if you're evaluating ways to scale qualification without proportional headcount.\n\nHappy to share how we've helped similar **consulting firms** achieve 3x qualification capacity.\n\nInterested in connecting?",
            personalizationTokens: [
                "social signal",
                "company",
                "industry"
            ],
            aiGenerated: true
        }
    ],
    L003: [
        {
            id: "M201",
            channel: "email",
            direction: "outbound",
            timestamp: "3 days ago",
            subject: "AI transformation at NTT Data",
            content: "Hi Lisa, NTT Data's AI transformation initiative caught our attention. We help IT services firms automate initial sales qualification...",
            body: 'Hi Lisa,\n\n**NTT Data\'s** AI transformation initiative caught our attention.\n\nWe help **IT services firms** automate initial sales qualification so your team can focus on high-value client conversations.\n\nRelevant for your RFP:\n• Transparent AI decision-making (no "black box")\n• Pre-built Salesforce connector for enterprise deployments\n• Case studies from similar-sized services firms\n\nOpen to a brief call this week?',
            personalizationTokens: [
                "company",
                "AI initiative",
                "RFP signal"
            ],
            aiGenerated: true
        },
        {
            id: "M202",
            channel: "email",
            direction: "inbound",
            timestamp: "2 days ago",
            subject: "Re: AI transformation at NTT Data",
            content: "Thanks for reaching out. We're actively evaluating solutions. Can you send more information about integration capabilities?",
            body: "Thanks for reaching out.\n\nWe're actively evaluating solutions as part of our Q1 planning. Can you send more information about integration capabilities and security compliance?\n\nWe need something that integrates cleanly with Salesforce and doesn't require extensive customization.\n\nBest,\nLisa"
        },
        {
            id: "M203",
            channel: "linkedin",
            direction: "outbound",
            timestamp: "1 day ago",
            content: "Lisa, following up on your email. I've prepared a custom integration overview for NTT Data's Salesforce instance.",
            body: "Lisa, following up on your email.\n\nI've prepared a custom integration overview for **NTT Data's Salesforce instance**.\n\nCovers:\n• Bi-directional sync architecture\n• SOC 2 compliance details\n• Similar IT services firm deployments\n\nShould I send it over, or would a quick call work better?",
            personalizationTokens: [
                "company",
                "tech stack",
                "security concerns"
            ],
            aiGenerated: true
        },
        {
            id: "M204",
            channel: "voice",
            direction: "outbound",
            timestamp: "5 hours ago",
            duration: "22 minutes",
            outcome: "Qualified",
            summary: "Lisa confirmed RFP published for sales automation. Budget: $400K allocated, potential for $600K expansion. Decision timeline: End of Q1. She owns budget, CRO approval is formality. Key concern: Explainability and integration experience.",
            objections: [
                "Previous vendor had poor integration experience",
                "Needs explainability for compliance",
                "Wants case studies from similar-sized services firms"
            ],
            scriptUsed: '**Opening:**\nHi Lisa, thanks for taking the time. I wanted to dive deeper into NTT Data\'s sales automation needs.\n\n**Discovery:**\n- Tell me about the RFP timeline\n- What went wrong with the previous vendor?\n- What are your top 3 requirements?\n\n**Qualification:**\n- Budget: Confirmed $400K allocated\n- Authority: Lisa owns budget, CRO approval is formality\n- Timeline: Decision by end of Q1\n\n**Address Objections:**\n- Integration: "We have a proven track record with Salesforce Enterprise"\n- Explainability: "Every AI decision is transparent and auditable"\n- Case studies: "I\'ll share 3 IT services firm examples"\n\n**Close:**\nSchedule technical demo with integration team',
            aiGenerated: true
        }
    ]
};
const mockMeetings = [
    {
        id: "M001",
        leadId: "L003",
        leadName: "Lisa Park",
        company: "NTT Data",
        scheduledFor: "Tomorrow, 2:00 PM EST",
        status: "upcoming",
        handoffPack: {
            researchSummary: "NTT Data is undergoing major AI transformation initiative. 15,000+ employee IT services firm with strong APAC presence. Recently published RFP for sales automation. Lisa leads revenue operations and reports to CRO. Budget cycle reset in January.",
            qualificationNotes: [
                "Confirmed need: Scaling SDR team from 12 to 50, can't hire fast enough",
                "Timeline: Decision by end of Q1, implementation in Q2",
                "Authority: Lisa owns the budget, final approval from CRO (formality)",
                "Budget: $400K allocated, potential for $600K if ROI is demonstrated"
            ],
            objectionsRaised: [
                "Concerned about AI 'black box' - needs explainability",
                "Previous vendor had poor integration experience",
                "Wants to see case studies from similar-sized services firms"
            ],
            suggestedTalkTrack: [
                "Lead with explainability - our decision transparency is unique",
                "Reference Accenture case study (similar profile)",
                "Offer integration workshop with their Salesforce team",
                "Discuss phased rollout approach to minimize risk"
            ],
            whyBooked: "Lisa expressed strong urgency, has budget and authority, timeline aligns with our sales cycle. She specifically requested a demo after reviewing our ROI calculator. High intent signal."
        }
    },
    {
        id: "M002",
        leadId: "L006",
        leadName: "James Anderson",
        company: "Financial Services Group",
        scheduledFor: "Dec 20, 10:00 AM EST",
        status: "upcoming",
        handoffPack: {
            researchSummary: "Mid-market financial services firm expanding into new markets. 2,500 employees, growing sales team. James is Head of Sales, reporting to CEO. Company raised Series C last quarter.",
            qualificationNotes: [
                "Need: Current SDR team can't keep up with inbound volume from recent marketing push",
                "Timeline: Want to pilot in Q1, full rollout Q2",
                "Authority: James is decision maker, needs CEO sign-off for >$200K",
                "Budget: $150K confirmed, potential for more in Q2"
            ],
            objectionsRaised: [
                "Prefers to start with small pilot",
                "Needs fast time-to-value",
                "Team is non-technical, worried about complexity"
            ],
            suggestedTalkTrack: [
                "Emphasize quick pilot program (30 days)",
                "Show ease of use - no technical skills required",
                "Highlight fast ROI from early disqualification",
                "Discuss expansion path if pilot succeeds"
            ],
            whyBooked: "James reached out inbound after CEO forwarded our content. Strong buying signals and active evaluation. Good fit for pilot-to-expansion model."
        }
    }
];
const mockICPData = {
    companyAnalysis: {
        name: "Accenture",
        industry: "Professional Services & Consulting",
        size: "738,000 employees globally",
        revenue: "$64.1B (FY2023)",
        structure: "Public company, global operations across 120 countries",
        techStack: "Salesforce (primary CRM), Microsoft Dynamics, various marketing automation tools",
        salesMotion: "Complex B2B sales, long sales cycles, multi-stakeholder decisions"
    },
    personaAnalysis: {
        title: "VP of Sales Operations",
        seniority: "Senior Management",
        reportingStructure: "Reports to Chief Revenue Officer",
        responsibilities: [
            "Sales process optimization",
            "Sales technology stack management",
            "Team performance analytics",
            "Revenue operations strategy"
        ],
        painPoints: [
            "Scaling challenges with manual qualification processes",
            "Inconsistent lead quality from marketing",
            "Long ramp time for new SDRs",
            "Difficulty measuring SDR efficiency"
        ],
        decisionAuthority: "Economic buyer for sales tools <$500K, influencer for larger deals"
    },
    triggers: [
        {
            type: "organizational",
            signal: "Expanding sales team by 40% in Q1",
            source: "LinkedIn job postings, company announcements",
            strength: "high",
            recency: "Active (last 30 days)"
        },
        {
            type: "technical",
            signal: "CRM migration to Salesforce Enterprise",
            source: "Tech community posts, vendor announcements",
            strength: "high",
            recency: "In progress"
        },
        {
            type: "financial",
            signal: "Budget approved for sales enablement tools",
            source: "Conversation insights from initial calls",
            strength: "medium",
            recency: "Confirmed in last call"
        }
    ],
    icpScore: {
        overall: 94,
        breakdown: {
            companyFit: {
                score: 95,
                factors: [
                    {
                        name: "Company size",
                        value: 100,
                        weight: 30
                    },
                    {
                        name: "Industry match",
                        value: 90,
                        weight: 25
                    },
                    {
                        name: "Tech stack compatibility",
                        value: 95,
                        weight: 20
                    },
                    {
                        name: "Geographic presence",
                        value: 95,
                        weight: 15
                    },
                    {
                        name: "Growth trajectory",
                        value: 90,
                        weight: 10
                    }
                ]
            },
            personaFit: {
                score: 92,
                factors: [
                    {
                        name: "Decision authority",
                        value: 95,
                        weight: 35
                    },
                    {
                        name: "Pain point alignment",
                        value: 90,
                        weight: 30
                    },
                    {
                        name: "Seniority level",
                        value: 92,
                        weight: 20
                    },
                    {
                        name: "Department fit",
                        value: 90,
                        weight: 15
                    }
                ]
            },
            timingFit: {
                score: 96,
                factors: [
                    {
                        name: "Active triggers",
                        value: 100,
                        weight: 40
                    },
                    {
                        name: "Budget cycle",
                        value: 95,
                        weight: 30
                    },
                    {
                        name: "Urgency signals",
                        value: 92,
                        weight: 30
                    }
                ]
            }
        },
        explanation: "Exceptional fit across all dimensions. Large enterprise with clear need for sales automation, active budget, and decision maker identified. Strong buying signals and timeline alignment. This profile historically converts at 78% rate from qualified to closed."
    }
};
const mockOutreachStrategies = [
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
                goal: "Initial awareness and value proposition"
            },
            {
                channel: "LinkedIn",
                step: "3",
                status: "completed",
                goal: "Build relationship, share relevant content"
            },
            {
                channel: "Voice",
                step: "4",
                status: "active",
                goal: "Deep qualification and objection handling",
                reasoning: "High engagement on previous channels, ICP score warrants personal touch"
            }
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
                    "Industry-specific use case"
                ],
                sent: true,
                result: "Opened 3 times"
            },
            {
                step: 2,
                channel: "Email",
                subject: "How Deloitte reduced SDR ramp time by 60%",
                preview: "Following up on my previous email...",
                personalization: [
                    "Competitor case study",
                    "Specific metric (ramp time)",
                    "Professional services industry focus"
                ],
                sent: true,
                result: "Clicked case study link, replied"
            }
        ],
        guardrails: {
            maxTouches: 8,
            voiceEscalationAllowed: true,
            voiceEscalationTrigger: "High ICP + engagement on 2+ channels",
            stopConditions: [
                "Explicit opt-out",
                "No engagement after 6 touches",
                "ICP score drops below 60"
            ]
        }
    }
];
const mockLearningData = {
    weeklyInsights: {
        period: "Dec 10-17, 2024",
        leadsAnalyzed: 847,
        changesImplemented: 5
    },
    whatWorked: [
        {
            finding: "Voice escalation at qualification stage",
            data: "Leads escalated to voice had 34% higher qualification rate",
            action: "Increased voice escalation threshold from ICP 85 to ICP 80",
            impact: "Expected 15% more qualified leads per week"
        },
        {
            finding: "Industry-specific case studies in email step 2",
            data: "Email 2 click rate improved from 12% to 23% with targeted case studies",
            action: "Automated case study matching based on lead industry",
            impact: "Higher engagement in nurture sequence"
        },
        {
            finding: "LinkedIn engagement before email follow-up",
            data: "Leads engaged on LinkedIn responded 2.1x more to subsequent emails",
            action: "Adjusted sequence: LinkedIn touchpoint now required before email 3",
            impact: "Improved email response rates"
        }
    ],
    whatDidntWork: [
        {
            finding: "Generic pricing questions in initial emails",
            data: "Emails mentioning pricing in first touch had 41% lower response rate",
            action: "Removed pricing discussion from templates 1-2, moved to step 4+",
            impact: "Cleaner value-first messaging"
        },
        {
            finding: "Weekend outreach attempts",
            data: "Saturday/Sunday emails had 67% lower open rates, 89% lower response",
            action: "Disabled weekend sends, queue for Monday morning instead",
            impact: "Better engagement, more respectful approach"
        }
    ],
    modelImprovements: [
        {
            area: "ICP Scoring",
            change: "Added 'recent funding' as a positive signal (+8 points)",
            reason: "Funded companies converted 2.4x more often in last 90 days",
            confidence: "High"
        },
        {
            area: "Qualification Logic",
            change: "Budget confirmation now required for enterprise deals >$300K",
            reason: "Lost 3 late-stage deals due to budget constraints not caught early",
            confidence: "High"
        },
        {
            area: "Channel Priority",
            change: "Email-first for ICP 60-79, LinkedIn-first for ICP 80+",
            reason: "Higher ICP leads more responsive on LinkedIn",
            confidence: "Medium"
        }
    ]
};
const mockCRMSync = {
    connectionStatus: "Connected",
    lastSync: "2 minutes ago",
    platform: "Salesforce Enterprise",
    syncFrequency: "Real-time",
    fieldMappings: [
        {
            jazonField: "ICP Score",
            crmField: "Lead_Score__c",
            direction: "Jazon → CRM",
            syncStatus: "Active"
        },
        {
            jazonField: "Qualification Status",
            crmField: "Qualification_Status__c",
            direction: "Jazon → CRM",
            syncStatus: "Active"
        },
        {
            jazonField: "AI Recommendation",
            crmField: "Next_Best_Action__c",
            direction: "Jazon → CRM",
            syncStatus: "Active"
        },
        {
            jazonField: "Last Contact Channel",
            crmField: "Last_Activity_Type__c",
            direction: "Jazon → CRM",
            syncStatus: "Active"
        },
        {
            jazonField: "Lead Owner",
            crmField: "OwnerId",
            direction: "CRM → Jazon",
            syncStatus: "Active"
        },
        {
            jazonField: "Company Data",
            crmField: "Account",
            direction: "Bidirectional",
            syncStatus: "Active"
        }
    ],
    recentWrites: [
        {
            timestamp: "2 minutes ago",
            record: "Sarah Chen - Accenture",
            field: "Qualification_Status__c",
            oldValue: "Engaged",
            newValue: "Voice Qualification",
            triggeredBy: "Jazon AI - Voice escalation decision"
        },
        {
            timestamp: "15 minutes ago",
            record: "Lisa Park - NTT Data",
            field: "Next_Best_Action__c",
            oldValue: "Continue Nurture",
            newValue: "Prepare AE Handoff",
            triggeredBy: "Jazon AI - Meeting scheduled"
        },
        {
            timestamp: "1 hour ago",
            record: "Michael Roberts - Tech Solutions",
            field: "Lead_Score__c",
            oldValue: "65",
            newValue: "42",
            triggeredBy: "Jazon AI - ICP re-evaluation"
        }
    ],
    readPermissions: [
        "Lead fields: Name, Email, Company, Title, Phone",
        "Account fields: Industry, Company Size, Revenue",
        "Activity history: Emails, Calls, Meetings",
        "Campaign membership and source data"
    ],
    writePermissions: [
        "Custom fields: Lead Score, Qualification Status, Next Best Action",
        "Activity logging: Jazon touchpoints and AI decisions",
        "Task creation: Follow-up reminders for AE team",
        "Lead status updates: Based on qualification outcomes"
    ]
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/context/jazon-app-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JazonAppProvider",
    ()=>JazonAppProvider,
    "useJazonApp",
    ()=>useJazonApp
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mock-data.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
const defaultCompanyProfile = {
    companyName: "",
    website: "",
    productDescription: "",
    targetCustomers: "",
    primaryUseCase: "",
    valueProps: ""
};
const defaultAgentInstructions = {
    tone: "consultative",
    allowedChannels: {
        email: true,
        linkedin: true,
        voice: true
    },
    voiceEscalationRules: "Escalate to voice when ICP score >= 80 and there are 2+ positive engagements across email or LinkedIn.",
    qualificationStrictness: "medium",
    excludedIndustries: "None"
};
const JazonAppContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function JazonAppProvider(param) {
    let { children } = param;
    _s();
    const [leads, setLeads] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mock$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["mockLeads"]);
    const [companyProfile, setCompanyProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultCompanyProfile);
    const [agentInstructions, setAgentInstructions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(defaultAgentInstructions);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(JazonAppContext.Provider, {
        value: {
            leads,
            setLeads,
            companyProfile,
            setCompanyProfile,
            agentInstructions,
            setAgentInstructions
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/jazon-app-context.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_s(JazonAppProvider, "ebXbj0r9PC3JLSab6C53sZi+cfk=");
_c = JazonAppProvider;
function useJazonApp() {
    _s1();
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(JazonAppContext);
    if (!ctx) {
        throw new Error("useJazonApp must be used within a JazonAppProvider");
    }
    return ctx;
}
_s1(useJazonApp, "/dMy7t63NXD4eYACoT93CePwGrg=");
var _c;
__turbopack_context__.k.register(_c, "JazonAppProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/jazon-app-shell.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JazonAppShell",
    ()=>JazonAppShell
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$jazon$2d$app$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/jazon-app-context.tsx [app-client] (ecmascript)");
"use client";
;
;
function JazonAppShell(param) {
    let { children } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$jazon$2d$app$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["JazonAppProvider"], {
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/jazon-app-shell.tsx",
        lineNumber: 7,
        columnNumber: 10
    }, this);
}
_c = JazonAppShell;
var _c;
__turbopack_context__.k.register(_c, "JazonAppShell");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        "object" === typeof node && null !== node && node.$$typeof === REACT_ELEMENT_TYPE && node._store && (node._store.validated = 1);
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, trackActualOwner ? Error("react-stack-top-frame") : unknownOwnerDebugStack, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
]);

//# sourceMappingURL=_d584d007._.js.map