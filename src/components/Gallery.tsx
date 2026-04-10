"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X } from "lucide-react";

/* ── Image data: two rows with different heights for masonry feel ── */
const row1 = [
  {
    src: "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Elegancki dom z zadbanym ogrodem i trawnikiem",
    w: "w-[340px] md:w-[480px]",
    h: "h-[220px] md:h-[320px]",
  },
  {
    src: "https://images.pexels.com/photos/27443421/pexels-photo-27443421.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "System nawadniania trawnika w dzialaniu",
    w: "w-[260px] md:w-[340px]",
    h: "h-[220px] md:h-[320px]",
  },
  {
    src: "https://images.pexels.com/photos/7598364/pexels-photo-7598364.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Nowoczesny dom z ogrodem",
    w: "w-[380px] md:w-[520px]",
    h: "h-[220px] md:h-[320px]",
  },
  {
    src: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Zielony zadbany trawnik z bliska",
    w: "w-[280px] md:w-[380px]",
    h: "h-[220px] md:h-[320px]",
  },
  {
    src: "https://images.pexels.com/photos/17418139/pexels-photo-17418139.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Nowoczesny taras z meblami ogrodowymi",
    w: "w-[320px] md:w-[440px]",
    h: "h-[220px] md:h-[320px]",
  },
];

const row2 = [
  {
    src: "https://images.pexels.com/photos/25286944/pexels-photo-25286944.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Oswietlenie sciezki ogrodowej noca",
    w: "w-[300px] md:w-[420px]",
    h: "h-[200px] md:h-[280px]",
  },
  {
    src: "https://images.pexels.com/photos/25283561/pexels-photo-25283561.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Zraszacz podlewajacy zielony trawnik",
    w: "w-[360px] md:w-[500px]",
    h: "h-[200px] md:h-[280px]",
  },
  {
    src: "https://images.pexels.com/photos/16553864/pexels-photo-16553864.jpeg?auto=compress&cs=tinysrgb&w=600&q=80",
    alt: "Nowoczesny ogrod z roslinami przy domu",
    w: "w-[240px] md:w-[340px]",
    h: "h-[200px] md:h-[280px]",
  },
  {
    src: "https://images.pexels.com/photos/10831661/pexels-photo-10831661.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Kamienna sciezka przez kwitnacy ogrod",
    w: "w-[340px] md:w-[460px]",
    h: "h-[200px] md:h-[280px]",
  },
  {
    src: "https://images.pexels.com/photos/7546775/pexels-photo-7546775.jpeg?auto=compress&cs=tinysrgb&w=800&q=80",
    alt: "Zadbany trawnik przy nowoczesnym domu",
    w: "w-[280px] md:w-[380px]",
    h: "h-[200px] md:h-[280px]",
  },
];

const allImages = [...row1, ...row2];

/* ── Infinite scroll row ── */
function InfiniteRow({
  items,
  direction,
  speed,
  onImageClick,
}: {
  items: typeof row1;
  direction: "left" | "right";
  speed: number; // px per second
  onImageClick: (idx: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const pausedRef = useRef(false);
  const singleWidthRef = useRef(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!trackRef.current) return;

      if (lastTimeRef.current === 0) lastTimeRef.current = timestamp;
      const delta = (timestamp - lastTimeRef.current) / 1000;
      lastTimeRef.current = timestamp;

      if (!pausedRef.current) {
        const dir = direction === "left" ? -1 : 1;
        offsetRef.current += speed * delta * dir;

        // Seamless loop: reset when we've scrolled one full set
        const sw = singleWidthRef.current;
        if (sw > 0) {
          if (direction === "left" && offsetRef.current <= -sw) {
            offsetRef.current += sw;
          } else if (direction === "right" && offsetRef.current >= 0) {
            offsetRef.current -= sw;
          }
        }

        trackRef.current.style.transform = `translateX(${offsetRef.current}px)`;
      }

      animRef.current = requestAnimationFrame(animate);
    },
    [direction, speed]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Measure width of one set of items
    const children = track.children;
    const itemCount = items.length;
    let totalW = 0;
    for (let i = 0; i < itemCount; i++) {
      totalW += (children[i] as HTMLElement).offsetWidth + 16; // 16px = gap-4
    }
    singleWidthRef.current = totalW;

    // Start position for right-direction
    if (direction === "right") {
      offsetRef.current = -totalW;
    }

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [animate, direction, items.length]);

  const handleEnter = () => {
    pausedRef.current = true;
  };
  const handleLeave = () => {
    pausedRef.current = false;
  };

  // Render 3x for seamless loop
  const tripled = [...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onTouchStart={handleEnter}
      onTouchEnd={handleLeave}
    >
      <div ref={trackRef} className="flex gap-4 will-change-transform">
        {tripled.map((item, i) => {
          const realIdx = i % items.length;
          const globalIdx =
            items === row1 ? realIdx : row1.length + realIdx;

          return (
            <div
              key={i}
              onClick={() => onImageClick(globalIdx)}
              className={`relative ${item.w} ${item.h} flex-shrink-0 rounded-2xl overflow-hidden group cursor-pointer`}
            >
              <img
                src={item.src}
                alt={item.alt}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                loading="lazy"
                draggable={false}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-dark/0 group-hover:bg-dark/40 transition-colors duration-300" />
              {/* Bottom gradient always visible for depth */}
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-dark/30 to-transparent pointer-events-none" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Main Gallery ── */
export default function Gallery() {
  const sectionRef = useRef<HTMLElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightbox]);

  return (
    <>
      <section
        ref={sectionRef}
        className="py-20 lg:py-28 bg-white relative overflow-hidden"
      >
        {/* Header */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-12 lg:mb-16">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-10 h-px bg-accent" />
              Galeria
              <span className="w-10 h-px bg-accent" />
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight">
              Nasze realizacje{" "}
              <span className="text-gradient">z bliska</span>
            </h2>
          </div>
        </div>

        {/* Row 1 — moves left, taller cards */}
        <div className="mb-4">
          <InfiniteRow
            items={row1}
            direction="left"
            speed={40} /* ← px/sec — adjust for speed */
            onImageClick={setLightbox}
          />
        </div>

        {/* Row 2 — moves right, shorter cards */}
        <InfiniteRow
          items={row2}
          direction="right"
          speed={30} /* ← px/sec — adjust for speed */
          onImageClick={setLightbox}
        />
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
            src={allImages[lightbox].src
              .replace("w=600", "w=1200")
              .replace("w=800", "w=1200")}
            alt={allImages[lightbox].alt}
            className="max-w-full max-h-[85vh] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
