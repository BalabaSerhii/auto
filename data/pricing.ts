/**
 * Популярні роботи та стартові ціни (орієнтир — середні ціни СТО Києва, 2026).
 * priceFrom: null — показується «від [ЦІНА] грн». Реальні ціни вписати числом.
 */
export type PriceItem = {
  id: string;
  title: string;
  note?: string;
  priceFrom: number | null;
};

export const pricing: PriceItem[] = [
  { id: "computer-diagnostics", title: "Комп'ютерна діагностика", priceFrom: 450 },
  { id: "oil-change", title: "Заміна масла", note: "без вартості масла та фільтра", priceFrom: 350 },
  { id: "chassis-diagnostics", title: "Діагностика ходової", priceFrom: 350 },
  { id: "brake-pads", title: "Заміна гальмівних колодок", note: "одна вісь, без вартості колодок", priceFrom: 500 },
  { id: "ac-refill", title: "Заправка кондиціонера", note: "з фреоном і перевіркою тиску", priceFrom: 800 },
];

export const pricingNote =
  "Точна вартість залежить від моделі автомобіля, запчастин та обсягу робіт. Перед ремонтом погоджуємо перелік робіт і вартість.";
