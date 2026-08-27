import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { StickyBars } from "@/components/StickyBars";
import { Hero } from "@/components/sections/Hero";
import { Calculator } from "@/components/sections/Calculator";
import { Build } from "@/components/sections/Build";
import { Proof } from "@/components/sections/Proof";
import { Process } from "@/components/sections/Process";
import { Promise as PromiseSection } from "@/components/sections/Promise";
import { Answers } from "@/components/sections/Answers";
import { Booking } from "@/components/sections/Booking";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Reveal />
      <Header />
      <main>
        <Hero />
        <Calculator />
        <Build />
        <Proof />
        <Process />
        <PromiseSection />
        <Answers />
        <Booking />
      </main>
      <Footer />
      <StickyBars />
    </>
  );
}
