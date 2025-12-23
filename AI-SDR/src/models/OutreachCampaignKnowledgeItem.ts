import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOutreachCampaignKnowledgeItem extends Document {
  campaign_id: mongoose.Types.ObjectId;
  type: "file" | "url" | "note";
  
  // For files
  file_name?: string;
  file_type?: string; // e.g., "PDF", "DOCX"
  file_size?: number; // in bytes
  file_data?: Buffer; // Small files only (< 1MB for demo); for larger files use GridFS
  
  // For URLs
  url?: string;
  url_title?: string;
  
  // For notes
  note_title?: string;
  note_content?: string;
  
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const OutreachCampaignKnowledgeItemSchema = new Schema<IOutreachCampaignKnowledgeItem>(
  {
    campaign_id: {
      type: Schema.Types.ObjectId,
      ref: "OutreachCampaignV2",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["file", "url", "note"],
      required: true,
    },
    
    // File fields
    file_name: {
      type: String,
      required: function(this: IOutreachCampaignKnowledgeItem) {
        return this.type === "file";
      },
    },
    file_type: {
      type: String,
    },
    file_size: {
      type: Number,
    },
    file_data: {
      type: Buffer,
      // Only store small files directly (< 1MB)
      // For larger files, consider GridFS or external storage
    },
    
    // URL fields
    url: {
      type: String,
      required: function(this: IOutreachCampaignKnowledgeItem) {
        return this.type === "url";
      },
    },
    url_title: {
      type: String,
    },
    
    // Note fields
    note_title: {
      type: String,
      required: function(this: IOutreachCampaignKnowledgeItem) {
        return this.type === "note";
      },
    },
    note_content: {
      type: String,
    },
    
    uploadedBy: {
      type: String,
      required: true,
      default: "user@example.com",
    },
  },
  {
    timestamps: true,
    collection: "outreach_campaign_knowledge_items",
  }
);

// Index for efficient queries
OutreachCampaignKnowledgeItemSchema.index({ campaign_id: 1, type: 1 });
OutreachCampaignKnowledgeItemSchema.index({ createdAt: -1 });

const OutreachCampaignKnowledgeItem: Model<IOutreachCampaignKnowledgeItem> =
  mongoose.models.OutreachCampaignKnowledgeItem ||
  mongoose.model<IOutreachCampaignKnowledgeItem>(
    "OutreachCampaignKnowledgeItem",
    OutreachCampaignKnowledgeItemSchema
  );

export default OutreachCampaignKnowledgeItem;

