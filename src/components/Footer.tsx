"use client";

import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CTA_BG =
  "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80";

export default function Footer() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        if (bgRef.current) {
          gsap.to(bgRef.current, {
            y: 60,
            ease: "none",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.3,
            },
          });
        }
      }, ctaRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <footer>
      {/* CTA strip with parallax background */}
      <div ref={ctaRef} className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <img
            ref={bgRef}
            src={CTA_BG}
            alt="Piekny ogrod z trawnikiem"
            className="w-full h-[140%] object-cover -translate-y-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-dark/85 via-primary/75 to-dark/85" />
          <div className="absolute inset-0 noise" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6">
              <Sparkles size={14} className="text-accent" />
              <span className="text-sm font-medium text-white/90">
                Bezplatna wycena
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight text-white mb-4">
              Gotowy na ogrod,
              <br />
              ktory robi wrazenie?
            </h2>
            <p className="text-white/60 text-lg mb-8">
              Wypelnij krotki quiz — przygotujemy wycene dopasowana do Twoich
              potrzeb.
            </p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2.5 h-14 px-10 bg-gradient-to-r from-accent to-accent/80 text-white font-semibold rounded-2xl hover:shadow-xl hover:shadow-accent/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Wyslij zapytanie
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="bg-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-emerald rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs">G</span>
            </div>
            <span className="text-sm font-semibold text-white/80">
              GRUND<span className="text-accent/70">GARDEN</span>
            </span>
          </div>
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} GRUNDGARDEN. Wszelkie prawa
            zastrzezone.
          </p>
        </div>
      </div>
    </footer>
  );
}
