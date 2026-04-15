"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, Quote } from "lucide-react";

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
  {
    quote:
      "Zamowilismy ogrodzenie i nawadnianie. Realizacja w terminie, ekipa rzetelna, efekt koncowy — wyzej niz oczekiwania. Na pewno wrociny!",
    name: "Katarzyna Zielinska",
    location: "Poznan",
    initials: "KZ",
    service: "Ogrodzenie + nawadnianie",
  },
  {
    quote:
      "Od lat szukalem firmy, ktora zrobi trawnik z prawdziwego zdarzenia. GRUNDGARDEN to wreszcie to — perfekcyjny efekt i uczciwa cena.",
    name: "Tomasz Lewandowski",
    location: "Gdansk",
    initials: "TL",
    service: "Trawnik z rolki",
  },
];

function TestimonialCard({
  t,
  isActive,
}: {
  t: (typeof testimonials)[0];
  isActive: boolean;
}) {
  return (
    <div
      className={`relative p-7 lg:p-8 rounded-3xl bg-white border transition-all duration-500 ${
        isActive
          ? "border-accent/20 shadow-2xl shadow-primary/10 scale-100"
          : "border-border/30 shadow-lg shadow-primary/3 scale-[0.92] opacity-50"
      }`}
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
          <Star key={s} size={16} className="fill-accent text-accent" />
        ))}
      </div>

      {/* Quote text */}
      <p className="text-text leading-relaxed mb-7 text-[15px] font-medium relative z-10">
        &ldquo;{t.quote}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3.5 pt-6 border-t border-border/40">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center shadow-md shadow-primary/15">
          <span className="text-white text-sm font-bold">{t.initials}</span>
        </div>
        <div>
          <p className="text-sm font-bold text-text">{t.name}</p>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-accent inline-block" />
            {t.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
      setActiveIndex(clamped);

      if (!sliderRef.current) return;
      const cards = sliderRef.current.querySelectorAll("[data-tcard]");
      if (!cards.length) return;

      // Animate the track position
      const cardWidth = (cards[0] as HTMLElement).offsetWidth;
      const gap = 28;
      const containerWidth = sliderRef.current.parentElement?.offsetWidth || 0;
      const offset =
        containerWidth / 2 - cardWidth / 2 - clamped * (cardWidth + gap);

      gsap.to(sliderRef.current, {
        x: offset,
        duration: 0.8,
        ease: "power3.out",
      });

      // Animate cards scale/opacity
      cards.forEach((card, i) => {
        const el = card as HTMLElement;
        const distance = Math.abs(i - clamped);
        gsap.to(el, {
          scale: distance === 0 ? 1 : 0.92 - distance * 0.03,
          opacity: distance === 0 ? 1 : Math.max(0.3, 0.5 - distance * 0.1),
          duration: 0.6,
          ease: "power2.out",
        });
      });
    },
    []
  );

  // Auto-play
  useEffect(() => {
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % testimonials.length;
        return next;
      });
    }, 4000);
    return () => clearInterval(autoPlayRef.current);
  }, []);

  // Trigger goTo when activeIndex changes
  useEffect(() => {
    goTo(activeIndex);
  }, [activeIndex, goTo]);

  // Initialize position
  useEffect(() => {
    const timer = setTimeout(() => goTo(0), 100);
    return () => clearTimeout(timer);
  }, [goTo]);

  // Drag/swipe support
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    clearInterval(autoPlayRef.current);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const diff = e.clientX - startX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && activeIndex < testimonials.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (diff > 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
    // Restart autoplay
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  };

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
        <div className="text-center mb-16">
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

        {/* GSAP slider */}
        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: "pan-y" }}
        >
          <div
            ref={sliderRef}
            className="flex gap-7"
            style={{ willChange: "transform" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                data-tcard
                className="flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[400px]"
                onClick={() => setActiveIndex(i)}
              >
                <TestimonialCard t={t} isActive={i === activeIndex} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation dots + progress */}
        <div className="flex items-center justify-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setActiveIndex(i);
                clearInterval(autoPlayRef.current);
                autoPlayRef.current = setInterval(() => {
                  setActiveIndex((prev) => (prev + 1) % testimonials.length);
                }, 4000);
              }}
              className={`relative h-2 rounded-full transition-all duration-500 cursor-pointer overflow-hidden ${
                i === activeIndex
                  ? "w-10 bg-primary/20"
                  : "w-2 bg-border hover:bg-primary/20"
              }`}
              aria-label={`Opinia ${i + 1}`}
            >
              {i === activeIndex && (
                <span
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{
                    animation: "fillDot 4s linear infinite",
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <style jsx>{`
          @keyframes fillDot {
            from {
              transform: scaleX(0);
              transform-origin: left;
            }
            to {
              transform: scaleX(1);
              transform-origin: left;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
