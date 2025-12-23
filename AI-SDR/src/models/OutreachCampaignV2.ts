import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachCampaignV2 extends Document {
  name: string;
  status: "active" | "paused" | "completed" | "archived";
  createdBy: string;
  mode: string; // e.g., "Sales Mode", "Agitation Email", etc.
  
  // AI Campaign Reasoning
  aiReasoning?: {
    objective: string;
    avgICPScore: number;
    explanation: string;
    approach: string;
    riskFlags: string[];
  };
  
  // Strategy fields
  strategyType?: string; // e.g., "Net-new Outbound", "Nurture", "Reactivation", "ABM"
  primaryGoal?: string; // e.g., "Book Meeting", "Start Conversation", "Qualify"
  channelMix?: string[]; // e.g., ["Email", "LinkedIn", "Call"]
  
  // Scheduling configuration
  scheduling: {
    max_touches: number;
    interval_days: number;
    time_window: {
      start: string; // e.g., "08:00"
      end: string; // e.g., "17:00"
    };
    timezone: string;
    allowed_days: string[]; // e.g., ["Monday", "Tuesday", ...]
  };
  
  // Agent profile
  agentProfile: {
    agent_name: string;
    agent_designation: string;
    agent_contact: string;
    seller_name: string;
  };
  
  // Instructions and guardrails
  instructions: {
    construct: string;
    format: string;
    personalization: string;
    additional_notes: string;
  };
  
  // Templates per step
  templates: {
    email_steps: Array<{
      step_name: string; // e.g., "Pain Point Email", "Agitation Email"
      construct_instructions: string;
      format_instructions: string;
      template: string;
    }>;
    linkedin_template: string;
    voice_template: string;
  };
  
  // Computed metrics (cached)
  metrics: {
    total_prospects: number;
    active_prospects: number;
    replied_prospects: number;
    booked_prospects: number;
    response_rate: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const OutreachCampaignV2Schema = new Schema<IOutreachCampaignV2>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "paused", "completed", "archived"],
      default: "active",
    },
    createdBy: {
      type: String,
      required: true,
      default: "user@example.com",
    },
    mode: {
      type: String,
      default: "Sales Mode",
    },
    aiReasoning: {
      objective: { type: String, default: "Net-new outbound" },
      avgICPScore: { type: Number, default: 75 },
      explanation: { type: String, default: "" },
      approach: { type: String, default: "Value-led" },
      riskFlags: { type: [String], default: [] },
    },
    strategyType: {
      type: String,
      default: "Net-new Outbound",
    },
    primaryGoal: {
      type: String,
      default: "Book Meeting",
    },
    channelMix: {
      type: [String],
      default: ["Email", "LinkedIn", "Call"],
    },
    scheduling: {
      max_touches: {
        type: Number,
        default: 7,
      },
      interval_days: {
        type: Number,
        default: 1,
      },
      time_window: {
        start: {
          type: String,
          default: "08:00",
        },
        end: {
          type: String,
          default: "17:00",
        },
      },
      timezone: {
        type: String,
        default: "America/New_York",
      },
      allowed_days: {
        type: [String],
        default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      },
    },
    agentProfile: {
      agent_name: {
        type: String,
        default: "",
      },
      agent_designation: {
        type: String,
        default: "",
      },
      agent_contact: {
        type: String,
        default: "",
      },
      seller_name: {
        type: String,
        default: "",
      },
    },
    instructions: {
      construct: {
        type: String,
        default: "",
      },
      format: {
        type: String,
        default: "",
      },
      personalization: {
        type: String,
        default: "",
      },
      additional_notes: {
        type: String,
        default: "",
      },
    },
    templates: {
      email_steps: {
        type: [
          {
            step_name: String,
            construct_instructions: String,
            format_instructions: String,
            template: String,
          },
        ],
        default: [
          {
            step_name: "Pain Point Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
          {
            step_name: "Agitation Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
          {
            step_name: "Initial Solution Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
          {
            step_name: "Customer Proof Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
          {
            step_name: "Data Points Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
          {
            step_name: "Address Concerns Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
          {
            step_name: "First Offer Email",
            construct_instructions: "",
            format_instructions: "",
            template: "",
          },
        ],
      },
      linkedin_template: {
        type: String,
        default: "",
      },
      voice_template: {
        type: String,
        default: "",
      },
    },
    metrics: {
      total_prospects: {
        type: Number,
        default: 0,
      },
      active_prospects: {
        type: Number,
        default: 0,
      },
      replied_prospects: {
        type: Number,
        default: 0,
      },
      booked_prospects: {
        type: Number,
        default: 0,
      },
      response_rate: {
        type: Number,
        default: 0,
      },
    },
  },
  {
    timestamps: true,
    collection: "outreach_campaigns_v2",
  }
);

// Index for efficient queries
OutreachCampaignV2Schema.index({ createdBy: 1, status: 1 });
OutreachCampaignV2Schema.index({ createdAt: -1 });

const OutreachCampaignV2: Model<IOutreachCampaignV2> =
  mongoose.models.OutreachCampaignV2 ||
  mongoose.model<IOutreachCampaignV2>("OutreachCampaignV2", OutreachCampaignV2Schema);

export default OutreachCampaignV2;

