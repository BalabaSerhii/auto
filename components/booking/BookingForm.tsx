"use client";

import Link from "next/link";
import { ArrowRight, Check, ChevronDown, CircleAlert, LoaderCircle, Phone, RotateCcw } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { services } from "@/data/services";
import { site } from "@/data/site";
import { cn, telHref } from "@/lib/utils";
import { hasErrors, validateBooking, type BookingErrors, type BookingInput } from "@/lib/validation";
import { buttonClass } from "@/components/ui/Button";

type Status = "idle" | "loading" | "error" | "success";
type Variant = "full" | "compact";

const serviceOptions = [...services.map((s) => s.title), "Інше / не знаю, що зламалось"];

const empty: BookingInput = { name: "", phone: "", brand: "", model: "", service: "", date: "", comment: "", consent: false, company: "" };

export function BookingForm({
  variant = "full",
  context,
  defaultService,
  onDone,
  className,
}: {
  variant?: Variant;
  context?: string;
  defaultService?: string;
  onDone?: () => void;
  className?: string;
}) {
  const [values, setValues] = useState<BookingInput>({ ...empty, service: defaultService ?? "" });
  const [errors, setErrors] = useState<BookingErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof BookingInput, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [round, setRound] = useState(0);
  const [minDate, setMinDate] = useState<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const phoneLink = telHref();

  useEffect(() => {
    const d = new Date();
    setMinDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
  }, []);

  const set = <K extends keyof BookingInput>(key: K, value: BookingInput[K]) => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (submitted || touched[key]) setErrors(validateBooking(next, variant));
  };

  const blur = (key: keyof BookingInput) => {
    setTouched((t) => ({ ...t, [key]: true }));
    setErrors(validateBooking(values, variant));
  };

  const visibleError = (key: keyof BookingInput) => (submitted || touched[key] ? errors[key] : undefined);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    const found = validateBooking(values, variant);
    setErrors(found);
    if (hasErrors(found)) {
      const first = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, context, variant }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const reset = () => {
    setValues({ ...empty, service: defaultService ?? "" });
    setErrors({});
    setTouched({});
    setSubmitted(false);
    setStatus("idle");
    setRound((r) => r + 1);
  };

  const field = (key: keyof BookingInput) => {
    const id = `${uid}-${key}`;
    const err = visibleError(key);
    return {
      id,
      name: key,
      "aria-invalid": err ? true : undefined,
      "aria-describedby": err ? `${id}-error` : undefined,
      onBlur: () => blur(key),
    } as const;
  };

  return (
    <div className={cn("relative", className)}>
        {status === "success" ? (
          <div role="status" className="anim-fade-up flex flex-col items-start gap-5 py-6">
            <span
              className="anim-pop grid size-14 place-items-center rounded-full bg-success/15 text-success ring-1 ring-success/40"
            >
              <Check className="size-7" strokeWidth={2.2} aria-hidden />
            </span>
            <div>
              <p className="text-2xl font-semibold tracking-[-0.02em]">Дякуємо!</p>
              <p className="mt-2 max-w-sm text-muted">Ми отримали вашу заявку та зв&apos;яжемося з вами.</p>
            </div>
            <button type="button" onClick={onDone ?? reset} className={buttonClass("secondary", "md")}>
              {onDone ? "Закрити" : "Надіслати ще одну заявку"}
            </button>
          </div>
        ) : (
          <form
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            className={cn("grid gap-4", round > 0 && "anim-fade-in")}
            aria-busy={status === "loading"}
          >
            {/* honeypot */}
            <div aria-hidden className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
              <label>
                Компанія
                <input tabIndex={-1} autoComplete="off" value={values.company} onChange={(e) => set("company", e.target.value)} name="company" />
              </label>
            </div>

            <div className={cn("grid gap-4", variant === "full" && "sm:grid-cols-2")}>
              <Field label="Ім'я" required error={visibleError("name")} id={`${uid}-name`}>
                <input
                  {...field("name")}
                  data-autofocus
                  type="text"
                  autoComplete="name"
                  placeholder="Як до вас звертатися"
                  value={values.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass(!!visibleError("name"))}
                />
              </Field>
              <Field label="Телефон" required error={visibleError("phone")} id={`${uid}-phone`}>
                <input
                  {...field("phone")}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="+380 __ ___ __ __"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  className={inputClass(!!visibleError("phone"))}
                />
              </Field>
            </div>

            {variant === "full" ? (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Марка автомобіля" id={`${uid}-brand`} error={visibleError("brand")}>
                    <input {...field("brand")} type="text" autoComplete="off" placeholder="Напр. Volkswagen" value={values.brand} onChange={(e) => set("brand", e.target.value)} className={inputClass(!!visibleError("brand"))} />
                  </Field>
                  <Field label="Модель" id={`${uid}-model`} error={visibleError("model")}>
                    <input {...field("model")} type="text" autoComplete="off" placeholder="Напр. Golf" value={values.model} onChange={(e) => set("model", e.target.value)} className={inputClass(!!visibleError("model"))} />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Що потрібно зробити?" required id={`${uid}-service`} error={visibleError("service")}>
                    <div className="relative">
                      <select {...field("service")} value={values.service} onChange={(e) => set("service", e.target.value)} className={cn(inputClass(!!visibleError("service")), "cursor-pointer appearance-none pr-10", !values.service && "text-subtle")}>
                        <option value="" disabled>
                          Оберіть послугу
                        </option>
                        {serviceOptions.map((s) => (
                          <option key={s} value={s} className="bg-surface-2 text-fg">
                            {s}
                          </option>
                        ))}
                      </select>
                      <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-muted" />
                    </div>
                  </Field>
                  <Field label="Бажана дата" id={`${uid}-date`} error={visibleError("date")}>
                    <input {...field("date")} type="date" min={minDate} value={values.date} onChange={(e) => set("date", e.target.value)} className={cn(inputClass(!!visibleError("date")), !values.date && "text-subtle")} />
                  </Field>
                </div>
                <Field label="Коментар" id={`${uid}-comment`} error={visibleError("comment")}>
                  <textarea {...field("comment")} rows={3} placeholder="Що турбує: звук, помилка на панелі, пробіг до ТО…" value={values.comment} onChange={(e) => set("comment", e.target.value)} className={cn(inputClass(!!visibleError("comment")), "h-auto resize-y py-3")} />
                </Field>
              </>
            ) : null}

            {context ? (
              <div className="rounded-md border border-line bg-fg/2 px-4 py-3 text-sm text-muted">
                <span className="mb-1 block font-mono text-[11px] tracking-[0.12em] text-subtle uppercase">До заявки буде додано</span>
                {context}
              </div>
            ) : null}

            <div>
              <label htmlFor={`${uid}-consent`} className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-muted">
                <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
                  <input
                    {...field("consent")}
                    type="checkbox"
                    checked={values.consent}
                    onChange={(e) => set("consent", e.target.checked)}
                    className={cn(
                      "peer size-5 cursor-pointer appearance-none rounded-[5px] border bg-fg/3 transition-colors checked:border-accent checked:bg-accent",
                      visibleError("consent") ? "border-danger" : "border-line-strong",
                    )}
                  />
                  <Check aria-hidden className="pointer-events-none absolute size-3.5 text-accent-ink opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                </span>
                <span>
                  Погоджуюся на обробку персональних даних відповідно до{" "}
                  <Link href="/privacy" className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent" target="_blank">
                    Політики конфіденційності
                  </Link>
                  . Дані використовуються лише для зв&apos;язку щодо вашого запису.
                </span>
              </label>
              <ErrorText id={`${uid}-consent-error`} message={visibleError("consent")} />
            </div>

            {status === "error" ? (
                <div role="alert" className="anim-fade-down">
                  <div className="flex gap-3 rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-fg">
                    <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                    <p>
                      Не вдалося надіслати заявку. Спробуйте ще раз або{" "}
                      {phoneLink ? (
                        <a href={phoneLink} className="font-semibold underline underline-offset-4">
                          зателефонуйте нам
                        </a>
                      ) : (
                        "зателефонуйте нам"
                      )}
                      .
                    </p>
                  </div>
                </div>
              ) : null}

            <div className={cn("flex flex-col gap-3", variant === "full" && "sm:flex-row")}>
              <button type="submit" disabled={status === "loading"} className={buttonClass("primary", "lg", "w-full sm:w-auto sm:min-w-52")}>
                <span className="relative z-10 inline-flex items-center gap-2">
                  {status === "loading" ? (
                    <>
                      <LoaderCircle className="size-5 animate-spin" aria-hidden />
                      Надсилаємо...
                    </>
                  ) : status === "error" ? (
                    <>
                      <RotateCcw className="size-4" aria-hidden />
                      Спробувати ще раз
                    </>
                  ) : (
                    <>
                      Записатися
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
                    </>
                  )}
                </span>
              </button>
              {variant === "full" && phoneLink ? (
                <a href={phoneLink} className={buttonClass("secondary", "lg", "w-full sm:w-auto")}>
                  <span className="relative z-10 inline-flex items-center gap-2">
                    <Phone className="size-4" aria-hidden />
                    Зателефонувати
                  </span>
                </a>
              ) : null}
            </div>
            {variant === "full" && !phoneLink ? (
              <p className="text-sm text-subtle">
                Або зателефонуйте: <span className="placeholder-data">{site.phone}</span>
              </p>
            ) : null}
          </form>
        )}
    </div>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "h-12 w-full rounded-md border bg-fg/3 px-4 text-[15px] text-fg placeholder:text-subtle transition-[border-color,background-color,box-shadow] duration-300 outline-none",
    "hover:border-fg/25 focus:border-accent focus:bg-fg/5 focus:ring-4 focus:ring-accent/15 focus-visible:outline-none",
    invalid ? "border-danger/70 focus:border-danger focus:ring-danger/15" : "border-line-strong",
  );
}

function Field({ label, id, required, error, children }: { label: string; id: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={id} className="text-sm font-medium text-metal">
        {label}
        {required ? (
          <span className="text-accent" aria-hidden>
            {" "}
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (обов&apos;язкове поле)</span> : null}
      </label>
      {children}
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

/** Помилка поля: плавно розкривається й згортається (CSS grid-rows), текст лишається на час згортання */
function ErrorText({ id, message }: { id: string; message?: string }) {
  const last = useRef(message);
  if (message) last.current = message;
  const shown = !!message;
  return (
    <div className={cn("grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out-expo", shown ? "grid-rows-[1fr] opacity-100" : "-mt-2 grid-rows-[0fr] opacity-0")}>
      <p id={shown ? id : undefined} className="flex items-center gap-1.5 overflow-hidden text-[13px] text-danger" aria-hidden={!shown}>
        <CircleAlert className="size-3.5 shrink-0" aria-hidden />
        {last.current}
      </p>
    </div>
  );
}
