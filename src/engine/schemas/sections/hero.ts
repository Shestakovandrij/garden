import { SectionSchema } from "../../types";

export const heroSchema: SectionSchema = {
  key: "hero",
  label: "Hero",
  description: "Main hero section with heading, subheading, CTA, and background image",
  icon: "Sparkles",
  version: 1,
  fields: [
    { key: "badge", label: "Badge Text", type: "text", placeholder: "e.g. Welcome" },
    { key: "heading", label: "Heading", type: "text", required: true, placeholder: "Main headline" },
    { key: "subheading", label: "Subheading", type: "textarea", placeholder: "Supporting text" },
    { key: "backgroundImage", label: "Background Image", type: "image" },
    { key: "cta", label: "CTA Buttons", type: "repeater", fields: [
      { key: "text", label: "Button Text", type: "text", required: true },
      { key: "url", label: "Button URL", type: "link" },
      { key: "variant", label: "Variant", type: "select", options: [
        { label: "Primary", value: "primary" },
        { label: "Secondary", value: "secondary" },
        { label: "Outline", value: "outline" },
      ]},
    ]},
    { key: "trustItems", label: "Trust Indicators", type: "repeater", fields: [
      { key: "icon", label: "Icon Name", type: "text" },
      { key: "text", label: "Text", type: "text" },
    ]},
  ],
  defaultData: {
    badge: "",
    heading: "Your Headline Here",
    subheading: "Supporting description text",
    backgroundImage: "",
    cta: [{ text: "Get Started", url: "#contact", variant: "primary" }],
    trustItems: [],
  },
};
