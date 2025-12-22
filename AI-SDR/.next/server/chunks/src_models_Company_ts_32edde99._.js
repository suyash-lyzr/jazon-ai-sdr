module.exports = [
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
];

//# sourceMappingURL=src_models_Company_ts_32edde99._.js.map