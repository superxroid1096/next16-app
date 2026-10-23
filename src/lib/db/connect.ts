import "server-only";
import mongoose from "mongoose";

/**
 * MongoDB connection utility.
 * Caches the connection promise in `globalThis` so that
 * hot-reloads during development don't open new connections.
 */

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is not defined. Please add it to your .env.local file."
  );
}

/**
 * Cached connection stored on globalThis to survive HMR in dev.
 */
interface MongoCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoCache: MongoCache | undefined;
}

const cached: MongoCache = globalThis._mongoCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis._mongoCache) {
  globalThis._mongoCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI!, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}
