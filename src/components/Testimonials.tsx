"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

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

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <div className="relative p-7 lg:p-8 rounded-3xl bg-white border border-border/30">
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
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center">
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
  const [activeIndex, setActiveIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const goTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, testimonials.length - 1));
    setActiveIndex(clamped);

    const track = trackRef.current;
    if (!track) return;

    const card = track.children[0] as HTMLElement;
    if (!card) return;

    const cardWidth = card.offsetWidth;
    const gap = 20;
    const containerWidth = track.parentElement?.offsetWidth || 0;
    const offset = containerWidth / 2 - cardWidth / 2 - clamped * (cardWidth + gap);

    track.style.transition = "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)";
    track.style.transform = `translateX(${offset}px)`;
  }, []);

  const startAutoPlay = useCallback(() => {
    clearInterval(autoPlayRef.current);
    autoPlayRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % testimonials.length;
        return next;
      });
    }, 4000);
  }, []);

  // Auto-play
  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(autoPlayRef.current);
  }, [startAutoPlay]);

  // Sync track position when activeIndex changes
  useEffect(() => {
    goTo(activeIndex);
  }, [activeIndex, goTo]);

  // Initialize position after mount
  useEffect(() => {
    const timer = setTimeout(() => goTo(0), 50);
    return () => clearTimeout(timer);
  }, [goTo]);

  // Swipe support
  const touchStartX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    clearInterval(autoPlayRef.current);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(diff) > 50) {
      if (diff < 0 && activeIndex < testimonials.length - 1) {
        setActiveIndex(activeIndex + 1);
      } else if (diff > 0 && activeIndex > 0) {
        setActiveIndex(activeIndex - 1);
      }
    }
    startAutoPlay();
  };

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden bg-[#f3f6f4]">
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

        {/* CSS slider — no GSAP on cards */}
        <div
          className="overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={trackRef}
            className="flex gap-5"
            style={{ willChange: "transform" }}
          >
            {testimonials.map((t, i) => (
              <div
                key={i}
                className={`flex-shrink-0 w-[85vw] sm:w-[70vw] md:w-[50vw] lg:w-[400px] transition-all duration-500 cursor-pointer ${
                  i === activeIndex
                    ? "scale-100 opacity-100"
                    : "scale-[0.93] opacity-40"
                }`}
                onClick={() => {
                  setActiveIndex(i);
                  startAutoPlay();
                }}
              >
                <TestimonialCard t={t} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={() => {
              setActiveIndex(Math.max(0, activeIndex - 1));
              startAutoPlay();
            }}
            className="w-10 h-10 rounded-xl bg-white border border-border/50 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            aria-label="Poprzednia opinia"
          >
            <ChevronLeft size={18} className="text-text-muted" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveIndex(i);
                  startAutoPlay();
                }}
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
            onClick={() => {
              setActiveIndex(Math.min(testimonials.length - 1, activeIndex + 1));
              startAutoPlay();
            }}
            className="w-10 h-10 rounded-xl bg-white border border-border/50 flex items-center justify-center cursor-pointer active:scale-95 transition-transform"
            aria-label="Nastepna opinia"
          >
            <ChevronRight size={18} className="text-text-muted" />
          </button>
        </div>
      </div>
    </section>
  );
}
