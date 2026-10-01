/**
 * Валідація заявки. Спільна для клієнта (миттєві помилки) та API (довіряти
 * лише серверній перевірці).
 */

export type BookingInput = {
  name: string;
  phone: string;
  brand?: string;
  model?: string;
  service?: string;
  date?: string;
  comment?: string;
  /** Контекст із калькулятора тощо — додається до повідомлення */
  context?: string;
  consent: boolean;
  /** honeypot: люди це поле не бачать і не заповнюють */
  company?: string;
};

export type BookingErrors = Partial<Record<keyof BookingInput, string>>;

const LIMITS = { name: 60, brand: 40, model: 40, service: 80, comment: 1000, context: 600 } as const;

/** Нормалізує український номер до +380XXXXXXXXX. null — номер некоректний. */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (/^380\d{9}$/.test(digits)) return `+${digits}`;
  if (/^0\d{9}$/.test(digits)) return `+38${digits}`;
  if (/^80\d{9}$/.test(digits)) return `+3${digits}`;
  // Іноземні номери: 10–15 цифр із явним «+»
  if (raw.trim().startsWith("+") && digits.length >= 10 && digits.length <= 15) return `+${digits}`;
  return null;
}

export function validateBooking(input: BookingInput, variant: "full" | "compact" = "full"): BookingErrors {
  const errors: BookingErrors = {};
  const name = input.name?.trim() ?? "";

  if (name.length < 2) errors.name = "Вкажіть, будь ласка, ваше ім'я.";
  else if (name.length > LIMITS.name) errors.name = "Ім'я занадто довге.";

  if (!input.phone?.trim()) errors.phone = "Вкажіть номер телефону, щоб ми могли зв'язатися.";
  else if (!normalizePhone(input.phone)) errors.phone = "Перевірте номер: наприклад, 067 123 45 67.";

  if (variant === "full") {
    if (!input.service?.trim()) errors.service = "Оберіть, що потрібно зробити.";
  }

  if (input.date) {
    const picked = new Date(`${input.date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(picked.getTime())) errors.date = "Некоректна дата.";
    else if (picked < today) errors.date = "Оберіть сьогоднішню або майбутню дату.";
  }

  for (const key of ["brand", "model", "service", "comment", "context"] as const) {
    const v = input[key];
    if (v && v.length > LIMITS[key]) errors[key] = "Занадто довгий текст.";
  }

  if (!input.consent) errors.consent = "Потрібна ваша згода на обробку даних.";

  return errors;
}

export function hasErrors(errors: BookingErrors): boolean {
  return Object.keys(errors).length > 0;
}
