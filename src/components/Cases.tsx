"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin, ExternalLink } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const cases = [
  {
    label: "Zakladanie trawnika",
    desc: "Kompleksowe przygotowanie terenu, system nawadniania i profesjonalne zalozenie trawnika z rolki.",
    location: "Warszawa",
    area: "350 m²",
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
    area: "45 m²",
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
    area: "200 m²",
    duration: "10 dni",
    image:
      "https://images.pexels.com/photos/10831661/pexels-photo-10831661.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Kamienna sciezka prowadzaca przez kwitnacy ogrod",
    tag: "Ogrod",
  },
  {
    label: "Nowoczesne ogrodzenie",
    desc: "Ogrodzenie panelowe z automatyczna brama, podmurówka betonowa i slupki stalowe.",
    location: "Poznan",
    area: "120 mb",
    duration: "8 dni",
    image:
      "https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Nowoczesne ogrodzenie panelowe",
    tag: "Ogrodzenie",
  },
  {
    label: "System nawadniania",
    desc: "Automatyczny system nawadniania z czujnikami wilgotnosci, sterownikiem smart i 6 strefami podlewania.",
    location: "Gdansk",
    area: "500 m²",
    duration: "4 dni",
    image:
      "https://images.pexels.com/photos/27443421/pexels-photo-27443421.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Automatyczny system nawadniania ogrodu",
    tag: "Nawadnianie",
  },
  {
    label: "Oswietlenie ogrodowe LED",
    desc: "Kompleksowe oswietlenie sciezek, rabat i strefy wypoczynkowej — energooszczedne LED z czujnikiem zmierzchu.",
    location: "Lodz",
    area: "300 m²",
    duration: "3 dni",
    image:
      "https://images.pexels.com/photos/25286944/pexels-photo-25286944.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Oswietlenie ogrodowe LED wzdluz sciezki",
    tag: "Oswietlenie",
  },
  {
    label: "Rabaty kwiatowe i zywoploty",
    desc: "Wieloletnie nasadzenia, rabaty mieszane, zywoploty z bukszpanu i tui — zaprojektowane pod calorocny efekt.",
    location: "Katowice",
    area: "180 m²",
    duration: "6 dni",
    image:
      "https://images.pexels.com/photos/570041/pexels-photo-570041.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Kolorowe rabaty kwiatowe w ogrodzie",
    tag: "Nasadzenia",
  },
];

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const ctx = gsap.context(() => {
        // Calculate how far to scroll horizontally
        const getScrollDistance = () => {
          return track.scrollWidth - container.offsetWidth;
        };

        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${getScrollDistance()}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="realizacje"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #F8FAF9 0%, #EDF2EF 50%, #F8FAF9 100%)",
      }}
    >
      <div className="py-24 lg:py-32">
        {/* Section header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
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
        </div>

        {/* Horizontal scroll track */}
        <div ref={containerRef} className="overflow-hidden">
          <div
            ref={trackRef}
            className="flex gap-7 pl-6 lg:pl-[max(2rem,calc((100vw-80rem)/2+2rem))]"
            style={{ paddingRight: "4rem" }}
          >
            {cases.map((item, i) => (
              <div
                key={i}
                data-case-card
                className="group flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[32vw] xl:w-[28vw] rounded-3xl overflow-hidden bg-white border border-border/30 shadow-lg shadow-primary/3 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 cursor-pointer"
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
                      <span className="text-sm font-medium">
                        {item.location}
                      </span>
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
      </div>
    </section>
  );
}
