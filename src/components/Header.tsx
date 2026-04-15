"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import gsap from "gsap";

const NAV_LINKS = [
  { href: "#uslugi", label: "Usługi" },
  { href: "#realizacje", label: "Realizacje" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);

      // Hide on scroll down, show on scroll up (only after 80px)
      if (y > 80) {
        setHidden(y > lastScrollY.current && y - lastScrollY.current > 5);
      } else {
        setHidden(false);
      }
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Animate inner elements when menu opens
  useEffect(() => {
    if (!open || !navRef.current) return;

    const links = navRef.current.querySelectorAll("[data-menu-link]");
    const dividers = navRef.current.querySelectorAll("[data-menu-divider]");
    const cta = navRef.current.querySelector("[data-menu-cta]");

    gsap.fromTo(
      links,
      { opacity: 0, filter: "blur(12px)", y: 30 },
      {
        opacity: 1,
        filter: "blur(0px)",
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.1,
        delay: 0.3,
      }
    );

    if (dividers.length) {
      gsap.fromTo(
        dividers,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.08,
          delay: 0.4,
        }
      );
    }

    if (cta) {
      gsap.fromTo(
        cta,
        { opacity: 0, filter: "blur(10px)", y: 20 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.6,
        }
      );
    }
  }, [open]);

  return (
    <>
      <header
        className={`fixed z-50 top-3 left-4 right-4 rounded-2xl transition-all duration-400 ${
          hidden && !open
            ? "-translate-y-[calc(100%+1rem)] opacity-0"
            : "translate-y-0 opacity-100"
        } ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 border border-border/30"
            : "bg-white/90 backdrop-blur-sm shadow-md shadow-black/3 border border-border/20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-text">
                GRUND<span className="text-accent">GARDEN</span>
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-primary transition-colors duration-200 rounded-lg hover:bg-primary/5 cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#kontakt"
                className="ml-3 inline-flex items-center gap-2 h-10 px-6 bg-gradient-to-r from-primary to-emerald text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                Wyślij zapytanie
                <ArrowRight size={15} />
              </a>
            </nav>

            <button
              onClick={() => setOpen(true)}
              className="md:hidden p-2.5 text-text rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
              aria-label="Menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[100] bg-[#0A1F12] flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
          open ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div className="relative z-10 px-6 pt-5 pb-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              GRUND<span className="text-accent">GARDEN</span>
            </span>
          </a>
          <button
            onClick={() => setOpen(false)}
            className="p-2.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Zamknij menu"
          >
            <X size={22} />
          </button>
        </div>

        <nav ref={navRef} className="flex-1 flex flex-col justify-center px-8 -mt-16">
          {NAV_LINKS.map((link, i) => (
            <div key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                data-menu-link
                className="block text-[2.5rem] leading-tight font-bold text-white py-5 cursor-pointer hover:text-accent transition-colors duration-300"
              >
                {link.label}
              </a>
              {i < NAV_LINKS.length - 1 && (
                <div
                  data-menu-divider
                  className="h-px bg-white/10 origin-left"
                />
              )}
            </div>
          ))}

          <div data-menu-cta className="mt-10">
            <a
              href="#kontakt"
              onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center gap-3 w-full h-16 bg-gradient-to-r from-primary to-emerald text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary/30 cursor-pointer hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
            >
              Wyślij zapytanie
              <ArrowRight size={20} />
            </a>
          </div>
        </nav>

        <div className="px-8 pb-8">
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} GrundGarden
          </p>
        </div>
      </div>
    </>
  );
}
