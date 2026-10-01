import { NextResponse } from "next/server";
import { hasErrors, normalizePhone, validateBooking, type BookingInput } from "@/lib/validation";

/**
 * Прийом заявок. Канали доставки налаштовуються через змінні середовища
 * (див. .env.example): Telegram-бот та/або довільний webhook.
 */

// Простий захист від флуду: не більше 5 заявок з однієї IP за 10 хв (в межах інстансу)
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

const str = (v: unknown, max = 1000) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const variant = body.variant === "compact" ? "compact" : "full";
  const input: BookingInput = {
    name: str(body.name, 80),
    phone: str(body.phone, 30),
    brand: str(body.brand, 60),
    model: str(body.model, 60),
    service: str(body.service, 100),
    date: str(body.date, 10),
    comment: str(body.comment, 1200),
    context: str(body.context, 800),
    consent: body.consent === true,
    company: str(body.company, 100),
  };

  // Honeypot заповнений — бот. Відповідаємо «успіхом», нічого не надсилаючи.
  if (input.company) return NextResponse.json({ ok: true });

  const errors = validateBooking(input, variant);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const phone = normalizePhone(input.phone)!;
  const lines = [
    "🔧 Нова заявка з сайту",
    `Ім'я: ${input.name}`,
    `Телефон: ${phone}`,
    input.service && `Послуга: ${input.service}`,
    (input.brand || input.model) && `Авто: ${[input.brand, input.model].filter(Boolean).join(" ")}`,
    input.date && `Бажана дата: ${input.date.split("-").reverse().join(".")}`,
    input.comment && `Коментар: ${input.comment}`,
    input.context && `Додатково: ${input.context}`,
  ].filter(Boolean) as string[];
  const text = lines.join("\n");

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const webhook = process.env.BOOKING_WEBHOOK_URL;

  if (!(token && chatId) && !webhook) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[booking] Канал доставки не налаштовано. Заявка:\n${text}`);
      return NextResponse.json({ ok: true, dev: true });
    }
    console.error("[booking] TELEGRAM_BOT_TOKEN / BOOKING_WEBHOOK_URL не задані — заявку неможливо доставити");
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const deliveries: Promise<Response>[] = [];
  if (token && chatId) {
    deliveries.push(
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }
  if (webhook) {
    deliveries.push(
      fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, phone, company: undefined, consent: true, createdAt: new Date().toISOString() }),
        signal: AbortSignal.timeout(8000),
      }),
    );
  }

  const results = await Promise.allSettled(deliveries);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value.ok);
  if (!delivered) {
    console.error("[booking] Не вдалося доставити заявку", results);
    return NextResponse.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
