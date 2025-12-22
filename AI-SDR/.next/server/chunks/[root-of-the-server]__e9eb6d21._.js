module.exports = [
"[project]/.next-internal/server/app/api/leads/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/src/app/api/leads/[id]/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DELETE",
    ()=>DELETE,
    "GET",
    ()=>GET,
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachCampaign.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachStrategyRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachCopyRun.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/models/OutreachEvent.ts [app-route] (ecmascript)");
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
;
;
;
;
;
;
const runtime = "nodejs";
async function GET(request, { params }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await params;
        console.log(`✅ Database connected for GET /api/leads/${id}`);
        const leadId = id;
        // Fetch lead with populated company and persona
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
        const persona = lead.persona_id;
        // Fetch technographics for the company
        const technographics = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Technographic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            company_id: company._id
        });
        // Fetch research run for the lead
        const researchRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: lead._id
        });
        // Fetch citations if research run exists
        let citations = [];
        if (researchRun) {
            citations = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Citation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                research_run_id: researchRun._id
            });
        }
        // Fetch detected signals for the lead
        const detectedSignals = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            lead_id: lead._id
        });
        // Fetch ICP score for the lead
        const icpScore = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: lead._id
        });
        // Fetch ICP factor breakdowns if ICP score exists
        let factorBreakdowns = null;
        if (icpScore) {
            const breakdowns = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPFactorBreakdown$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
                icp_score_id: icpScore._id
            });
            factorBreakdowns = {
                companyFit: breakdowns.find((b)=>b.category === "companyFit"),
                personaFit: breakdowns.find((b)=>b.category === "personaFit"),
                timingFit: breakdowns.find((b)=>b.category === "timingFit")
            };
        }
        // Build comprehensive response
        const enrichedLead = {
            _id: lead._id,
            name: lead.name,
            title: lead.title,
            email: lead.email,
            status: lead.status,
            source: lead.source,
            source_metadata: lead.source_metadata,
            company: {
                _id: company._id,
                name: company.name,
                domain: company.domain,
                website_url: company.website_url,
                linkedin_url: company.linkedin_url,
                industry: company.industry,
                company_size: company.company_size,
                headquarters: company.headquarters,
                structure: company.structure,
                sales_motion: company.sales_motion,
                keywords: company.keywords,
                confidence: company.confidence,
                technographics: technographics
            },
            persona: {
                _id: persona._id,
                full_name: persona.full_name,
                email: persona.email,
                linkedin_url: persona.linkedin_url,
                title: persona.title,
                seniority: persona.seniority,
                department: persona.department,
                location: persona.location,
                reports_to: persona.reports_to,
                decision_authority: persona.decision_authority,
                responsibilities: persona.responsibilities,
                pain_points: persona.pain_points,
                confidence: persona.confidence
            },
            research_run: researchRun ? {
                _id: researchRun._id,
                research_meta: researchRun.research_meta,
                citations: citations,
                createdAt: researchRun.createdAt,
                updatedAt: researchRun.updatedAt
            } : null,
            detected_signals: detectedSignals,
            icp_score: icpScore ? {
                _id: icpScore._id,
                icp_score: icpScore.icp_score,
                fit_tier: icpScore.fit_tier,
                score_breakdown: icpScore.score_breakdown,
                strengths: icpScore.strengths,
                risks: icpScore.risks,
                gaps: icpScore.gaps,
                confidence_level: icpScore.confidence_level,
                scoring_meta: icpScore.scoring_meta,
                factor_breakdown: factorBreakdowns,
                createdAt: icpScore.createdAt,
                updatedAt: icpScore.updatedAt
            } : null,
            createdAt: lead.createdAt,
            updatedAt: lead.updatedAt
        };
        console.log(`✅ Retrieved lead ${leadId} with full normalized data`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            lead: enrichedLead
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
async function DELETE(request, { params }) {
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$mongodb$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const { id } = await params;
        console.log(`✅ Database connected for DELETE /api/leads/${id}`);
        const leadId = id;
        // Find the lead first
        const lead = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(leadId);
        if (!lead) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: "Lead not found"
            }, {
                status: 404
            });
        }
        console.log(`🗑️ Deleting lead: ${lead.name} (${leadId})`);
        // Step 1: Delete ICP factor breakdowns
        const icpScore = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        if (icpScore) {
            const factorBreakdownsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPFactorBreakdown$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                icp_score_id: icpScore._id
            });
            console.log(`  ✓ Deleted ${factorBreakdownsDeleted.deletedCount} ICP factor breakdowns`);
        }
        // Step 2: Delete ICP score
        const icpScoreDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ICPScore$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteOne({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${icpScoreDeleted.deletedCount} ICP score`);
        // Step 3: Delete citations (via research run)
        const researchRun = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        if (researchRun) {
            const citationsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Citation$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                research_run_id: researchRun._id
            });
            console.log(`  ✓ Deleted ${citationsDeleted.deletedCount} citations`);
        }
        // Step 4: Delete detected signals
        const signalsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$DetectedSignal$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${signalsDeleted.deletedCount} detected signals`);
        // Step 5: Delete research run
        const researchRunDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$ResearchRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteOne({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${researchRunDeleted.deletedCount} research run`);
        // Step 6: Delete all outreach-related data
        console.log(`  🗑️ Deleting outreach data for lead ${leadId}...`);
        // 6a. Find outreach campaign to get its ID for field overrides
        const campaign = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findOne({
            lead_id: leadId
        });
        const campaignId = campaign?._id;
        // 6b. Find strategy and copy runs to get their IDs for field overrides
        const strategyRuns = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            lead_id: leadId
        });
        const copyRuns = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].find({
            lead_id: leadId
        });
        // 6c. Delete field overrides for outreach entities
        if (campaignId) {
            const campaignOverridesDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                entity_type: "outreach_campaign",
                entity_id: campaignId
            });
            console.log(`  ✓ Deleted ${campaignOverridesDeleted.deletedCount} campaign field overrides`);
        }
        for (const strategyRun of strategyRuns){
            const strategyOverridesDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                entity_type: "outreach_strategy",
                entity_id: strategyRun._id
            });
            if (strategyOverridesDeleted.deletedCount > 0) {
                console.log(`  ✓ Deleted ${strategyOverridesDeleted.deletedCount} strategy field overrides`);
            }
        }
        for (const copyRun of copyRuns){
            const copyOverridesDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$FieldOverride$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                entity_type: "outreach_copy",
                entity_id: copyRun._id
            });
            if (copyOverridesDeleted.deletedCount > 0) {
                console.log(`  ✓ Deleted ${copyOverridesDeleted.deletedCount} copy field overrides`);
            }
        }
        // 6d. Delete outreach events
        const eventsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachEvent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${eventsDeleted.deletedCount} outreach events`);
        // 6e. Delete outreach copy runs
        const copyRunsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCopyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${copyRunsDeleted.deletedCount} outreach copy runs`);
        // 6f. Delete outreach strategy runs
        const strategyRunsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachStrategyRun$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${strategyRunsDeleted.deletedCount} outreach strategy runs`);
        // 6g. Delete outreach campaign
        const campaignDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$OutreachCampaign$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteOne({
            lead_id: leadId
        });
        console.log(`  ✓ Deleted ${campaignDeleted.deletedCount} outreach campaign`);
        // 6h. Delete outreach guardrails (if lead-specific)
        // Note: Guardrails might be global, so we only delete if they're lead-specific
        // This depends on your OutreachGuardrails model structure
        try {
            const OutreachGuardrails = (await __turbopack_context__.A("[project]/src/models/OutreachGuardrails.ts [app-route] (ecmascript, async loader)")).default;
            const guardrailsDeleted = await OutreachGuardrails.deleteMany({
                lead_id: leadId
            });
            if (guardrailsDeleted.deletedCount > 0) {
                console.log(`  ✓ Deleted ${guardrailsDeleted.deletedCount} outreach guardrails`);
            }
        } catch (e) {
            // Guardrails might not have lead_id field, skip if error
            console.log(`  ⚠️ Skipped guardrails deletion (may be global)`);
        }
        // Step 7: Check if company and persona are used by other leads
        const companyId = lead.company_id;
        const personaId = lead.persona_id;
        // Count other leads using the same company
        const otherLeadsWithCompany = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            company_id: companyId,
            _id: {
                $ne: leadId
            }
        });
        // Count other leads using the same persona
        const otherLeadsWithPersona = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].countDocuments({
            persona_id: personaId,
            _id: {
                $ne: leadId
            }
        });
        // Step 8: Delete the lead
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Lead$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(leadId);
        console.log(`  ✓ Deleted lead`);
        // Step 9: Delete company if no other leads use it
        if (otherLeadsWithCompany === 0) {
            // Delete technographics for this company
            const techsDeleted = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Technographic$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].deleteMany({
                company_id: companyId
            });
            console.log(`  ✓ Deleted ${techsDeleted.deletedCount} technographics`);
            // Delete company
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Company$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(companyId);
            console.log(`  ✓ Deleted company (no other leads using it)`);
        } else {
            console.log(`  ⚠️ Company not deleted (${otherLeadsWithCompany} other lead(s) using it)`);
        }
        // Step 10: Delete persona if no other leads use it
        if (otherLeadsWithPersona === 0) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$models$2f$Persona$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findByIdAndDelete(personaId);
            console.log(`  ✓ Deleted persona (no other leads using it)`);
        } else {
            console.log(`  ⚠️ Persona not deleted (${otherLeadsWithPersona} other lead(s) using it)`);
        }
        console.log(`✅ Successfully deleted lead ${leadId} and all related data`);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Lead and all related data deleted successfully",
            deleted: {
                lead: true,
                icp_score: icpScoreDeleted.deletedCount > 0,
                factor_breakdowns: icpScore ? true : false,
                research_run: researchRunDeleted.deletedCount > 0,
                citations: researchRun ? true : false,
                detected_signals: signalsDeleted.deletedCount > 0,
                outreach_campaign: campaignDeleted.deletedCount > 0,
                outreach_strategy_runs: strategyRunsDeleted.deletedCount,
                outreach_copy_runs: copyRunsDeleted.deletedCount,
                outreach_events: eventsDeleted.deletedCount,
                field_overrides: true,
                company: otherLeadsWithCompany === 0,
                persona: otherLeadsWithPersona === 0,
                technographics: otherLeadsWithCompany === 0
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

//# sourceMappingURL=%5Broot-of-the-server%5D__e9eb6d21._.js.map