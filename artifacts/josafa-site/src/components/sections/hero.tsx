import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const scrollToBooking = () => {
    document.getElementById("agendamento")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center pt-16 md:pt-20 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.png" 
          alt="Studio Interior" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-transparent"></div>
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      <div className="container relative z-10 px-4 md:px-6 mx-auto">
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm">
            Especialistas em Prótese Capilar
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary font-bold leading-tight tracking-tight">
            Recupere sua <br />
            <span className="text-secondary italic">Autoestima</span>
          </h1>
          
          <p className="text-lg md:text-xl text-primary/80 leading-relaxed max-w-xl">
            Soluções capilares naturais e sofisticadas em um ambiente privado e acolhedor. Nossa missão é transformar sua vida através da arte da prótese capilar.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button 
              size="lg" 
              onClick={scrollToBooking}
              className="bg-primary text-primary-foreground hover:bg-primary/90 text-base px-8 py-6 h-auto group"
            >
              Agendar Avaliação
              <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => document.getElementById("sobre")?.scrollIntoView({ behavior: "smooth" })}
              className="border-primary/20 text-primary hover:bg-primary/5 text-base px-8 py-6 h-auto bg-background/50 backdrop-blur-sm"
            >
              Conheça o Studio
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
