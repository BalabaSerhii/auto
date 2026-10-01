/**
 * Показники автосервісу.
 * value: null — показується плейсхолдер; число — анімований лічильник.
 */
export type Stat = {
  value: number | null;
  suffix?: string;
  label: string;
  placeholder: string;
};

export const stats: Stat[] = [
  { value: 12, suffix: "+", label: "років досвіду", placeholder: "[X]" },
  { value: 1000, suffix: "+", label: "відремонтованих автомобілів", placeholder: "[X]" },
  { value: 500, suffix: "+", label: "постійних клієнтів", placeholder: "[X]" },
  { value: 6, label: "робочих постів", placeholder: "[X]" },
];
