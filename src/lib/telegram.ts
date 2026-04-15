const BOT_TOKEN = "8746411057:AAE0w1PjRuY_1gG_QtdJ0OI8McZSKWLTlHo";
const CHAT_ID = "-5206348985";

export async function sendToTelegram(message: string): Promise<boolean> {
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "HTML",
        }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export function formatQuizMessage(answers: Record<string, string>): string {
  const serviceLabels: Record<string, string> = {
    lawn: "Trawnik",
    terrace: "Taras",
    design: "Projekt ogrodu",
    irrigation: "Nawadnianie",
    lighting: "Oswietlenie",
    full: "Kompleksowy ogrod",
  };
  const areaLabels: Record<string, string> = {
    small: "Do 200 m²",
    medium: "200–500 m²",
    large: "500–1000 m²",
    xlarge: "Powyżej 1000 m²",
  };
  const styleLabels: Record<string, string> = {
    modern: "Nowoczesny",
    classic: "Klasyczny",
    natural: "Naturalny",
    minimal: "Minimalistyczny",
  };
  const timelineLabels: Record<string, string> = {
    asap: "Jak najszybciej",
    month: "W ciągu miesiąca",
    quarter: "Za 2–3 miesiące",
    future: "Na przyszłość",
  };

  const lines = [
    "🌿 <b>NOWE ZAPYTANIE — QUIZ</b> 🌿",
    "",
    `🧑 <b>Imię:</b> ${answers.name || "—"}`,
    `📞 <b>Kontakt:</b> ${answers.contact || "—"}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    "",
    `🌱 <b>Usługa:</b> ${serviceLabels[answers.service] || answers.service || "—"}`,
    `📐 <b>Powierzchnia:</b> ${areaLabels[answers.area] || answers.area || "—"}`,
    `🎨 <b>Styl:</b> ${styleLabels[answers.style] || answers.style || "—"}`,
    `📅 <b>Termin:</b> ${timelineLabels[answers.timeline] || answers.timeline || "—"}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    `🕐 ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}`,
    "🌐 grundgarden.pl",
  ];

  return lines.join("\n");
}

export function formatPopupMessage(name: string, phone: string): string {
  const lines = [
    "📲 <b>NOWY KONTAKT — POPUP</b> 📲",
    "",
    `🧑 <b>Imię:</b> ${name}`,
    `📞 <b>Telefon:</b> ${phone}`,
    "",
    "━━━━━━━━━━━━━━━━━━",
    `🕐 ${new Date().toLocaleString("pl-PL", { timeZone: "Europe/Warsaw" })}`,
    "🌐 grundgarden.pl",
  ];

  return lines.join("\n");
}
