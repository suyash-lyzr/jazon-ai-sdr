import mongoose, { Document, Model, Schema } from "mongoose";

export interface ILocation {
  city: string;
  state_or_region: string;
  country: string;
  time_zone: string;
}

export interface IDecisionAuthority {
  budget_owner_likelihood: "High" | "Medium" | "Low";
  decision_maker_likelihood: "High" | "Medium" | "Low";
  champion_likelihood: "High" | "Medium" | "Low";
  rationale: string;
}

export interface IPersona extends Document {
  full_name: string;
  email: string;
  linkedin_url: string;
  title: string;
  seniority: string;
  department: string;
  location: ILocation;
  reports_to: string;
  decision_authority: IDecisionAuthority;
  responsibilities: string[];
  pain_points: string[];
  confidence: "High" | "Medium" | "Low";
  createdAt: Date;
  updatedAt: Date;
}

const LocationSchema = new Schema<ILocation>(
  {
    city: { type: String, default: "" },
    state_or_region: { type: String, default: "" },
    country: { type: String, default: "" },
    time_zone: { type: String, default: "" },
  },
  { _id: false }
);

const DecisionAuthoritySchema = new Schema<IDecisionAuthority>(
  {
    budget_owner_likelihood: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    decision_maker_likelihood: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    champion_likelihood: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Low",
    },
    rationale: { type: String, default: "" },
  },
  { _id: false }
);

const PersonaSchema = new Schema<IPersona>(
  {
    full_name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    linkedin_url: {
      type: String,
      index: true,
      sparse: true,
      unique: true,
    },
    title: {
      type: String,
      default: "",
    },
    seniority: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    location: {
      type: LocationSchema,
      default: () => ({}),
    },
    reports_to: {
      type: String,
      default: "",
    },
    decision_authority: {
      type: DecisionAuthoritySchema,
      default: () => ({}),
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    pain_points: {
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
    collection: "personas",
  }
);

// Static method for finding or creating a persona
PersonaSchema.statics.findOrCreate = async function (
  personaData: Partial<IPersona>
): Promise<IPersona> {
  const Persona = this as Model<IPersona>;

  // Try to find by email first (most reliable)
  if (personaData.email) {
    const existingByEmail = await Persona.findOne({
      email: personaData.email.toLowerCase(),
    });
    if (existingByEmail) {
      // Update existing persona with new data if provided
      Object.assign(existingByEmail, personaData);
      await existingByEmail.save();
      return existingByEmail;
    }
  }

  // Try to find by LinkedIn URL
  if (personaData.linkedin_url) {
    const existingByLinkedIn = await Persona.findOne({
      linkedin_url: personaData.linkedin_url,
    });
    if (existingByLinkedIn) {
      // Update existing persona with new data if provided
      Object.assign(existingByLinkedIn, personaData);
      await existingByLinkedIn.save();
      return existingByLinkedIn;
    }
  }

  // Try to find by name (case-insensitive, less reliable)
  if (personaData.full_name) {
    const existingByName = await Persona.findOne({
      full_name: new RegExp(`^${personaData.full_name}$`, "i"),
    });
    if (existingByName) {
      // Update existing persona with new data if provided
      Object.assign(existingByName, personaData);
      await existingByName.save();
      return existingByName;
    }
  }

  // Create new persona if not found
  const newPersona = new Persona(personaData);
  await newPersona.save();
  return newPersona;
};

// Extend the model interface to include statics
interface IPersonaModel extends Model<IPersona> {
  findOrCreate(personaData: Partial<IPersona>): Promise<IPersona>;
}

const Persona: IPersonaModel =
  (mongoose.models.Persona as IPersonaModel) ||
  mongoose.model<IPersona, IPersonaModel>("Persona", PersonaSchema);

export default Persona;

