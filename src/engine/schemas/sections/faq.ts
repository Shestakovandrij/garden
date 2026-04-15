import { SectionSchema } from "../../types";

export const faqSchema: SectionSchema = {
  key: "faq",
  label: "FAQ",
  description: "Frequently asked questions accordion",
  icon: "HelpCircle",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "items", label: "Questions", type: "repeater", fields: [
      { key: "question", label: "Question", type: "text", required: true },
      { key: "answer", label: "Answer", type: "textarea", required: true },
    ]},
  ],
  defaultData: { heading: "Frequently Asked Questions", subheading: "", items: [] },
};
