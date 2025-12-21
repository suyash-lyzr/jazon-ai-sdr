import mongoose, { Document, Model, Schema } from "mongoose";

export interface IScoreBreakdown {
  company_fit: number;
  persona_fit: number;
  timing_fit: number;
}

export interface IScoringMeta {
  inputs_used: string[];
  scored_at: string;
}

export interface IICPScore extends Document {
  lead_id: mongoose.Types.ObjectId;
  icp_score: number;
  fit_tier: "Tier 1" | "Tier 2" | "Tier 3" | "Disqualified";
  score_breakdown: IScoreBreakdown;
  strengths: string[];
  risks: string[];
  gaps: string[];
  confidence_level: "High" | "Medium" | "Low";
  scoring_meta: IScoringMeta;
  createdAt: Date;
  updatedAt: Date;
}

const ScoreBreakdownSchema = new Schema<IScoreBreakdown>(
  {
    company_fit: { type: Number, default: 0 },
    persona_fit: { type: Number, default: 0 },
    timing_fit: { type: Number, default: 0 },
  },
  { _id: false }
);

const ScoringMetaSchema = new Schema<IScoringMeta>(
  {
    inputs_used: { type: [String], default: [] },
    scored_at: { type: String, default: "" },
  },
  { _id: false }
);

const ICPScoreSchema = new Schema<IICPScore>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      unique: true,
      index: true,
    },
    icp_score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    fit_tier: {
      type: String,
      enum: ["Tier 1", "Tier 2", "Tier 3", "Disqualified"],
      required: true,
      index: true,
    },
    score_breakdown: {
      type: ScoreBreakdownSchema,
      default: () => ({}),
    },
    strengths: {
      type: [String],
      default: [],
    },
    risks: {
      type: [String],
      default: [],
    },
    gaps: {
      type: [String],
      default: [],
    },
    confidence_level: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    scoring_meta: {
      type: ScoringMetaSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
    collection: "icp_scores",
  }
);

const ICPScore: Model<IICPScore> =
  mongoose.models.ICPScore ||
  mongoose.model<IICPScore>("ICPScore", ICPScoreSchema);

export default ICPScore;

