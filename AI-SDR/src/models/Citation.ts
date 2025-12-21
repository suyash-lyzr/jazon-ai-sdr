import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICitation extends Document {
  research_run_id: mongoose.Types.ObjectId;
  source_name: string;
  url: string;
  accessed_at_utc: string;
  createdAt: Date;
}

const CitationSchema = new Schema<ICitation>(
  {
    research_run_id: {
      type: Schema.Types.ObjectId,
      ref: "ResearchRun",
      required: true,
      index: true,
    },
    source_name: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    accessed_at_utc: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "citations",
  }
);

const Citation: Model<ICitation> =
  mongoose.models.Citation ||
  mongoose.model<ICitation>("Citation", CitationSchema);

export default Citation;

