import mongoose, { Document, Model, Schema } from "mongoose";

export type SignalType =
  | "organizational"
  | "technical"
  | "financial"
  | "intent"
  | "engagement"
  | "persona_change"
  | "other";

export interface IDetectedSignal extends Document {
  lead_id: mongoose.Types.ObjectId;
  research_run_id: mongoose.Types.ObjectId;
  type: SignalType;
  signal: string;
  source: string;
  strength: "high" | "medium" | "low";
  recency: string;
  evidence: string[];
  createdAt: Date;
}

const DetectedSignalSchema = new Schema<IDetectedSignal>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    research_run_id: {
      type: Schema.Types.ObjectId,
      ref: "ResearchRun",
      required: true,
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
        "other",
      ],
      required: true,
    },
    signal: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      default: "",
    },
    strength: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    recency: {
      type: String,
      default: "",
    },
    evidence: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "detected_signals",
  }
);

// Compound index for efficient queries
DetectedSignalSchema.index({ lead_id: 1, type: 1 });

const DetectedSignal: Model<IDetectedSignal> =
  mongoose.models.DetectedSignal ||
  mongoose.model<IDetectedSignal>("DetectedSignal", DetectedSignalSchema);

export default DetectedSignal;

