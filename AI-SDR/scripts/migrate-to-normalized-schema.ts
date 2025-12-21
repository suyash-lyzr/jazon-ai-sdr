#!/usr/bin/env ts-node
/**
 * Migration script to convert old nested Lead schema to new normalized schema
 * 
 * Run this script with: npx ts-node scripts/migrate-to-normalized-schema.ts
 * 
 * This script:
 * 1. Reads all leads from the old "leads" collection
 * 2. Extracts and deduplicates companies and personas
 * 3. Creates new normalized records in separate collections
 * 4. Updates leads to reference the new company and persona IDs
 */

import mongoose from "mongoose";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, "..", ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is not defined in .env.local");
  process.exit(1);
}

// Define the old Lead schema interface
interface OldLead {
  _id: mongoose.Types.ObjectId;
  lead_input: {
    name: string;
    title: string;
    company: string;
    email?: string;
  };
  research?: {
    CompanyProfile?: any;
    PersonaProfile?: any;
    DetectedSignals?: any[];
    ResearchMeta?: any;
  };
  icp?: {
    icp_score?: number;
    fit_tier?: string;
    score_breakdown?: any;
    factor_breakdown?: any;
    strengths?: string[];
    risks?: string[];
    gaps?: string[];
    confidence_level?: string;
    scoring_meta?: any;
  };
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

async function migrate() {
  try {
    console.log("🚀 Starting migration to normalized schema...\n");

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    // Get reference to old leads collection
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error("Database connection not established");
    }

    // Check if old data exists
    const oldLeadsCollection = db.collection("leads");
    const oldLeadsCount = await oldLeadsCollection.countDocuments({
      $or: [{ "lead_input": { $exists: true } }, { "research": { $exists: true } }],
    });

    console.log(`📋 Found ${oldLeadsCount} leads with old schema\n`);

    if (oldLeadsCount === 0) {
      console.log("✅ No old schema data found. Migration not needed.");
      await mongoose.disconnect();
      return;
    }

    // Ask for confirmation
    console.log("⚠️  This will transform your existing data structure.");
    console.log("⚠️  Please ensure you have a backup of your database before proceeding.\n");

    // Fetch all old leads
    const oldLeads = (await oldLeadsCollection
      .find({})
      .toArray()) as unknown as OldLead[];

    console.log(`📦 Processing ${oldLeads.length} leads...\n`);

    // Collections for deduplication
    const companyMap = new Map<string, mongoose.Types.ObjectId>();
    const personaMap = new Map<string, mongoose.Types.ObjectId>();

    // Import models
    const { default: Company } = await import("../src/models/Company");
    const { default: Persona } = await import("../src/models/Persona");
    const { default: Lead } = await import("../src/models/Lead");
    const { default: Technographic } = await import(
      "../src/models/Technographic"
    );
    const { default: ResearchRun } = await import(
      "../src/models/ResearchRun"
    );
    const { default: Citation } = await import("../src/models/Citation");
    const { default: DetectedSignal } = await import(
      "../src/models/DetectedSignal"
    );
    const { default: ICPScore } = await import("../src/models/ICPScore");
    const { default: ICPFactorBreakdown } = await import(
      "../src/models/ICPFactorBreakdown"
    );

    let migratedCount = 0;
    let skippedCount = 0;

    for (const oldLead of oldLeads) {
      try {
        console.log(`\n🔄 Processing: ${oldLead.lead_input.name} (${oldLead.lead_input.company})`);

        // Step 1: Create or find Company
        const companyKey = oldLead.lead_input.company.toLowerCase();
        let companyId: mongoose.Types.ObjectId;

        if (companyMap.has(companyKey)) {
          companyId = companyMap.get(companyKey)!;
          console.log(`  ✓ Company already exists: ${oldLead.lead_input.company}`);
        } else {
          const companyData = oldLead.research?.CompanyProfile || {};
          const company = await Company.findOrCreate({
            name: oldLead.lead_input.company,
            domain: companyData.domain || "",
            website_url: companyData.website_url || "",
            linkedin_url: companyData.linkedin_url || "",
            industry: companyData.industry || "",
            company_size: companyData.company_size || {},
            headquarters: companyData.headquarters || {},
            structure: companyData.structure || "",
            sales_motion: companyData.sales_motion || "",
            keywords: companyData.keywords || [],
            confidence: companyData.confidence || "Low",
          });
          companyId = company._id;
          companyMap.set(companyKey, companyId);
          console.log(`  ✓ Created company: ${oldLead.lead_input.company}`);

          // Create technographics if available
          if (companyData.technographics && Array.isArray(companyData.technographics)) {
            for (const tech of companyData.technographics) {
              await Technographic.create({
                company_id: companyId,
                name: tech.name,
                category: tech.category,
                confidence: tech.confidence,
                source: tech.source,
              });
            }
            console.log(`  ✓ Created ${companyData.technographics.length} technographics`);
          }
        }

        // Step 2: Create or find Persona
        const personaKey = oldLead.lead_input.email
          ? oldLead.lead_input.email.toLowerCase()
          : oldLead.lead_input.name.toLowerCase();
        let personaId: mongoose.Types.ObjectId;

        if (personaMap.has(personaKey)) {
          personaId = personaMap.get(personaKey)!;
          console.log(`  ✓ Persona already exists: ${oldLead.lead_input.name}`);
        } else {
          const personaData = oldLead.research?.PersonaProfile || {};
          const persona = await Persona.findOrCreate({
            full_name: oldLead.lead_input.name,
            email: oldLead.lead_input.email || "",
            linkedin_url: personaData.linkedin_url || "",
            title: oldLead.lead_input.title,
            seniority: personaData.seniority || "",
            department: personaData.department || "",
            location: personaData.location || {},
            reports_to: personaData.reports_to || "",
            decision_authority: personaData.decision_authority || {},
            responsibilities: personaData.responsibilities || [],
            pain_points: personaData.pain_points || [],
            confidence: personaData.confidence || "Low",
          });
          personaId = persona._id;
          personaMap.set(personaKey, personaId);
          console.log(`  ✓ Created persona: ${oldLead.lead_input.name}`);
        }

        // Step 3: Create new Lead with references
        const newLead = await Lead.create({
          name: oldLead.lead_input.name,
          title: oldLead.lead_input.title,
          email: oldLead.lead_input.email,
          company_id: companyId,
          persona_id: personaId,
          status: oldLead.status,
          source: "CSV",
          createdAt: oldLead.createdAt,
          updatedAt: oldLead.updatedAt,
        });
        console.log(`  ✓ Created new lead with ID: ${newLead._id}`);

        // Step 4: Create ResearchRun if research data exists
        if (oldLead.research) {
          const researchRun = await ResearchRun.create({
            lead_id: newLead._id,
            company_id: companyId,
            persona_id: personaId,
            research_meta: oldLead.research.ResearchMeta || {},
          });
          console.log(`  ✓ Created research run`);

          // Create Citations
          if (oldLead.research.ResearchMeta?.citations) {
            for (const citation of oldLead.research.ResearchMeta.citations) {
              await Citation.create({
                research_run_id: researchRun._id,
                source_name: citation.source_name,
                url: citation.url,
                accessed_at_utc: citation.accessed_at_utc,
              });
            }
            console.log(`  ✓ Created ${oldLead.research.ResearchMeta.citations.length} citations`);
          }

          // Create DetectedSignals
          if (oldLead.research.DetectedSignals) {
            for (const signal of oldLead.research.DetectedSignals) {
              await DetectedSignal.create({
                lead_id: newLead._id,
                research_run_id: researchRun._id,
                type: signal.type,
                signal: signal.signal,
                source: signal.source,
                strength: signal.strength,
                recency: signal.recency,
                evidence: signal.evidence,
              });
            }
            console.log(`  ✓ Created ${oldLead.research.DetectedSignals.length} signals`);
          }
        }

        // Step 5: Create ICPScore if ICP data exists
        if (oldLead.icp && oldLead.icp.icp_score !== undefined) {
          const icpScore = await ICPScore.create({
            lead_id: newLead._id,
            icp_score: oldLead.icp.icp_score,
            fit_tier: oldLead.icp.fit_tier || "Tier 3",
            score_breakdown: oldLead.icp.score_breakdown || {},
            strengths: oldLead.icp.strengths || [],
            risks: oldLead.icp.risks || [],
            gaps: oldLead.icp.gaps || [],
            confidence_level: oldLead.icp.confidence_level || "Low",
            scoring_meta: oldLead.icp.scoring_meta || {},
          });
          console.log(`  ✓ Created ICP score: ${oldLead.icp.icp_score}`);

          // Create ICPFactorBreakdowns
          if (oldLead.icp.factor_breakdown) {
            for (const category of ["companyFit", "personaFit", "timingFit"] as const) {
              if (oldLead.icp.factor_breakdown[category]) {
                await ICPFactorBreakdown.create({
                  icp_score_id: icpScore._id,
                  category: category,
                  score: oldLead.icp.factor_breakdown[category].score,
                  factors: oldLead.icp.factor_breakdown[category].factors,
                });
              }
            }
            console.log(`  ✓ Created factor breakdowns`);
          }
        }

        // Step 6: Archive old lead (rename to avoid conflicts)
        await oldLeadsCollection.updateOne(
          { _id: oldLead._id },
          { $set: { _migrated: true, _new_lead_id: newLead._id } }
        );

        migratedCount++;
        console.log(`  ✅ Migration complete for lead ${oldLead._id}`);
      } catch (error: any) {
        console.error(`  ❌ Error migrating lead ${oldLead._id}:`, error.message);
        skippedCount++;
      }
    }

    console.log("\n" + "=".repeat(60));
    console.log("📊 Migration Summary:");
    console.log("=".repeat(60));
    console.log(`✅ Successfully migrated: ${migratedCount} leads`);
    console.log(`❌ Skipped (errors): ${skippedCount} leads`);
    console.log(`🏢 Created/updated: ${companyMap.size} companies`);
    console.log(`👤 Created/updated: ${personaMap.size} personas`);
    console.log("=".repeat(60));

    console.log("\n✨ Migration completed successfully!");
    console.log("\n⚠️  Old lead documents are still in the database with _migrated: true flag.");
    console.log("   You can safely delete them after verifying the migration.\n");

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
  } catch (error: any) {
    console.error("\n❌ Migration failed:", error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run migration
migrate();

