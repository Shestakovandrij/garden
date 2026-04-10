"use client";

import { useEffect, useRef, useCallback } from "react";
import { ArrowRight, Sparkles, Shield, Clock, TreePine } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const HERO_THUMB1 =
  "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&q=80";

const HERO_THUMB2 =
  "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=400&q=80";

const HERO_SIDE =
  "https://images.pexels.com/photos/7598364/pexels-photo-7598364.jpeg?auto=compress&cs=tinysrgb&w=800&q=80";

/* ---------- Interactive organic blob canvas ---------- */
function OrganicBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const animRef = useRef<number>(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const m = mouseRef.current;

    // Smooth follow cursor
    m.x += (m.targetX - m.x) * 0.03;
    m.y += (m.targetY - m.y) * 0.03;

    const time = Date.now() * 0.001;

    ctx.clearRect(0, 0, w, h);

    // Draw multiple organic blobs that react to cursor
    const blobs = [
      {
        cx: w * 0.35 + m.x * w * 0.15,
        cy: h * 0.4 + m.y * h * 0.1,
        r: Math.min(w, h) * 0.28,
        color1: "rgba(27, 67, 50, 0.12)",
        color2: "rgba(45, 106, 79, 0.04)",
        speed: 0.8,
        phase: 0,
      },
      {
        cx: w * 0.65 - m.x * w * 0.12,
        cy: h * 0.55 - m.y * h * 0.08,
        r: Math.min(w, h) * 0.22,
        color1: "rgba(182, 141, 64, 0.10)",
        color2: "rgba(182, 141, 64, 0.02)",
        speed: 0.6,
        phase: 2,
      },
      {
        cx: w * 0.5 + m.x * w * 0.2,
        cy: h * 0.3 + m.y * h * 0.15,
        r: Math.min(w, h) * 0.18,
        color1: "rgba(64, 145, 108, 0.08)",
        color2: "rgba(64, 145, 108, 0.01)",
        speed: 1.0,
        phase: 4,
      },
      {
        cx: w * 0.25 + m.x * w * 0.1,
        cy: h * 0.7 - m.y * h * 0.12,
        r: Math.min(w, h) * 0.15,
        color1: "rgba(182, 141, 64, 0.06)",
        color2: "rgba(27, 67, 50, 0.02)",
        speed: 0.5,
        phase: 1,
      },
    ];

    blobs.forEach((blob) => {
      ctx.save();
      ctx.beginPath();

      // Organic shape using bezier curves that morph over time
      const points = 8;
      const angleStep = (Math.PI * 2) / points;

      for (let i = 0; i <= points; i++) {
        const angle = i * angleStep;
        const wave1 = Math.sin(time * blob.speed + angle * 2 + blob.phase) * blob.r * 0.15;
        const wave2 = Math.cos(time * blob.speed * 0.7 + angle * 3 + blob.phase) * blob.r * 0.1;
        const r = blob.r + wave1 + wave2;

        const x = blob.cx + Math.cos(angle) * r;
        const y = blob.cy + Math.sin(angle) * r;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          const prevAngle = (i - 1) * angleStep;
          const prevWave1 = Math.sin(time * blob.speed + prevAngle * 2 + blob.phase) * blob.r * 0.15;
          const prevWave2 = Math.cos(time * blob.speed * 0.7 + prevAngle * 3 + blob.phase) * blob.r * 0.1;
          const prevR = blob.r + prevWave1 + prevWave2;
          const prevX = blob.cx + Math.cos(prevAngle) * prevR;
          const prevY = blob.cy + Math.sin(prevAngle) * prevR;

          const cpX1 = prevX + Math.cos(prevAngle + Math.PI / 2) * blob.r * 0.55;
          const cpY1 = prevY + Math.sin(prevAngle + Math.PI / 2) * blob.r * 0.55;
          const cpX2 = x - Math.cos(angle + Math.PI / 2) * blob.r * 0.55;
          const cpY2 = y - Math.sin(angle + Math.PI / 2) * blob.r * 0.55;

          ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, x, y);
        }
      }

      ctx.closePath();

      const grad = ctx.createRadialGradient(
        blob.cx, blob.cy, 0,
        blob.cx, blob.cy, blob.r * 1.2
      );
      grad.addColorStop(0, blob.color1);
      grad.addColorStop(1, blob.color2);
      ctx.fillStyle = grad;
      ctx.filter = "blur(40px)";
      ctx.fill();
      ctx.restore();
    });

    // Draw subtle grid lines that warp near cursor
    ctx.save();
    ctx.strokeStyle = "rgba(27, 67, 50, 0.15)";
    ctx.lineWidth = 1;
    const gridSize = 60;
    const warpRadius = 150;
    const warpStrength = 20;

    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath();
      for (let y = 0; y < h; y += 4) {
        const dx = x - m.x * w;
        const dy = y - m.y * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const warp = dist < warpRadius ? (1 - dist / warpRadius) * warpStrength : 0;
        const warpX = dist > 0 ? (dx / dist) * warp : 0;
        if (y === 0) ctx.moveTo(x + warpX, y);
        else ctx.lineTo(x + warpX, y);
      }
      ctx.stroke();
    }

    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath();
      for (let x = 0; x < w; x += 4) {
        const dx = x - m.x * w;
        const dy = y - m.y * h;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const warp = dist < warpRadius ? (1 - dist / warpRadius) * warpStrength : 0;
        const warpY = dist > 0 ? (dy / dist) * warp : 0;
        if (x === 0) ctx.moveTo(x, y + warpY);
        else ctx.lineTo(x, y + warpY);
      }
      ctx.stroke();
    }
    ctx.restore();

    animRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
      mouseRef.current.targetY = (e.clientY - rect.top) / rect.height;
    };

    canvas.addEventListener("mousemove", handleMouse);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(animRef.current);
    };
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
          "[data-hero-badge]",
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, delay: 0.2 }
        )
          .fromTo(
            "[data-hero-title] .hero-line",
            { y: 80, opacity: 0, rotateX: 15 },
            { y: 0, opacity: 1, rotateX: 0, duration: 1, stagger: 0.15 },
            "-=0.3"
          )
          .fromTo(
            "[data-hero-subtitle]",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            "[data-hero-cta]",
            { y: 25, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.1 },
            "-=0.3"
          )
          .fromTo(
            "[data-hero-trust]",
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
            "-=0.2"
          )
          .fromTo(
            "[data-hero-visual]",
            { x: 60, opacity: 0, scale: 0.92 },
            { x: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
            "-=1"
          )
          .fromTo(
            "[data-hero-float]",
            { scale: 0.6, opacity: 0, y: 20 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.2,
              ease: "back.out(1.7)",
            },
            "-=0.6"
          );
      }, sectionRef);
      return () => ctx.revert();
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-[#f0f5f2]"
    >
      {/* Desktop: interactive cursor-reactive canvas background */}
      <div className="hidden lg:block absolute inset-0">
        <OrganicBlobs />
      </div>

      {/* Subtle top gradient (desktop only) */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#e8f0ec] to-transparent pointer-events-none hidden lg:block" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:py-0 w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center lg:min-h-screen lg:py-28">

          {/* Mobile hero image — on top */}
          <div className="lg:hidden w-full rounded-2xl overflow-hidden shadow-xl shadow-primary/10 border border-border/30">
            <img
              src={HERO_SIDE}
              alt="Nowoczesny dom z zadbanym ogrodem i trawnikiem"
              className="w-full h-[240px] sm:h-[300px] object-cover"
            />
          </div>

          {/* Text content */}
          <div>
            {/* Badge */}
            <div
              data-hero-badge
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-primary/10 shadow-sm mb-8"
            >
              <Sparkles size={14} className="text-accent" />
              <span className="text-sm font-medium text-primary">
                Kompleksowe uslugi ogrodnicze w Polsce
              </span>
            </div>

            {/* H1 */}
            <h1
              data-hero-title
              className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[4rem] font-bold leading-[1.06] tracking-tight text-dark mb-7"
              style={{ perspective: "600px" }}
            >
              <span className="hero-line block overflow-hidden">
                <span className="block">Twoj ogrod w rekach</span>
              </span>
              <span className="hero-line block overflow-hidden">
                <span className="block text-gradient">
                  sprawdzonego wykonawcy
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p
              data-hero-subtitle
              className="text-lg lg:text-xl text-text-secondary leading-relaxed mb-10 max-w-lg"
            >
              Zakladamy trawniki, budujemy tarasy, projektujemy ogrody. Solidna
              realizacja, konkretne terminy, jasna komunikacja.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <a
                data-hero-cta
                href="#kontakt"
                className="group relative inline-flex items-center gap-2.5 h-14 px-9 bg-gradient-to-r from-primary to-emerald text-white font-bold rounded-2xl hover:shadow-2xl hover:shadow-primary/25 transition-all duration-400 hover:-translate-y-1 cursor-pointer"
              >
                <span className="relative z-10">Wyslij zapytanie</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                />
                <div className="absolute inset-0 rounded-2xl bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              <a
                data-hero-cta
                href="#uslugi"
                className="inline-flex items-center gap-2.5 h-14 px-9 rounded-2xl font-semibold text-text bg-white/70 backdrop-blur-md border border-border/50 hover:bg-white hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                Zobacz uslugi
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 lg:gap-8">
              {[
                { icon: Shield, text: "Bezplatna wycena" },
                { icon: Clock, text: "Odpowiedz w 24h" },
                { icon: TreePine, text: "Gwarancja jakosci" },
              ].map((item) => (
                <div
                  key={item.text}
                  data-hero-trust
                  className="flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <item.icon size={15} className="text-accent" />
                  </div>
                  <span className="text-sm font-medium text-text-secondary">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop — visual composition */}
          <div className="hidden lg:block" data-hero-visual>
            <div className="relative">
              {/* Main hero image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/15 border border-white/50">
                <img
                  src={HERO_SIDE}
                  alt="Nowoczesny dom z zadbanym ogrodem i trawnikiem"
                  className="w-full h-[540px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent rounded-3xl" />
              </div>

              {/* Floating glass card — top right */}
              <div
                data-hero-float
                className="absolute -top-5 -right-5 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-xl shadow-primary/10 animate-float"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent to-yellow-500 flex items-center justify-center shadow-md shadow-accent/25">
                    <Sparkles size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Premium jakosc</p>
                    <p className="text-xs text-text-muted">Gwarancja satysfakcji</p>
                  </div>
                </div>
              </div>

              {/* Floating gallery — bottom left */}
              <div
                data-hero-float
                className="absolute -bottom-6 -left-6 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-3.5 shadow-xl shadow-primary/10"
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    <img
                      src={HERO_THUMB1}
                      alt="Realizacja ogrodu"
                      className="w-11 h-11 rounded-xl object-cover border-2 border-white"
                    />
                    <img
                      src={HERO_THUMB2}
                      alt="Realizacja trawnika"
                      className="w-11 h-11 rounded-xl object-cover border-2 border-white"
                    />
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center border-2 border-white">
                      <span className="text-white text-xs font-bold">50+</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-text">Realizacje</p>
                    <p className="text-xs text-text-muted">Zobacz portfolio</p>
                  </div>
                </div>
              </div>

              {/* Stats badge — mid right */}
              <div
                data-hero-float
                className="absolute top-1/2 -right-10 -translate-y-1/2 bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl px-5 py-3 shadow-xl shadow-primary/10"
              >
                <p className="text-2xl font-bold text-primary">100%</p>
                <p className="text-xs text-text-muted">Zadowolonych</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none hidden lg:block" />
    </section>
  );
}
