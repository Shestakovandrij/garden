"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS_BG =
  "https://images.pexels.com/photos/5504178/pexels-photo-5504178.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

const stats = [
  { value: "150+", label: "Zrealizowanych projektow" },
  { value: "8", label: "Lat doswiadczenia" },
  { value: "25 000", label: "m\u00B2 zalozonych trawnikow" },
  { value: "100%", label: "Zadowolonych klientow" },
];

function AnimatedStat({
  stat,
  index,
}: {
  stat: (typeof stats)[0];
  index: number;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-stat
      className="text-center p-8 rounded-3xl glass-dark group hover:bg-white/10 transition-all duration-500 cursor-default"
    >
      <div
        className={`text-4xl lg:text-5xl font-bold text-white mb-3 transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ transitionDelay: `${index * 100}ms` }}
      >
        {stat.value}
      </div>
      <div className="text-sm text-white/80 font-medium">
        {stat.label}
      </div>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Parallax background image
        if (bgRef.current) {
          gsap.to(bgRef.current, {
            y: 80,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
            },
          });
        }

        gsap.fromTo(
          "[data-stat]",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.12,
            ease: "power2.out",
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
      ref={sectionRef}
      className="relative py-24 lg:py-32 overflow-hidden"
    >
      {/* Parallax background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          ref={bgRef}
          src={STATS_BG}
          alt="Sciezka w zielonym ogrodzie"
          className="w-full h-[130%] object-cover -translate-y-[15%]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-dark/90" />
      </div>

      {/* Noise overlay */}
      <div className="absolute inset-0 noise" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent-light mb-4">
            <span className="w-8 h-px bg-accent/50" />
            W liczbach
            <span className="w-8 h-px bg-accent/50" />
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-3">
            GRUNDGARDEN w liczbach
          </h2>
          <p className="text-white/60 text-lg">
            Doswiadczenie, ktore przekladamy na efekty w Twoim ogrodzie.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => (
            <AnimatedStat key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
