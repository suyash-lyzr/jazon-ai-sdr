module.exports = [
"[project]/.next-internal/server/app/api/leads/[id]/outreach/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/mongoose [external] (mongoose, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}),
"[project]/src/lib/mongodb.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = {
        conn: null,
        promise: null
    };
}
async function connectDB() {
    let MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    }
    // Remove quotes if present
    MONGODB_URI = MONGODB_URI.replace(/^["']|["']$/g, '');
    // If we have a cached connection, return it
    if (cached.conn) {
        return cached.conn;
    }
    // If we don't have a cached promise, create one
    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then(async (mongoose)=>{
            console.log('✅ MongoDB connected successfully');
            // Ensure models are registered (Next.js hot reload fix)
            // Dynamically import models to ensure they're registered after connection
            if (!mongoose.models.Company) {
                await __turbopack_context__.A("[project]/src/models/Company.ts [app-route] (ecmascript, async loader)");
            }
            if (!mongoose.models.Persona) {
                await __turbopack_context__.A("[project]/src/models/Persona.ts [app-route] (ecmascript, async loader)");
            }
            if (!mongoose.models.Lead) {
                await __turbopack_context__.A("[project]/src/models/Lead.ts [app-route] (ecmascript, async loader)");
            }
            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}
const __TURBOPACK__default__export__ = connectDB;
}),
"[project]/src/models/Lead.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const SourceMetadataSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    apollo_list_name: {
        type: String
    },
    apollo_person_id: {
        type: String
    },
    hubspot_contact_id: {
        type: String
    },
    salesforce_lead_id: {
        type: String
    }
}, {
    _id: false
});
const LeadSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    company_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Company",
        required: true,
        index: true
    },
    persona_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Persona",
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: [
            "uploaded",
            "researched",
            "icp_scored"
        ],
        required: true,
        default: "uploaded",
        index: true
    },
    source: {
        type: String,
        default: "CSV"
    },
    source_metadata: {
        type: SourceMetadataSchema,
        required: false
    }
}, {
    timestamps: true,
    collection: "leads"
});
// Indexes for common queries
LeadSchema.index({
    company_id: 1,
    persona_id: 1
});
LeadSchema.index({
    status: 1,
    createdAt: -1
});
const Lead = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Lead || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Lead", LeadSchema);
const __TURBOPACK__default__export__ = Lead;
}),
"[project]/src/models/ICPScore.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const ScoreBreakdownSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    company_fit: {
        type: Number,
        default: 0
    },
    persona_fit: {
        type: Number,
        default: 0
    },
    timing_fit: {
        type: Number,
        default: 0
    }
}, {
    _id: false
});
const ScoringMetaSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    inputs_used: {
        type: [
            String
        ],
        default: []
    },
    scored_at: {
        type: String,
        default: ""
    }
}, {
    _id: false
});
const ICPScoreSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        required: true,
        unique: true,
        index: true
    },
    icp_score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
        index: true
    },
    fit_tier: {
        type: String,
        enum: [
            "Tier 1",
            "Tier 2",
            "Tier 3",
            "Disqualified"
        ],
        required: true,
        index: true
    },
    score_breakdown: {
        type: ScoreBreakdownSchema,
        default: ()=>({})
    },
    strengths: {
        type: [
            String
        ],
        default: []
    },
    risks: {
        type: [
            String
        ],
        default: []
    },
    gaps: {
        type: [
            String
        ],
        default: []
    },
    confidence_level: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    scoring_meta: {
        type: ScoringMetaSchema,
        default: ()=>({})
    }
}, {
    timestamps: true,
    collection: "icp_scores"
});
const ICPScore = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ICPScore || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("ICPScore", ICPScoreSchema);
const __TURBOPACK__default__export__ = ICPScore;
}),
"[project]/src/models/OutreachCampaign.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const OutreachCampaignSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        required: true,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: [
            "not_started",
            "active",
            "paused",
            "stopped",
            "completed",
            "disqualified"
        ],
        default: "not_started"
    },
    current_phase: {
        type: String,
        enum: [
            "Research",
            "Engagement",
            "Qualification",
            "Handoff"
        ],
        default: "Research"
    },
    current_step_number: {
        type: Number,
        default: 0
    },
    next_planned_action: {
        label: {
            type: String,
            default: "Generate outreach strategy"
        },
        scheduled_at: {
            type: Date,
            default: null
        }
    },
    final_decision: {
        status: {
            type: String,
            default: "Pending"
        },
        reason: {
            type: String,
            default: "Outreach not yet generated"
        }
    },
    channel_mix: {
        email: {
            type: Number,
            default: 0
        },
        linkedin: {
            type: Number,
            default: 0
        },
        voice: {
            type: Number,
            default: 0
        }
    },
    response_rate: {
        type: Number,
        default: 0
    },
    avg_response_time: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: "outreach_campaigns"
});
const OutreachCampaign = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.OutreachCampaign || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("OutreachCampaign", OutreachCampaignSchema);
const __TURBOPACK__default__export__ = OutreachCampaign;
}),
"[project]/src/models/OutreachStrategyRun.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const OutreachStrategyRunSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        required: true,
        index: true
    },
    research_run_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "ResearchRun",
        required: true
    },
    icp_score_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "ICPScore",
        required: true
    },
    strategy_output: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: "outreach_strategy_runs"
});
// Index for finding latest strategy run per lead
OutreachStrategyRunSchema.index({
    lead_id: 1,
    createdAt: -1
});
const OutreachStrategyRun = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.OutreachStrategyRun || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("OutreachStrategyRun", OutreachStrategyRunSchema);
const __TURBOPACK__default__export__ = OutreachStrategyRun;
}),
"[project]/src/models/OutreachCopyRun.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const OutreachCopyRunSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        required: true,
        index: true
    },
    strategy_run_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "OutreachStrategyRun",
        required: true
    },
    copy_output: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
        required: true
    }
}, {
    timestamps: true,
    collection: "outreach_copy_runs"
});
// Index for finding latest copy run per lead
OutreachCopyRunSchema.index({
    lead_id: 1,
    createdAt: -1
});
const OutreachCopyRun = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.OutreachCopyRun || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("OutreachCopyRun", OutreachCopyRunSchema);
const __TURBOPACK__default__export__ = OutreachCopyRun;
}),
"[project]/src/models/OutreachEvent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const OutreachEventSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        required: true,
        index: true
    },
    campaign_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "OutreachCampaign",
        required: true,
        index: true
    },
    event_type: {
        type: String,
        enum: [
            "lifecycle",
            "research",
            "outreach",
            "engagement",
            "decision",
            "guardrail",
            "outcome"
        ],
        required: true
    },
    actor: {
        type: String,
        enum: [
            "AI",
            "System",
            "Human"
        ],
        required: true
    },
    timestamp: {
        type: Date,
        required: true,
        index: true
    },
    sort_order: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    badge: {
        type: String,
        default: ""
    },
    channel: {
        type: String,
        default: ""
    },
    direction: {
        type: String,
        enum: [
            "inbound",
            "outbound",
            ""
        ],
        default: ""
    },
    content: {
        subject: String,
        body: String,
        talking_points: [
            String
        ]
    },
    metadata: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    collection: "outreach_events"
});
// Compound index for chronological queries
OutreachEventSchema.index({
    lead_id: 1,
    sort_order: 1
});
OutreachEventSchema.index({
    campaign_id: 1,
    timestamp: 1
});
const OutreachEvent = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.OutreachEvent || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("OutreachEvent", OutreachEventSchema);
const __TURBOPACK__default__export__ = OutreachEvent;
}),
"[project]/src/models/OutreachGuardrails.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const OutreachGuardrailsSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        default: null,
        index: true
    },
    max_touches: {
        type: Number,
        default: 8
    },
    voice_escalation_allowed: {
        type: Boolean,
        default: true
    },
    voice_escalation_trigger: {
        type: String,
        default: "High ICP (≥80) + engagement on 2+ channels"
    },
    stop_conditions: {
        type: [
            String
        ],
        default: [
            "Explicit opt-out",
            "No engagement after 8 touches",
            "ICP score drops below 40 after re-research"
        ]
    },
    compliance_rules: {
        type: [
            String
        ],
        default: [
            "No weekend outreach (respects business hours)",
            "Unsubscribe links included in all emails",
            "GDPR and CAN-SPAM compliant messaging"
        ]
    }
}, {
    timestamps: true,
    collection: "outreach_guardrails"
});
// Static method to get guardrails (lead-specific or global)
OutreachGuardrailsSchema.statics.getForLead = async function(leadId) {
    // Try to find lead-specific guardrails
    let guardrails = await this.findOne({
        lead_id: leadId
    });
    if (!guardrails) {
        // Fall back to global defaults
        guardrails = await this.findOne({
            lead_id: null
        });
        if (!guardrails) {
            // Create global defaults if they don't exist
            guardrails = await this.create({
                lead_id: null
            });
        }
    }
    return guardrails;
};
const OutreachGuardrails = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.OutreachGuardrails || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("OutreachGuardrails", OutreachGuardrailsSchema);
const __TURBOPACK__default__export__ = OutreachGuardrails;
}),
"[project]/src/models/FieldOverride.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const FieldOverrideSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    scope: {
        type: String,
        enum: [
            "company",
            "persona",
            "outreach_campaign",
            "outreach_strategy",
            "outreach_copy",
            "outreach_guardrails"
        ],
        required: true,
        index: true
    },
    entity_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        required: true,
        index: true
    },
    path: {
        type: String,
        required: true
    },
    value: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
        required: true
    },
    updated_by: {
        type: String,
        default: "user"
    },
    reason: {
        type: String,
        default: ""
    }
}, {
    timestamps: {
        createdAt: false,
        updatedAt: true
    },
    collection: "field_overrides"
});
// Compound index for efficient lookups
FieldOverrideSchema.index({
    scope: 1,
    entity_id: 1,
    path: 1
}, {
    unique: true
});
// Static method to get all overrides for an entity
FieldOverrideSchema.statics.getOverridesForEntity = async function(scope, entityId) {
    const overrides = await this.find({
        scope,
        entity_id: entityId
    });
    // Convert to a map for easy lookup
    const overrideMap = {};
    overrides.forEach((override)=>{
        overrideMap[override.path] = override.value;
    });
    return overrideMap;
};
// Static method to set an override
FieldOverrideSchema.statics.setOverride = async function(scope, entityId, path, value, updatedBy = "user", reason = "") {
    return await this.findOneAndUpdate({
        scope,
        entity_id: entityId,
        path
    }, {
        value,
        updated_by: updatedBy,
        reason
    }, {
        upsert: true,
        new: true
    });
};
const FieldOverride = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.FieldOverride || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("FieldOverride", FieldOverrideSchema);
const __TURBOPACK__default__export__ = FieldOverride;
}),
"[project]/src/app/api/leads/[id]/outreach/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Lead.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ICPScore.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachCampaign.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachStrategyRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachCopyRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachEvent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachGuardrails$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachGuardrails.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/FieldOverride.ts [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
;
;
const runtime = "nodejs";
// Helper to merge overrides into an object
function applyOverrides(baseObject, overrides) {
    const result = JSON.parse(JSON.stringify(baseObject)); // Deep clone
    for (const [path, value] of Object.entries(overrides)){
        const parts = path.split(/[\[\]\.]+/).filter(Boolean);
        let current = result;
        for(let i = 0; i < parts.length - 1; i++){
            const part = parts[i];
            const nextPart = parts[i + 1];
            if (!current[part]) {
                current[part] = isNaN(Number(nextPart)) ? {} : [];
            }
            current = current[part];
        }
        current[parts[parts.length - 1]] = value;
    }
    return result;
}
// Helper to parse JSON that might be wrapped in markdown code fences
function parseMarkdownJSON(data) {
    if (!data) return data;
    // If it's already a proper object (not a string), return as-is
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
        // Check if it has expected properties or if it's already parsed
        if (data.drafts || data.recommended_channel_sequence || data.status || data.strategy_status) {
            return data;
        }
    }
    // If it's a string, try to clean and parse it
    if (typeof data === 'string') {
        try {
            // Strip markdown code fences
            let cleaned = data.trim();
            cleaned = cleaned.replace(/^```(?:json)?\s*\n?/i, "");
            cleaned = cleaned.replace(/\n?```\s*$/i, "");
            cleaned = cleaned.trim();
            // Only parse if it looks like JSON
            if (cleaned.startsWith('{') || cleaned.startsWith('[')) {
                return JSON.parse(cleaned);
            }
        } catch (e) {
            console.warn("Could not parse markdown JSON:", e);
            return data;
        }
    }
    return data;
}
async function GET(request, { params }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await params;
        console.log(`✅ Database connected for GET /api/leads/${id}/outreach`);
        const leadId = id;
        // Fetch lead with company and ICP score
        const lead = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(leadId).populate("company_id").populate("persona_id");
        if (!lead) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Lead not found"
            }, {
                status: 404
            });
        }
        const company = lead.company_id;
        const icpScore = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        // Fetch or create campaign
        let campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        if (!campaign) {
            campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                lead_id: leadId
            });
        }
        // Fetch latest strategy run
        const strategyRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        }).sort({
            createdAt: -1
        }).limit(1);
        // Fetch latest copy run
        const copyRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        }).sort({
            createdAt: -1
        }).limit(1);
        // Fetch all events
        const events = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            lead_id: leadId
        }).sort({
            sort_order: 1
        });
        // Fetch guardrails (lead-specific or global)
        const guardrails = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachGuardrails$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getForLead(leadId);
        // Fetch overrides for strategy, copy, campaign, and guardrails
        const campaignOverrides = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getOverridesForEntity("outreach_campaign", campaign._id);
        const strategyOverrides = strategyRun ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getOverridesForEntity("outreach_strategy", strategyRun._id) : {};
        const copyOverrides = copyRun ? await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getOverridesForEntity("outreach_copy", copyRun._id) : {};
        const guardrailsOverrides = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].getOverridesForEntity("outreach_guardrails", guardrails._id);
        // Apply overrides (manual always wins)
        const effectiveCampaign = applyOverrides(campaign.toObject(), campaignOverrides);
        // Parse strategy and copy outputs (in case they contain markdown-wrapped JSON from old data)
        console.log("🔍 Raw strategy_output type:", typeof strategyRun?.strategy_output);
        console.log("🔍 Raw strategy_output preview:", JSON.stringify(strategyRun?.strategy_output).substring(0, 100));
        console.log("🔍 Raw copy_output type:", typeof copyRun?.copy_output);
        console.log("🔍 Raw copy_output preview:", JSON.stringify(copyRun?.copy_output).substring(0, 100));
        const parsedStrategyOutput = strategyRun ? parseMarkdownJSON(strategyRun.strategy_output) : null;
        const parsedCopyOutput = copyRun ? parseMarkdownJSON(copyRun.copy_output) : null;
        console.log("✅ Parsed strategy has drafts?", !!parsedStrategyOutput?.recommended_channel_sequence);
        console.log("✅ Parsed copy has drafts?", !!parsedCopyOutput?.drafts, "Count:", parsedCopyOutput?.drafts?.length);
        const effectiveStrategy = parsedStrategyOutput ? {
            ...applyOverrides(parsedStrategyOutput, strategyOverrides),
            _id: strategyRun._id
        } : null;
        const effectiveCopy = parsedCopyOutput ? {
            ...applyOverrides(parsedCopyOutput, copyOverrides),
            _id: copyRun._id
        } : null;
        const effectiveGuardrails = applyOverrides(guardrails.toObject(), guardrailsOverrides);
        // Build response
        const response = {
            success: true,
            data: {
                lead: {
                    _id: lead._id,
                    name: lead.name,
                    title: lead.title,
                    email: lead.email,
                    company: {
                        name: company?.name || "Unknown"
                    },
                    icp_score: icpScore ? {
                        icp_score: icpScore.icp_score,
                        fit_tier: icpScore.fit_tier
                    } : null
                },
                campaign: effectiveCampaign,
                strategy: effectiveStrategy,
                copy: effectiveCopy,
                events: events.map((e)=>({
                        id: e._id,
                        eventType: e.event_type,
                        timestamp: e.timestamp,
                        actor: e.actor,
                        title: e.title,
                        description: e.summary,
                        badge: e.badge,
                        channel: e.channel,
                        direction: e.direction,
                        content: e.content,
                        metadata: e.metadata
                    })),
                guardrails: effectiveGuardrails
            }
        };
        console.log(`✅ Retrieved outreach data for lead ${leadId} with ${events.length} events`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(response, {
            status: 200
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Internal server error",
            message: error.message || "An unexpected error occurred"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__02833e9d._.js.map