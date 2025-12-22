import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachCopyRun extends Document {
  lead_id: mongoose.Types.ObjectId;
  strategy_run_id: mongoose.Types.ObjectId;
  copy_output: {
    status: string;
    channel: string;
    copy_meta: {
      generated_at: Date;
      model: string;
      strategy_run_id: string;
    };
    drafts: Array<{
      step: number;
      channel: string;
      subject_options: string[];
      body: string;
      talking_points: string[];
      personalization_used: string[];
      strategy_alignment: string;
    }>;
    confidence_level: string;
    review_notes: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const OutreachCopyRunSchema = new Schema<IOutreachCopyRun>(
  {
    lead_id: {
      type: Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },
    strategy_run_id: {
      type: Schema.Types.ObjectId,
      ref: "OutreachStrategyRun",
      required: true,
    },
    copy_output: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "outreach_copy_runs",
  }
);

// Index for finding latest copy run per lead
OutreachCopyRunSchema.index({ lead_id: 1, createdAt: -1 });

const OutreachCopyRun: Model<IOutreachCopyRun> =
  mongoose.models.OutreachCopyRun ||
  mongoose.model<IOutreachCopyRun>("OutreachCopyRun", OutreachCopyRunSchema);

export default OutreachCopyRun;

