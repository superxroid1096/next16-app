/**
 * Script: Seed Database with test data (both languages)
 *
 * Usage:
 *   npx tsx scripts/seed.ts
 *
 * Creates sample data for all entities to test the full flow.
 * Run this during development only — delete before production.
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set in environment.");
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI!);
  console.log("Connected to MongoDB.");

  const db = mongoose.connection.db!;

  // ---- SiteSettings ----
  const settingsCount = await db.collection("sitesettings").countDocuments();
  if (settingsCount === 0) {
    await db.collection("sitesettings").insertOne({
      name: { ar: "محمد أحمد", en: "Mohamed Ahmed" },
      jobTitle: { ar: "مطور واجهات أمامية", en: "Frontend Developer" },
      headline: { ar: "أبني تطبيقات ويب سريعة وسهلة الاستخدام", en: "I build fast and user-friendly web apps" },
      bio: {
        ar: "مطور ويب بخبرة في React وNext.js وNode.js. بركز على الأداء وتجربة المستخدم.",
        en: "Web developer experienced in React, Next.js, and Node.js. I focus on performance and user experience.",
      },
      avatarUrl: "",
      avatarPublicId: "",
      availableForWork: true,
      availabilityNote: { ar: "متاح للعمل عن بعد", en: "Available for remote work" },
      whatsapp: "+201234567890",
      email: "contact@example.com",
      linkedIn: "https://linkedin.com/in/example",
      github: "https://github.com/example",
      extraLinks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("SiteSettings seeded.");
  }

  // ---- SkillGroups ----
  const skillsCount = await db.collection("skillgroups").countDocuments();
  if (skillsCount === 0) {
    await db.collection("skillgroups").insertMany([
      {
        name: { ar: "الواجهة الأمامية", en: "Frontend" },
        items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML", "CSS"],
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { ar: "الخلفية", en: "Backend" },
        items: ["Node.js", "Express", "MongoDB", "PostgreSQL", "REST APIs"],
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: { ar: "أدوات", en: "Tools" },
        items: ["Git", "GitHub", "VS Code", "Figma", "Postman"],
        order: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("SkillGroups seeded.");
  }

  // ---- Experience ----
  const expCount = await db.collection("experiences").countDocuments();
  if (expCount === 0) {
    await db.collection("experiences").insertMany([
      {
        company: { ar: "شركة تقنية", en: "Tech Company" },
        role: { ar: "مطور واجهات أمامية", en: "Frontend Developer" },
        description: {
          ar: "بناء وصيانة تطبيقات React للعملاء. تحسين الأداء وتجربة المستخدم.",
          en: "Built and maintained React applications for clients. Improved performance and user experience.",
        },
        startDate: new Date("2023-01-01"),
        endDate: null,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        company: { ar: "وكالة رقمية", en: "Digital Agency" },
        role: { ar: "مطور ويب", en: "Web Developer" },
        description: {
          ar: "تطوير مواقع ويب متجاوبة باستخدام HTML وCSS وJavaScript.",
          en: "Developed responsive websites using HTML, CSS, and JavaScript.",
        },
        startDate: new Date("2021-06-01"),
        endDate: new Date("2022-12-31"),
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Experiences seeded.");
  }

  // ---- Certificates ----
  const certCount = await db.collection("certificates").countDocuments();
  if (certCount === 0) {
    await db.collection("certificates").insertMany([
      {
        title: { ar: "React - The Complete Guide", en: "React - The Complete Guide" },
        issuer: { ar: "Udemy", en: "Udemy" },
        date: new Date("2023-03-15"),
        verifyUrl: "",
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: { ar: "JavaScript Algorithms and Data Structures", en: "JavaScript Algorithms and Data Structures" },
        issuer: { ar: "freeCodeCamp", en: "freeCodeCamp" },
        date: new Date("2022-08-20"),
        verifyUrl: "https://freecodecamp.org/certification/example/javascript",
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Certificates seeded.");
  }

  // ---- Projects ----
  const projCount = await db.collection("projects").countDocuments();
  if (projCount === 0) {
    await db.collection("projects").insertMany([
      {
        slug: "e-commerce-store",
        title: { ar: "متجر إلكتروني", en: "E-Commerce Store" },
        summary: {
          ar: "متجر إلكتروني كامل بسلة مشتريات ودفع إلكتروني",
          en: "Full e-commerce store with shopping cart and online payment",
        },
        description: {
          ar: "متجر إلكتروني متكامل مبني بـ Next.js وStripe للدفع.",
          en: "A full-featured e-commerce store built with Next.js and Stripe for payments.",
        },
        role: { ar: "مطور Full-Stack", en: "Full-Stack Developer" },
        challenge: {
          ar: "إدارة حالة السلة مع الأداء العالي",
          en: "Managing cart state while maintaining high performance",
        },
        solution: {
          ar: "استخدام Zustand لإدارة الحالة مع تحسين الأداء عبر React Server Components",
          en: "Used Zustand for state management with RSC for performance",
        },
        result: {
          ar: "تحسين وقت التحميل بنسبة 40%",
          en: "Improved load time by 40%",
        },
        techs: ["Next.js", "React", "TypeScript", "Stripe", "MongoDB", "Tailwind CSS"],
        githubUrl: "https://github.com/example/ecommerce",
        liveUrl: "https://ecommerce.example.com",
        modes: ["client", "hire"],
        featured: true,
        status: "published",
        order: 0,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        slug: "task-manager",
        title: { ar: "مدير المهام", en: "Task Manager" },
        summary: {
          ar: "تطبيق لإدارة المهام والمشاريع مع فريق العمل",
          en: "Task and project management app for teams",
        },
        description: {
          ar: "تطبيق ويب لإدارة المهام مع إمكانية التعاون بين أعضاء الفريق.",
          en: "A web app for task management with team collaboration features.",
        },
        role: { ar: "مطور واجهات أمامية", en: "Frontend Developer" },
        challenge: {
          ar: "تحديثات في الوقت الحقيقي بين أعضاء الفريق",
          en: "Real-time updates across team members",
        },
        solution: {
          ar: "استخدام WebSockets مع Optimistic Updates",
          en: "Used WebSockets with Optimistic Updates",
        },
        result: {
          ar: "تحسين إنتاجية الفريق بنسبة 25%",
          en: "Improved team productivity by 25%",
        },
        techs: ["React", "Node.js", "Socket.io", "PostgreSQL", "Express"],
        githubUrl: "https://github.com/example/task-manager",
        liveUrl: "",
        modes: ["tech", "hire"],
        featured: true,
        status: "published",
        order: 1,
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Projects seeded.");
  }

  // ---- Feedbacks ----
  const fbCount = await db.collection("feedbacks").countDocuments();
  if (fbCount === 0) {
    await db.collection("feedbacks").insertMany([
      {
        name: "Ahmed Hassan",
        roleOrCompany: "CTO, TechStartup",
        message: "شغل ممتاز والتسليم في الوقت المحدد. أنصح بالتعامل معاه.",
        status: "approved",
        locale: "ar",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Sarah Johnson",
        roleOrCompany: "Product Manager, DigitalCo",
        message: "Great attention to detail and excellent communication throughout the project.",
        status: "approved",
        locale: "en",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Test Pending",
        roleOrCompany: "",
        message: "This feedback is pending review.",
        status: "pending",
        locale: "en",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    console.log("Feedbacks seeded.");
  }

  console.log("\nSeed complete!");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
