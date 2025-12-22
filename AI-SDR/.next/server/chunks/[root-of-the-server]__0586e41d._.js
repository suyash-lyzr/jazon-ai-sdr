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
"[project]/src/models/Company.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const CompanySizeSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    employee_count: {
        type: Number,
        default: 0
    },
    employee_count_confidence: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    annual_revenue_usd: {
        type: Number,
        default: 0
    },
    revenue_confidence: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    is_public: {
        type: Boolean,
        default: false
    },
    ticker: {
        type: String,
        default: ""
    },
    exchange: {
        type: String,
        default: ""
    }
}, {
    _id: false
});
const HeadquartersSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    city: {
        type: String,
        default: ""
    },
    state_or_region: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    raw_address: {
        type: String,
        default: ""
    }
}, {
    _id: false
});
const CompanySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true,
        index: true
    },
    domain: {
        type: String,
        index: true,
        sparse: true,
        unique: true
    },
    website_url: {
        type: String,
        default: ""
    },
    linkedin_url: {
        type: String,
        default: ""
    },
    industry: {
        type: String,
        index: true,
        default: ""
    },
    company_size: {
        type: CompanySizeSchema,
        default: ()=>({})
    },
    headquarters: {
        type: HeadquartersSchema,
        default: ()=>({})
    },
    structure: {
        type: String,
        default: ""
    },
    sales_motion: {
        type: String,
        default: ""
    },
    keywords: {
        type: [
            String
        ],
        default: []
    },
    confidence: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    }
}, {
    timestamps: true,
    collection: "companies"
});
// Static method for finding or creating a company
CompanySchema.statics.findOrCreate = async function(companyData) {
    const Company = this;
    // Try to find by domain first (most reliable)
    if (companyData.domain) {
        const existingByDomain = await Company.findOne({
            domain: companyData.domain
        });
        if (existingByDomain) {
            // Update existing company with new data if provided
            Object.assign(existingByDomain, companyData);
            await existingByDomain.save();
            return existingByDomain;
        }
    }
    // Try to find by name (case-insensitive)
    if (companyData.name) {
        const existingByName = await Company.findOne({
            name: new RegExp(`^${companyData.name}$`, "i")
        });
        if (existingByName) {
            // Update existing company with new data if provided
            Object.assign(existingByName, companyData);
            await existingByName.save();
            return existingByName;
        }
    }
    // Create new company if not found
    const newCompany = new Company(companyData);
    await newCompany.save();
    return newCompany;
};
const Company = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Company || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Company", CompanySchema);
const __TURBOPACK__default__export__ = Company;
}),
"[project]/src/models/Persona.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const LocationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    city: {
        type: String,
        default: ""
    },
    state_or_region: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    time_zone: {
        type: String,
        default: ""
    }
}, {
    _id: false
});
const DecisionAuthoritySchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    budget_owner_likelihood: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    decision_maker_likelihood: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    champion_likelihood: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    rationale: {
        type: String,
        default: ""
    }
}, {
    _id: false
});
const PersonaSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    full_name: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        index: true,
        sparse: true,
        unique: true
    },
    linkedin_url: {
        type: String,
        index: true,
        sparse: true,
        unique: true
    },
    title: {
        type: String,
        default: ""
    },
    seniority: {
        type: String,
        default: ""
    },
    department: {
        type: String,
        default: ""
    },
    location: {
        type: LocationSchema,
        default: ()=>({})
    },
    reports_to: {
        type: String,
        default: ""
    },
    decision_authority: {
        type: DecisionAuthoritySchema,
        default: ()=>({})
    },
    responsibilities: {
        type: [
            String
        ],
        default: []
    },
    pain_points: {
        type: [
            String
        ],
        default: []
    },
    confidence: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    }
}, {
    timestamps: true,
    collection: "personas"
});
// Static method for finding or creating a persona
PersonaSchema.statics.findOrCreate = async function(personaData) {
    const Persona = this;
    // Try to find by email first (most reliable)
    if (personaData.email) {
        const existingByEmail = await Persona.findOne({
            email: personaData.email.toLowerCase()
        });
        if (existingByEmail) {
            // Update existing persona with new data if provided
            Object.assign(existingByEmail, personaData);
            await existingByEmail.save();
            return existingByEmail;
        }
    }
    // Try to find by LinkedIn URL
    if (personaData.linkedin_url) {
        const existingByLinkedIn = await Persona.findOne({
            linkedin_url: personaData.linkedin_url
        });
        if (existingByLinkedIn) {
            // Update existing persona with new data if provided
            Object.assign(existingByLinkedIn, personaData);
            await existingByLinkedIn.save();
            return existingByLinkedIn;
        }
    }
    // Try to find by name (case-insensitive, less reliable)
    if (personaData.full_name) {
        const existingByName = await Persona.findOne({
            full_name: new RegExp(`^${personaData.full_name}$`, "i")
        });
        if (existingByName) {
            // Update existing persona with new data if provided
            Object.assign(existingByName, personaData);
            await existingByName.save();
            return existingByName;
        }
    }
    // Create new persona if not found
    const newPersona = new Persona(personaData);
    await newPersona.save();
    return newPersona;
};
const Persona = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Persona || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Persona", PersonaSchema);
const __TURBOPACK__default__export__ = Persona;
}),
"[project]/src/models/Technographic.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const TechnographicSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    company_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "Company",
        required: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: ""
    },
    confidence: {
        type: String,
        enum: [
            "High",
            "Medium",
            "Low"
        ],
        default: "Low"
    },
    source: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    collection: "technographics"
});
// Compound index for deduplication
TechnographicSchema.index({
    company_id: 1,
    name: 1
}, {
    unique: true
});
const Technographic = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Technographic || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Technographic", TechnographicSchema);
const __TURBOPACK__default__export__ = Technographic;
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
"[project]/src/models/Citation.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const CitationSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    research_run_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "ResearchRun",
        required: true,
        index: true
    },
    source_name: {
        type: String,
        default: ""
    },
    url: {
        type: String,
        default: ""
    },
    accessed_at_utc: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    collection: "citations"
});
const Citation = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.Citation || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("Citation", CitationSchema);
const __TURBOPACK__default__export__ = Citation;
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
"[project]/src/models/ICPFactorBreakdown.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const FactorSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    name: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    }
}, {
    _id: false
});
const ICPFactorBreakdownSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"]({
    icp_score_id: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["Schema"].Types.ObjectId,
        ref: "ICPScore",
        required: true,
        index: true
    },
    category: {
        type: String,
        enum: [
            "companyFit",
            "personaFit",
            "timingFit"
        ],
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    factors: {
        type: [
            FactorSchema
        ],
        default: []
    }
}, {
    timestamps: true,
    collection: "icp_factor_breakdowns"
});
// Compound unique index
ICPFactorBreakdownSchema.index({
    icp_score_id: 1,
    category: 1
}, {
    unique: true
});
const ICPFactorBreakdown = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.ICPFactorBreakdown || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("ICPFactorBreakdown", ICPFactorBreakdownSchema);
const __TURBOPACK__default__export__ = ICPFactorBreakdown;
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Company$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Company.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Persona$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Persona.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Technographic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Technographic.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ResearchRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Citation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/Citation.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/DetectedSignal.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ICPScore.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPFactorBreakdown$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/ICPFactorBreakdown.ts [app-route] (ecmascript)");
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
        // Fetch leads from database with populated company and persona
        let leads;
        if (leadId) {
            // Fetch specific lead
            leads = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                _id: leadId
            }).populate("company_id").populate("persona_id");
            console.log(`📋 Fetching specific lead: ${leadId}`);
        } else {
            // Fetch all leads with status "uploaded" (not yet researched)
            leads = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                status: "uploaded"
            }).populate("company_id").populate("persona_id");
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
                const company = lead.company_id;
                const persona = lead.persona_id;
                // Prepare lead data for the agent
                const leadData = {
                    name: lead.name,
                    title: lead.title,
                    company: company.name,
                    email: lead.email || ""
                };
                // Generate unique session IDs for this lead
                const researchSessionId = `${RESEARCH_AGENT_ID}-${lead._id.toString()}-${Date.now()}`;
                // Prepare the message with lead data for the Research Agent
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
                // Save research response to JSON file (for debugging)
                const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "output");
                if (!__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].existsSync(outputDir)) {
                    __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(outputDir, {
                        recursive: true
                    });
                }
                const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
                const researchFileName = `research-agent-response-${lead._id.toString()}-${timestamp}.json`;
                const researchFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, researchFileName);
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(researchFilePath, JSON.stringify({
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    leadCompany: leadData.company,
                    timestamp: new Date().toISOString(),
                    agentResponse: researchAgentData,
                    parsedResearchData: researchData
                }, null, 2), "utf-8");
                console.log(`💾 Research response saved to: ${researchFilePath}`);
                // Step 1: Update Company with research data
                if (researchData.CompanyProfile) {
                    const companyProfile = researchData.CompanyProfile;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Company$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(company._id, {
                        domain: companyProfile.domain || company.domain,
                        website_url: companyProfile.website_url || company.website_url,
                        linkedin_url: companyProfile.linkedin_url || company.linkedin_url,
                        industry: companyProfile.industry || company.industry,
                        company_size: companyProfile.company_size || company.company_size,
                        headquarters: companyProfile.headquarters || company.headquarters,
                        structure: companyProfile.structure || company.structure,
                        sales_motion: companyProfile.sales_motion || company.sales_motion,
                        keywords: companyProfile.keywords || company.keywords,
                        confidence: companyProfile.confidence || company.confidence
                    });
                    console.log(`✅ Company ${company._id} updated`);
                }
                // Step 2: Update Persona with research data
                if (researchData.PersonaProfile) {
                    const personaProfile = researchData.PersonaProfile;
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Persona$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(persona._id, {
                        full_name: personaProfile.full_name || persona.full_name,
                        email: personaProfile.email || persona.email,
                        linkedin_url: personaProfile.linkedin_url || persona.linkedin_url,
                        title: personaProfile.title || persona.title,
                        seniority: personaProfile.seniority || persona.seniority,
                        department: personaProfile.department || persona.department,
                        location: personaProfile.location || persona.location,
                        reports_to: personaProfile.reports_to || persona.reports_to,
                        decision_authority: personaProfile.decision_authority || persona.decision_authority,
                        responsibilities: personaProfile.responsibilities || persona.responsibilities,
                        pain_points: personaProfile.pain_points || persona.pain_points,
                        confidence: personaProfile.confidence || persona.confidence
                    });
                    console.log(`✅ Persona ${persona._id} updated`);
                }
                // Step 3: Create/update Technographics
                if (researchData.CompanyProfile && researchData.CompanyProfile.technographics) {
                    // Delete existing technographics for this company
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Technographic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                        company_id: company._id
                    });
                    // Create new technographics
                    for (const tech of researchData.CompanyProfile.technographics){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Technographic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                            company_id: company._id,
                            name: tech.name,
                            category: tech.category,
                            confidence: tech.confidence,
                            source: tech.source
                        });
                    }
                    console.log(`✅ Created ${researchData.CompanyProfile.technographics.length} technographics`);
                }
                // Step 4: Create/update ResearchRun
                const researchRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
                    lead_id: lead._id
                }, {
                    lead_id: lead._id,
                    company_id: company._id,
                    persona_id: persona._id,
                    research_meta: researchData.ResearchMeta || {}
                }, {
                    upsert: true,
                    new: true
                });
                console.log(`✅ ResearchRun ${researchRun._id} created/updated`);
                // Step 5: Create Citations
                if (researchData.ResearchMeta && researchData.ResearchMeta.citations) {
                    // Delete existing citations for this research run
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Citation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                        research_run_id: researchRun._id
                    });
                    // Create new citations
                    for (const citation of researchData.ResearchMeta.citations){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Citation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                            research_run_id: researchRun._id,
                            source_name: citation.source_name,
                            url: citation.url,
                            accessed_at_utc: citation.accessed_at_utc
                        });
                    }
                    console.log(`✅ Created ${researchData.ResearchMeta.citations.length} citations`);
                }
                // Step 6: Create DetectedSignals
                if (researchData.DetectedSignals) {
                    // Delete existing signals for this lead
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                        lead_id: lead._id
                    });
                    // Create new signals
                    for (const signal of researchData.DetectedSignals){
                        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                            lead_id: lead._id,
                            research_run_id: researchRun._id,
                            type: signal.type,
                            signal: signal.signal,
                            source: signal.source,
                            strength: signal.strength,
                            recency: signal.recency,
                            evidence: signal.evidence
                        });
                    }
                    console.log(`✅ Created ${researchData.DetectedSignals.length} detected signals`);
                }
                // Update lead status to "researched"
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(lead._id, {
                    status: "researched"
                });
                // Step 7: Call ICP Scoring Agent
                console.log(`\n📊 Calling ICP Scoring Agent for ${leadData.name}...`);
                const icpSessionId = `${ICP_AGENT_ID}-${lead._id.toString()}-${Date.now()}`;
                const icpMessage = `Please perform ICP scoring for the following lead based on the research data:

Lead Information:
- Name: ${leadData.name}
- Title: ${leadData.title}
- Company: ${leadData.company}
- Email: ${leadData.email || "Not provided"}

Research Data:
${JSON.stringify(researchData, null, 2)}`;
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
                __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(icpFilePath, JSON.stringify({
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    timestamp: new Date().toISOString(),
                    agentResponse: icpAgentData,
                    parsedIcpData: icpData
                }, null, 2), "utf-8");
                console.log(`💾 ICP response saved to: ${icpFilePath}`);
                // Step 8: Create/update ICPScore
                const icpScore = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOneAndUpdate({
                    lead_id: lead._id
                }, {
                    lead_id: lead._id,
                    icp_score: icpData.icp_score,
                    fit_tier: icpData.fit_tier,
                    score_breakdown: icpData.score_breakdown,
                    strengths: icpData.strengths,
                    risks: icpData.risks,
                    gaps: icpData.gaps,
                    confidence_level: icpData.confidence_level,
                    scoring_meta: icpData.scoring_meta
                }, {
                    upsert: true,
                    new: true
                });
                console.log(`✅ ICPScore ${icpScore._id} created/updated`);
                // Step 9: Create ICPFactorBreakdowns
                if (icpData.factor_breakdown) {
                    // Delete existing factor breakdowns
                    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPFactorBreakdown$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                        icp_score_id: icpScore._id
                    });
                    // Create factor breakdowns for each category
                    for (const category of [
                        "companyFit",
                        "personaFit",
                        "timingFit"
                    ]){
                        if (icpData.factor_breakdown[category]) {
                            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPFactorBreakdown$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].create({
                                icp_score_id: icpScore._id,
                                category: category,
                                score: icpData.factor_breakdown[category].score,
                                factors: icpData.factor_breakdown[category].factors
                            });
                        }
                    }
                    console.log(`✅ Created ICP factor breakdowns`);
                }
                // Update lead status to "icp_scored"
                await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndUpdate(lead._id, {
                    status: "icp_scored"
                });
                console.log(`✅ Lead ${lead._id} processing complete with normalized data`);
                responses.push({
                    leadId: lead._id.toString(),
                    leadName: leadData.name,
                    leadCompany: leadData.company,
                    researchFile: researchFilePath,
                    icpFile: icpFilePath
                });
            } catch (error) {
                console.error(`❌ Error processing lead ${lead._id}:`, error);
                errors.push({
                    leadId: lead._id.toString(),
                    leadName: lead.name,
                    error: error.message || "Unknown error"
                });
            }
        }
        // Save summary
        const summaryTimestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const summaryFileName = `refresh-summary-${summaryTimestamp}.json`;
        const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "output");
        const summaryFilePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, summaryFileName);
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].writeFileSync(summaryFilePath, JSON.stringify({
            timestamp: new Date().toISOString(),
            summary: {
                totalProcessed: responses.length,
                totalFailed: errors.length,
                totalLeads: responses.length + errors.length
            },
            responses: responses,
            errors: errors
        }, null, 2), "utf-8");
        console.log(`\n📊 Refresh Summary:`);
        console.log(`  ✅ Successfully processed: ${responses.length} leads`);
        console.log(`  ❌ Errors: ${errors.length} leads`);
        console.log(`  💾 Summary saved to: ${summaryFilePath}`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: `Processed ${responses.length} lead(s) with normalized schema`,
            processed: responses.length,
            failed: errors.length,
            responses: responses,
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

//# sourceMappingURL=%5Broot-of-the-server%5D__0586e41d._.js.map