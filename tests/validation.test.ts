import test from "node:test";
import assert from "node:assert/strict";
import {
  projectSchema,
  siteSettingsSchema,
  skillGroupSchema,
  experienceSchema,
  certificateSchema,
  submitFeedbackSchema,
  loginSchema,
} from "../src/lib/validation";

test("Project Validation Schema", async (t) => {
  await t.test("accepts valid project input", () => {
    const valid = {
      slug: "nextjs-portfolio",
      title: { ar: "مشروع بورتفوليو", en: "Portfolio Project" },
      summary: { ar: "ملخص المشروع", en: "Project Summary" },
      description: { ar: "وصف مفصل", en: "Detailed description" },
      role: { ar: "مطور الواجهة", en: "Frontend Lead" },
      challenge: { ar: "التحدي", en: "Challenge" },
      solution: { ar: "الحل", en: "Solution" },
      result: { ar: "النتيجة", en: "Result" },
      techs: ["Next.js", "TypeScript"],
      githubUrl: "https://github.com/example/repo",
      liveUrl: "https://example.com",
      modes: ["hire", "tech"],
      featured: true,
      status: "published",
      order: 1,
      images: [
        {
          publicId: "img1",
          url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
          alt: { ar: "صورة", en: "Image" },
          isCover: true,
          order: 0,
        },
      ],
    };

    const res = projectSchema.safeParse(valid);
    assert.equal(res.success, true);
  });

  await t.test("rejects invalid slug with uppercase or spaces", () => {
    const invalid = {
      slug: "Invalid Slug",
      title: { ar: "مشروع", en: "Project" },
    };
    const res = projectSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });

  await t.test("rejects missing Arabic title", () => {
    const invalid = {
      slug: "valid-slug",
      title: { ar: "", en: "Only English" },
    };
    const res = projectSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });
});

test("Feedback Validation Schema", async (t) => {
  await t.test("accepts valid feedback submission", () => {
    const valid = {
      name: "أحمد علي",
      roleOrCompany: "مدير تقني",
      message: "عمل احترافي جداً وسرعة عالية في التنفيذ والمتابعة.",
      locale: "ar",
      hp_website: "",
    };
    const res = submitFeedbackSchema.safeParse(valid);
    assert.equal(res.success, true);
  });

  await t.test("rejects spam containing URLs in message", () => {
    const spamWithUrl = {
      name: "Spam Bot",
      message: "Check out our services at https://spam-link.com for cheap deals!",
    };
    const res = submitFeedbackSchema.safeParse(spamWithUrl);
    assert.equal(res.success, false);
    if (!res.success) {
      assert.match(res.error.issues[0].message, /غير مسموح بوضع روابط/);
    }
  });

  await t.test("rejects messages shorter than 10 characters", () => {
    const tooShort = {
      name: "محمد",
      message: "شكرا",
    };
    const res = submitFeedbackSchema.safeParse(tooShort);
    assert.equal(res.success, false);
  });
});

test("Admin Login Validation Schema", async (t) => {
  await t.test("accepts valid email and password", () => {
    const valid = {
      email: "ADMIN@example.com ",
      password: "strongpassword123",
    };
    const res = loginSchema.safeParse(valid);
    assert.equal(res.success, true);
    if (res.success) {
      assert.equal(res.data.email, "admin@example.com"); // trimmed & lowercased
    }
  });

  await t.test("rejects invalid email", () => {
    const invalid = {
      email: "not-an-email",
      password: "password123",
    };
    const res = loginSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });

  await t.test("rejects password shorter than 8 characters", () => {
    const invalid = {
      email: "admin@example.com",
      password: "short",
    };
    const res = loginSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });
});

test("Skill Group Validation Schema", async (t) => {
  await t.test("accepts valid skill group with items", () => {
    const valid = {
      name: { ar: "الواجهة", en: "Frontend" },
      items: ["React", "Next.js"],
      order: 0,
    };
    const res = skillGroupSchema.safeParse(valid);
    assert.equal(res.success, true);
  });

  await t.test("rejects empty items array", () => {
    const invalid = {
      name: { ar: "الواجهة", en: "Frontend" },
      items: [],
    };
    const res = skillGroupSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });
});

test("Experience Validation Schema", async (t) => {
  await t.test("rejects endDate that is before startDate", () => {
    const invalid = {
      company: { ar: "شركة", en: "Company" },
      role: { ar: "مهندس", en: "Engineer" },
      description: { ar: "وصف", en: "Desc" },
      startDate: new Date("2024-01-01"),
      endDate: new Date("2023-01-01"), // before start
    };
    const res = experienceSchema.safeParse(invalid);
    assert.equal(res.success, false);
  });
});
