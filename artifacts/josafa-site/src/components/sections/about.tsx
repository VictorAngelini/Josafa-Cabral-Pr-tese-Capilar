export function AboutSection() {
  return (
    <section id="sobre" className="py-24 bg-card">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl relative z-10">
              <img 
                src="/about.png" 
                alt="Josafá realizando consulta" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative background element */}
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-secondary/20 rounded-full blur-3xl -z-10"></div>
            <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          </div>

          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif text-primary font-semibold">
              Muito mais que estética.<br />
              <span className="text-secondary italic">É sobre identidade.</span>
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                No Josafá Hair & Prótese Capilar, entendemos que a perda de cabelo vai muito além da aparência física. Ela afeta a forma como nos vemos e como nos apresentamos ao mundo.
              </p>
              <p>
                Nosso estúdio foi concebido para ser um santuário de discrição e elegância. Diferente de salões tradicionais, aqui você encontra um ambiente reservado, onde cada atendimento é tratado com o máximo de respeito, empatia e especialização técnica.
              </p>
              <p>
                Combinamos a precisão da barbearia de alto padrão com técnicas avançadas de prótese capilar para entregar resultados indetectáveis e naturais.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-border">
              <div>
                <div className="text-3xl font-serif text-primary font-bold mb-2">+10</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Anos de Experiência</div>
              </div>
              <div>
                <div className="text-3xl font-serif text-primary font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground uppercase tracking-wider font-medium">Foco em Naturalidade</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
