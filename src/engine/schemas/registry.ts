import { SectionSchema } from "../types";
import { heroSchema } from "./sections/hero";
import { richTextSchema } from "./sections/rich-text";
import { servicesGridSchema } from "./sections/services-grid";
import { gallerySchema } from "./sections/gallery";
import { testimonialsSchema } from "./sections/testimonials";
import { faqSchema } from "./sections/faq";
import { statsSchema } from "./sections/stats";
import { ctaSchema } from "./sections/cta";
import { contactFormSchema } from "./sections/contact-form";
import { customSchema } from "./sections/custom";

class SchemaRegistry {
  private schemas: Map<string, SectionSchema> = new Map();

  register(schema: SectionSchema) {
    this.schemas.set(schema.key, schema);
  }

  get(key: string): SectionSchema | undefined {
    return this.schemas.get(key);
  }

  getAll(): SectionSchema[] {
    return Array.from(this.schemas.values());
  }

  keys(): string[] {
    return Array.from(this.schemas.keys());
  }

  has(key: string): boolean {
    return this.schemas.has(key);
  }
}

// Singleton instance
const registry = new SchemaRegistry();

// Register built-in schemas
registry.register(heroSchema);
registry.register(richTextSchema);
registry.register(servicesGridSchema);
registry.register(gallerySchema);
registry.register(testimonialsSchema);
registry.register(faqSchema);
registry.register(statsSchema);
registry.register(ctaSchema);
registry.register(contactFormSchema);
registry.register(customSchema);

export { registry };
export type { SchemaRegistry };
