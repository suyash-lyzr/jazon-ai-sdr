import mongoose, { Document, Model, Schema } from "mongoose";

export type OverrideScope =
  | "company"
  | "persona"
  | "outreach_campaign"
  | "outreach_strategy"
  | "outreach_copy"
  | "outreach_guardrails";

export interface IFieldOverride extends Document {
  scope: OverrideScope;
  entity_id: mongoose.Types.ObjectId;
  path: string; // JSON path like "steps[2].goal" or "maxTouches"
  value: any;
  updated_by: string;
  reason: string;
  updatedAt: Date;
}

const FieldOverrideSchema = new Schema<IFieldOverride>(
  {
    scope: {
      type: String,
      enum: [
        "company",
        "persona",
        "outreach_campaign",
        "outreach_strategy",
        "outreach_copy",
        "outreach_guardrails",
      ],
      required: true,
      index: true,
    },
    entity_id: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    path: {
      type: String,
      required: true,
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
    updated_by: {
      type: String,
      default: "user",
    },
    reason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
    collection: "field_overrides",
  }
);

// Compound index for efficient lookups
FieldOverrideSchema.index({ scope: 1, entity_id: 1, path: 1 }, { unique: true });

// Static method to get all overrides for an entity
FieldOverrideSchema.statics.getOverridesForEntity = async function (
  scope: OverrideScope,
  entityId: mongoose.Types.ObjectId
) {
  const overrides = await this.find({ scope, entity_id: entityId });
  
  // Convert to a map for easy lookup
  const overrideMap: Record<string, any> = {};
  overrides.forEach((override: any) => {
    overrideMap[override.path] = override.value;
  });
  
  return overrideMap;
};

// Static method to set an override
FieldOverrideSchema.statics.setOverride = async function (
  scope: OverrideScope,
  entityId: mongoose.Types.ObjectId,
  path: string,
  value: any,
  updatedBy: string = "user",
  reason: string = ""
) {
  return await this.findOneAndUpdate(
    { scope, entity_id: entityId, path },
    { value, updated_by: updatedBy, reason },
    { upsert: true, new: true }
  );
};

const FieldOverride: Model<IFieldOverride> =
  mongoose.models.FieldOverride ||
  mongoose.model<IFieldOverride>("FieldOverride", FieldOverrideSchema);

export default FieldOverride;

