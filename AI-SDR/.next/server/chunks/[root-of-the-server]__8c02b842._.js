module.exports = [
"[project]/.next-internal/server/app/api/leads/[id]/outreach/generate/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/models/ResearchRun.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const RequestedLeadSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        default: ""
    },
    title: {
        type: String,
        default: ""
    },
    company: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    }
}, {
    _id: false
});
const ResearchMetaSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    requested_lead: {
        type: RequestedLeadSchema,
        default: ()=>({})
    },
    research_timestamp_utc: {
        type: String,
        default: ""
    },
    tools_used: {
        type: [
            String
        ],
        default: []
    },
    data_quality_warnings: {
        type: [
            String
        ],
        default: []
    }
}, {
    _id: false
});
const ResearchRunSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Lead",
        required: true,
        unique: true,
        index: true
    },
    company_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Company",
        required: true
    },
    persona_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Persona",
        required: true
    },
    research_meta: {
        type: ResearchMetaSchema,
        default: ()=>({})
    }
}, {
    timestamps: true,
    collection: "research_runs"
});
const ResearchRun = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ResearchRun || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("ResearchRun", ResearchRunSchema);
const __TURBOPACK__default__export__ = ResearchRun;
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
"[project]/src/models/DetectedSignal.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const DetectedSignalSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
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
    type: {
        type: String,
        enum: [
            "organizational",
            "technical",
            "financial",
            "intent",
            "engagement",
            "persona_change",
            "other"
        ],
        required: true
    },
    signal: {
        type: String,
        required: true
    },
    source: {
        type: String,
        default: ""
    },
    strength: {
        type: String,
        enum: [
            "high",
            "medium",
            "low"
        ],
        default: "medium"
    },
    recency: {
        type: String,
        default: ""
    },
    evidence: {
        type: [
            String
        ],
        default: []
    }
}, {
    timestamps: true,
    collection: "detected_signals"
});
// Compound index for efficient queries
DetectedSignalSchema.index({
    lead_id: 1,
    type: 1
});
const DetectedSignal = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.DetectedSignal || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("DetectedSignal", DetectedSignalSchema);
const __TURBOPACK__default__export__ = DetectedSignal;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/leads/[id]/outreach/generate/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "maxDuration",
    ()=>maxDuration,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Lead.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ResearchRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ICPScore.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachCampaign.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachStrategyRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachCopyRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachEvent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/DetectedSignal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
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
;
;
const runtime = "nodejs";
const maxDuration = 300;
const LYXR_AGENT_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYXR_API_KEY = process.env.LYZR_API_KEY || "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const OUTREACH_STRATEGY_AGENT_ID = process.env.OUTREACH_STRATEGY_AGENT_ID || "69453743f6d93e181164e4d0";
const OUTREACH_COPY_AGENT_ID = process.env.OUTREACH_COPY_AGENT_ID || "6948162d2be72f04a7d64f65";
const USER_ID = process.env.LYZR_USER_ID || "suyash@lyzr.ai";
function parseFencedJsonOrThrow(raw, label) {
    // If agent already returned an object, just use it.
    if (raw && typeof raw === "object") return raw;
    const escapeNewlinesInsideStrings = (input)=>{
        let out = "";
        let inString = false;
        let escaped = false;
        for(let i = 0; i < input.length; i++){
            const ch = input[i];
            if (escaped) {
                out += ch;
                escaped = false;
                continue;
            }
            if (ch === "\\") {
                out += ch;
                escaped = true;
                continue;
            }
            if (ch === "\"") {
                inString = !inString;
                out += ch;
                continue;
            }
            // JSON does not allow literal newlines inside string literals.
            if (inString && ch === "\n") {
                out += "\\n";
                continue;
            }
            if (inString && ch === "\r") {
                out += "\\r";
                continue;
            }
            out += ch;
        }
        return out;
    };
    const repairMismatchedBrackets = (input)=>{
        let out = "";
        const stack = [];
        let inString = false;
        let escaped = false;
        const pushExpected = (open)=>{
            if (open === "{") stack.push("}");
            else if (open === "[") stack.push("]");
        };
        const isOpener = (ch)=>ch === "{" || ch === "[";
        const isCloser = (ch)=>ch === "}" || ch === "]";
        for(let i = 0; i < input.length; i++){
            let ch = input[i];
            if (escaped) {
                out += ch;
                escaped = false;
                continue;
            }
            if (ch === "\\") {
                out += ch;
                escaped = true;
                continue;
            }
            if (ch === "\"") {
                inString = !inString;
                out += ch;
                continue;
            }
            if (inString) {
                out += ch;
                continue;
            }
            // Outside strings: maintain bracket stack and repair mismatches by inserting expected closers.
            if (isOpener(ch)) {
                pushExpected(ch);
                out += ch;
                continue;
            }
            if (isCloser(ch)) {
                // If the closer doesn't match, prefer REPLACING it with what we expected.
                if (stack.length > 0 && stack[stack.length - 1] !== ch) {
                    // Replace mismatched closer with expected closer (do NOT emit the wrong one).
                    out += stack.pop();
                    continue;
                }
                if (stack.length > 0 && stack[stack.length - 1] === ch) stack.pop();
                out += ch;
                continue;
            }
            out += ch;
        }
        // If still unclosed, close everything at the end.
        while(stack.length > 0)out += stack.pop();
        return out;
    };
    if (typeof raw !== "string") {
        throw new Error(`${label}: expected string or object response, got ${typeof raw}`);
    }
    // Common Lyzr behavior: markdown fenced JSON in a string.
    const trimmed = raw.trim();
    // If it starts with ```...```, strip outer fences.
    const stripOuterFences = (s)=>s.replace(/^```(?:json)?\s*\n?/i, "").replace(/\n?```\s*$/i, "").trim();
    let candidate = stripOuterFences(trimmed);
    // If still not valid JSON-looking, try extracting a fenced block from anywhere.
    if (!(candidate.startsWith("{") || candidate.startsWith("["))) {
        const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
        if (match?.[1]) {
            candidate = match[1].trim();
        }
    }
    if (!(candidate.startsWith("{") || candidate.startsWith("["))) {
        throw new Error(`${label}: could not locate JSON in agent response`);
    }
    // Agents sometimes include literal newlines inside quoted strings (invalid JSON).
    // Sanitize by escaping \n/\r inside string literals before parsing.
    const sanitized = escapeNewlinesInsideStrings(candidate);
    try {
        return JSON.parse(sanitized);
    } catch (e) {
        // Agents also occasionally mismatch brackets (e.g., close an array with `}`).
        // Best-effort repair: balance brackets outside strings and retry.
        const repaired = repairMismatchedBrackets(sanitized);
        return JSON.parse(repaired);
    }
}
async function POST(request, { params }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await params;
        console.log(`✅ Database connected for POST /api/leads/${id}/outreach/generate`);
        const leadId = id;
        // Fetch lead with populated data
        const lead = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(leadId).populate("company_id").populate("persona_id");
        if (!lead) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Lead not found"
            }, {
                status: 404
            });
        }
        // Fetch research run and ICP score
        const researchRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        const icpScore = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        if (!researchRun || !icpScore) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Research and ICP scoring must be completed before generating outreach"
            }, {
                status: 400
            });
        }
        console.log(`📋 Generating outreach for lead: ${lead.name} (ICP: ${icpScore.icp_score})`);
        // Step 1: Call Outreach Strategy Agent
        console.log("🎯 Calling Outreach Strategy Agent...");
        // Fetch detected signals
        const detectedSignals = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            lead_id: leadId
        });
        const strategyInput = {
            lead: {
                name: lead.name,
                title: lead.title,
                email: lead.email
            },
            company: lead.company_id.toObject(),
            persona: lead.persona_id.toObject(),
            research: researchRun.research_meta,
            icp_score: {
                icp_score: icpScore.icp_score,
                fit_tier: icpScore.fit_tier,
                score_breakdown: icpScore.score_breakdown,
                strengths: icpScore.strengths,
                risks: icpScore.risks
            },
            detected_signals: detectedSignals.map((s)=>s.toObject())
        };
        // Generate unique session ID for this strategy run
        const strategySessionId = `strategy-${leadId}-${Date.now()}`;
        // Call Lyzr API
        const strategyAgentResponse = await fetch(LYXR_AGENT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": LYXR_API_KEY
            },
            body: JSON.stringify({
                user_id: USER_ID,
                agent_id: OUTREACH_STRATEGY_AGENT_ID,
                session_id: strategySessionId,
                message: JSON.stringify(strategyInput)
            })
        });
        if (!strategyAgentResponse.ok) {
            const errorText = await strategyAgentResponse.text();
            throw new Error(`Strategy Agent API error: ${strategyAgentResponse.status} - ${errorText}`);
        }
        const strategyAgentData = await strategyAgentResponse.json();
        // Parse the strategy response (strip markdown code fences if present)
        let strategyOutput;
        try {
            strategyOutput = parseFencedJsonOrThrow(strategyAgentData.response, "Strategy agent");
        } catch (parseError) {
            console.warn("⚠️ Could not parse strategy response as JSON, using raw response", parseError);
            strategyOutput = {
                strategy_status: "ERROR",
                blocking_reason: "Failed to parse agent response",
                raw_response: strategyAgentData.response
            };
        }
        // Save strategy response to JSON file (for debugging)
        const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "output");
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(outputDir)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(outputDir, {
                recursive: true
            });
        }
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const strategyFileName = `outreach-strategy-agent-response-${leadId}-${timestamp}.json`;
        const strategyFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, strategyFileName);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(strategyFilePath, JSON.stringify({
            leadId: leadId,
            leadName: lead.name,
            leadCompany: lead.company_id?.name || "Unknown",
            timestamp: new Date().toISOString(),
            agentResponse: strategyAgentData,
            parsedStrategyData: strategyOutput,
            strategyInput: strategyInput
        }, null, 2), "utf-8");
        console.log(`💾 Strategy response saved to: ${strategyFilePath}`);
        console.log("📊 Parsed Strategy Output:", JSON.stringify(strategyOutput, null, 2));
        // Save strategy run
        if (!strategyOutput || typeof strategyOutput !== "object") {
            throw new Error("Strategy output is not an object after parsing; refusing to persist invalid strategy_output");
        }
        const strategyRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            lead_id: leadId,
            research_run_id: researchRun._id,
            icp_score_id: icpScore._id,
            strategy_output: {
                ...strategyOutput,
                strategy_meta: {
                    ...strategyOutput.strategy_meta,
                    inputs_used: {
                        research_run_id: researchRun._id.toString(),
                        icp_score_id: icpScore._id.toString()
                    }
                }
            }
        });
        console.log(`✅ Outreach Strategy saved (status: ${strategyOutput.strategy_status})`);
        // Check if strategy blocks outreach
        if (strategyOutput.strategy_status === "NO_OUTREACH") {
            // Update campaign to reflect no outreach
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
                lead_id: leadId
            }, {
                status: "disqualified",
                final_decision: {
                    status: "No outreach",
                    reason: strategyOutput.reason || "Strategy determined no outreach"
                }
            }, {
                upsert: true
            });
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "Strategy generated but no outreach recommended",
                strategy_status: "NO_OUTREACH",
                reason: strategyOutput.reason
            }, {
                status: 200
            });
        }
        // Step 2: Call Outreach Copy Agent
        console.log("✍️ Calling Outreach Copy Agent...");
        const copyInput = {
            lead: {
                name: lead.name,
                title: lead.title,
                email: lead.email
            },
            company: lead.company_id.toObject(),
            persona: lead.persona_id.toObject(),
            research: researchRun.research_meta,
            icp_score: {
                icp_score: icpScore.icp_score,
                fit_tier: icpScore.fit_tier
            },
            strategy: strategyOutput,
            strategy_run_id: strategyRun._id.toString()
        };
        // Generate unique session ID for this copy run
        const copySessionId = `copy-${leadId}-${Date.now()}`;
        // Call Lyzr API
        const copyAgentResponse = await fetch(LYXR_AGENT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": LYXR_API_KEY
            },
            body: JSON.stringify({
                user_id: USER_ID,
                agent_id: OUTREACH_COPY_AGENT_ID,
                session_id: copySessionId,
                message: JSON.stringify(copyInput)
            })
        });
        if (!copyAgentResponse.ok) {
            const errorText = await copyAgentResponse.text();
            throw new Error(`Copy Agent API error: ${copyAgentResponse.status} - ${errorText}`);
        }
        const copyAgentData = await copyAgentResponse.json();
        // Parse the copy response (strip markdown code fences if present)
        let copyOutput;
        try {
            copyOutput = parseFencedJsonOrThrow(copyAgentData.response, "Copy agent");
        } catch (parseError) {
            console.warn("⚠️ Could not parse copy response as JSON, using raw response", parseError);
            copyOutput = {
                status: "ERROR",
                drafts: [],
                raw_response: copyAgentData.response
            };
        }
        // Save copy response to JSON file (for debugging)
        const copyTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const copyFileName = `outreach-copy-agent-response-${leadId}-${copyTimestamp}.json`;
        const copyFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, copyFileName);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(copyFilePath, JSON.stringify({
            leadId: leadId,
            leadName: lead.name,
            leadCompany: lead.company_id?.name || "Unknown",
            timestamp: new Date().toISOString(),
            agentResponse: copyAgentData,
            parsedCopyData: copyOutput,
            copyInput: copyInput,
            strategyRunId: strategyRun._id.toString()
        }, null, 2), "utf-8");
        console.log(`💾 Copy response saved to: ${copyFilePath}`);
        console.log("📊 Parsed Copy Output:", JSON.stringify(copyOutput, null, 2));
        // Save copy run
        if (!copyOutput || typeof copyOutput !== "object") {
            throw new Error("Copy output is not an object after parsing; refusing to persist invalid copy_output");
        }
        const copyRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            lead_id: leadId,
            strategy_run_id: strategyRun._id,
            copy_output: {
                ...copyOutput,
                copy_meta: {
                    ...copyOutput.copy_meta,
                    strategy_run_id: strategyRun._id.toString()
                }
            }
        });
        console.log(`✅ Outreach Copy saved (status: ${copyOutput.status})`);
        // Step 3: Update campaign
        const totalSteps = strategyOutput.recommended_channel_sequence?.length || 0;
        const firstStep = strategyOutput.recommended_channel_sequence?.[0];
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
            lead_id: leadId
        }, {
            status: "active",
            current_phase: "Engagement",
            current_step_number: 1,
            next_planned_action: {
                label: firstStep?.goal || "Start outreach",
                scheduled_at: firstStep?.recommended_delay_hours ? new Date(Date.now() + firstStep.recommended_delay_hours * 3600000) : null
            },
            final_decision: {
                status: "In progress",
                reason: "Outreach strategy generated and ready"
            }
        }, {
            upsert: true,
            new: true
        });
        // Step 4: Create initial events
        const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        // Get current max sort_order
        const lastEvent = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        }).sort({
            sort_order: -1
        });
        let sortOrder = (lastEvent?.sort_order || 0) + 1;
        // Event: Strategy generated
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            lead_id: leadId,
            campaign_id: campaign._id,
            event_type: "decision",
            actor: "AI",
            timestamp: new Date(),
            sort_order: sortOrder++,
            title: "Outreach strategy generated",
            summary: `AI-generated ${totalSteps}-step outreach strategy with channels: ${strategyOutput.recommended_channel_sequence?.map((s)=>s.channel).join(", ")}. Strategy confidence: ${strategyOutput.confidence_level}.`,
            badge: "AI Decision",
            metadata: {
                strategy_run_id: strategyRun._id,
                total_steps: totalSteps,
                channels: strategyOutput.recommended_channel_sequence?.map((s)=>s.channel),
                confidence: strategyOutput.confidence_level
            }
        });
        // Event: Copy generated
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            lead_id: leadId,
            campaign_id: campaign._id,
            event_type: "outreach",
            actor: "AI",
            timestamp: new Date(),
            sort_order: sortOrder++,
            title: "Outreach copy generated",
            summary: `AI-generated personalized copy for ${copyOutput.drafts?.length || 0} outreach steps. Copy confidence: ${copyOutput.confidence_level}.`,
            badge: "Outreach Prepared",
            metadata: {
                copy_run_id: copyRun._id,
                drafts_count: copyOutput.drafts?.length || 0,
                confidence: copyOutput.confidence_level
            }
        });
        // Event: Outreach ready to start
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
            lead_id: leadId,
            campaign_id: campaign._id,
            event_type: "lifecycle",
            actor: "System",
            timestamp: new Date(),
            sort_order: sortOrder++,
            title: "Outreach campaign ready",
            summary: `Campaign configured and ready to execute. Next step: ${firstStep?.goal || "Begin outreach"}`,
            badge: "Campaign Ready",
            metadata: {
                next_step: firstStep?.goal,
                scheduled_at: campaign.next_planned_action.scheduled_at
            }
        });
        console.log(`✅ Outreach campaign generated for lead ${leadId}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Outreach strategy and copy generated successfully",
            data: {
                strategy_status: strategyOutput.strategy_status,
                copy_status: copyOutput.status,
                total_steps: totalSteps,
                campaign_status: "active"
            }
        }, {
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

//# sourceMappingURL=%5Broot-of-the-server%5D__8c02b842._.js.map