import { SectionSchema } from "../../types";

export const testimonialsSchema: SectionSchema = {
  key: "testimonials",
  label: "Testimonials",
  description: "Customer reviews and testimonials",
  icon: "Quote",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "items", label: "Testimonials", type: "repeater", fields: [
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "name", label: "Author Name", type: "text", required: true },
      { key: "role", label: "Role / Location", type: "text" },
      { key: "avatar", label: "Avatar", type: "image" },
      { key: "rating", label: "Rating (1-5)", type: "number", min: 1, max: 5 },
    ]},
  ],
  defaultData: { heading: "What Our Clients Say", subheading: "", items: [] },
};
