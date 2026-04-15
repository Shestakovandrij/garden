import { SectionSchema } from "../../types";

export const richTextSchema: SectionSchema = {
  key: "richText",
  label: "Rich Text",
  description: "Free-form rich text content block",
  icon: "FileText",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "content", label: "Content", type: "richtext", required: true },
    { key: "alignment", label: "Alignment", type: "select", options: [
      { label: "Left", value: "left" },
      { label: "Center", value: "center" },
      { label: "Right", value: "right" },
    ]},
  ],
  defaultData: { heading: "", content: "", alignment: "left" },
};
