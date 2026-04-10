"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    title: "Perfekcyjne trawniki",
    desc: "Zakladanie i renowacja trawnikow z dbalosc o kazdy detal.",
    image:
      "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Zielony zadbany trawnik z bliska",
  },
  {
    title: "Indywidualne projekty",
    desc: "Projekt ogrodu dopasowany do Twojej dzialki i stylu zycia.",
    image:
      "https://images.pexels.com/photos/465118/pexels-photo-465118.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Planowanie projektu ogrodu nad rysunkami technicznymi",
  },
  {
    title: "Systemy nawadniajace",
    desc: "Nowoczesne nawadnianie, ktore dziala za Ciebie.",
    image:
      "https://images.pexels.com/photos/27443421/pexels-photo-27443421.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Automatyczny system nawadniania trawnika",
  },
  {
    title: "Tarasy i kostka brukowa",
    desc: "Eleganckie nawierzchnie, ktore sluza latami.",
    image:
      "https://images.pexels.com/photos/17366761/pexels-photo-17366761.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Elegancka kostka brukowa ulozona w ogrodzie",
  },
  {
    title: "Tarasy kompozytowe",
    desc: "Trwale tarasy bez corocznej konserwacji.",
    image:
      "https://images.pexels.com/photos/7061672/pexels-photo-7061672.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Nowoczesny taras kompozytowy przy domu",
  },
  {
    title: "Oswietlenie ogrodowe",
    desc: "Funkcjonalne swiatlo, ktore podkresla charakter ogrodu.",
    image:
      "https://images.pexels.com/photos/25286944/pexels-photo-25286944.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Oswietlenie sciezki ogrodowej wieczorem",
  },
  {
    title: "Rabaty i nasadzenia",
    desc: "Przemyslane kompozycje roslinne i donice betonowe.",
    image:
      "https://images.pexels.com/photos/570041/pexels-photo-570041.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Kolorowe rabaty kwiatowe w zaprojektowanym ogrodzie",
  },
  {
    title: "Ogrodzenia",
    desc: "Solidne ogrodzenia dopasowane do architektury domu.",
    image:
      "https://images.pexels.com/photos/2736834/pexels-photo-2736834.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Nowoczesne ogrodzenie przy domu z ogrodem",
  },
  {
    title: "Domki narzedziowe",
    desc: "Estetyczne i praktyczne rozwiazania do przechowywania.",
    image:
      "https://images.pexels.com/photos/2048397/pexels-photo-2048397.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Drewniany domek narzedziowy w ogrodzie",
  },
  {
    title: "Kosiarki automatyczne",
    desc: "Automatyczne koszenie bez Twojego udzialu.",
    image:
      "https://images.pexels.com/photos/4162011/pexels-photo-4162011.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Kosiarka na zielonym trawniku",
  },
];

function ServiceCard({
  service,
  size,
}: {
  service: (typeof services)[0];
  size: "lg" | "md" | "sm";
}) {
  const heights = { lg: "h-80 md:h-96", md: "h-72", sm: "h-64" };
  const titleSize = {
    lg: "text-xl lg:text-2xl",
    md: "text-lg lg:text-xl",
    sm: "text-base",
  };

  return (
    <div
      data-service-card
      className={`group relative rounded-3xl overflow-hidden ${heights[size]} cursor-pointer`}
    >
      <img
        src={service.image}
        alt={service.alt}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        loading="lazy"
      />
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-7">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3
              className={`${titleSize[size]} font-bold text-white mb-1.5 transition-transform duration-300 group-hover:translate-x-1`}
            >
              {service.title}
            </h3>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              {service.desc}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <ArrowUpRight size={18} className="text-white" />
          </div>
        </div>
      </div>

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/50 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-service-header]", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        });

        gsap.from("[data-service-card]", {
          y: 40,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: {
            trigger: "[data-service-card]",
            start: "top 85%",
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="uslugi" ref={sectionRef} className="py-24 lg:py-32 bg-white relative">
      {/* Subtle bg accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section header */}
        <div
          data-service-header
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16"
        >
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-8 h-px bg-accent" />
              Uslugi
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight mb-4">
              Kompleksowa realizacja
              <br />
              <span className="text-gradient">ogrodu marzen</span>
            </h2>
            <p className="text-text-secondary text-lg leading-relaxed">
              Od projektu po gotowy ogrod. Wszystko w jednym miejscu, bez
              szukania kolejnych podwykonawcow.
            </p>
          </div>
          <a
            href="#kontakt"
            className="inline-flex items-center gap-2 text-primary font-semibold hover:text-emerald transition-colors whitespace-nowrap group cursor-pointer"
          >
            Chcesz wycene? Napisz do nas
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Bento grid — row 1: 2 large */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {services.slice(0, 2).map((service) => (
            <ServiceCard key={service.title} service={service} size="lg" />
          ))}
        </div>

        {/* Bento grid — row 2: 3 medium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          {services.slice(2, 5).map((service) => (
            <ServiceCard key={service.title} service={service} size="md" />
          ))}
        </div>

        {/* Bento grid — row 3: 5 compact */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {services.slice(5).map((service) => (
            <ServiceCard key={service.title} service={service} size="sm" />
          ))}
        </div>
      </div>
    </section>
  );
}
