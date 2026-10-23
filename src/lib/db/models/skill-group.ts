import "server-only";
import { Schema, model, models } from "mongoose";

const l10n = {
  ar: { type: String, default: "" },
  en: { type: String, default: "" },
};

const skillGroupSchema = new Schema(
  {
    name: l10n,
    items: [String],
    order: { type: Number, default: 0 },
  },
  { timestamps: true, collection: "skillgroups" }
);

export const SkillGroup =
  models.SkillGroup || model("SkillGroup", skillGroupSchema);
