import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { FloatCta } from "@/components/FloatCta";
import { Hero } from "@/components/sections/Hero";
import { Hours } from "@/components/sections/Hours";
import { Build } from "@/components/sections/Build";
import { Proof } from "@/components/sections/Proof";
import { Process } from "@/components/sections/Process";
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
        <Hours />
        <Build />
        <Proof />
        <Process />
        <Answers />
        <Booking />
      </main>
      <Footer />
      <FloatCta />
    </>
  );
}
