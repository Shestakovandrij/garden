"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cases = [
  {
    label: "Zakladanie trawnika",
    desc: "Kompleksowe przygotowanie terenu, system nawadniania i profesjonalne zalozenie trawnika z rolki.",
    location: "Warszawa",
    area: "350 m\u00B2",
    duration: "5 dni",
    image:
      "https://images.pexels.com/photos/7546775/pexels-photo-7546775.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Zadbany trawnik przy domu po realizacji GRUNDGARDEN",
    tag: "Trawnik",
  },
  {
    label: "Taras kompozytowy z meblami",
    desc: "Budowa tarasu z desek kompozytowych, montaz oswietlenia LED i aranzacja strefy wypoczynkowej.",
    location: "Krakow",
    area: "45 m\u00B2",
    duration: "7 dni",
    image:
      "https://images.pexels.com/photos/17418139/pexels-photo-17418139.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Nowoczesny taras z drewnianymi meblami ogrodowymi",
    tag: "Taras",
  },
  {
    label: "Sciezka ogrodowa i nasadzenia",
    desc: "Kamienna sciezka, dobor roslin wieloletnich, automatyczne nawadnianie i oswietlenie niskie.",
    location: "Wroclaw",
    area: "200 m\u00B2",
    duration: "10 dni",
    image:
      "https://images.pexels.com/photos/10831661/pexels-photo-10831661.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Kamienna sciezka prowadzaca przez kwitnacy ogrod",
    tag: "Ogrod",
  },
];

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Reveal content immediately for visibility
    setRevealed(true);

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.fromTo(
          "[data-case-card]",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
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
      id="realizacje"
      ref={sectionRef}
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: "linear-gradient(180deg, #F8FAF9 0%, #EDF2EF 50%, #F8FAF9 100%)" }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/4 rounded-full blur-[180px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-10 h-px bg-accent" />
              Realizacje
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight mb-4">
              Efekty mowia{" "}
              <span className="text-gradient">same za siebie</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Zobacz wybrane projekty, ktore zrealizowalismy. Kazdy ogrod to
              indywidualne podejscie i dbalosc o szczegoly.
            </p>
          </div>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-emerald transition-colors whitespace-nowrap group cursor-pointer"
          >
            Chcesz podobny efekt?
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Cases grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {cases.map((item, i) => (
            <div
              key={i}
              data-case-card
              className="group rounded-3xl overflow-hidden bg-white border border-border/30 shadow-lg shadow-primary/3 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              style={!revealed ? { opacity: 1 } : undefined}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-dark/10 to-transparent" />

                {/* Tag */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md text-xs font-bold text-primary shadow-sm">
                    {item.tag}
                  </span>
                </div>

                {/* Hover overlay with arrow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center scale-50 group-hover:scale-100 transition-transform duration-400">
                    <ExternalLink size={22} className="text-white" />
                  </div>
                </div>

                {/* Bottom stats */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <span className="px-3 py-1 rounded-lg bg-dark/60 backdrop-blur-sm text-white text-xs font-medium">
                    {item.area}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-dark/60 backdrop-blur-sm text-white text-xs font-medium">
                    {item.duration}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-bold text-text text-lg mb-2 group-hover:text-primary transition-colors duration-300">
                  {item.label}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <MapPin size={14} className="text-accent" />
                    <span className="text-sm font-medium">{item.location}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1">
                    Szczegoly
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
