import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachCampaignProspect extends Document {
  campaign_id: mongoose.Types.ObjectId;
  lead_id: mongoose.Types.ObjectId;
  status: "active" | "paused" | "replied" | "booked" | "disqualified" | "finished";
  current_step: number;
  
  // Per-prospect metrics
  metrics: {
    emails_sent: number;
    emails_opened: number;
    emails_clicked: number;
    linkedin_sent: number;
    voice_calls: number;
    replies: number;
    last_touch_at: Date | null;
    next_touch_at: Date | null;
  };
  
  // Prospect-specific notes
  notes: string;
  
  addedAt: Date;
  updatedAt: Date;
}

const OutreachCampaignProspectSchema = new Schema<IOutreachCampaignProspect>(
  {
    campaign_id: {
      type: Schema.Types.ObjectId,
      ref: "OutreachCampaignV2",
      required: true,
      index: true,
    },
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "replied", "booked", "disqualified", "finished"],
      default: "active",
    },
    current_step: {
      type: Number,
      default: 0,
    },
    metrics: {
      emails_sent: {
        type: Number,
        default: 0,
      },
      emails_opened: {
        type: Number,
        default: 0,
      },
      emails_clicked: {
        type: Number,
        default: 0,
      },
      linkedin_sent: {
        type: Number,
        default: 0,
      },
      voice_calls: {
        type: Number,
        default: 0,
      },
      replies: {
        type: Number,
        default: 0,
      },
      last_touch_at: {
        type: Date,
        default: null,
      },
      next_touch_at: {
        type: Date,
        default: null,
      },
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: { createdAt: "addedAt", updatedAt: "updatedAt" },
    collection: "outreach_campaign_prospects",
  }
);

// Unique constraint: one lead can only be in a campaign once
OutreachCampaignProspectSchema.index({ campaign_id: 1, lead_id: 1 }, { unique: true });

// Indexes for efficient queries
OutreachCampaignProspectSchema.index({ campaign_id: 1, status: 1 });
OutreachCampaignProspectSchema.index({ lead_id: 1 });

const OutreachCampaignProspect: Model<IOutreachCampaignProspect> =
  mongoose.models.OutreachCampaignProspect ||
  mongoose.model<IOutreachCampaignProspect>(
    "OutreachCampaignProspect",
    OutreachCampaignProspectSchema
  );

export default OutreachCampaignProspect;

