import { SectionSchema } from "../../types";

export const servicesGridSchema: SectionSchema = {
  key: "servicesGrid",
  label: "Services Grid",
  description: "Grid of services/features with icons and descriptions",
  icon: "LayoutGrid",
  version: 1,
  fields: [
    { key: "badge", label: "Badge", type: "text" },
    { key: "heading", label: "Heading", type: "text", required: true },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "columns", label: "Columns", type: "select", options: [
      { label: "2 Columns", value: "2" },
      { label: "3 Columns", value: "3" },
      { label: "4 Columns", value: "4" },
    ]},
    { key: "items", label: "Service Items", type: "repeater", fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "icon", label: "Icon", type: "text" },
      { key: "image", label: "Image", type: "image" },
      { key: "link", label: "Link", type: "link" },
    ]},
  ],
  defaultData: {
    badge: "",
    heading: "Our Services",
    subheading: "",
    columns: "3",
    items: [],
  },
};
