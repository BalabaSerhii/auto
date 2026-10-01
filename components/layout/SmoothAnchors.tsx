"use client";

import { useEffect } from "react";
import { scrollToId } from "@/lib/smooth-scroll";

/** Перехоплює кліки по якорях (#services тощо) і плавно прокручує до секції */
export function SmoothAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;
      const id = decodeURIComponent(link.getAttribute("href")!.slice(1));
      if (scrollToId(id)) {
        e.preventDefault();
        // Для клавіатури та скрінрідерів переносимо фокус у секцію
        const target = id && id !== "top" ? document.getElementById(id) : document.getElementById("main");
        if (target && e.detail === 0) {
          target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
        }
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
