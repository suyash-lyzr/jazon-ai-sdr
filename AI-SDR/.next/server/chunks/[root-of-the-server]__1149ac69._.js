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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
;
;
const runtime = "nodejs";
const LYXR_AGENT_API_URL = "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
const LYXR_API_KEY = "sk-default-eE6EHcdIhXl61H4mK4YKZFqISTGrruf1";
const RESEARCH_AGENT_ID = "69451f56d9c1eef9bdbd3957";
const ICP_AGENT_ID = "6945269078787390cded7e01";
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
                // Generate unique session IDs for this lead
                const researchSessionId = `${RESEARCH_AGENT_ID}-${lead._id.toString()}-${Date.now()}`;
                // Prepare the message with lead data for the Research Agent
                // Format: Provide lead information for research and enrichment
                const message = `Please perform research and enrichment for the following lead:

Name: ${leadData.name}, 
Title: ${leadData.title}, 
Company: ${leadData.company}, 
Email: ${leadData.email || "Not provided"}
`;
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
                        agent_id: RESEARCH_AGENT_ID,
                        session_id: researchSessionId,
                        message: message
                    })
                });
                if (!agentResponse.ok) {
                    const errorText = await agentResponse.text();
                    throw new Error(`Agent API error: ${agentResponse.status} - ${errorText}`);
                }
                const researchAgentData = await agentResponse.json();
                console.log(`✅ Research Agent response received for ${leadData.name}`);
                console.log(`📥 Research Response data:`, JSON.stringify(researchAgentData, null, 2));
                // Parse the research response (it's a JSON string in the response field)
                let researchData;
                try {
                    if (typeof researchAgentData.response === "string") {
                        researchData = JSON.parse(researchAgentData.response);
                    } else {
                        researchData = researchAgentData.response;
                    }
                } catch (parseError) {
                    console.warn("⚠️ Could not parse research response as JSON, using raw response");
                    researchData = researchAgentData.response;
                }
                // Save research response to JSON file
                const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "output");
                if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(outputDir)) {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(outputDir, {
                        recursive: true
                    });
                }
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                const researchFileName = `research-agent-response-${lead._id.toString()}-${timestamp}.json`;
                const researchFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, researchFileName);
                const formattedResearchResponse = {
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    leadCompany: leadData.company,
                    leadTitle: leadData.title,
                    leadEmail: leadData.email || null,
                    timestamp: new Date().toISOString(),
                    agentResponse: researchAgentData,
                    parsedResearchData: researchData
                };
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(researchFilePath, JSON.stringify(formattedResearchResponse, null, 2), "utf-8");
                console.log(`💾 Research response saved to: ${researchFilePath}`);
                // Now call the ICP Scoring Agent with the research data
                console.log(`\n📊 Calling ICP Scoring Agent for ${leadData.name}...`);
                const icpSessionId = `${ICP_AGENT_ID}-${lead._id.toString()}-${Date.now()}`;
                // Prepare message for ICP Agent with research data
                const icpMessage = `Please perform ICP scoring for the following lead based on the research data:

Lead Information:
- Name: ${leadData.name}
- Title: ${leadData.title}
- Company: ${leadData.company}
- Email: ${leadData.email || "Not provided"}

Research Data:
${JSON.stringify(researchData, null, 2)}

Please return structured output with:
- icp_score (0-100)
- fit_tier (Tier 1 / Tier 2 / Tier 3 / Disqualified)
- score_breakdown
- strengths
- risks
- gaps
- confidence_level
- scoring_meta`;
                // Call the ICP Scoring Agent
                const icpAgentResponse = await fetch(LYXR_AGENT_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": LYXR_API_KEY
                    },
                    body: JSON.stringify({
                        user_id: USER_ID,
                        agent_id: ICP_AGENT_ID,
                        session_id: icpSessionId,
                        message: icpMessage
                    })
                });
                if (!icpAgentResponse.ok) {
                    const errorText = await icpAgentResponse.text();
                    throw new Error(`ICP Agent API error: ${icpAgentResponse.status} - ${errorText}`);
                }
                const icpAgentData = await icpAgentResponse.json();
                console.log(`✅ ICP Agent response received for ${leadData.name}`);
                console.log(`📥 ICP Response data:`, JSON.stringify(icpAgentData, null, 2));
                // Parse the ICP response
                let icpData;
                try {
                    if (typeof icpAgentData.response === "string") {
                        icpData = JSON.parse(icpAgentData.response);
                    } else {
                        icpData = icpAgentData.response;
                    }
                } catch (parseError) {
                    console.warn("⚠️ Could not parse ICP response as JSON, using raw response");
                    icpData = icpAgentData.response;
                }
                // Save ICP response to JSON file
                const icpFileName = `icp-agent-response-${lead._id.toString()}-${timestamp}.json`;
                const icpFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, icpFileName);
                const formattedIcpResponse = {
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    leadCompany: leadData.company,
                    leadTitle: leadData.title,
                    leadEmail: leadData.email || null,
                    timestamp: new Date().toISOString(),
                    researchData: researchData,
                    agentResponse: icpAgentData,
                    parsedIcpData: icpData
                };
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(icpFilePath, JSON.stringify(formattedIcpResponse, null, 2), "utf-8");
                console.log(`💾 ICP response saved to: ${icpFilePath}`);
                // Update the lead in the database with research and ICP data
                console.log(`\n💾 Updating lead in database...`);
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(lead._id, {
                    research: researchData,
                    icp: icpData,
                    status: "icp_scored"
                });
                console.log(`✅ Lead ${lead._id} updated in database with research and ICP data`);
                responses.push({
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    leadCompany: leadData.company,
                    researchResponse: researchAgentData,
                    icpResponse: icpAgentData,
                    researchFile: researchFilePath,
                    icpFile: icpFilePath
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
        // Save summary to a combined JSON file
        const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "output");
        if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(outputDir)) {
            __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(outputDir, {
                recursive: true
            });
        }
        const summaryTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const summaryFileName = `refresh-summary-${summaryTimestamp}.json`;
        const summaryFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, summaryFileName);
        const summaryData = {
            timestamp: new Date().toISOString(),
            summary: {
                totalProcessed: responses.length,
                totalFailed: errors.length,
                totalLeads: responses.length + errors.length
            },
            responses: responses.map((r)=>({
                    leadId: r.leadId,
                    leadName: r.leadName,
                    leadCompany: r.leadCompany,
                    researchFile: r.researchFile,
                    icpFile: r.icpFile
                })),
            errors: errors.length > 0 ? errors : [],
            fullResponses: responses
        };
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(summaryFilePath, JSON.stringify(summaryData, null, 2), "utf-8");
        console.log(`\n📊 Refresh Summary:`);
        console.log(`  ✅ Successfully processed: ${responses.length} leads`);
        console.log(`  ❌ Errors: ${errors.length} leads`);
        console.log(`  💾 Summary saved to: ${summaryFilePath}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Processed ${responses.length} lead(s)`,
            processed: responses.length,
            failed: errors.length,
            responses: responses.map((r)=>({
                    leadId: r.leadId,
                    leadName: r.leadName,
                    leadCompany: r.leadCompany,
                    researchFile: r.researchFile,
                    icpFile: r.icpFile
                })),
            errors: errors.length > 0 ? errors : undefined,
            summaryFile: summaryFilePath
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1149ac69._.js.map