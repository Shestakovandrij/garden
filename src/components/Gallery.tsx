"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { X, ZoomIn } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const images = [
  {
    src: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Elegancki dom z zadbanym ogrodem i trawnikiem",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/27443421/pexels-photo-27443421.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "System nawadniania trawnika w dzialaniu",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/25286944/pexels-photo-25286944.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Oswietlenie sciezki ogrodowej noca",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/25283561/pexels-photo-25283561.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Zraszacz podlewajacy zielony trawnik z bliska",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/16553864/pexels-photo-16553864.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Nowoczesny ogrod z roslinami przy domu",
    span: "",
  },
];

export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-gallery-item]", {
          y: 30,
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        });
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  return (
    <>
      <section ref={sectionRef} className="py-24 lg:py-32 bg-white relative">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/3 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-8 h-px bg-accent" />
              Galeria
              <span className="w-8 h-px bg-accent" />
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight">
              Nasze realizacje <span className="text-gradient">z bliska</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[220px]">
            {images.map((img, i) => (
              <div
                key={i}
                data-gallery-item
                onClick={() => setLightbox(i)}
                className={`relative rounded-2xl overflow-hidden group cursor-pointer ${img.span}`}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                    <ZoomIn size={20} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Zamknij"
          >
            <X size={24} className="text-white" />
          </button>
          <img
            src={images[lightbox].src.replace("w=600", "w=1200").replace("w=800", "w=1200")}
            alt={images[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
