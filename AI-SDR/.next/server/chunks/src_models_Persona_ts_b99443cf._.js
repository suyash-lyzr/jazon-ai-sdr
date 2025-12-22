module.exports = [
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
];

//# sourceMappingURL=src_models_Persona_ts_b99443cf._.js.map