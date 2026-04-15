import { FieldType } from "../types";

export interface FieldTypeMeta {
  type: FieldType;
  label: string;
  icon: string;
  supportsDefault: boolean;
}

export const FIELD_TYPE_META: Record<FieldType, FieldTypeMeta> = {
  text: { type: "text", label: "Text", icon: "Type", supportsDefault: true },
  textarea: { type: "textarea", label: "Text Area", icon: "AlignLeft", supportsDefault: true },
  richtext: { type: "richtext", label: "Rich Text", icon: "FileText", supportsDefault: true },
  image: { type: "image", label: "Image", icon: "Image", supportsDefault: true },
  gallery: { type: "gallery", label: "Gallery", icon: "Images", supportsDefault: false },
  number: { type: "number", label: "Number", icon: "Hash", supportsDefault: true },
  boolean: { type: "boolean", label: "Toggle", icon: "ToggleLeft", supportsDefault: true },
  select: { type: "select", label: "Select", icon: "ChevronDown", supportsDefault: true },
  repeater: { type: "repeater", label: "Repeater", icon: "List", supportsDefault: false },
  link: { type: "link", label: "Link", icon: "Link", supportsDefault: true },
  list: { type: "list", label: "String List", icon: "ListOrdered", supportsDefault: false },
  object: { type: "object", label: "Object", icon: "Braces", supportsDefault: false },
  color: { type: "color", label: "Color", icon: "Palette", supportsDefault: true },
};
