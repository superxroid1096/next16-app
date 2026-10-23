import { z } from "zod";
import { l10nSchema } from "./common";

export const skillGroupSchema = z.object({
  name: l10nSchema.refine((val) => val.ar.trim().length > 0, {
    message: "اسم مجموعة المهارات بالعربية مطلوب",
  }),
  items: z
    .array(z.string().trim().min(1, "Skill item cannot be empty"))
    .min(1, "At least one skill item is required"),
  order: z.number().int().default(0),
});

export type SkillGroupInput = z.infer<typeof skillGroupSchema>;
