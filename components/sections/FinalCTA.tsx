import { ArrowRight, Phone } from "lucide-react";
import { site } from "@/data/site";
import { telHref } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Ph } from "@/components/ui/Typography";

export function FinalCTA() {
  const phone = telHref();
  return (
    <section aria-labelledby="final-cta-title" className="px-3 sm:px-5">
      <Reveal effect="scale" className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-xl border border-line-strong bg-surface px-6 py-16 sm:px-12 sm:py-24">
        <div aria-hidden className="bg-grid mask-radial absolute inset-0 -z-10" />
        <div aria-hidden className="absolute -top-1/2 left-1/2 -z-10 h-full w-2/3 -translate-x-1/2 rounded-full bg-accent/15 blur-[100px]" />
        {/* Схематичні лінії */}
        <svg aria-hidden className="absolute inset-0 -z-10 size-full" preserveAspectRatio="none" viewBox="0 0 1200 400" fill="none">
          <path d="M0 320 H260 L300 280 H520" stroke="rgb(245 165 36 / 0.35)" strokeDasharray="4 8" />
          <path d="M1200 80 H940 L900 120 H700" stroke="currentColor" strokeOpacity="0.15" strokeDasharray="4 8" />
          <circle cx="520" cy="280" r="3" fill="#f5a524" />
          <circle cx="700" cy="120" r="3" fill="currentColor" fillOpacity="0.4" />
        </svg>

        <div className="mx-auto max-w-3xl text-center">
          <h2 id="final-cta-title" className="text-4xl leading-[1.02] font-semibold sm:text-6xl lg:text-7xl">
            Є питання по <span className="text-accent">автомобілю?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted sm:text-xl">Розкажіть, що сталося — підкажемо, з чого почати.</p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#contact" size="lg">
              Записатися на діагностику
              <ArrowRight className="size-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />
            </Button>
            {phone ? (
              <Button href={phone} variant="secondary" size="lg">
                <Phone className="size-4" aria-hidden />
                Зателефонувати
              </Button>
            ) : (
              <p className="self-center text-sm text-muted">
                або телефонуйте: <Ph>{site.phone}</Ph>
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
