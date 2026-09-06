import { FamilyExperience } from "@/components/landing/FamilyExperience";
import { Features } from "@/components/landing/Features";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Navbar } from "@/components/landing/Navbar";
import { PregnancyJourney } from "@/components/landing/PregnancyJourney";
import { PrivacySection } from "@/components/landing/PrivacySection";
import { ProblemSection } from "@/components/landing/ProblemSection";

export default function Home() {
  return (
    <div id="top" className="flex min-h-full flex-col overflow-x-clip">
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <PregnancyJourney />
        <FamilyExperience />
        <Features />
        <PrivacySection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
