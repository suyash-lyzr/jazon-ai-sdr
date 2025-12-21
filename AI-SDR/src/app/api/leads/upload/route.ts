import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import connectDB from "@/lib/mongodb";
import Lead from "@/models/Lead";
import Company from "@/models/Company";
import Persona from "@/models/Persona";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected");

    // Get the form data
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const mappingJson = formData.get("mapping") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith(".csv")) {
      return NextResponse.json(
        { error: "File must be a CSV file" },
        { status: 400 }
      );
    }

    console.log("📄 Processing CSV file:", file.name);

    // Read file content
    const fileContent = await file.text();
    console.log("📄 File content length:", fileContent.length);

    // Parse CSV
    let records: any[];
    try {
      records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_column_count: true,
      });
      console.log("✅ CSV parsed successfully. Rows:", records.length);
      console.log("📋 CSV headers:", records.length > 0 ? Object.keys(records[0]) : []);
    } catch (parseError: any) {
      console.error("❌ CSV parsing error:", parseError);
      return NextResponse.json(
        { 
          error: "Failed to parse CSV file. Please check the format.",
          details: parseError.message 
        },
        { status: 400 }
      );
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { error: "CSV file is empty or has no valid rows" },
        { status: 400 }
      );
    }

    // Parse field mapping if provided
    let fieldMapping: Record<string, string> | null = null;
    if (mappingJson) {
      try {
        fieldMapping = JSON.parse(mappingJson);
        console.log("🗺️ Using field mapping:", fieldMapping);
      } catch (e) {
        console.warn("⚠️ Failed to parse mapping, using default column names");
      }
    }

    // Validate and create leads
    const createdLeads = [];
    const errors = [];

    for (let i = 0; i < records.length; i++) {
      const row = records[i];
      const rowNumber = i + 2; // +2 because row 1 is header, and arrays are 0-indexed

      // Map fields if mapping is provided
      let name: string | undefined;
      let title: string | undefined;
      let company: string | undefined;
      let email: string | undefined;

      if (fieldMapping) {
        name = row[fieldMapping.name]?.toString().trim();
        title = row[fieldMapping.title]?.toString().trim();
        company = row[fieldMapping.company]?.toString().trim();
        email = row[fieldMapping.email]?.toString().trim();
      } else {
        // Use default column names
        name = row.name?.toString().trim();
        title = row.title?.toString().trim();
        company = row.company?.toString().trim();
        email = row.email?.toString().trim();
      }

      // Validate required fields
      if (!name || !title || !company) {
        errors.push({
          row: rowNumber,
          error: "Missing required fields: name, title, or company",
          data: { name, title, company, email },
        });
        continue;
      }

      // Validate email format if provided
      if (email && email.length > 0) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          errors.push({
            row: rowNumber,
            error: "Invalid email format",
            data: { name, title, company, email },
          });
          continue;
        }
      }

      try {
        // Step 1: Find or create Company
        const companyDoc = await Company.findOrCreate({
          name: company,
          domain: "", // Will be enriched by research agent
          industry: "", // Will be enriched by research agent
          confidence: "Low",
        });

        console.log(
          `✅ Company ${companyDoc._id === companyDoc._id ? "found" : "created"}: ${company}`
        );

        // Step 2: Find or create Persona
        const personaDoc = await Persona.findOrCreate({
          full_name: name,
          email: email || "",
          title: title,
          confidence: "Low",
        });

        console.log(
          `✅ Persona ${personaDoc._id === personaDoc._id ? "found" : "created"}: ${name}`
        );

        // Step 3: Create Lead with references
        const lead = await Lead.create({
          name,
          title,
          email: email || undefined,
          company_id: companyDoc._id,
          persona_id: personaDoc._id,
          status: "uploaded",
          source: "CSV",
        });

        createdLeads.push({
          id: lead._id.toString(),
          name: name,
          title: title,
          company: company,
          email: email,
          status: lead.status,
        });

        console.log(
          `✅ Lead created: ${name} (${company}) - ID: ${lead._id}`
        );
      } catch (createError: any) {
        console.error(`❌ Error creating lead for row ${rowNumber}:`, createError);
        errors.push({
          row: rowNumber,
          error: createError.message || "Failed to create lead",
          data: { name, title, company, email },
        });
      }
    }

    // Log summary
    console.log(
      `📊 CSV Upload Summary: ${createdLeads.length} leads created, ${errors.length} errors`
    );

    // Return response
    return NextResponse.json(
      {
        success: true,
        message: `Successfully processed ${createdLeads.length} leads`,
        leads: createdLeads,
        errors: errors.length > 0 ? errors : undefined,
        summary: {
          total: records.length,
          created: createdLeads.length,
          failed: errors.length,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ API Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message || "An unexpected error occurred",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

