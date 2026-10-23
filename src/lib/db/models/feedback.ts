import "server-only";
import { Schema, model, models } from "mongoose";

const feedbackSchema = new Schema(
  {
    name: { type: String, required: true },
    roleOrCompany: { type: String, default: "" },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    locale: {
      type: String,
      enum: ["ar", "en"],
      default: "ar",
    },
  },
  { timestamps: true, collection: "feedbacks" }
);

feedbackSchema.index({ status: 1, createdAt: -1 });

export const Feedback = models.Feedback || model("Feedback", feedbackSchema);
