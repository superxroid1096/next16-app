import { z } from "zod";
import { l10nSchema, optionalUrlSchema } from "./common";

export const certificateSchema = z.object({
  title: l10nSchema.refine((val) => val.ar.trim().length > 0, {
    message: "عنوان الشهادة بالعربية مطلوب",
  }),
  issuer: l10nSchema.refine((val) => val.ar.trim().length > 0, {
    message: "جهة إصدار الشهادة بالعربية مطلوبة",
  }),
  date: z.coerce.date(),
  verifyUrl: optionalUrlSchema.default(""),
  order: z.number().int().default(0),
});

export type CertificateInput = z.infer<typeof certificateSchema>;
