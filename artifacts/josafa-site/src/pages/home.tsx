import { HeroSection } from "@/components/sections/hero";
import { AboutSection } from "@/components/sections/about";
import { ServicesSection } from "@/components/sections/services";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { BookingSection } from "@/components/sections/booking";
import { BeforeAfterVideoSection } from "@/components/sections/before-after-video";
import { CursoSection } from "@/components/sections/curso";

export function Home() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <AboutSection />
      <BeforeAfterVideoSection />
      <CursoSection />
      <HowItWorksSection />
      <ServicesSection />
      <BookingSection />
    </div>
  );
}
