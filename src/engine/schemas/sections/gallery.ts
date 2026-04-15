import { SectionSchema } from "../../types";

export const gallerySchema: SectionSchema = {
  key: "gallery",
  label: "Gallery",
  description: "Image gallery or portfolio grid",
  icon: "Images",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "subheading", label: "Subheading", type: "textarea" },
    { key: "layout", label: "Layout", type: "select", options: [
      { label: "Grid", value: "grid" },
      { label: "Masonry", value: "masonry" },
      { label: "Carousel", value: "carousel" },
    ]},
    { key: "images", label: "Images", type: "repeater", fields: [
      { key: "src", label: "Image", type: "image", required: true },
      { key: "alt", label: "Alt Text", type: "text" },
      { key: "caption", label: "Caption", type: "text" },
    ]},
  ],
  defaultData: { heading: "", subheading: "", layout: "grid", images: [] },
};
