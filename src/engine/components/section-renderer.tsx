"use client";

import { ComponentType } from "react";

export interface SectionRenderData {
  id: string;
  type: string;
  schemaKey: string;
  data: Record<string, unknown>;
  visible: boolean;
}

type SectionComponent = ComponentType<{ data: Record<string, unknown>; id: string }>;

// Registry of frontend components mapped by section type
const componentMap: Record<string, SectionComponent> = {};

/**
 * Register a frontend component for a section type.
 * Call this in your project to connect section types to actual React components.
 *
 * Example:
 *   registerSectionComponent("hero", HeroSection);
 *   registerSectionComponent("faq", FAQSection);
 */
export function registerSectionComponent(type: string, component: SectionComponent) {
  componentMap[type] = component;
}

/**
 * Fallback component shown when no component is registered for a section type
 */
function FallbackSection({ data, id }: { data: Record<string, unknown>; id: string }) {
  return (
    <section className="py-12 px-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl my-4">
      <div className="max-w-4xl mx-auto text-center text-gray-400">
        <p className="text-sm font-medium">Section: {id}</p>
        <p className="text-xs mt-1">No renderer registered for this section type</p>
        <pre className="text-xs mt-4 text-left bg-white p-4 rounded-lg overflow-auto max-h-40">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </section>
  );
}

/**
 * Renders a single section by looking up its component in the registry.
 */
export function SectionRenderer({ section }: { section: SectionRenderData }) {
  if (!section.visible) return null;

  const Component = componentMap[section.type] || componentMap[section.schemaKey] || FallbackSection;
  return <Component data={section.data} id={section.id} />;
}

/**
 * Renders a full page of sections.
 * Use this in your dynamic [slug] page.
 *
 * Example:
 *   <PageRenderer sections={page.sections} />
 */
export function PageRenderer({ sections }: { sections: SectionRenderData[] }) {
  return (
    <>
      {sections
        .filter((s) => s.visible)
        .map((section) => (
          <SectionRenderer key={section.id} section={section} />
        ))}
    </>
  );
}
