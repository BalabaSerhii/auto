/**
 * Основні дані автосервісу.
 *
 * Значення у квадратних дужках — плейсхолдери. Сайт підсвічує їх акцентним
 * кольором, щоб було видно, що ще потрібно заповнити. Посилання зі значенням
 * `null` на сайті не показуються — фіктивних посилань немає.
 */

export type Messenger = {
  id: "telegram" | "viber" | "whatsapp" | "instagram";
  label: string;
  href: string | null;
};

export const site = {
  name: "АвтоЕксперт",
  city: "Київ",
  /** Місто в місцевому відмінку — для фраз «автосервіс у Києві» */
  cityIn: "Києві",
  /** Основний домен сайту (canonical, sitemap). Можна перевизначити NEXT_PUBLIC_SITE_URL. */
  url: "https://autoremont.space",
  /** Короткий опис для пошуковиків і соцмереж (до ~160 символів) */
  description:
    "Діагностика, технічне обслуговування та ремонт автомобілів. Пояснюємо проблему, погоджуємо вартість до початку робіт і повертаємо авто в дорогу.",

  /** Номер у зручному для читання вигляді; tel:-посилання будується автоматично */
  phone: "+380 50 594 82 54",
  email: "info@autoekspert.ua",

  address: {
    street: "вулиця Михайла Донця, 6",
    city: "Київ",
    region: "м. Київ",
    postalCode: "03061",
    /** Пряме посилання на маршрут. Якщо null — будується з адреси (Google Maps). */
    routeUrl: null as string | null,
    /** Координати для карти та structured data */
    geo: { lat: 50.43116, lng: 30.42701 } as { lat: number; lng: number } | null,
  },

  hours: [{ days: "Пн–Нд", time: "08:00–20:00" }],
  /** Короткий підпис графіка */
  hoursNote: "Без вихідних",

  /** Графік у форматі schema.org для structured data */
  schemaOpeningHours: ["Mo-Su 08:00-20:00"] as string[],

  messengers: [
    { id: "telegram", label: "Telegram", href: "https://t.me/+380505948254" },
    { id: "whatsapp", label: "WhatsApp", href: "https://wa.me/380505948254" },
    { id: "viber", label: "Viber", href: null },
    { id: "instagram", label: "Instagram", href: null },
  ] satisfies Messenger[] as Messenger[],

  /**
   * Фото для першого екрана (/public/images/...). Якщо null — показується
   * технічна SVG-ілюстрація.
   */
  heroImage: null as { src: string; alt: string } | null,

  /** Гарантія: лише реальні умови. null — блок гарантії показує плейсхолдер. */
  warranty: "На виконані роботи — 6 місяців або 10 000 км пробігу. На запчастини, які ми постачаємо, — гарантія виробника." as string | null,

  /** Редакція юридичних документів */
  legalUpdated: "1 жовтня 2026 р.",

  developer: { name: "Balaba Digital", url: "https://www.balabadigital.de/" },
};

export const nav = [
  { href: "#services", label: "Послуги" },
  { href: "#why-us", label: "Чому ми" },
  { href: "#process", label: "Як працюємо" },
  { href: "#pricing", label: "Ціни" },
  { href: "#reviews", label: "Відгуки" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Контакти" },
];

export const legalLinks = [
  { href: "/privacy", label: "Політика конфіденційності" },
  { href: "/terms", label: "Умови використання" },
  { href: "/personal-data", label: "Обробка персональних даних" },
];
