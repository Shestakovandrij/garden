import { SectionSchema } from "../../types";

export const contactFormSchema: SectionSchema = {
  key: "contactForm",
  label: "Contact Form",
  description: "Embeddable contact/lead form section",
  icon: "Mail",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "formSlug", label: "Form Slug (from Forms)", type: "text", required: true, helpText: "Must match a form slug defined in Forms section" },
    { key: "successMessage", label: "Success Message", type: "text", defaultValue: "Thank you! We will contact you soon." },
  ],
  defaultData: {
    heading: "Contact Us",
    subheading: "",
    formSlug: "contact",
    successMessage: "Thank you! We will contact you soon.",
  },
};
