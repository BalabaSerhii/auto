# Деплой: GitHub → Cloudflare Workers → домен autoekspert.ua

Проект уже подготовлен к Cloudflare (адаптер `@opennextjs/cloudflare`, файлы `wrangler.jsonc`, `open-next.config.ts`).
Сборка проверена локально: сайт, API заявок и оптимизация изображений работают на рантайме Workers, размер воркера ≈ 2 МБ (gzip) — помещается в бесплатный тариф (лимит 3 МБ).

Почему Workers, а не Pages: у сайта есть серверный API `/api/booking` (отправка заявок), поэтому нужен полноценный рантайм. Cloudflare рекомендует для Next.js именно Workers + OpenNext.

---

## Шаг 1. Новый репозиторий на GitHub

1. Откройте https://github.com/new
2. **Repository name:** `autoekspert-site` (любое)
3. **Private** — рекомендуется.
4. **Не** добавляйте README, .gitignore и лицензию — репозиторий должен быть пустым.
5. Нажмите **Create repository** и скопируйте адрес вида `https://github.com/ВАШ_ЛОГИН/autoekspert-site.git`.

> Файл `TZ111.docx` (техзадание) лежит в папке проекта и попадёт в репозиторий. Если не нужно — добавьте строку `TZ111.docx` в `.gitignore` перед первым коммитом.

## Шаг 2. Загрузить код

В терминале в папке `E:\project\auto`:

```bash
git init
git add .
git commit -m "Сайт АвтоЕксперт"
git branch -M main
git remote add origin https://github.com/ВАШ_ЛОГИН/autoekspert-site.git
git push -u origin main
```

При первом `push` Git попросит войти в GitHub (откроется окно браузера).
Секреты не попадут в репозиторий: `.env*`, `.dev.vars`, `node_modules`, `.next`, `.open-next` уже в `.gitignore`.

## Шаг 3. Подключить репозиторий к Cloudflare

1. Зарегистрируйтесь / войдите на https://dash.cloudflare.com
2. Слева **Compute (Workers) → Workers & Pages → Create** → вкладка **Workers** → **Import a repository**.
3. **Connect GitHub** → разрешите доступ к репозиторию `autoekspert-site`.
4. Настройки проекта:

| Поле | Значение |
|---|---|
| Project name | `autoekspert` (**должно совпадать** с `name` в `wrangler.jsonc`) |
| Production branch | `main` |
| Build command | `npx opennextjs-cloudflare build` |
| Deploy command | `npx opennextjs-cloudflare deploy` |
| Non-production branch deploy command | `npx opennextjs-cloudflare upload` |
| Root directory | `/` (пусто) |

5. Нажмите **Create and deploy**. Первая сборка занимает 2–4 минуты.
6. После сборки сайт откроется по адресу вида `https://autoekspert.<ваш-аккаунт>.workers.dev` — проверьте его.

Дальше всё автоматически: каждый `git push` в `main` → новая сборка и деплой.

## Шаг 4. Секреты для формы заявок (обязательно)

Без этого форма на продакшене покажет ошибку «Не вдалося надіслати заявку» — заявки не теряются молча, но и не доходят.

### Telegram-бот (рекомендуется)
1. В Telegram откройте **@BotFather** → `/newbot` → придумайте имя → получите **токен** вида `123456:ABC...`.
2. Напишите своему боту любое сообщение (или добавьте бота в рабочую группу и напишите там).
3. Откройте в браузере `https://api.telegram.org/bot<ТОКЕН>/getUpdates` и найдите `"chat":{"id": ...}` — это **TELEGRAM_CHAT_ID** (для группы число начинается с `-`).

### Добавить в Cloudflare
**Workers & Pages → autoekspert → Settings → Variables and Secrets → Add:**

| Тип | Имя | Значение |
|---|---|---|
| Secret | `TELEGRAM_BOT_TOKEN` | токен бота |
| Text | `TELEGRAM_CHAT_ID` | id чата |

(Альтернатива — `BOOKING_WEBHOOK_URL` для CRM/Make/Zapier.)

После сохранения нажмите **Deploy** (или сделайте любой `git push`), затем отправьте тестовую заявку с сайта.

## Шаг 5. Подключить домен autoekspert.ua

### 5.1. Перенести DNS домена в Cloudflare
1. В Cloudflare: **Account Home → Onboard a domain** (Add a domain) → `autoekspert.ua` → тариф **Free**.
2. Cloudflare просканирует текущие DNS-записи. **Проверьте, что перенеслись MX и TXT-записи почты** (SPF, DKIM) — иначе перестанет работать `info@autoekspert.ua`. Если чего-то нет — скопируйте вручную из панели текущего DNS/почтового провайдера.
3. Удалите старые записи `A`/`AAAA`/`CNAME` для `autoekspert.ua` и `www`, если они указывают на старый хостинг (почтовые записи **не трогайте**).
4. Cloudflare выдаст **два NS-сервера** вида `xxx.ns.cloudflare.com`.
5. В панели регистратора домена `.ua` (где покупали домен: imena.ua, nic.ua, ukrnames и т. п.) замените NS-серверы на эти два.
6. Ждите статус **Active** в Cloudflare — обычно 1–2 часа, максимум до 24 часов. Придёт письмо.

### 5.2. Привязать домен к сайту
1. **Workers & Pages → autoekspert → Settings → Domains & Routes → Add → Custom domain**.
2. Введите `autoekspert.ua` → **Add domain**. DNS-запись и SSL-сертификат Cloudflare создаст сам.
3. Повторите для `www.autoekspert.ua`.

### 5.3. Редирект www → без www
**Домен autoekspert.ua → Rules → Redirect Rules → Create rule → шаблон «Redirect from WWW to root»** → Deploy.

### 5.4. HTTPS
**SSL/TLS → Overview:** режим **Full (strict)**. **SSL/TLS → Edge Certificates:** включите **Always Use HTTPS**.

Готово: сайт открывается по `https://autoekspert.ua`.

## Шаг 6. После запуска

- **Google Search Console** (https://search.google.com/search-console): добавьте `autoekspert.ua` (подтверждение через DNS-запись TXT в Cloudflare) и отправьте карту сайта `https://autoekspert.ua/sitemap.xml`.
- **Google Business Profile**: создайте/обновите карточку СТО с тем же адресом, телефоном и графиком — это главное для локального поиска «СТО Київ».
- Проверьте разметку: https://search.google.com/test/rich-results → `https://autoekspert.ua`.

## Полезные команды

```bash
npm run dev       # локальная разработка (http://localhost:3000)
npm run preview   # сборка под Cloudflare + запуск на рантайме Workers (http://localhost:8787)
npm run deploy    # ручной деплой с компьютера (нужен `npx wrangler login`)
```

Для `npm run preview` с отправкой заявок скопируйте `.dev.vars.example` → `.dev.vars` и заполните.

## Лимиты бесплатного тарифа Cloudflare

- Workers: 100 000 запросов в день.
- Workers Builds: сборки из GitHub, бесплатные минуты сборки ежемесячно.
- Cloudflare Images (оптимизация фото `next/image`): бесплатный лимит уникальных преобразований в месяц. Для сайта такого размера хватает с запасом.
