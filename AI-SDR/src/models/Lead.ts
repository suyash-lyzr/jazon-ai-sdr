import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISourceMetadata {
  apollo_list_name?: string;
  apollo_person_id?: string;
  hubspot_contact_id?: string;
  salesforce_lead_id?: string;
}

export type LeadStatus = "uploaded" | "researched" | "icp_scored";

export interface ILead extends Document {
  name: string;
  title: string;
  email?: string;
  company_id: mongoose.Types.ObjectId;
  persona_id: mongoose.Types.ObjectId;
  status: LeadStatus;
  source: string;
  source_metadata?: ISourceMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const SourceMetadataSchema = new Schema<ISourceMetadata>(
  {
    apollo_list_name: { type: String },
    apollo_person_id: { type: String },
    hubspot_contact_id: { type: String },
    salesforce_lead_id: { type: String },
  },
  { _id: false }
);

const LeadSchema = new Schema<ILead>(
  {
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    persona_id: {
      type: Schema.Types.ObjectId,
      ref: "Persona",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["uploaded", "researched", "icp_scored"],
      required: true,
      default: "uploaded",
      index: true,
    },
    source: {
      type: String,
      default: "CSV",
    },
    source_metadata: {
      type: SourceMetadataSchema,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: "leads",
  }
);

// Indexes for common queries
LeadSchema.index({ company_id: 1, persona_id: 1 });
LeadSchema.index({ status: 1, createdAt: -1 });

const Lead: Model<ILead> =
  mongoose.models.Lead || mongoose.model<ILead>("Lead", LeadSchema);

export default Lead;
