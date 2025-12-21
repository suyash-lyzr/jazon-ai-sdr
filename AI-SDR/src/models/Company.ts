import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICompanySize {
  employee_count: number;
  employee_count_confidence: "High" | "Medium" | "Low";
  annual_revenue_usd: number;
  revenue_confidence: "High" | "Medium" | "Low";
  is_public: boolean;
  ticker: string;
  exchange: string;
}

export interface IHeadquarters {
  city: string;
  state_or_region: string;
  country: string;
  raw_address: string;
}

export interface ICompany extends Document {
  name: string;
  domain: string;
  website_url: string;
  linkedin_url: string;
  industry: string;
  company_size: ICompanySize;
  headquarters: IHeadquarters;
  structure: string;
  sales_motion: string;
  keywords: string[];
  confidence: "High" | "Medium" | "Low";
  createdAt: Date;
  updatedAt: Date;
}

const CompanySizeSchema = new Schema<ICompanySize>(
  {
    employee_count: { type: Number, default: 0 },
    employee_count_confidence: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    annual_revenue_usd: { type: Number, default: 0 },
    revenue_confidence: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    is_public: { type: Boolean, default: false },
    ticker: { type: String, default: "" },
    exchange: { type: String, default: "" },
  },
  { _id: false }
);

const HeadquartersSchema = new Schema<IHeadquarters>(
  {
    city: { type: String, default: "" },
    state_or_region: { type: String, default: "" },
    country: { type: String, default: "" },
    raw_address: { type: String, default: "" },
  },
  { _id: false }
);

const CompanySchema = new Schema<ICompany>(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    domain: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    website_url: {
      type: String,
      default: "",
    },
    linkedin_url: {
      type: String,
      default: "",
    },
    industry: {
      type: String,
      index: true,
      default: "",
    },
    company_size: {
      type: CompanySizeSchema,
      default: () => ({}),
    },
    headquarters: {
      type: HeadquartersSchema,
      default: () => ({}),
    },
    structure: {
      type: String,
      default: "",
    },
    sales_motion: {
      type: String,
      default: "",
    },
    keywords: {
      type: [String],
      default: [],
    },
    confidence: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
  },
  {
    timestamps: true,
    collection: "companies",
  }
);

// Static method for finding or creating a company
CompanySchema.statics.findOrCreate = async function (
  companyData: Partial<ICompany>
): Promise<ICompany> {
  const Company = this as Model<ICompany>;

  // Try to find by domain first (most reliable)
  if (companyData.domain) {
    const existingByDomain = await Company.findOne({
      domain: companyData.domain,
    });
    if (existingByDomain) {
      // Update existing company with new data if provided
      Object.assign(existingByDomain, companyData);
      await existingByDomain.save();
      return existingByDomain;
    }
  }

  // Try to find by name (case-insensitive)
  if (companyData.name) {
    const existingByName = await Company.findOne({
      name: new RegExp(`^${companyData.name}$`, "i"),
    });
    if (existingByName) {
      // Update existing company with new data if provided
      Object.assign(existingByName, companyData);
      await existingByName.save();
      return existingByName;
    }
  }

  // Create new company if not found
  const newCompany = new Company(companyData);
  await newCompany.save();
  return newCompany;
};

// Extend the model interface to include statics
interface ICompanyModel extends Model<ICompany> {
  findOrCreate(companyData: Partial<ICompany>): Promise<ICompany>;
}

const Company: ICompanyModel =
  (mongoose.models.Company as ICompanyModel) ||
  mongoose.model<ICompany, ICompanyModel>("Company", CompanySchema);

export default Company;

