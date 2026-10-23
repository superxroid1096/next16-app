import { z } from "zod";
import { l10nSchema } from "./common";

export const experienceSchema = z.object({
  company: l10nSchema.refine((val) => val.ar.trim().length > 0, {
    message: "اسم الشركة بالعربية مطلوب",
  }),
  role: l10nSchema.refine((val) => val.ar.trim().length > 0, {
    message: "المسمى الوظيفي بالعربية مطلوب",
  }),
  description: l10nSchema,
  startDate: z.coerce.date(),
  endDate: z.coerce.date().nullable().optional(),
  order: z.number().int().default(0),
}).refine(
  (data) => {
    if (data.endDate && data.startDate > data.endDate) {
      return false;
    }
    return true;
  },
  {
    message: "تاريخ النهاية يجب أن يكون بعد تاريخ البداية",
    path: ["endDate"],
  }
);

export type ExperienceInput = z.infer<typeof experienceSchema>;
