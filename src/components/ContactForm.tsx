"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  ArrowLeft,
  Send,
  CheckCircle2,
  Sparkles,
  TreePine,
  Ruler,
  Paintbrush,
  Calendar,
  User,
  Phone,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface QuizStep {
  id: string;
  question: string;
  subtitle: string;
  type: "single" | "multi" | "input";
  icon: typeof TreePine;
  options?: { label: string; value: string; icon?: string }[];
  inputFields?: {
    name: string;
    label: string;
    placeholder: string;
    type: string;
    required: boolean;
    icon: typeof User;
  }[];
}

const quizSteps: QuizStep[] = [
  {
    id: "service",
    question: "Czego potrzebujesz?",
    subtitle: "Wybierz glowna usluge, ktora Cie interesuje",
    type: "single",
    icon: TreePine,
    options: [
      { label: "Trawnik", value: "lawn", icon: "lawn" },
      { label: "Taras", value: "terrace", icon: "terrace" },
      { label: "Projekt ogrodu", value: "design", icon: "design" },
      { label: "Nawadnianie", value: "irrigation", icon: "irrigation" },
      { label: "Oswietlenie", value: "lighting", icon: "lighting" },
      { label: "Kompleksowy ogrod", value: "full", icon: "full" },
    ],
  },
  {
    id: "area",
    question: "Jaka jest powierzchnia?",
    subtitle: "Przyblizona wielkosc terenu do zagospodarowania",
    type: "single",
    icon: Ruler,
    options: [
      { label: "Do 200 m2", value: "small" },
      { label: "200-500 m2", value: "medium" },
      { label: "500-1000 m2", value: "large" },
      { label: "Powyzej 1000 m2", value: "xlarge" },
    ],
  },
  {
    id: "style",
    question: "Jaki styl preferujesz?",
    subtitle: "To pomoze nam lepiej dopasowac projekt",
    type: "single",
    icon: Paintbrush,
    options: [
      { label: "Nowoczesny", value: "modern" },
      { label: "Klasyczny", value: "classic" },
      { label: "Naturalny", value: "natural" },
      { label: "Minimalistyczny", value: "minimal" },
    ],
  },
  {
    id: "timeline",
    question: "Kiedy chcesz zaczac?",
    subtitle: "Orientacyjny termin rozpoczecia prac",
    type: "single",
    icon: Calendar,
    options: [
      { label: "Jak najszybciej", value: "asap" },
      { label: "W ciagu miesiaca", value: "month" },
      { label: "Za 2-3 miesiace", value: "quarter" },
      { label: "Planuje na przyszlosc", value: "future" },
    ],
  },
  {
    id: "contact",
    question: "Jak sie z Toba skontaktowac?",
    subtitle: "Odezwiemy sie w ciagu 24 godzin",
    type: "input",
    icon: Phone,
    inputFields: [
      {
        name: "name",
        label: "Imie",
        placeholder: "Jan Kowalski",
        type: "text",
        required: true,
        icon: User,
      },
      {
        name: "contact",
        label: "Telefon lub e-mail",
        placeholder: "+48 500 000 000 lub jan@email.pl",
        type: "text",
        required: true,
        icon: Phone,
      },
    ],
  },
];

const serviceLabels: Record<string, string> = {
  lawn: "Trawnik",
  terrace: "Taras",
  design: "Projekt ogrodu",
  irrigation: "Nawadnianie",
  lighting: "Oswietlenie",
  full: "Kompleksowy ogrod",
};
const areaLabels: Record<string, string> = {
  small: "Do 200 m2",
  medium: "200-500 m2",
  large: "500-1000 m2",
  xlarge: "Powyzej 1000 m2",
};
const styleLabels: Record<string, string> = {
  modern: "Nowoczesny",
  classic: "Klasyczny",
  natural: "Naturalny",
  minimal: "Minimalistyczny",
};
const timelineLabels: Record<string, string> = {
  asap: "Jak najszybciej",
  month: "W ciagu miesiaca",
  quarter: "Za 2-3 miesiace",
  future: "Na przyszlosc",
};

export default function ContactForm() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [animating, setAnimating] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const stepRef = useRef<HTMLDivElement>(null);

  const totalSteps = quizSteps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        gsap.from("[data-quiz-anim]", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
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

  const animateStep = useCallback((dir: "forward" | "backward") => {
    if (!stepRef.current) return;
    setAnimating(true);

    const el = stepRef.current;
    const xOut = dir === "forward" ? -30 : 30;
    const xIn = dir === "forward" ? 30 : -30;

    gsap.to(el, {
      x: xOut,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        setDirection(dir);
        setCurrentStep((prev) =>
          dir === "forward" ? prev + 1 : prev - 1
        );
        gsap.fromTo(
          el,
          { x: xIn, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.35,
            ease: "power2.out",
            onComplete: () => setAnimating(false),
          }
        );
      },
    });
  }, []);

  const handleOptionSelect = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));

    // Auto-advance after selection with a slight delay for visual feedback
    if (currentStep < totalSteps - 1) {
      setTimeout(() => animateStep("forward"), 300);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const canGoNext = () => {
    const step = quizSteps[currentStep];
    if (step.type === "input") {
      return step.inputFields?.every((f) =>
        f.required ? !!answers[f.name]?.trim() : true
      );
    }
    return !!answers[step.id];
  };

  const step = quizSteps[currentStep];

  return (
    <section
      id="kontakt"
      ref={sectionRef}
      className="py-24 lg:py-32 bg-gradient-to-b from-white via-surface to-white relative overflow-hidden"
    >
      {/* Decorative blobs */}
      <div className="absolute top-20 right-[5%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-[5%] w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px]" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div data-quiz-anim className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-accent mb-4">
              <span className="w-8 h-px bg-accent" />
              Kontakt
              <span className="w-8 h-px bg-accent" />
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold text-text tracking-tight mb-4">
              Opisz swoj <span className="text-gradient">projekt</span>
            </h2>
            <p className="text-text-secondary text-lg max-w-xl mx-auto">
              Odpowiedz na kilka pytan — przygotujemy bezplatna wycene
              dopasowana do Twoich potrzeb.
            </p>
          </div>

          {/* Quiz card */}
          <div
            data-quiz-anim
            className="rounded-3xl bg-white border border-border/50 shadow-xl shadow-primary/5 overflow-hidden"
          >
            {submitted ? (
              /* Success screen */
              <div className="p-10 lg:p-16 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center shadow-lg shadow-primary/20">
                  <CheckCircle2 size={36} className="text-white" />
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text mb-3">
                  Dziekujemy!
                </h3>
                <p className="text-text-secondary text-lg mb-8 max-w-md mx-auto">
                  Twoje zapytanie zostalo wyslane. Skontaktujemy sie w ciagu 24 godzin.
                </p>

                {/* Summary */}
                <div className="max-w-sm mx-auto rounded-2xl bg-surface border border-border/50 p-6 text-left">
                  <p className="text-sm font-semibold text-text-muted mb-4 uppercase tracking-wider">
                    Podsumowanie
                  </p>
                  <div className="space-y-3">
                    {answers.service && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Usluga</span>
                        <span className="font-medium text-text">
                          {serviceLabels[answers.service] || answers.service}
                        </span>
                      </div>
                    )}
                    {answers.area && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Powierzchnia</span>
                        <span className="font-medium text-text">
                          {areaLabels[answers.area] || answers.area}
                        </span>
                      </div>
                    )}
                    {answers.style && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Styl</span>
                        <span className="font-medium text-text">
                          {styleLabels[answers.style] || answers.style}
                        </span>
                      </div>
                    )}
                    {answers.timeline && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Termin</span>
                        <span className="font-medium text-text">
                          {timelineLabels[answers.timeline] || answers.timeline}
                        </span>
                      </div>
                    )}
                    {answers.name && (
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Imie</span>
                        <span className="font-medium text-text">
                          {answers.name}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Progress bar */}
                <div className="px-8 pt-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-text-muted">
                      Krok {currentStep + 1} z {totalSteps}
                    </span>
                    <span className="text-sm font-semibold text-accent">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="h-2 bg-surface-alt rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary via-emerald to-accent rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Step content */}
                <div ref={stepRef} className="p-8 lg:p-10">
                  {/* Step icon + question */}
                  <div className="flex items-start gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-emerald/10 flex items-center justify-center flex-shrink-0">
                      <step.icon size={22} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl lg:text-2xl font-bold text-text mb-1">
                        {step.question}
                      </h3>
                      <p className="text-text-muted text-sm">
                        {step.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Options */}
                  {step.type === "single" && step.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {step.options.map((opt) => {
                        const isSelected = answers[step.id] === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() =>
                              handleOptionSelect(step.id, opt.value)
                            }
                            disabled={animating}
                            className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                : "border-border/50 hover:border-primary/30 hover:bg-surface"
                            }`}
                          >
                            {/* Selection indicator */}
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                                isSelected
                                  ? "border-primary bg-primary"
                                  : "border-border"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>

                            <span
                              className={`font-medium transition-colors duration-200 ${
                                isSelected ? "text-primary" : "text-text"
                              }`}
                            >
                              {opt.label}
                            </span>

                            {/* Selected checkmark */}
                            {isSelected && (
                              <Sparkles
                                size={16}
                                className="text-accent ml-auto"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Input fields */}
                  {step.type === "input" && step.inputFields && (
                    <div className="space-y-5">
                      {step.inputFields.map((field) => (
                        <div key={field.name}>
                          <label
                            htmlFor={field.name}
                            className="block text-sm font-medium text-text mb-2"
                          >
                            {field.label}
                          </label>
                          <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted">
                              <field.icon size={18} />
                            </div>
                            <input
                              type={field.type}
                              id={field.name}
                              name={field.name}
                              required={field.required}
                              value={answers[field.name] || ""}
                              onChange={(e) =>
                                handleInputChange(field.name, e.target.value)
                              }
                              placeholder={field.placeholder}
                              className="w-full h-13 pl-12 pr-4 rounded-2xl border-2 border-border/50 bg-surface text-text placeholder:text-text-muted text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="px-8 pb-8 flex items-center justify-between">
                  <button
                    onClick={() => !animating && animateStep("backward")}
                    disabled={currentStep === 0 || animating}
                    className={`inline-flex items-center gap-2 h-12 px-6 rounded-2xl font-medium text-sm transition-all duration-200 cursor-pointer ${
                      currentStep === 0
                        ? "opacity-0 pointer-events-none"
                        : "text-text-secondary hover:text-text hover:bg-surface"
                    }`}
                  >
                    <ArrowLeft size={16} />
                    Wstecz
                  </button>

                  {currentStep === totalSteps - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={!canGoNext() || animating}
                      className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-primary to-emerald text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                    >
                      Wyslij
                      <Send size={16} />
                    </button>
                  ) : (
                    <button
                      onClick={() => !animating && animateStep("forward")}
                      disabled={!canGoNext() || animating}
                      className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-primary to-emerald text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none cursor-pointer"
                    >
                      Dalej
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>

                {/* Step dots */}
                <div className="px-8 pb-6 flex items-center justify-center gap-2">
                  {quizSteps.map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? "w-8 bg-gradient-to-r from-primary to-accent"
                          : i < currentStep
                          ? "w-3 bg-primary/40"
                          : "w-3 bg-border"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Trust notes below quiz */}
          {!submitted && (
            <div
              data-quiz-anim
              className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" />
                Bezplatna wycena
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" />
                Odpowiedz w 24h
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-primary" />
                Bez zobowiazan
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
