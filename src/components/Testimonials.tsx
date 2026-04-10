"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Profesjonalna ekipa, dokladna realizacja i swietny kontakt. Trawnik wygladal idealnie juz od pierwszego dnia. Polecam kazdemu!",
    name: "Marek Wisniewski",
    location: "Warszawa",
    initials: "MW",
    service: "Trawnik z rolki",
  },
  {
    quote:
      "Taras kompozytowy zrobiony na czas, z dbalosc o detale. Cala rodzina jest zachwycona efektem. GRUNDGARDEN to solidna firma.",
    name: "Anna Kowalska",
    location: "Krakow",
    initials: "AK",
    service: "Taras kompozytowy",
  },
  {
    quote:
      "Kompleksowy projekt ogrodu — od nawadniania po oswietlenie. Wszystko w jednym miejscu, zero stresu. Efekt przeszedl oczekiwania.",
    name: "Piotr Nowak",
    location: "Wroclaw",
    initials: "PN",
    service: "Kompleksowy ogrod",
  },
];

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setRevealed(true);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-testimonial-header]",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
            },
          }
        );
        gsap.fromTo(
          "[data-testimonial]",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: "[data-testimonial]",
              start: "top 85%",
            },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F8FAF9 0%, #EDF2EF 40%, #F8FAF9 100%)",
      }}
    >
      {/* Decorative */}
      <div className="absolute top-0 left-[20%] w-[600px] h-[600px] bg-primary/3 rounded-full blur-[180px]" />
      <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] bg-accent/3 rounded-full blur-[140px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div data-testimonial-header className="text-center mb-16">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
            <span className="w-10 h-px bg-accent" />
            Opinie klientow
            <span className="w-10 h-px bg-accent" />
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight mb-4">
            Co mowia <span className="text-gradient">nasi klienci</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-xl mx-auto">
            Setki zadowolonych klientow, ktorzy nam zaufali i polecaja nas
            dalej.
          </p>
        </div>

        {/* Desktop: cards grid */}
        <div className="hidden md:grid grid-cols-3 gap-7 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={i}
              data-testimonial
              className="relative p-7 lg:p-8 rounded-3xl bg-white border border-border/30 shadow-lg shadow-primary/3 hover:shadow-2xl hover:shadow-primary/8 transition-all duration-500 hover:-translate-y-2 group"
              style={!revealed ? { opacity: 1 } : undefined}
            >
              {/* Large quote mark */}
              <div className="absolute -top-3 -left-1 text-accent/10 pointer-events-none">
                <Quote size={64} strokeWidth={1} />
              </div>

              {/* Service tag */}
              <div className="mb-5">
                <span className="inline-flex px-3 py-1 rounded-lg bg-accent/8 text-xs font-semibold text-accent">
                  {t.service}
                </span>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className="fill-accent text-accent"
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-text leading-relaxed mb-7 text-[15px] font-medium relative z-10">
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3.5 pt-6 border-t border-border/40">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center shadow-md shadow-primary/15">
                  <span className="text-white text-sm font-bold">
                    {t.initials}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-text">{t.name}</p>
                  <p className="text-xs text-text-muted flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
                    {t.location}
                  </p>
                </div>
              </div>

              {/* Hover corner glow */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-accent/6 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Mobile: carousel */}
        <div className="md:hidden">
          <div
            data-testimonial
            className="relative p-7 rounded-3xl bg-white border border-border/30 shadow-lg shadow-primary/3"
            style={!revealed ? { opacity: 1 } : undefined}
          >
            {/* Service tag */}
            <div className="mb-5">
              <span className="inline-flex px-3 py-1 rounded-lg bg-accent/8 text-xs font-semibold text-accent">
                {testimonials[activeIndex].service}
              </span>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} size={16} className="fill-accent text-accent" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-text leading-relaxed mb-7 text-[15px] font-medium">
              &ldquo;{testimonials[activeIndex].quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3.5 pt-6 border-t border-border/40">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {testimonials[activeIndex].initials}
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-text">
                  {testimonials[activeIndex].name}
                </p>
                <p className="text-xs text-text-muted">
                  {testimonials[activeIndex].location}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={() =>
                setActiveIndex(
                  (activeIndex - 1 + testimonials.length) % testimonials.length
                )
              }
              className="w-10 h-10 rounded-xl bg-white border border-border/50 flex items-center justify-center hover:bg-surface transition-colors cursor-pointer"
              aria-label="Poprzednia opinia"
            >
              <ChevronLeft size={18} className="text-text-muted" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "w-8 bg-gradient-to-r from-primary to-accent"
                      : "w-2 bg-border"
                  }`}
                  aria-label={`Opinia ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() =>
                setActiveIndex((activeIndex + 1) % testimonials.length)
              }
              className="w-10 h-10 rounded-xl bg-white border border-border/50 flex items-center justify-center hover:bg-surface transition-colors cursor-pointer"
              aria-label="Nastepna opinia"
            >
              <ChevronRight size={18} className="text-text-muted" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
