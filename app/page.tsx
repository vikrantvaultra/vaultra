import { AuditModal } from "@/components/AuditModal";
import { Header } from "@/components/Header";
import { Reveal } from "@/components/Reveal";
import { Hero } from "@/components/sections/Hero";
import { Stats } from "@/components/sections/Stats";
import { Contrast } from "@/components/sections/Contrast";
import { Build } from "@/components/sections/Build";
import { Roi } from "@/components/sections/Roi";
import { Proof } from "@/components/sections/Proof";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { Footer } from "@/components/sections/Footer";

export default function Page() {
  return (
    <>
      <Reveal />
      <Header />
      <main>
        <Hero />
        <Stats />
        <Contrast />
        <Build />
        <Roi />
        <Proof />
      </main>
      <TrustStrip />
      <Footer />
      <AuditModal />
    </>
  );
}
