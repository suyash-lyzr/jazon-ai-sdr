import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITechnographic extends Document {
  company_id: mongoose.Types.ObjectId;
  name: string;
  category: string;
  confidence: "High" | "Medium" | "Low";
  source: string;
  createdAt: Date;
}

const TechnographicSchema = new Schema<ITechnographic>(
  {
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "",
    },
    confidence: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    source: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    collection: "technographics",
  }
);

// Compound index for deduplication
TechnographicSchema.index({ company_id: 1, name: 1 }, { unique: true });

const Technographic: Model<ITechnographic> =
  mongoose.models.Technographic ||
  mongoose.model<ITechnographic>("Technographic", TechnographicSchema);

export default Technographic;

