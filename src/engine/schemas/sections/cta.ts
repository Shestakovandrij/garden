import { SectionSchema } from "../../types";

export const ctaSchema: SectionSchema = {
  key: "cta",
  label: "Call to Action",
  description: "CTA block with heading, text, and button",
  icon: "MousePointerClick",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text", required: true },
    { key: "text", label: "Description", type: "textarea" },
    { key: "buttonText", label: "Button Text", type: "text", required: true },
    { key: "buttonUrl", label: "Button URL", type: "link" },
    { key: "backgroundImage", label: "Background Image", type: "image" },
    { key: "variant", label: "Style", type: "select", options: [
      { label: "Dark", value: "dark" },
      { label: "Light", value: "light" },
      { label: "Gradient", value: "gradient" },
    ]},
  ],
  defaultData: {
    heading: "Ready to get started?",
    text: "",
    buttonText: "Contact Us",
    buttonUrl: "#contact",
    backgroundImage: "",
    variant: "dark",
  },
};
