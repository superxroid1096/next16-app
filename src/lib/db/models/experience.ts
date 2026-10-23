import "server-only";
import { Schema, model, models } from "mongoose";

const l10n = {
  ar: { type: String, default: "" },
  en: { type: String, default: "" },
};

const experienceSchema = new Schema(
  {
    company: l10n,
    role: l10n,
    description: l10n,
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null }, // null = current position
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "experiences" }
);

export const Experience =
  models.Experience || model("Experience", experienceSchema);
