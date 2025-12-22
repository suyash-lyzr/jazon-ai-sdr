module.exports = [
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
];

//# sourceMappingURL=src_models_OutreachGuardrails_ts_9d77f351._.js.map