// Field types supported by the dynamic editor
export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "image"
  | "gallery"
  | "number"
  | "boolean"
  | "select"
  | "repeater"
  | "link"
  | "list"
  | "object"
  | "color";

// A single field definition in a section schema
export interface FieldDefinition {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  defaultValue?: unknown;
  placeholder?: string;
  helpText?: string;
  // For select
  options?: { label: string; value: string }[];
  // For repeater / object
  fields?: FieldDefinition[];
  // For image
  accept?: string;
  // Validation
  min?: number;
  max?: number;
}

// Schema for a section type
export interface SectionSchema {
  key: string;
  label: string;
  description?: string;
  icon?: string;
  version: number;
  fields: FieldDefinition[];
  defaultData: Record<string, unknown>;
}

// Content types that mirror DB models
export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published";
  sortOrder: number;
  seo?: ContentPageSeo | null;
  sections?: ContentSection[];
  createdAt: string;
  updatedAt: string;
}

export interface ContentPageSeo {
  id: string;
  pageId: string;
  title: string;
  metaDescription: string;
  ogImage: string;
  noIndex: boolean;
}

export interface ContentSection {
  id: string;
  pageId: string;
  type: string;
  schemaKey: string;
  schemaVersion: number;
  label: string;
  sortOrder: number;
  visible: boolean;
  data: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface ContentMedia {
  id: string;
  url: string;
  filename: string;
  alt: string;
  mimeType: string;
  size: number;
  folder: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface ContentForm {
  id: string;
  name: string;
  slug: string;
  fields: FormFieldDef[];
  redirectUrl?: string;
  _count?: { leads: number };
  createdAt: string;
  updatedAt: string;
}

export interface FormFieldDef {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

export interface ContentLead {
  id: string;
  formId: string;
  values: Record<string, unknown>;
  status: "new" | "contacted" | "converted" | "archived";
  source: string;
  ip?: string;
  createdAt: string;
  form?: { name: string; slug: string };
}

export interface GlobalSettingsData {
  projectName: string;
  logo: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  socialLinks: { platform: string; url: string }[];
  themeTokens: Record<string, string>;
}

export interface DashboardStats {
  totalPages: number;
  totalSections: number;
  totalMedia: number;
  totalLeads: number;
  totalForms: number;
  recentLeads: ContentLead[];
}
