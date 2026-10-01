export const THEME_KEY = "theme";
export const THEME_COLORS = { dark: "#0a0a0b", light: "#f2f2ef" } as const;

/**
 * Скрипт для початку <body>: виставляє тему до першого малювання — без «спалаху»,
 * і клас .js (анімації появи ховають блоки лише коли JavaScript працює).
 * За замовчуванням — темна тема.
 */
export const themeInitScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"){document.documentElement.dataset.theme="light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="${THEME_COLORS.light}"}}catch(e){}`;
