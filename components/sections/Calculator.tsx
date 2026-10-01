"use client";

import { ArrowLeft, ArrowRight, RotateCcw, ScanLine } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { calcCategories, calcOldestYear, calcSteps } from "@/data/calculator";
import { pricing } from "@/data/pricing";
import { cn, priceLabel } from "@/lib/utils";
import { useBooking } from "@/components/booking/BookingProvider";
import { buttonClass } from "@/components/ui/Button";
import { Ph } from "@/components/ui/Typography";

type State = { category: string; brand: string; model: string; year: string; description: string };
const initial: State = { category: "", brand: "", model: "", year: "", description: "" };

/** Швидкий калькулятор орієнтовної вартості: 3 кроки + результат */
export function Calculator() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [moved, setMoved] = useState(false);
  const [data, setData] = useState<State>(initial);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const mounted = useRef(false);
  const uid = useId();
  const { open } = useBooking();

  const category = calcCategories.find((c) => c.id === data.category);
  const years = useMemo(() => {
    const now = new Date().getFullYear();
    return Array.from({ length: now - calcOldestYear + 1 }, (_, i) => String(now - i));
  }, []);

  // Після зміни кроку переносимо фокус на заголовок — для клавіатури та скрінрідерів
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  const canNext = step === 0 ? !!data.category : step === 1 ? data.brand.trim().length >= 2 : true;
  const go = (to: number) => {
    setMoved(true);
    setDir(to > step ? 1 : -1);
    setStep(to);
  };

  const priceItems = category ? pricing.filter((p) => category.priceIds.includes(p.id)) : [];
  const car = [data.brand, data.model, data.year].filter(Boolean).join(" ");

  const summary = [
    category ? `Калькулятор: ${category.label}` : null,
    car ? `Авто: ${car}` : null,
    data.description.trim() ? `Опис: ${data.description.trim()}` : null,
  ]
    .filter(Boolean)
    .join(". ");

  return (
    <div className="relative overflow-hidden rounded-xl border border-line-strong bg-surface shadow-card">
      {/* Прогрес */}
      <div className="border-b border-line px-5 pt-5 pb-4 sm:px-7">
        <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.12em] uppercase">
          <span className="text-accent">Крок {Math.min(step + 1, 3)} / 3</span>
          <span className="text-subtle">Орієнтовна вартість</span>
        </div>
        <ol className="mt-3 grid grid-cols-4 gap-1.5" aria-label="Кроки калькулятора">
          {calcSteps.map((label, i) => (
            <li key={label} className="relative h-1 overflow-hidden rounded-full bg-fg/8">
              <span className="sr-only">
                {label}
                {i < step ? " — виконано" : i === step ? " — поточний" : ""}
              </span>
              <span aria-hidden className={cn("absolute inset-0 origin-left bg-accent transition-transform duration-500 ease-out-expo", i <= step ? "scale-x-100" : "scale-x-0")} />
            </li>
          ))}
        </ol>
      </div>

      <div className="relative min-h-[26rem] px-5 py-6 sm:px-7 sm:py-7">
        {/* Новий крок монтується заново (key) і в'їжджає з боку напрямку руху */}
        <div key={step} className={moved ? (dir > 0 ? "anim-step-right" : "anim-step-left") : undefined}>
            <h3 ref={headingRef} tabIndex={-1} className="text-2xl font-semibold tracking-[-0.02em] outline-none">
              {calcSteps[step]}
            </h3>

            {step === 0 && (
              <fieldset className="mt-5">
                <legend className="sr-only">Оберіть, що потрібно автомобілю</legend>
                <div className="grid grid-cols-2 gap-2">
                  {calcCategories.map((c) => {
                    const checked = data.category === c.id;
                    return (
                      <label
                        key={c.id}
                        className={cn(
                          "relative flex min-h-[4.5rem] cursor-pointer flex-col justify-center rounded-md border px-3.5 py-3 transition-[border-color,background-color] duration-300 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                          checked ? "border-accent bg-accent-soft" : "border-line-strong hover:border-fg/30 hover:bg-fg/3",
                        )}
                      >
                        <input type="radio" name={`${uid}-category`} value={c.id} checked={checked} onChange={() => setData((d) => ({ ...d, category: c.id }))} className="sr-only" />
                        <span className="text-[15px] font-semibold">{c.label}</span>
                        <span className="mt-0.5 text-xs leading-snug text-muted">{c.hint}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <div className="mt-5 grid gap-4">
                <CalcField label="Марка" id={`${uid}-brand`} required>
                  <input id={`${uid}-brand`} type="text" value={data.brand} onChange={(e) => setData((d) => ({ ...d, brand: e.target.value }))} placeholder="Напр. Toyota" className={calcInput} autoComplete="off" />
                </CalcField>
                <div className="grid grid-cols-[1fr_8rem] gap-3">
                  <CalcField label="Модель" id={`${uid}-model`}>
                    <input id={`${uid}-model`} type="text" value={data.model} onChange={(e) => setData((d) => ({ ...d, model: e.target.value }))} placeholder="Напр. RAV4" className={calcInput} autoComplete="off" />
                  </CalcField>
                  <CalcField label="Рік" id={`${uid}-year`}>
                    <select id={`${uid}-year`} value={data.year} onChange={(e) => setData((d) => ({ ...d, year: e.target.value }))} className={cn(calcInput, "cursor-pointer", !data.year && "text-subtle")}>
                      <option value="">—</option>
                      {years.map((y) => (
                        <option key={y} value={y} className="bg-surface-2 text-fg">
                          {y}
                        </option>
                      ))}
                    </select>
                  </CalcField>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="mt-5">
                <CalcField label="Опишіть своїми словами" id={`${uid}-desc`}>
                  <textarea
                    id={`${uid}-desc`}
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData((d) => ({ ...d, description: e.target.value }))}
                    placeholder="Напр.: стукає спереду справа на нерівностях, з'явилось тиждень тому"
                    className={cn(calcInput, "h-auto resize-none py-3")}
                    maxLength={500}
                  />
                </CalcField>
                <p className="mt-2 text-sm text-muted">Необов&apos;язково, але так ми швидше зорієнтуємось.</p>
              </div>
            )}

            {step === 3 && category && (
              <div className="mt-5" aria-live="polite">
                {category.mode === "estimate" ? (
                  <>
                    <p className="font-mono text-[11px] tracking-[0.12em] text-accent uppercase">Попередня оцінка</p>
                    <ul className="mt-3 divide-y divide-line rounded-md border border-line">
                      {priceItems.map((p) => (
                        <li key={p.id} className="flex items-baseline justify-between gap-4 px-4 py-3.5">
                          <span className="text-[15px]">{p.title}</span>
                          <span className="shrink-0 font-semibold tabular-nums">
                            <Ph>{priceLabel(p.priceFrom)}</Ph>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      Це стартова вартість робіт. Остаточну суму назвемо після огляду{car ? ` ${car}` : ""} — і погодимо її з вами до початку ремонту.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="flex gap-4 rounded-md border border-accent/30 bg-accent-soft p-4">
                      <ScanLine className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden />
                      <div>
                        <p className="font-semibold">Потрібна діагностика для визначення вартості</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                          Без огляду можна лише вгадувати. Після діагностики пояснимо, що саме несправне, і погодимо вартість ремонту.
                        </p>
                      </div>
                    </div>
                    {priceItems.length > 0 ? (
                      <ul className="mt-3 divide-y divide-line rounded-md border border-line">
                        {priceItems.map((p) => (
                          <li key={p.id} className="flex items-baseline justify-between gap-4 px-4 py-3.5">
                            <span className="text-[15px]">{p.title}</span>
                            <span className="shrink-0 font-semibold tabular-nums">
                              <Ph>{priceLabel(p.priceFrom)}</Ph>
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() =>
                      open({
                        context: summary,
                        service: category.mode === "diagnosis" ? "Діагностика" : category.label,
                        title: category.mode === "diagnosis" ? "Запис на діагностику" : "Отримати консультацію",
                      })
                    }
                    className={buttonClass("primary", "lg", "w-full sm:w-auto")}
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      {category.mode === "diagnosis" ? "Записатися на діагностику" : "Отримати консультацію"}
                      <ArrowRight className="size-4" aria-hidden />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setData(initial);
                      go(0);
                    }}
                    className={buttonClass("ghost", "lg", "w-full text-muted sm:w-auto")}
                  >
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <RotateCcw className="size-4" aria-hidden />
                      Спочатку
                    </span>
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>

      {step < 3 ? (
        <div className="flex items-center justify-between gap-3 border-t border-line px-5 py-4 sm:px-7">
          <button
            type="button"
            onClick={() => go(step - 1)}
            disabled={step === 0}
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-2 text-sm font-medium text-muted transition-colors hover:text-fg disabled:invisible"
          >
            <ArrowLeft className="size-4" aria-hidden />
            Назад
          </button>
          <button type="button" onClick={() => go(step + 1)} disabled={!canNext} className={buttonClass(canNext ? "primary" : "secondary", "md")}>
            <span className="relative z-10 inline-flex items-center gap-2">
              {step === 2 ? "Показати результат" : "Далі"}
              <ArrowRight className="size-4" aria-hidden />
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}

const calcInput =
  "h-12 w-full rounded-md border border-line-strong bg-fg/3 px-4 text-[15px] text-fg placeholder:text-subtle outline-none transition-[border-color,box-shadow] duration-300 hover:border-fg/25 focus:border-accent focus:ring-4 focus:ring-accent/15 focus-visible:outline-none";

function CalcField({ label, id, required, children }: { label: string; id: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-metal">
        {label}
        {required ? <span className="text-accent"> *</span> : null}
      </label>
      {children}
    </div>
  );
}
