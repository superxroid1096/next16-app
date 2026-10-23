import "server-only";
import { Schema, model, models } from "mongoose";

const rateLimitSchema = new Schema({
  key: { type: String, required: true, unique: true },
  count: { type: Number, default: 1 },
  expiresAt: { type: Date, required: true },
});

// TTL index: MongoDB automatically deletes expired documents
rateLimitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimit =
  models.RateLimit || model("RateLimit", rateLimitSchema);
