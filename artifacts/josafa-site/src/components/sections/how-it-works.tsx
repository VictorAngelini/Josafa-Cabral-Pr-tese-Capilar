import { CalendarCheck, Scissors, Sparkles } from "lucide-react";

export function HowItWorksSection() {
  const steps = [
    {
      icon: <CalendarCheck className="w-8 h-8 text-primary-foreground" />,
      title: "1. Consulta",
      description: "Uma avaliação detalhada e particular para entender suas necessidades, analisar seu perfil e planejar a melhor solução para o seu caso."
    },
    {
      icon: <Scissors className="w-8 h-8 text-primary-foreground" />,
      title: "2. Aplicação",
      description: "Em um ambiente privativo, realizamos a aplicação da prótese com técnicas de alta precisão e produtos dermatologicamente testados."
    },
    {
      icon: <Sparkles className="w-8 h-8 text-primary-foreground" />,
      title: "3. Transformação",
      description: "O corte e estilização finais que integram perfeitamente a prótese ao seu cabelo natural, devolvendo sua imagem e confiança."
    }
  ];

  return (
    <section className="py-24 bg-primary text-primary-foreground">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Como Funciona</h2>
          <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">
            Um processo simples, seguro e focado na sua total satisfação.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          {/* Connector line for desktop */}
          <div className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-[2px] bg-secondary/30 z-0"></div>

          {steps.map((step, index) => (
            <div key={index} className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6 shadow-xl border-4 border-primary">
                {step.icon}
              </div>
              <h3 className="text-2xl font-serif font-semibold mb-4">{step.title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
