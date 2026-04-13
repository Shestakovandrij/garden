"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const NAV_LINKS = [
  { href: "#uslugi", label: "Usługi" },
  { href: "#realizacje", label: "Realizacje" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const splitRefs = useRef<SplitText[]>([]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const animateOpen = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Kill previous timeline
    tlRef.current?.kill();
    splitRefs.current.forEach((s) => s.revert());
    splitRefs.current = [];

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Slide overlay from right
    tl.fromTo(
      overlay,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.6, ease: "power3.inOut" }
    );

    // Animate header inside overlay
    const header = overlay.querySelector("[data-menu-header]");
    if (header) {
      tl.fromTo(
        header,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.25"
      );
    }

    // SplitText on each nav link
    const linkEls = overlay.querySelectorAll("[data-menu-link]");
    linkEls.forEach((el) => {
      const split = new SplitText(el, { type: "chars" });
      splitRefs.current.push(split);

      tl.fromTo(
        split.chars,
        { opacity: 0, filter: "blur(12px)", y: 30 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.03,
        },
        `-=0.35`
      );
    });

    // Animate dividers
    const dividers = overlay.querySelectorAll("[data-menu-divider]");
    tl.fromTo(
      dividers,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.5, ease: "power2.out", stagger: 0.05 },
      "-=0.6"
    );

    // CTA button
    const cta = overlay.querySelector("[data-menu-cta]");
    if (cta) {
      tl.fromTo(
        cta,
        { opacity: 0, filter: "blur(10px)", y: 20 },
        { opacity: 1, filter: "blur(0px)", y: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3"
      );
    }
  }, []);

  const animateClose = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setMobileOpen(false);
        splitRefs.current.forEach((s) => s.revert());
        splitRefs.current = [];
      },
    });

    tl.to(overlay, {
      xPercent: 100,
      duration: 0.5,
      ease: "power3.inOut",
    });

    tlRef.current = tl;
  }, []);

  const handleOpen = useCallback(() => {
    setMobileOpen(true);
  }, []);

  // Run open animation after the overlay mounts
  useEffect(() => {
    if (mobileOpen && overlayRef.current) {
      // Small delay to ensure DOM is painted
      requestAnimationFrame(() => {
        animateOpen();
      });
    }
  }, [mobileOpen, animateOpen]);

  const handleLinkClick = useCallback(() => {
    animateClose();
  }, [animateClose]);

  return (
    <header
      className={`fixed z-50 transition-all duration-500 top-3 left-4 right-4 rounded-2xl ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 border border-border/30"
          : "bg-white/90 backdrop-blur-sm shadow-md shadow-black/3 border border-border/20"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald rounded-xl flex items-center justify-center shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-shadow duration-300">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-text">
              GRUND<span className="text-accent">GARDEN</span>
            </span>
          </a>

          {/* Desktop nav */}
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

          {/* Mobile toggle */}
          <button
            onClick={handleOpen}
            className="md:hidden p-2.5 text-text rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* Mobile fullscreen overlay */}
      {mobileOpen && (
        <div
          ref={overlayRef}
          className="md:hidden fixed inset-0 z-[100] bg-[#0A1F12] flex flex-col"
          style={{ transform: "translateX(100%)" }}
        >
          {/* Menu header */}
          <div
            data-menu-header
            className="px-6 pt-5 pb-4 flex items-center justify-between"
          >
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">
                GRUND<span className="text-accent">GARDEN</span>
              </span>
            </a>
            <button
              onClick={animateClose}
              className="p-2.5 text-white/70 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Zamknij menu"
            >
              <X size={22} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 flex flex-col justify-center px-8 -mt-16">
            {NAV_LINKS.map((link, i) => (
              <div key={link.href}>
                <a
                  href={link.href}
                  onClick={handleLinkClick}
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

            {/* CTA */}
            <div data-menu-cta className="mt-10">
              <a
                href="#kontakt"
                onClick={handleLinkClick}
                className="inline-flex items-center justify-center gap-3 w-full h-16 bg-gradient-to-r from-primary to-emerald text-white text-lg font-semibold rounded-2xl shadow-lg shadow-primary/30 cursor-pointer hover:shadow-xl hover:shadow-primary/40 transition-all duration-300"
              >
                Wyślij zapytanie
                <ArrowRight size={20} />
              </a>
            </div>
          </nav>

          {/* Bottom accent */}
          <div className="px-8 pb-8">
            <p className="text-white/30 text-sm">
              © {new Date().getFullYear()} GrundGarden
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
