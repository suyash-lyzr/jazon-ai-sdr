import mongoose from "mongoose";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, "..", ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "";

async function showCollections() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    const db = mongoose.connection.db;
    if (!db) throw new Error("No database connection");

    const collections = [
      "leads",
      "companies",
      "personas",
      "technographics",
      "research_runs",
      "citations",
      "detected_signals",
      "icp_scores",
      "icp_factor_breakdowns"
    ];

    console.log("📊 Normalized Collections Structure:");
    console.log("=".repeat(70));

    for (const collectionName of collections) {
      const count = await db.collection(collectionName).countDocuments();
      const sample = await db.collection(collectionName).findOne({});
      
      console.log(`\n📁 ${collectionName.toUpperCase()} (${count} documents)`);
      
      if (sample) {
        console.log("   Sample structure:");
        const keys = Object.keys(sample).filter(k => k !== '_id' && k !== '__v' && k !== 'createdAt' && k !== 'updatedAt');
        keys.forEach(key => {
          const value = sample[key];
          if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            console.log(`   - ${key}: { object with ${Object.keys(value).length} fields }`);
          } else if (Array.isArray(value)) {
            console.log(`   - ${key}: [ array with ${value.length} items ]`);
          } else {
            console.log(`   - ${key}: ${typeof value}`);
          }
        });
        
        // Show references
        if (sample.lead_id) console.log(`   → References: lead_id`);
        if (sample.company_id) console.log(`   → References: company_id`);
        if (sample.persona_id) console.log(`   → References: persona_id`);
        if (sample.icp_score_id) console.log(`   → References: icp_score_id`);
        if (sample.research_run_id) console.log(`   → References: research_run_id`);
      }
    }

    // Show the new normalized lead structure
    console.log("\n" + "=".repeat(70));
    console.log("📋 NEW NORMALIZED LEAD STRUCTURE:");
    console.log("=".repeat(70));
    
    const newLead = await db.collection("leads").findOne({ 
      _migrated: { $exists: false } 
    });
    
    if (newLead) {
      console.log("\n✅ New Lead Document (Normalized):");
      console.log(JSON.stringify({
        _id: newLead._id,
        name: newLead.name,
        title: newLead.title,
        email: newLead.email,
        company_id: newLead.company_id,
        persona_id: newLead.persona_id,
        status: newLead.status,
        source: newLead.source
      }, null, 2));
      
      console.log("\n🔗 This lead references:");
      console.log(`   - Company ID: ${newLead.company_id}`);
      console.log(`   - Persona ID: ${newLead.persona_id}`);
    } else {
      console.log("\n⚠️  No new normalized leads found (only old nested ones exist)");
    }

    // Show old vs new
    const oldLeads = await db.collection("leads").countDocuments({ _migrated: true });
    const newLeads = await db.collection("leads").countDocuments({ _migrated: { $exists: false } });
    
    console.log("\n" + "=".repeat(70));
    console.log("📊 Summary:");
    console.log("=".repeat(70));
    console.log(`Old nested leads: ${oldLeads}`);
    console.log(`New normalized leads: ${newLeads}`);
    console.log(`\n💡 The old nested documents can be safely deleted after verification.`);

    await mongoose.disconnect();
    console.log("\n✅ Complete");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

showCollections();
