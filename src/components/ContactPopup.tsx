"use client";

import { sendToTelegram, formatPopupMessage } from "@/lib/telegram";
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { X, Phone, User, CheckCircle } from "lucide-react";

/* ── Context ── */
const ContactPopupContext = createContext<{
  open: () => void;
}>({ open: () => {} });

export function useContactPopup() {
  return useContext(ContactPopupContext);
}

/* ── Phone mask: +48 XXX XXX XXX ── */
function formatPhone(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.startsWith("48")) {
    const rest = digits.slice(2);
    const parts = [rest.slice(0, 3), rest.slice(3, 6), rest.slice(6, 9)].filter(Boolean);
    return "+48 " + parts.join(" ");
  }
  const parts = [digits.slice(0, 3), digits.slice(3, 6), digits.slice(6, 9)].filter(Boolean);
  return parts.join(" ");
}

function validatePhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9;
}

function validateName(value: string): boolean {
  return value.trim().length >= 2;
}

/* ── Provider + Popup ── */
export function ContactPopupProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const openPopup = useCallback(() => {
    setIsOpen(true);
    setName("");
    setPhone("");
    setNameError("");
    setPhoneError("");
    setSubmitted(false);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Focus name input on open
  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      setTimeout(() => nameInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setPhone(formatPhone(raw));
    if (phoneError) setPhoneError("");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let valid = true;
    if (!validateName(name)) {
      setNameError("Wpisz swoje imie (min. 2 znaki)");
      valid = false;
    }
    if (!validatePhone(phone)) {
      setPhoneError("Wpisz poprawny numer telefonu (min. 9 cyfr)");
      valid = false;
    }

    if (valid) {
      sendToTelegram(formatPopupMessage(name, phone));
      setSubmitted(true);
      setTimeout(() => close(), 2500);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) close();
  };

  return (
    <ContactPopupContext.Provider value={{ open: openPopup }}>
      {children}

      {/* Popup overlay */}
      {isOpen && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        >
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-primary/15 overflow-hidden animate-[slideUp_0.3s_ease-out]">
            {/* Close button */}
            <button
              onClick={close}
              className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-surface flex items-center justify-center text-text-muted hover:text-text hover:bg-border/50 transition-colors cursor-pointer z-10"
              aria-label="Zamknij"
            >
              <X size={18} />
            </button>

            {submitted ? (
              /* Success state */
              <div className="p-8 pt-10 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald flex items-center justify-center mx-auto mb-5">
                  <CheckCircle size={32} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-text mb-2">Dziekujemy!</h3>
                <p className="text-text-secondary text-sm">
                  Odezwiemy sie do Ciebie w ciagu 24 godzin.
                </p>
              </div>
            ) : (
              /* Form */
              <form onSubmit={handleSubmit} className="p-8 pt-10">
                <h3 className="text-xl font-bold text-text mb-2">
                  Zostaw kontakt
                </h3>
                <p className="text-text-secondary text-sm mb-7">
                  Oddzwonimy i omowimy szczegoly Twojego projektu.
                </p>

                {/* Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Imie
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                      <User size={16} />
                    </div>
                    <input
                      ref={nameInputRef}
                      type="text"
                      value={name}
                      onChange={handleNameChange}
                      placeholder="Jan"
                      className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium text-text bg-surface outline-none transition-colors duration-200 ${
                        nameError
                          ? "border-red-400 focus:border-red-500"
                          : "border-border/60 focus:border-primary/40"
                      }`}
                    />
                  </div>
                  {nameError && (
                    <p className="text-red-500 text-xs mt-1.5">{nameError}</p>
                  )}
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text mb-1.5">
                    Numer telefonu
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted">
                      <Phone size={16} />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="+48 500 600 700"
                      className={`w-full h-12 pl-10 pr-4 rounded-xl border text-sm font-medium text-text bg-surface outline-none transition-colors duration-200 ${
                        phoneError
                          ? "border-red-400 focus:border-red-500"
                          : "border-border/60 focus:border-primary/40"
                      }`}
                    />
                  </div>
                  {phoneError && (
                    <p className="text-red-500 text-xs mt-1.5">{phoneError}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="w-full h-13 bg-gradient-to-r from-primary to-emerald text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 cursor-pointer active:scale-[0.98]"
                >
                  Wyslij zapytanie
                </button>

                <p className="text-text-muted text-xs text-center mt-4">
                  Klikajac wyslij, zgadzasz sie na kontakt telefoniczny.
                </p>
              </form>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </ContactPopupContext.Provider>
  );
}
