import { z } from "zod";
import { feedbackStatusEnum, localeEnum } from "./common";

// Regex to detect links or URLs in feedback message to prevent spam
const URL_REGEX = /(https?:\/\/|www\.|\.com|\.net|\.org|\.io|\.me|[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/i;

export const submitFeedbackSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "الاسم يجب أن يكون حرفين على الأقل")
    .max(60, "الاسم طويل جداً (الحد الأقصى 60 حرف)"),
  roleOrCompany: z
    .string()
    .trim()
    .max(80, "المسمى الوظيفي أو الشركة لا تتجاوز 80 حرف")
    .default(""),
  message: z
    .string()
    .trim()
    .min(10, "الرسالة يجب أن تكون 10 أحرف على الأقل")
    .max(1000, "الرسالة لا تتجاوز 1000 حرف")
    .refine((msg) => !URL_REGEX.test(msg), {
      message: "غير مسموح بوضع روابط في رسائل التقييم",
    }),
  locale: localeEnum.default("ar"),
  // Honeypot field: must remain empty (if filled, it's a spam bot)
  hp_website: z.string().max(0, "Spam detected").optional().default(""),
});

export const updateFeedbackStatusSchema = z.object({
  status: feedbackStatusEnum,
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
export type UpdateFeedbackStatusInput = z.infer<typeof updateFeedbackStatusSchema>;
