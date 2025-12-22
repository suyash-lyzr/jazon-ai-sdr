import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachGuardrails extends Document {
  lead_id: mongoose.Types.ObjectId | null; // null = global defaults
  max_touches: number;
  voice_escalation_allowed: boolean;
  voice_escalation_trigger: string;
  stop_conditions: string[];
  compliance_rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OutreachGuardrailsSchema = new Schema<IOutreachGuardrails>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
      index: true,
    },
    max_touches: {
      type: Number,
      default: 8,
    },
    voice_escalation_allowed: {
      type: Boolean,
      default: true,
    },
    voice_escalation_trigger: {
      type: String,
      default: "High ICP (≥80) + engagement on 2+ channels",
    },
    stop_conditions: {
      type: [String],
      default: [
        "Explicit opt-out",
        "No engagement after 8 touches",
        "ICP score drops below 40 after re-research",
      ],
    },
    compliance_rules: {
      type: [String],
      default: [
        "No weekend outreach (respects business hours)",
        "Unsubscribe links included in all emails",
        "GDPR and CAN-SPAM compliant messaging",
      ],
    },
  },
  {
    timestamps: true,
    collection: "outreach_guardrails",
  }
);

// Static method to get guardrails (lead-specific or global)
OutreachGuardrailsSchema.statics.getForLead = async function (
  leadId: mongoose.Types.ObjectId
) {
  // Try to find lead-specific guardrails
  let guardrails = await this.findOne({ lead_id: leadId });

  if (!guardrails) {
    // Fall back to global defaults
    guardrails = await this.findOne({ lead_id: null });

    if (!guardrails) {
      // Create global defaults if they don't exist
      guardrails = await this.create({ lead_id: null });
    }
  }

  return guardrails;
};

const OutreachGuardrails: Model<IOutreachGuardrails> =
  mongoose.models.OutreachGuardrails ||
  mongoose.model<IOutreachGuardrails>(
    "OutreachGuardrails",
    OutreachGuardrailsSchema
  );

export default OutreachGuardrails;

