import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { Benefits } from "@/components/sections/Benefits";
import { Stats } from "@/components/sections/Stats";
import { Process } from "@/components/sections/Process";
import { Brands } from "@/components/sections/Brands";
import { Pricing } from "@/components/sections/Pricing";
import { Gallery } from "@/components/sections/Gallery";
import { Testimonials } from "@/components/sections/Testimonials";
import { FAQ } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Contact } from "@/components/sections/Contact";

/**
 * Порядок секцій відповідає головному шляху користувача:
 * зрозумів, що це → послуги → переваги → процес → ціни → докази → запис.
 */
export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <Services />
        <Benefits />
        <Stats />
        <Process />
        <Brands />
        <Pricing />
        <Gallery />
        <Testimonials />
        <FAQ />
        <FinalCTA />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
