import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachCampaign extends Document {
  lead_id: mongoose.Types.ObjectId;
  status:
    | "not_started"
    | "active"
    | "paused"
    | "stopped"
    | "completed"
    | "disqualified";
  current_phase: "Research" | "Engagement" | "Qualification" | "Handoff";
  current_step_number: number;
  next_planned_action: {
    label: string;
    scheduled_at: Date | null;
  };
  final_decision: {
    status: string;
    reason: string;
  };
  channel_mix: {
    email: number;
    linkedin: number;
    voice: number;
  };
  response_rate: number;
  avg_response_time: number;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachCampaignSchema = new Schema<IOutreachCampaign>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: [
        "not_started",
        "active",
        "paused",
        "stopped",
        "completed",
        "disqualified",
      ],
      default: "not_started",
    },
    current_phase: {
      type: String,
      enum: ["Research", "Engagement", "Qualification", "Handoff"],
      default: "Research",
    },
    current_step_number: {
      type: Number,
      default: 0,
    },
    next_planned_action: {
      label: {
        type: String,
        default: "Generate outreach strategy",
      },
      scheduled_at: {
        type: Date,
        default: null,
      },
    },
    final_decision: {
      status: {
        type: String,
        default: "Pending",
      },
      reason: {
        type: String,
        default: "Outreach not yet generated",
      },
    },
    channel_mix: {
      email: {
        type: Number,
        default: 0,
      },
      linkedin: {
        type: Number,
        default: 0,
      },
      voice: {
        type: Number,
        default: 0,
      },
    },
    response_rate: {
      type: Number,
      default: 0,
    },
    avg_response_time: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    collection: "outreach_campaigns",
  }
);

const OutreachCampaign: Model<IOutreachCampaign> =
  mongoose.models.OutreachCampaign ||
  mongoose.model<IOutreachCampaign>("OutreachCampaign", OutreachCampaignSchema);

export default OutreachCampaign;

