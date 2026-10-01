import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/Typography";
import { ServiceGrid } from "./ServiceGrid";

export function Services() {
  return (
    <section id="services" aria-labelledby="services-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          id="services-title"
          index="01"
          eyebrow="Послуги"
          title="Все необхідне для вашого автомобіля"
          lead="Від планового обслуговування до складної діагностики та ремонту."
        />
        <div className="mt-12 sm:mt-16">
          <ServiceGrid services={services} />
        </div>
        <p className="mt-6 text-sm text-muted">
          Не знайшли свою ситуацію?{" "}
          <a href="#estimate" className="text-fg underline decoration-line-strong underline-offset-4 transition-colors hover:decoration-accent">
            Опишіть проблему — підкажемо, з чого почати
          </a>
          .
        </p>
      </div>
    </section>
  );
}
