"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ── Service data — easy to add/remove/reorder ── */
const services = [
  {
    title: "Perfekcyjne trawniki",
    desc: "Zakladanie i renowacja trawnikow z rolki oraz z siewu. Profesjonalne przygotowanie podloza, system nawadniania i pielegnacja posadzieniowa.",
    image:
      "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Zielony zadbany trawnik z bliska",
  },
  {
    title: "Indywidualne projekty",
    desc: "Projekt ogrodu dopasowany do Twojej dzialki, stylu zycia i budzetu. Wizualizacje 3D, dobor roslin i plan realizacji.",
    image:
      "https://images.pexels.com/photos/465118/pexels-photo-465118.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Planowanie projektu ogrodu",
  },
  {
    title: "Systemy nawadniajace",
    desc: "Nowoczesne nawadnianie automatyczne, ktore dziala za Ciebie. Strefy, czujniki wilgotnosci, sterowniki smart.",
    image:
      "https://images.pexels.com/photos/27443421/pexels-photo-27443421.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Automatyczny system nawadniania",
  },
  {
    title: "Tarasy i nawierzchnie",
    desc: "Elegancka kostka brukowa, tarasy kompozytowe i drewniane. Trwale nawierzchnie, ktore sluza latami bez konserwacji.",
    image:
      "https://images.pexels.com/photos/7061672/pexels-photo-7061672.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Nowoczesny taras kompozytowy",
  },
  {
    title: "Oswietlenie ogrodowe",
    desc: "Funkcjonalne i dekoracyjne oswietlenie LED. Sciezki, akcentowanie roslin, strefa wypoczynkowa.",
    image:
      "https://images.pexels.com/photos/25286944/pexels-photo-25286944.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Oswietlenie sciezki ogrodowej",
  },
  {
    title: "Rabaty i nasadzenia",
    desc: "Przemyslane kompozycje roslinne, wieloletnie rabaty kwiatowe, zywoploty i donice betonowe.",
    image:
      "https://images.pexels.com/photos/570041/pexels-photo-570041.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Kolorowe rabaty kwiatowe",
  },
  {
    title: "Ogrodzenia",
    desc: "Solidne ogrodzenia panelowe, drewniane i gabionowe — dopasowane do architektury domu.",
    image:
      "https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Nowoczesne ogrodzenie",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  /* Scroll-triggered entrance */
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-service-header]",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
          }
        );
        gsap.fromTo(
          "[data-service-item]",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.out",
            scrollTrigger: { trigger: "[data-service-item]", start: "top 85%" },
          }
        );
        gsap.fromTo(
          "[data-service-preview]",
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: "[data-service-preview]",
              start: "top 85%",
            },
          }
        );
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  /* Animate preview image change */
  const handleServiceChange = (index: number) => {
    if (index === activeIndex || isAnimating) return;
    setIsAnimating(true);
    setPrevIndex(activeIndex);

    const preview = previewRef.current;
    if (!preview) {
      setActiveIndex(index);
      setIsAnimating(false);
      return;
    }

    const incoming = preview.querySelector("[data-img-incoming]") as HTMLElement;
    const outgoing = preview.querySelector("[data-img-outgoing]") as HTMLElement;

    if (incoming && outgoing) {
      // Set up incoming with new image
      setActiveIndex(index);

      gsap.set(incoming, { opacity: 0, scale: 1.05, y: 20 });
      gsap.set(outgoing, { opacity: 1, scale: 1, y: 0 });

      const tl = gsap.timeline({
        onComplete: () => {
          setPrevIndex(index);
          setIsAnimating(false);
        },
      });

      tl.to(outgoing, {
        opacity: 0,
        scale: 0.95,
        y: -15,
        duration: 0.35,
        ease: "power2.in",
      }).to(
        incoming,
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.15"
      );
    } else {
      setActiveIndex(index);
      setIsAnimating(false);
    }
  };

  const active = services[activeIndex];
  const prev = services[prevIndex];

  return (
    <section
      id="uslugi"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-white relative overflow-hidden"
    >
      {/* Decorative bg */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* ── Header row ── */}
        <div
          data-service-header
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14 lg:mb-20"
        >
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-10 h-px bg-accent" />
              Uslugi
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight">
              Kompleksowa realizacja
              <br />
              <span className="text-gradient">ogrodu marzen.</span>
            </h2>
          </div>
          <div className="max-w-sm">
            <p className="text-text-secondary text-base leading-relaxed mb-4">
              Od projektu po gotowy ogrod. Wszystko w jednym miejscu, bez
              szukania kolejnych podwykonawcow.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:text-emerald transition-colors group cursor-pointer"
            >
              Chcesz wycene?
              <ArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>

        {/* ── Two-column: list + preview ── */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Left — service list */}
          <div className="lg:w-[55%] xl:w-[50%]">
            <div className="divide-y divide-border/60">
              {services.map((service, i) => {
                const isActive = i === activeIndex;
                return (
                  <button
                    key={i}
                    data-service-item
                    onClick={() => handleServiceChange(i)}
                    onMouseEnter={() => handleServiceChange(i)}
                    onFocus={() => handleServiceChange(i)}
                    className={`w-full text-left py-5 lg:py-6 flex items-start gap-4 lg:gap-6 group transition-all duration-300 cursor-pointer ${
                      isActive ? "opacity-100" : "opacity-50 hover:opacity-80"
                    }`}
                    aria-current={isActive ? "true" : undefined}
                  >
                    {/* Number */}
                    <span
                      className={`text-xs font-semibold tabular-nums mt-2 transition-colors duration-300 ${
                        isActive ? "text-accent" : "text-text-muted"
                      }`}
                    >
                      ({String(i + 1).padStart(2, "0")})
                    </span>

                    {/* Title + desc */}
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`text-2xl sm:text-3xl lg:text-[2.5rem] font-bold tracking-tight leading-[1.1] transition-colors duration-300 ${
                          isActive ? "text-text" : "text-text/60"
                        }`}
                      >
                        {service.title}
                      </h3>

                      {/* Description — visible only when active */}
                      <div
                        className={`overflow-hidden transition-all duration-400 ease-out ${
                          isActive
                            ? "max-h-24 opacity-100 mt-3"
                            : "max-h-0 opacity-0 mt-0"
                        }`}
                      >
                        <p className="text-text-secondary text-sm leading-relaxed max-w-md">
                          {service.desc}
                        </p>
                      </div>
                    </div>

                    {/* Arrow — active only */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-primary to-emerald text-white scale-100"
                          : "bg-transparent text-transparent scale-75"
                      }`}
                    >
                      <ArrowUpRight size={18} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right — preview */}
          <div
            className="lg:w-[45%] xl:w-[50%] lg:sticky lg:top-28 lg:self-start"
            data-service-preview
          >
            <div
              ref={previewRef}
              className="relative rounded-3xl overflow-hidden aspect-[4/3] lg:aspect-[3/4] xl:aspect-[4/5] bg-surface-alt"
            >
              {/* Outgoing (previous) image */}
              <img
                data-img-outgoing
                src={prev.image}
                alt={prev.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Incoming (active) image */}
              <img
                data-img-incoming
                src={active.image}
                alt={active.alt}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Bottom gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-dark/10 to-transparent" />

              {/* Active service info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-sm text-xs font-semibold text-white/90 mb-3">
                      ({String(activeIndex + 1).padStart(2, "0")}) Usluga
                    </span>
                    <h4 className="text-xl lg:text-2xl font-bold text-white">
                      {active.title}
                    </h4>
                  </div>
                  <a
                    href="#kontakt"
                    className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/15 flex items-center justify-center hover:bg-accent hover:border-accent transition-all duration-300 cursor-pointer flex-shrink-0"
                    aria-label={`Zapytaj o ${active.title}`}
                  >
                    <ArrowUpRight size={20} className="text-white" />
                  </a>
                </div>
              </div>

              {/* Accent top line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent" />
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
              {services.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleServiceChange(i)}
                  className={`relative flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-xl overflow-hidden transition-all duration-300 cursor-pointer ${
                    i === activeIndex
                      ? "ring-2 ring-accent ring-offset-2 ring-offset-white opacity-100"
                      : "opacity-40 hover:opacity-70"
                  }`}
                  aria-label={s.title}
                >
                  <img
                    src={s.image}
                    alt={s.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
