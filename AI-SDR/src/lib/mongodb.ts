import mongoose from 'mongoose';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: any;
    promise: Promise<any> | null;
  };
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  let MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error(
      'Please define the MONGODB_URI environment variable inside .env.local'
    );
  }

  // Remove quotes if present
  MONGODB_URI = MONGODB_URI.replace(/^["']|["']$/g, '');

  // If we have a cached connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If we don't have a cached promise, create one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(async (mongooseInstance) => {
      console.log('✅ MongoDB connected successfully');
      
      // Ensure models are registered (Next.js hot reload fix)
      // Dynamically import models to ensure they're registered after connection
      if (!mongooseInstance.models.Company) {
        await import('@/models/Company');
      }
      if (!mongooseInstance.models.Persona) {
        await import('@/models/Persona');
      }
      if (!mongooseInstance.models.Lead) {
        await import('@/models/Lead');
      }
      
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;

