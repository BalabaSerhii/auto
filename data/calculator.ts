/**
 * Налаштування калькулятора орієнтовної вартості.
 *
 * mode:
 *  - "estimate"  — для типових робіт показуємо стартові ціни з data/pricing.ts
 *  - "diagnosis" — вартість без огляду не визначити, пропонуємо діагностику
 */
export type CalcCategory = {
  id: string;
  label: string;
  hint: string;
  mode: "estimate" | "diagnosis";
  /** id робіт із data/pricing.ts */
  priceIds: string[];
};

export const calcCategories: CalcCategory[] = [
  { id: "diagnostics", label: "Діагностика", hint: "Помилка на панелі, незрозумілий симптом", mode: "estimate", priceIds: ["computer-diagnostics", "chassis-diagnostics"] },
  { id: "maintenance", label: "ТО", hint: "Масло, фільтри, регламент", mode: "estimate", priceIds: ["oil-change"] },
  { id: "brakes", label: "Гальма", hint: "Колодки, диски, скрип", mode: "estimate", priceIds: ["brake-pads"] },
  { id: "chassis", label: "Ходова", hint: "Стук, люфт, тягне вбік", mode: "diagnosis", priceIds: ["chassis-diagnostics"] },
  { id: "engine", label: "Двигун", hint: "Течі, втрата тяги, шум", mode: "diagnosis", priceIds: ["computer-diagnostics"] },
  { id: "electric", label: "Електрика", hint: "Не заводиться, сідає АКБ", mode: "diagnosis", priceIds: ["computer-diagnostics"] },
  { id: "ac", label: "Кондиціонер", hint: "Слабко холодить, запах", mode: "estimate", priceIds: ["ac-refill"] },
  { id: "other", label: "Інше", hint: "Не знаю, що саме зламалось", mode: "diagnosis", priceIds: ["computer-diagnostics"] },
];

export const calcSteps = ["Що потрібно?", "Який автомобіль?", "Що сталося?", "Результат"] as const;

export const calcOldestYear = 1990;
