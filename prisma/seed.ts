import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user from env vars (not hardcoded)
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: {},
    create: {
      email: ADMIN_EMAIL,
      password: passwordHash,
      name: "Admin",
      role: "admin",
    },
  });
  console.log("✅ Admin user:", admin.email);

  // Create a sample page
  const homePage = await prisma.page.upsert({
    where: { slug: "home" },
    update: {},
    create: {
      slug: "home",
      title: "Home",
      status: "published",
      sortOrder: 0,
      seo: {
        create: {
          title: "Home — My Website",
          metaDescription: "Welcome to our website",
        },
      },
    },
  });
  console.log("✅ Page:", homePage.title);

  // Create sample sections
  const sectionsData = [
    {
      type: "hero",
      schemaKey: "hero",
      label: "Hero Section",
      sortOrder: 0,
      data: {
        badge: "Welcome",
        heading: "Build Something Amazing",
        subheading: "We create beautiful solutions for your business",
        backgroundImage: "",
        cta: [
          { text: "Get Started", url: "#contact", variant: "primary" },
          { text: "Learn More", url: "#services", variant: "secondary" },
        ],
        trustItems: [
          { icon: "Shield", text: "Trusted by 100+" },
          { icon: "Clock", text: "Fast delivery" },
        ],
      },
    },
    {
      type: "servicesGrid",
      schemaKey: "servicesGrid",
      label: "Our Services",
      sortOrder: 1,
      data: {
        badge: "Services",
        heading: "What We Do",
        subheading: "Professional solutions tailored to your needs",
        columns: "3",
        items: [
          { title: "Service One", description: "Description of service one", icon: "Star", image: "", link: "" },
          { title: "Service Two", description: "Description of service two", icon: "Heart", image: "", link: "" },
          { title: "Service Three", description: "Description of service three", icon: "Zap", image: "", link: "" },
        ],
      },
    },
    {
      type: "faq",
      schemaKey: "faq",
      label: "FAQ",
      sortOrder: 2,
      data: {
        heading: "Frequently Asked Questions",
        subheading: "",
        items: [
          { question: "How does it work?", answer: "It works by following a simple process." },
          { question: "How much does it cost?", answer: "Contact us for a free quote." },
        ],
      },
    },
    {
      type: "cta",
      schemaKey: "cta",
      label: "Final CTA",
      sortOrder: 3,
      data: {
        heading: "Ready to get started?",
        text: "Contact us today for a free consultation",
        buttonText: "Contact Us",
        buttonUrl: "#contact",
        backgroundImage: "",
        variant: "dark",
      },
    },
  ];

  for (const s of sectionsData) {
    await prisma.section.create({
      data: { pageId: homePage.id, ...s, data: s.data as object },
    });
  }
  console.log("✅ Sections created:", sectionsData.length);

  // Create a contact form
  const form = await prisma.form.upsert({
    where: { slug: "contact" },
    update: {},
    create: {
      name: "Contact Form",
      slug: "contact",
      fields: [
        { name: "name", label: "Name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "tel" },
        { name: "message", label: "Message", type: "textarea" },
      ] as object,
    },
  });
  console.log("✅ Form:", form.name);

  // Create sample lead
  await prisma.lead.create({
    data: {
      formId: form.id,
      values: { name: "John Doe", email: "john@example.com", message: "Hello!" } as object,
      source: "website",
    },
  });
  console.log("✅ Sample lead created");

  // Global settings
  await prisma.globalSettings.upsert({
    where: { key: "general" },
    update: {},
    create: {
      key: "general",
      value: {
        projectName: "My Website",
        logo: "",
        contactEmail: "hello@example.com",
        contactPhone: "+1 234 567 890",
        address: "",
      } as object,
    },
  });
  console.log("✅ Settings created");

  console.log("\n🎉 Seed complete!");
  console.log(`📧 Login: ${ADMIN_EMAIL}`);
  console.log("🔑 Password: (from ADMIN_PASSWORD env or default)");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
