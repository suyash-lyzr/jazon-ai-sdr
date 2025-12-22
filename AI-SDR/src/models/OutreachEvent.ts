import mongoose, { Document, Model, Schema } from "mongoose";

export type OutreachEventType =
  | "lifecycle"
  | "research"
  | "outreach"
  | "engagement"
  | "decision"
  | "guardrail"
  | "outcome";

export type OutreachEventActor = "AI" | "System" | "Human";

export interface IOutreachEvent extends Document {
  lead_id: mongoose.Types.ObjectId;
  campaign_id: mongoose.Types.ObjectId;
  event_type: OutreachEventType;
  actor: OutreachEventActor;
  timestamp: Date;
  sort_order: number;
  title: string;
  summary: string;
  badge: string;
  channel?: string;
  direction?: "inbound" | "outbound";
  content?: {
    subject?: string;
    body?: string;
    talking_points?: string[];
  };
  metadata: Record<string, any>;
  createdAt: Date;
}

const OutreachEventSchema = new Schema<IOutreachEvent>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    campaign_id: {
      type: Schema.Types.ObjectId,
      ref: "OutreachCampaign",
      required: true,
      index: true,
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
        "outcome",
      ],
      required: true,
    },
    actor: {
      type: String,
      enum: ["AI", "System", "Human"],
      required: true,
    },
    timestamp: {
      type: Date,
      required: true,
      index: true,
    },
    sort_order: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    badge: {
      type: String,
      default: "",
    },
    channel: {
      type: String,
      default: "",
    },
    direction: {
      type: String,
      enum: ["inbound", "outbound", ""],
      default: "",
    },
    content: {
      subject: String,
      body: String,
      talking_points: [String],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: "outreach_events",
  }
);

// Compound index for chronological queries
OutreachEventSchema.index({ lead_id: 1, sort_order: 1 });
OutreachEventSchema.index({ campaign_id: 1, timestamp: 1 });

const OutreachEvent: Model<IOutreachEvent> =
  mongoose.models.OutreachEvent ||
  mongoose.model<IOutreachEvent>("OutreachEvent", OutreachEventSchema);

export default OutreachEvent;

