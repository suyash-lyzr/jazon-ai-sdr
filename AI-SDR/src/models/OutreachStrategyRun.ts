import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachStrategyRun extends Document {
  lead_id: mongoose.Types.ObjectId;
  research_run_id: mongoose.Types.ObjectId;
  icp_score_id: mongoose.Types.ObjectId;
  strategy_output: {
    strategy_status: string;
    strategy_meta: {
      generated_at: Date;
      model: string;
      inputs_used: {
        research_run_id: string;
        icp_score_id: string;
      };
    };
    plan_summary: string;
    target_persona: {
      title: string;
      seniority: string;
      department: string;
    };
    recommended_channel_sequence: Array<{
      step: number;
      channel: string;
      intent: string;
      goal: string;
      reasoning: string;
      recommended_delay_hours: number;
      send_window: string;
      personalization_signals: string[];
      content_request: string;
      gating_conditions: string[];
    }>;
    voice_readiness: {
      thresholds: {
        icp_min: number;
        engagement_channels_min: number;
      };
      human_approval_required: boolean;
      rationale: string;
    };
    sequencing_logic: {
      rationale: string;
      recommended_delays: string;
    };
    risk_flags: string[];
    confidence_level: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OutreachStrategyRunSchema = new Schema<IOutreachStrategyRun>(
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
    icp_score_id: {
      type: Schema.Types.ObjectId,
      ref: "ICPScore",
      required: true,
    },
    strategy_output: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: "outreach_strategy_runs",
  }
);

// Index for finding latest strategy run per lead
OutreachStrategyRunSchema.index({ lead_id: 1, createdAt: -1 });

const OutreachStrategyRun: Model<IOutreachStrategyRun> =
  mongoose.models.OutreachStrategyRun ||
  mongoose.model<IOutreachStrategyRun>(
    "OutreachStrategyRun",
    OutreachStrategyRunSchema
  );

export default OutreachStrategyRun;

