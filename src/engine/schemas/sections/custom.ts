import { SectionSchema } from "../../types";

export const customSchema: SectionSchema = {
  key: "custom",
  label: "Custom Block",
  description: "Free-form JSON data block for custom frontend rendering",
  icon: "Code",
  version: 1,
  fields: [
    { key: "componentName", label: "Component Name", type: "text", required: true, helpText: "Frontend component to render this block" },
    { key: "heading", label: "Heading", type: "text" },
    { key: "content", label: "Content (JSON)", type: "textarea", helpText: "Raw JSON data for the component" },
  ],
  defaultData: { componentName: "", heading: "", content: "{}" },
};
