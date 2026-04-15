"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus, Minus } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    q: "Ile kosztuje zalozenie trawnika?",
    a: "Koszt zalezy od wielkosci dzialki i zakresu prac. Wyslij zapytanie — przygotujemy bezplatna wycene.",
  },
  {
    q: "Jak dlugo trwa realizacja?",
    a: "Standardowy projekt realizujemy w ustalonym terminie. Dokladny czas zalezy od zakresu — omawiamy go po ogledzinach.",
  },
  {
    q: "Czy moge zamowic tylko jedna usluge?",
    a: "Tak. Realizujemy zarowno kompleksowe projekty, jak i pojedyncze uslugi — np. sam trawnik lub samo oswietlenie.",
  },
  {
    q: "Czy udzielacie gwarancji na prace?",
    a: "Tak. Szczegoly gwarancji omawiamy indywidualnie przy kazdym projekcie.",
  },
  {
    q: "Jaki jest pierwszy krok?",
    a: "Wyslij krotki opis projektu przez formularz. Skontaktujemy sie, aby omowic szczegoly i umowic ogledziny.",
  },
];

function FAQItem({
  q,
  a,
  index,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        isOpen
          ? "border-primary/20 bg-primary/[0.02] shadow-md shadow-primary/5"
          : isHovered
          ? "border-primary/15 bg-primary/[0.01] shadow-sm shadow-primary/3 -translate-y-0.5"
          : "border-border/50 hover:border-primary/10"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 lg:p-6 text-left gap-4 cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <span
            className={`text-sm font-bold tabular-nums transition-colors duration-300 ${
              isOpen
                ? "text-accent"
                : isHovered
                ? "text-accent/70"
                : "text-text-muted"
            }`}
          >
            0{index + 1}
          </span>
          <span
            className={`font-semibold text-[15px] lg:text-base transition-colors duration-300 ${
              isOpen
                ? "text-primary"
                : isHovered
                ? "text-primary/80"
                : "text-text"
            }`}
          >
            {q}
          </span>
        </div>
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
            isOpen
              ? "bg-primary text-white rotate-0 scale-100"
              : isHovered
              ? "bg-primary/10 text-primary scale-110"
              : "bg-surface text-text-muted scale-100"
          }`}
        >
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </div>
      </button>
      <div
        style={{ height }}
        className="overflow-hidden transition-all duration-300 ease-out"
      >
        <div
          ref={contentRef}
          className="px-5 lg:px-6 pb-5 lg:pb-6 pl-14 lg:pl-16"
        >
          <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-faq-anim]", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-b from-white to-surface relative"
    >
      <div className="absolute top-0 right-[10%] w-[400px] h-[400px] bg-accent/3 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20">
          {/* Left — heading */}
          <div data-faq-anim className="lg:sticky lg:top-32 lg:self-start">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-8 h-px bg-accent" />
              FAQ
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight mb-4">
              Najczesciej
              <br />
              <span className="text-gradient">zadawane pytania</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed mb-8">
              Nie znalazles odpowiedzi? Napisz do nas — chetnie pomozemy.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 h-12 px-7 bg-gradient-to-r from-primary to-emerald text-white text-sm font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Wyslij zapytanie
            </a>
          </div>

          {/* Right — accordion */}
          <div data-faq-anim className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                q={faq.q}
                a={faq.a}
                index={i}
                isOpen={openIndex === i}
                onToggle={() =>
                  setOpenIndex(openIndex === i ? null : i)
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
