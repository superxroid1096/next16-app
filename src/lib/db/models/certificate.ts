import "server-only";
import { Schema, model, models } from "mongoose";

const l10n = {
  ar: { type: String, default: "" },
  en: { type: String, default: "" },
};

const certificateSchema = new Schema(
  {
    title: l10n,
    issuer: l10n,
    date: { type: Date, required: true },
    verifyUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "certificates" }
);

export const Certificate =
  models.Certificate || model("Certificate", certificateSchema);
