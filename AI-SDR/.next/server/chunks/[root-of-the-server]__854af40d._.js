module.exports = [
"[project]/.next-internal/server/app/api/leads/refresh/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
        cached.promise = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(MONGODB_URI, opts).then((mongoose)=>{
            console.log('✅ MongoDB connected successfully');
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
;
;
// Ensure database connection
if (__TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connection.readyState === 0) {
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])().catch((err)=>console.error("MongoDB connection error:", err));
}
// Schema definition
const LeadSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    lead_input: {
        name: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        company: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: false
        }
    },
    research: {
        CompanyProfile: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
            required: false
        },
        PersonaProfile: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
            required: false
        },
        DetectedSignals: {
            type: [
                __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed
            ],
            required: false,
            default: []
        },
        ResearchMeta: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
            required: false
        }
    },
    icp: {
        icp_score: {
            type: Number,
            required: false
        },
        fit_tier: {
            type: String,
            required: false
        },
        score_breakdown: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
            required: false
        },
        strengths: {
            type: [
                String
            ],
            required: false,
            default: []
        },
        risks: {
            type: [
                String
            ],
            required: false,
            default: []
        },
        gaps: {
            type: [
                String
            ],
            required: false,
            default: []
        },
        confidence_level: {
            type: String,
            required: false
        },
        scoring_meta: {
            type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.Mixed,
            required: false
        }
    },
    status: {
        type: String,
        enum: [
            "uploaded",
            "researched",
            "icp_scored"
        ],
        required: true,
        default: "uploaded"
    }
}, {
    timestamps: true,
    collection: "leads"
});
// Export model safely to avoid re-registration errors
const Lead = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Lead || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Lead", LeadSchema);
const __TURBOPACK__default__export__ = Lead;
}),
"[project]/src/app/api/leads/refresh/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Lead.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
const LYXR_AGENT_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYXR_API_KEY = "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const AGENT_ID = "69451f56d9c1eef9bdbd3957";
const USER_ID = "suyash@lyzr.ai";
async function POST(request) {
    try {
        // Connect to database
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        console.log("✅ Database connected for lead refresh");
        // Get request body to check if specific lead ID is provided
        const body = await request.json().catch(()=>({}));
        const leadId = body.leadId || null;
        // Fetch leads from database
        let leads;
        if (leadId) {
            // Fetch specific lead
            leads = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                _id: leadId
            });
            console.log(`📋 Fetching specific lead: ${leadId}`);
        } else {
            // Fetch all leads with status "uploaded" (not yet researched)
            leads = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                status: "uploaded"
            });
            console.log(`📋 Found ${leads.length} leads with status "uploaded"`);
        }
        if (!leads || leads.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: true,
                message: "No leads found to refresh",
                processed: 0,
                responses: []
            }, {
                status: 200
            });
        }
        // Process each lead
        const responses = [];
        const errors = [];
        for (const lead of leads){
            try {
                // Prepare lead data for the agent
                const leadData = {
                    name: lead.lead_input.name,
                    title: lead.lead_input.title,
                    company: lead.lead_input.company,
                    email: lead.lead_input.email || ""
                };
                // Generate a unique session ID for this lead
                const sessionId = `${AGENT_ID}-${lead._id.toString()}-${Date.now()}`;
                // Prepare the message with lead data for the Research Agent
                // Format: Provide lead information for research and enrichment
                const message = `Please perform research and enrichment for the following lead:

Name: ${leadData.name}
Title: ${leadData.title}
Company: ${leadData.company}
Email: ${leadData.email || "Not provided"}

Please return structured output with:
- CompanyProfile
- PersonaProfile  
- DetectedSignals
- ResearchMeta`;
                console.log(`\n🔍 Processing lead: ${leadData.name} (${leadData.company})`);
                console.log(`📤 Sending to Research Agent...`);
                // Call the Research & Enrichment Agent
                const agentResponse = await fetch(LYXR_AGENT_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": LYXR_API_KEY
                    },
                    body: JSON.stringify({
                        user_id: USER_ID,
                        agent_id: AGENT_ID,
                        session_id: sessionId,
                        message: message
                    })
                });
                if (!agentResponse.ok) {
                    const errorText = await agentResponse.text();
                    throw new Error(`Agent API error: ${agentResponse.status} - ${errorText}`);
                }
                const agentData = await agentResponse.json();
                console.log(`✅ Agent response received for ${leadData.name}`);
                console.log(`📥 Response data:`, JSON.stringify(agentData, null, 2));
                responses.push({
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    leadCompany: leadData.company,
                    response: agentData
                });
            } catch (error) {
                console.error(`❌ Error processing lead ${lead._id}:`, error);
                errors.push({
                    leadId: lead._id.toString(),
                    leadName: lead.lead_input.name,
                    error: error.message || "Unknown error"
                });
            }
        }
        // Log summary
        console.log(`\n📊 Refresh Summary:`);
        console.log(`  ✅ Successfully processed: ${responses.length} leads`);
        console.log(`  ❌ Errors: ${errors.length} leads`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Processed ${responses.length} lead(s)`,
            processed: responses.length,
            failed: errors.length,
            responses: responses,
            errors: errors.length > 0 ? errors : undefined
        }, {
            status: 200
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: "Internal server error",
            message: error.message || "An unexpected error occurred",
            details: error.toString()
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__854af40d._.js.map