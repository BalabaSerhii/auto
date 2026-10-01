"use client";

import { useInViewOnce } from "@/lib/motion-lite";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap } from "leaflet";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/**
 * Карта в стилі сайту: тайли OpenStreetMap, приведені CSS-фільтрами до
 * монохрому під темну/світлу тему (див. .styled-map у globals.css), власний
 * бурштиновий маркер. Leaflet (JS і CSS) підвантажується лише коли блок
 * наближається до екрана — на швидкість першого екрана він не впливає. Колесо миші карту не масштабує — щоб не заважати прокрутці.
 */
export function LocationMap({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const inView = useInViewOnce(wrapRef, "400px 0px");
  const [ready, setReady] = useState(false);
  const geo = site.address.geo;

  useEffect(() => {
    if (!inView || !geo || !mapRef.current) return;
    let map: LeafletMap | null = null;
    let cancelled = false;

    Promise.all([import("leaflet"), loadLeafletCss()]).then(([L]) => {
      if (cancelled || !mapRef.current) return;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      map = L.map(mapRef.current, {
        center: [geo.lat, geo.lng],
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: false,
        // На телефоні карта не «перехоплює» свайп сторінки: рух — двома пальцями
        dragging: !coarse,
        attributionControl: true,
      });
      L.control.zoom({ position: "bottomright", zoomInTitle: "Наблизити", zoomOutTitle: "Віддалити" }).addTo(map);
      map.attributionControl.setPrefix(false);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "map-pin",
        html: `<span class="map-pin__pulse"></span><span class="map-pin__dot"></span><span class="map-pin__label">${site.name}</span>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });
      L.marker([geo.lat, geo.lng], { icon, keyboard: false, title: `${site.name}: ${site.address.street}` }).addTo(map);
      setReady(true);
    });

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [inView, geo]);

  return (
    <div ref={wrapRef} className={cn("styled-map relative isolate overflow-hidden bg-surface-2", className)}>
      {/* Схема-заглушка, поки карта вантажиться */}
      <svg aria-hidden viewBox="0 0 400 250" preserveAspectRatio="xMidYMid slice" className={cn("absolute inset-0 size-full transition-opacity duration-700", ready && "opacity-0")} fill="none">
        <g stroke="currentColor" strokeOpacity="0.07">
          {Array.from({ length: 12 }, (_, i) => (
            <line key={`v${i}`} x1={i * 36} y1="0" x2={i * 36} y2="250" />
          ))}
          {Array.from({ length: 8 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 36} x2="400" y2={i * 36} />
          ))}
        </g>
        <path d="M-10 170 C80 160 120 120 210 126 S340 80 420 70" stroke="currentColor" strokeOpacity="0.15" strokeWidth="10" />
        <circle cx="200" cy="125" r="7" fill="#f5a524" />
      </svg>
      <div ref={mapRef} className="absolute inset-0 z-0" role="region" aria-label={`Карта: ${site.address.street}, ${site.address.city}`} />
      <div className="glass pointer-events-none absolute top-3 left-3 z-500 rounded-md border border-line-strong px-3 py-2 text-xs">
        <span className="block font-semibold">{site.name}</span>
        <span className="block text-muted">{site.address.street}</span>
      </div>
    </div>
  );
}

const LEAFLET_CSS = "/vendor/leaflet-1.9.4.css";

/** Стилі Leaflet підключаються на вимогу, щоб не блокувати першу відмальовку сторінки */
function loadLeafletCss(): Promise<void> {
  if (document.querySelector(`link[href="${LEAFLET_CSS}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = LEAFLET_CSS;
    link.onload = () => resolve();
    link.onerror = () => resolve();
    document.head.appendChild(link);
  });
}
