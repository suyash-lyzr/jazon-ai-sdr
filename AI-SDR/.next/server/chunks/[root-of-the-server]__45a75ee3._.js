module.exports = [
"[project]/.next-internal/server/app/api/leads/upload/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/leads/upload/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parse$2f$lib$2f$sync$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/csv-parse/lib/sync.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/mongodb.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Lead.ts [app-route] (ecmascript)");
;
;
;
;
const runtime = "nodejs";
async function POST(request) {
    try {
        // Connect to database
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        console.log("✅ Database connected");
        // Get the form data
        const formData = await request.formData();
        const file = formData.get("file");
        const mappingJson = formData.get("mapping");
        if (!file) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "No file uploaded"
            }, {
                status: 400
            });
        }
        // Validate file type
        if (!file.name.endsWith(".csv")) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "File must be a CSV file"
            }, {
                status: 400
            });
        }
        console.log("📄 Processing CSV file:", file.name);
        // Read file content
        const fileContent = await file.text();
        console.log("📄 File content length:", fileContent.length);
        // Parse CSV
        let records;
        try {
            records = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$csv$2d$parse$2f$lib$2f$sync$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["parse"])(fileContent, {
                columns: true,
                skip_empty_lines: true,
                trim: true,
                relax_column_count: true
            });
            console.log("✅ CSV parsed successfully. Rows:", records.length);
            console.log("📋 CSV headers:", records.length > 0 ? Object.keys(records[0]) : []);
        } catch (parseError) {
            console.error("❌ CSV parsing error:", parseError);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Failed to parse CSV file. Please check the format.",
                details: parseError.message
            }, {
                status: 400
            });
        }
        if (!records || records.length === 0) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "CSV file is empty or has no valid rows"
            }, {
                status: 400
            });
        }
        // Parse field mapping if provided
        let fieldMapping = null;
        if (mappingJson) {
            try {
                fieldMapping = JSON.parse(mappingJson);
                console.log("🗺️ Using field mapping:", fieldMapping);
            } catch (e) {
                console.warn("⚠️ Failed to parse mapping, using default column names");
            }
        }
        // Validate and create leads
        const createdLeads = [];
        const errors = [];
        for(let i = 0; i < records.length; i++){
            const row = records[i];
            const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed
            // Map fields if mapping is provided
            let name;
            let title;
            let company;
            let email;
            if (fieldMapping) {
                name = row[fieldMapping.name]?.toString().trim();
                title = row[fieldMapping.title]?.toString().trim();
                company = row[fieldMapping.company]?.toString().trim();
                email = row[fieldMapping.email]?.toString().trim();
            } else {
                // Use default column names
                name = row.name?.toString().trim();
                title = row.title?.toString().trim();
                company = row.company?.toString().trim();
                email = row.email?.toString().trim();
            }
            // Validate required fields
            if (!name || !title || !company) {
                errors.push({
                    row: rowNumber,
                    error: "Missing required fields: name, title, or company",
                    data: {
                        name,
                        title,
                        company,
                        email
                    }
                });
                continue;
            }
            // Prepare lead input
            const leadInput = {
                name,
                title,
                company,
                email: email && email.length > 0 ? email : undefined
            };
            // Validate email format if provided
            if (leadInput.email && leadInput.email.length > 0) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(leadInput.email)) {
                    errors.push({
                        row: rowNumber,
                        error: "Invalid email format",
                        data: leadInput
                    });
                    continue;
                }
            }
            try {
                // Create lead document
                const lead = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                    lead_input: leadInput,
                    status: "uploaded"
                });
                createdLeads.push({
                    id: lead._id.toString(),
                    name: leadInput.name,
                    title: leadInput.title,
                    company: leadInput.company,
                    email: leadInput.email,
                    status: lead.status
                });
                console.log(`✅ Lead created: ${leadInput.name} (${leadInput.company}) - ID: ${lead._id}`);
            } catch (createError) {
                console.error(`❌ Error creating lead for row ${rowNumber}:`, createError);
                errors.push({
                    row: rowNumber,
                    error: createError.message || "Failed to create lead",
                    data: leadInput
                });
            }
        }
        // Log summary
        console.log(`📊 CSV Upload Summary: ${createdLeads.length} leads created, ${errors.length} errors`);
        // Return response
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Successfully processed ${createdLeads.length} leads`,
            leads: createdLeads,
            errors: errors.length > 0 ? errors : undefined,
            summary: {
                total: records.length,
                created: createdLeads.length,
                failed: errors.length
            }
        }, {
            status: 200
        });
    } catch (error) {
        console.error("❌ API Error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
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

//# sourceMappingURL=%5Broot-of-the-server%5D__45a75ee3._.js.map