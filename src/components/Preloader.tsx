"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Exit animation
          const exitTl = gsap.timeline({
            onComplete: () => {
              setDone(true);
              setTimeout(() => setHidden(true), 100);
            },
          });

          exitTl
            .to("[data-preloader-content]", {
              y: -30,
              opacity: 0,
              duration: 0.4,
              ease: "power2.in",
            })
            .to(
              "[data-preloader-left]",
              {
                yPercent: -100,
                duration: 0.7,
                ease: "power3.inOut",
              },
              "-=0.1"
            )
            .to(
              "[data-preloader-right]",
              {
                yPercent: 100,
                duration: 0.7,
                ease: "power3.inOut",
              },
              "<"
            );
        },
      });

      // Animate leaf SVG drawing
      tl.fromTo(
        "[data-preloader-leaf] path",
        { strokeDashoffset: 200 },
        { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }
      );

      // Animate progress bar
      tl.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1.5,
          ease: "power2.inOut",
          onUpdate: function () {
            if (percentRef.current) {
              const progress = Math.round(
                gsap.getProperty(progressRef.current!, "scaleX") as number * 100
              );
              percentRef.current.textContent = `${progress}%`;
            }
          },
        },
        "-=0.8"
      );

      // Fade in brand name letters
      tl.fromTo(
        "[data-preloader-letter]",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.out",
        },
        "-=1"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-[200] ${done ? "pointer-events-none" : ""}`}
    >
      {/* Split curtain panels */}
      <div
        data-preloader-left
        className="absolute top-0 left-0 w-full h-1/2 bg-[#0A1F12]"
      />
      <div
        data-preloader-right
        className="absolute bottom-0 left-0 w-full h-1/2 bg-[#0A1F12]"
      />

      {/* Center content */}
      <div
        data-preloader-content
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
      >
        {/* Animated leaf SVG */}
        <div data-preloader-leaf className="mb-8">
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Leaf shape */}
            <path
              d="M32 8C32 8 12 20 12 38C12 49.046 20.954 58 32 58C43.046 58 52 49.046 52 38C52 20 32 8 32 8Z"
              stroke="#B68D40"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              fill="none"
            />
            {/* Leaf vein center */}
            <path
              d="M32 18V48"
              stroke="#B68D40"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
            />
            {/* Leaf veins left */}
            <path
              d="M32 28L22 34"
              stroke="#B68D40"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              opacity="0.6"
            />
            <path
              d="M32 36L20 40"
              stroke="#B68D40"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              opacity="0.6"
            />
            {/* Leaf veins right */}
            <path
              d="M32 28L42 34"
              stroke="#B68D40"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              opacity="0.6"
            />
            <path
              d="M32 36L44 40"
              stroke="#B68D40"
              strokeWidth="1"
              strokeLinecap="round"
              strokeDasharray="200"
              strokeDashoffset="200"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Brand name with stagger animation */}
        <div className="flex items-center gap-0.5 mb-6">
          {"GRUNDGARDEN".split("").map((letter, i) => (
            <span
              key={i}
              data-preloader-letter
              className={`text-2xl font-bold tracking-wider ${
                i >= 5 ? "text-accent" : "text-white"
              }`}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* Progress bar */}
        <div className="w-48 relative">
          <div className="h-[2px] bg-white/10 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-gradient-to-r from-accent to-emerald-light rounded-full origin-left"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
          <span
            ref={percentRef}
            className="block text-center text-xs text-white/40 mt-3 font-medium tabular-nums"
          >
            0%
          </span>
        </div>

        {/* Subtitle */}
        <p className="text-white/20 text-xs mt-6 tracking-widest uppercase">
          Landscape Design Studio
        </p>
      </div>
    </div>
  );
}
