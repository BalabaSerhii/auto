export const THEME_KEY = "theme";
export const THEME_COLORS = { dark: "#0a0a0b", light: "#f2f2ef" } as const;

/**
 * Скрипт для початку <body>: виставляє тему до першого малювання — без «спалаху».
 * За замовчуванням — темна тема.
 */
export const themeInitScript = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"){document.documentElement.dataset.theme="light";var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="${THEME_COLORS.light}"}}catch(e){}`;
