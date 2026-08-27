import { BookingProvider } from "@/components/BookingProvider";
import { BookingModal } from "@/components/BookingModal";
import { Header } from "@/components/Header";
import { MobileCtaBar } from "@/components/MobileCtaBar";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Build } from "@/components/sections/Build";
import { Process } from "@/components/sections/Process";
import { Answers } from "@/components/sections/Answers";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <BookingProvider>
      <Reveal />
      <Header />
      <main>
        <Hero />
        <Problem />
        <Build />
        <Process />
        <Answers />
        <Contact />
      </main>
      <Footer />
      <MobileCtaBar />
      <BookingModal />
    </BookingProvider>
  );
}
