import { SectionSchema } from "../../types";

export const statsSchema: SectionSchema = {
  key: "stats",
  label: "Stats / Numbers",
  description: "Statistics section with animated counters",
  icon: "BarChart3",
  version: 1,
  fields: [
    { key: "heading", label: "Heading", type: "text" },
    { key: "backgroundImage", label: "Background Image", type: "image" },
    { key: "items", label: "Stats", type: "repeater", fields: [
      { key: "value", label: "Value", type: "text", required: true },
      { key: "suffix", label: "Suffix", type: "text", placeholder: "e.g. +, %, m²" },
      { key: "label", label: "Label", type: "text", required: true },
    ]},
  ],
  defaultData: { heading: "", backgroundImage: "", items: [] },
};
