import mongoose, { Document, Model, Schema } from "mongoose";

export interface IRequestedLead {
  name: string;
  title: string;
  company: string;
  email: string;
}

export interface IResearchMeta {
  requested_lead: IRequestedLead;
  research_timestamp_utc: string;
  tools_used: string[];
  data_quality_warnings: string[];
}

export interface IResearchRun extends Document {
  lead_id: mongoose.Types.ObjectId;
  company_id: mongoose.Types.ObjectId;
  persona_id: mongoose.Types.ObjectId;
  research_meta: IResearchMeta;
  createdAt: Date;
  updatedAt: Date;
}

const RequestedLeadSchema = new Schema<IRequestedLead>(
  {
    name: { type: String, default: "" },
    title: { type: String, default: "" },
    company: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { _id: false }
);

const ResearchMetaSchema = new Schema<IResearchMeta>(
  {
    requested_lead: {
      type: RequestedLeadSchema,
      default: () => ({}),
    },
    research_timestamp_utc: { type: String, default: "" },
    tools_used: { type: [String], default: [] },
    data_quality_warnings: { type: [String], default: [] },
  },
  { _id: false }
);

const ResearchRunSchema = new Schema<IResearchRun>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      unique: true,
      index: true,
    },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    persona_id: {
      type: Schema.Types.ObjectId,
      ref: "Persona",
      required: true,
    },
    research_meta: {
      type: ResearchMetaSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: "research_runs",
  }
);

const ResearchRun: Model<IResearchRun> =
  mongoose.models.ResearchRun ||
  mongoose.model<IResearchRun>("ResearchRun", ResearchRunSchema);

export default ResearchRun;

