import "server-only";
import { Schema, model, models } from "mongoose";

const l10n = {
  ar: { type: String, default: "" },
  en: { type: String, default: "" },
};

const imageSchema = new Schema(
  {
    publicId: { type: String, required: true },
    url: { type: String, required: true },
    width: Number,
    height: Number,
    alt: l10n,
    isCover: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const projectSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: l10n,
    summary: l10n,
    description: l10n,
    role: l10n,
    challenge: l10n,
    solution: l10n,
    result: l10n,
    techs: [String],
    githubUrl: { type: String, default: "" },
    liveUrl: { type: String, default: "" },
    modes: {
      type: [String],
      enum: ["hire", "client", "tech"],
      default: [],
    },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    order: { type: Number, default: 0 },
    images: [imageSchema],
  },
  { timestamps: true, collection: "projects" }
);

projectSchema.index({ status: 1, order: 1 });

export const Project = models.Project || model("Project", projectSchema);
