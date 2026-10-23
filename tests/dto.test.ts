import test from "node:test";
import assert from "node:assert/strict";
import {
  toProjectDTO,
  toSiteSettingsDTO,
  toSkillGroupDTO,
  toExperienceDTO,
  toCertificateDTO,
  toFeedbackDTO,
} from "../src/lib/data/dto";

test("DTO Converters", async (t) => {
  await t.test("toProjectDTO safely converts lean document", () => {
    const rawDoc = {
      _id: { toString: () => "6534e8e89f1a2c3d4e5f6a7b" },
      slug: "my-project",
      title: { ar: "مشروع", en: "Project" },
      summary: { ar: "ملخص", en: "Summary" },
      description: { ar: "وصف", en: "Desc" },
      role: { ar: "دور", en: "Role" },
      challenge: { ar: "تحدي", en: "Challenge" },
      solution: { ar: "حل", en: "Solution" },
      result: { ar: "نتيجة", en: "Result" },
      techs: ["Next.js", "TypeScript"],
      githubUrl: "https://github.com",
      liveUrl: "https://example.com",
      modes: ["hire"],
      featured: true,
      status: "published",
      order: 2,
      images: [
        {
          _id: "img1",
          publicId: "pub1",
          url: "https://example.com/img.jpg",
          alt: { ar: "صورة", en: "Image" },
          isCover: true,
          order: 0,
        },
      ],
      createdAt: new Date("2026-01-01T00:00:00Z"),
      updatedAt: new Date("2026-01-02T00:00:00Z"),
    };

    const dto = toProjectDTO(rawDoc);

    assert.equal(dto._id, "6534e8e89f1a2c3d4e5f6a7b");
    assert.equal(typeof dto._id, "string");
    assert.equal(dto.slug, "my-project");
    assert.equal(dto.featured, true);
    assert.equal(dto.images.length, 1);
    assert.equal(dto.images[0].isCover, true);
    assert.equal(dto.createdAt, "2026-01-01T00:00:00.000Z");
  });

  await t.test("toSiteSettingsDTO handles null/undefined gracefully", () => {
    const dto = toSiteSettingsDTO(null);
    assert.equal(dto._id, "");
    assert.equal(dto.name.ar, "");
    assert.equal(dto.name.en, "");
    assert.equal(dto.availableForWork, true);
    assert.deepEqual(dto.extraLinks, []);
  });

  await t.test("toSkillGroupDTO converts array of items correctly", () => {
    const raw = {
      _id: "skill1",
      name: { ar: "الواجهة", en: "Frontend" },
      items: ["React", "CSS"],
      order: 0,
    };
    const dto = toSkillGroupDTO(raw);
    assert.equal(dto._id, "skill1");
    assert.equal(dto.items.length, 2);
    assert.deepEqual(dto.items, ["React", "CSS"]);
  });

  await t.test("toExperienceDTO handles null endDate for current positions", () => {
    const raw = {
      _id: "exp1",
      company: { ar: "شركة", en: "Company" },
      role: { ar: "مهندس", en: "Engineer" },
      description: { ar: "وصف", en: "Desc" },
      startDate: new Date("2025-01-01T00:00:00Z"),
      endDate: null,
      order: 0,
    };
    const dto = toExperienceDTO(raw);
    assert.equal(dto.endDate, null);
    assert.equal(dto.startDate, "2025-01-01T00:00:00.000Z");
  });

  await t.test("toFeedbackDTO sets correct defaults and dates", () => {
    const raw = {
      _id: "fb1",
      name: "سامي",
      roleOrCompany: "عميل",
      message: "رأي إيجابي",
      status: "approved",
      locale: "ar",
      createdAt: new Date("2026-05-01T12:00:00Z"),
    };
    const dto = toFeedbackDTO(raw);
    assert.equal(dto.status, "approved");
    assert.equal(dto.name, "سامي");
    assert.equal(dto.createdAt, "2026-05-01T12:00:00.000Z");
  });
});
