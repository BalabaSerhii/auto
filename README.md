# Сайт автосервиса — одностраничный лендинг

Реализация ТЗ `TZ111.docx`: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Motion 13 · lucide-react.
Язык сайта — украинский, mobile-first, без выдуманных данных (все неизвестные факты — плейсхолдеры `[...]`).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm run typecheck
```

**Деплой на GitHub + Cloudflare + домен — см. [DEPLOY.md](DEPLOY.md).**

## 1. Что заполнить перед запуском

Все тексты и данные лежат в `data/` — компоненты трогать не нужно. Плейсхолдеры `[...]` на сайте подсвечены янтарным пунктиром, поэтому незаполненное видно сразу.

| Файл | Что внутри |
|---|---|
| `data/site.ts` | название, город, телефон, email, адрес, часы работы, мессенджеры, карта, гарантия, фото для hero |
| `data/services.ts` | услуги, подпункты, типичные симптомы |
| `data/pricing.ts` | цены «от» (`priceFrom: number`; `null` → «від [ЦІНА] грн») |
| `data/calculator.ts` | категории калькулятора и связь с ценами |
| `data/stats.ts` | показатели (`value: null` → плейсхолдер, число → анимированный счётчик) |
| `data/brands.ts` | марки, с которыми реально работает сервис (от 6 штук — бегущая строка) |
| `data/gallery.ts` | фото мастерской и «до/после» (файлы класть в `public/images/`) |
| `data/testimonials.ts` | реальные отзывы (уберите `placeholder: true`) |
| `data/faq.ts` | вопросы и ответы |
| `app/privacy`, `app/terms`, `app/personal-data` | юридические тексты (сейчас — структура с плейсхолдерами) |

Автоматическое поведение:
- Ссылки на мессенджеры со значением `null` не выводятся — фиктивных ссылок нет.
- Кнопки «Зателефонувати», «Побудувати маршрут», карта и JSON-LD (`AutoRepair`) появляются только когда заполнены телефон/адрес.
- Город попадает в `<title>` (локальное SEO) только когда указан.

### Демо-контент (заменить)

Сейчас заполнены демонстрационные данные — их нужно заменить на реальные:
- **Отзывы и фото клиентов** (`data/testimonials.ts`, `public/images/clients/`) — примеры; аватары с randomuser.me.
- **Фото мастерской и «до/после»** (`data/gallery.ts`, `public/images/gallery`, `public/images/before-after`) — стоковые фото Unsplash (лицензия Unsplash, разрешено коммерческое использование). Пары «до/после» подобраны по теме и показывают работу слайдера, это не одна и та же машина.
- **Цены** (`data/pricing.ts`) — ориентир по средним ценам СТО Киева.
- **Ответы FAQ, гарантия** (`data/faq.ts`, `data/site.ts → warranty`) — проверьте, что совпадает с реальными условиями (гарантия 6 мес / 10 000 км, зона ожидания, способы оплаты и т. д.).

| Файл | Источник |
|---|---|
| `public/images/gallery/workshop.jpg` | https://images.unsplash.com/photo-1767681092416-bccf9410bda4 |
| `public/images/gallery/diagnostics.jpg` | https://images.unsplash.com/photo-1727893380169-4dda123e19f7 |
| `public/images/gallery/engine-check.jpg` | https://images.unsplash.com/photo-1625047509168-a7026f36de04 |
| `public/images/gallery/workshop-tools.jpg` | https://images.unsplash.com/photo-1676018366904-c083ed678e60 |
| `public/images/gallery/lift.jpg` | https://images.unsplash.com/photo-1643700973089-baa86a1ab9ee |
| `public/images/gallery/mechanic.jpg` | https://images.unsplash.com/photo-1615906655593-ad0386982a0f |
| `public/images/before-after/brakes-before.jpg` | https://images.unsplash.com/photo-1609682932589-5ef2bd85980d |
| `public/images/before-after/brakes-after.jpg` | https://images.unsplash.com/photo-1696494561430-de087dd0bd69 |
| `public/images/before-after/headlight-before.jpg` | https://images.unsplash.com/photo-1745177161528-ae3d46d694f2 |
| `public/images/before-after/headlight-after.jpg` | https://images.unsplash.com/photo-1549207107-2704df6b92ab |
| `public/images/before-after/engine-before.jpg` | https://images.unsplash.com/photo-1638247311176-ca7db6f977f8 |
| `public/images/before-after/engine-after.jpg` | https://images.unsplash.com/photo-1711396113768-9fff6660043b |

## 2. Приём заявок

Формы отправляют `POST /api/booking` (валидация на клиенте и на сервере, honeypot, простой rate limit).
Скопируйте `.env.example` в `.env.local` и задайте хотя бы один канал:

- `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` — заявки приходят в Telegram;
- `BOOKING_WEBHOOK_URL` — JSON заявки отправляется в CRM / Make / Zapier.

Также задайте `NEXT_PUBLIC_SITE_URL` (canonical, sitemap, Open Graph).

В `npm run dev` без настроек заявка выводится в консоль сервера и форма показывает успех.
В production без настроек API отвечает 503 и форма показывает ошибку — заявки не теряются молча.

## Тема, навигация

- Переключатель тёмной/светлой темы рядом с «Записатися» (и в мобильном меню). Выбор сохраняется в `localStorage`, применяется до первой отрисовки (без «вспышки»). Токены светлой темы — в `app/globals.css` (`[data-theme="light"]`).
- Плавная прокрутка к якорям и кнопка «Нагору» — `lib/smooth-scroll.ts`, `components/layout/SmoothAnchors.tsx`.
- Кастомный курсор на всех кликабельных элементах — `--cursor-pointer` в `app/globals.css`.

## Карта

`components/sections/LocationMap.tsx` — Leaflet + тайлы OpenStreetMap, приведённые CSS-фильтрами к монохрому под тёмную/светлую тему (`.styled-map` в `app/globals.css`), свой янтарный маркер. Координаты — `data/site.ts → address.geo`. Ключ API не нужен; Leaflet загружается, только когда блок контактов приближается к экрану. Публичные тайлы OSM подходят для сайтов с обычной посещаемостью; при большом трафике замените URL тайлов на коммерческого провайдера (MapTiler, Stadia и т. п.).

## 3. Структура

```
app/            layout (шрифты, SEO, JSON-LD), page, sitemap, robots, icon, OG-картинка, api/booking, юр. страницы
components/
  layout/       Header, Footer, FloatingActions (мобильная панель + плавающая кнопка), Logo, LegalPage
  sections/     Hero, Services, Benefits, Stats, Process, Brands, Pricing, Calculator, Gallery, Testimonials, FAQ, FinalCTA, Contact
  booking/      BookingProvider (Motion + диалог записи), BookingForm, BookingDialog
  ui/           Button, Typography (Badge, SectionHeading, Ph), Reveal, Motion (TextReveal, NumberTicker), Accordion, ScrollRow, Icon
data/           весь редактируемый контент
lib/            utils, validation, use-modal, structured-data
```

Server Components по умолчанию; `"use client"` только у интерактивных частей (меню, формы, калькулятор, аккордеон, галерея, анимации). Motion подключён через `LazyMotion` + `domAnimation` (меньший бандл).

## 4. Паттерны 21st.dev (этап 2 ТЗ)

Код компонентов не копировался «как есть»: паттерны переписаны под единую систему токенов (`app/globals.css`, `@theme`) — один акцент, умеренные радиусы, тонкие линии, моноширинные технические метки.

| Паттерн (категория 21st.dev) | Где | Что оставлено / изменено |
|---|---|---|
| Text animation (word reveal) | заголовок Hero | появление по словам из-под маски; для скринридеров — цельная строка |
| Background (animated grid / beams) | Hero, CTA, секции | только CSS/SVG: сетка, точки, пунктирные «схемы», скан-линия; без WebGL и «облаков» |
| Spotlight / animated border card | карточки услуг | подсветка за курсором + анимированная верхняя граница; на мобильном — tap вместо hover |
| Number ticker | показатели | работает только для реальных чисел; иначе плейсхолдер |
| Scroll animation (timeline) | «Як ми працюємо» | горизонтальная шкала на desktop, вертикальный stepper на mobile |
| Accordion | FAQ | WAI-ARIA паттерн, плавная высота |
| Testimonials carousel | отзывы | CSS scroll-snap + стрелки, без библиотек |
| Marquee | марки | включается от 6 марок, пауза при наведении |
| Navigation (floating / hide-on-scroll) | Header | blur + граница при скролле, прячется вниз / появляется вверх, полноэкранное меню |
| CTA | финальный блок, плавающая кнопка | адаптированы к общему стилю |

## 5. Проверено

- `tsc` и `next build` — без ошибок; главная страница статическая.
- Нет горизонтального скролла на 375 / 390 / 430 / 768 / 1024 / 1440 / 1920 px, ошибок в консоли браузера нет.
- Мобильное меню: фокус внутри, Esc закрывает; диалог записи: валидация, фокус на первое ошибочное поле, состояния «Надсилаємо… / помилка / Дякуємо!».
- Калькулятор: 3 шага → результат → запись с переданным контекстом.
- API: 422 на невалидные данные, honeypot отсекает ботов.
- `prefers-reduced-motion` учитывается (MotionConfig + CSS).
