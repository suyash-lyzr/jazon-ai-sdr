import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export const runtime = "nodejs";

export async function GET() {
  try {
    // Check if MONGODB_URI is set
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json(
        {
          success: false,
          error: "MONGODB_URI environment variable is not set",
          message: "Please create a .env.local file with MONGODB_URI",
        },
        { status: 500 }
      );
    }

    // Check current connection state
    const connectionState = mongoose.connection.readyState;
    const states = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    };

    // Try to connect
    await connectDB();

    // Get connection info
    const connection = mongoose.connection;
    const dbName = connection.db?.databaseName;
    const host = connection.host;
    const port = connection.port;
    const collections = await connection.db?.listCollections().toArray();

    return NextResponse.json(
      {
        success: true,
        message: "Database connection successful!",
        connection: {
          state: states[connectionState as keyof typeof states] || "unknown",
          database: dbName,
          host: host,
          port: port,
          collections: collections?.map((c) => c.name) || [],
        },
        environment: {
          mongoUriSet: !!mongoUri,
          uriPreview: mongoUri
            ? `${mongoUri.split("@")[0]}@${mongoUri.split("@")[1]?.split("/")[0]}...`
            : "not set",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Database connection test error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Database connection failed",
        message: error.message || "Unknown error occurred",
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}

