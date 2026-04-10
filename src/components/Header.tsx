"use client";

import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "top-3 left-4 right-4 rounded-2xl glass shadow-lg shadow-black/5"
          : "bg-transparent"
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
            {[
              { href: "#uslugi", label: "Uslugi" },
              { href: "#realizacje", label: "Realizacje" },
              { href: "#faq", label: "FAQ" },
            ].map((link) => (
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
              Wyslij zapytanie
              <ArrowRight size={15} />
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2.5 text-text rounded-xl hover:bg-primary/5 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-0 z-50 bg-white/95 backdrop-blur-xl">
          <div className="px-6 pt-5 pb-4 flex items-center justify-between">
            <a href="#" className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-emerald rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-text">
                GRUND<span className="text-accent">GARDEN</span>
              </span>
            </a>
            <button
              onClick={() => setMobileOpen(false)}
              className="p-2.5 text-text rounded-xl hover:bg-primary/5 cursor-pointer"
              aria-label="Zamknij menu"
            >
              <X size={22} />
            </button>
          </div>
          <nav className="px-6 pt-8 flex flex-col gap-2">
            {[
              { href: "#uslugi", label: "Uslugi" },
              { href: "#realizacje", label: "Realizacje" },
              { href: "#faq", label: "FAQ" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-semibold text-text hover:text-primary transition-colors py-3 border-b border-border/50 cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#kontakt"
              onClick={() => setMobileOpen(false)}
              className="mt-6 inline-flex items-center justify-center gap-2 h-14 px-8 bg-gradient-to-r from-primary to-emerald text-white text-base font-semibold rounded-2xl shadow-lg shadow-primary/25 cursor-pointer"
            >
              Wyslij zapytanie
              <ArrowRight size={18} />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
