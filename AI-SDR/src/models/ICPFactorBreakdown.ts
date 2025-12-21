import mongoose, { Document, Model, Schema } from "mongoose";

export interface IFactor {
  name: string;
  value: number;
  weight: number;
}

export type FactorCategory = "companyFit" | "personaFit" | "timingFit";

export interface IICPFactorBreakdown extends Document {
  icp_score_id: mongoose.Types.ObjectId;
  category: FactorCategory;
  score: number;
  factors: IFactor[];
  createdAt: Date;
}

const FactorSchema = new Schema<IFactor>(
  {
    name: { type: String, required: true },
    value: { type: Number, required: true, min: 0, max: 100 },
    weight: { type: Number, required: true, min: 0, max: 100 },
  },
  { _id: false }
);

const ICPFactorBreakdownSchema = new Schema<IICPFactorBreakdown>(
  {
    icp_score_id: {
      type: Schema.Types.ObjectId,
      ref: "ICPScore",
      required: true,
      index: true,
    },
    category: {
      type: String,
      enum: ["companyFit", "personaFit", "timingFit"],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    factors: {
      type: [FactorSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    collection: "icp_factor_breakdowns",
  }
);

// Compound unique index
ICPFactorBreakdownSchema.index(
  { icp_score_id: 1, category: 1 },
  { unique: true }
);

const ICPFactorBreakdown: Model<IICPFactorBreakdown> =
  mongoose.models.ICPFactorBreakdown ||
  mongoose.model<IICPFactorBreakdown>(
    "ICPFactorBreakdown",
    ICPFactorBreakdownSchema
  );

export default ICPFactorBreakdown;

