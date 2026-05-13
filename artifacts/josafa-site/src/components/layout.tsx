import { Link } from "wouter";
import { FloatingWhatsApp } from "./floating-whatsapp";
import { Button } from "./ui/button";
import { MapPin, Phone, Instagram, Facebook, Youtube, Clock } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z"/>
    </svg>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const scrollTo = (id: string) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="fixed top-0 left-0 right-0 w-full z-50 bg-background/95 border-b border-border" style={{ transform: "translateZ(0)", WebkitTransform: "translateZ(0)" }}>
        <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.jpeg" alt="Logo Josafá Cabral" className="h-10 w-10 md:h-14 md:w-14 object-cover rounded-sm shrink-0" />
            <div className="flex flex-col leading-tight">
              <span className="text-base md:text-2xl font-bold text-foreground uppercase tracking-wide whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif" }}>Josafá Cabral</span>
              <span className="text-xs md:text-sm font-semibold text-foreground uppercase tracking-wide whitespace-nowrap" style={{ fontFamily: "'Cinzel', serif" }}>Prótese Capilar</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollTo("sobre")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Sobre</button>
            <button onClick={() => scrollTo("servicos")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Serviços</button>
            <button onClick={() => scrollTo("curso")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Nosso Curso</button>
            <button onClick={() => scrollTo("contato")} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contato</button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              onClick={() => scrollTo("agendamento")}
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-4 md:px-6 text-xs md:text-sm h-9 md:h-10"
            >
              Agendar
            </Button>
            <Link
              href="/proprietario"
              className="inline-flex items-center justify-center text-xs md:text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-3 md:px-6 h-9 md:h-10"
              data-testid="link-owner-area"
            >
              Proprietário
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer id="contato" className="bg-primary text-primary-foreground pt-20 pb-10">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-serif font-bold tracking-tight mb-1">Josafá Cabral</h3>
                <p className="text-secondary uppercase tracking-widest text-xs font-medium">Prótese Capilar</p>
              </div>
              <p className="text-primary-foreground/70 text-sm leading-relaxed pr-4">
                Especialistas em transformar vidas através da arte da prótese capilar. Um ambiente reservado, focado na sua autoestima.
              </p>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-serif font-semibold text-secondary">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-primary-foreground/80">
                  <Phone className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <p>+55 (11) 99322-3453</p>
                    <a href="https://wa.me/5511993223453" target="_blank" rel="noopener noreferrer" className="text-sm text-secondary hover:underline">Falar no WhatsApp</a>
                  </div>
                </li>
                <li>
                  <p className="text-primary-foreground/60 text-xs uppercase tracking-widest mb-3">Redes Sociais</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <a href="https://instagram.com/josafacabralprotesecapilar" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors text-secondary">
                      <Instagram className="w-5 h-5" />
                    </a>
                    <a href="https://www.facebook.com/josafacabralhair/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors text-secondary">
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a href="https://www.youtube.com/@josafacabralprotesecapilar4427" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors text-secondary">
                      <Youtube className="w-5 h-5" />
                    </a>
                    <a href="https://www.tiktok.com/@josafacabral0" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-secondary hover:text-primary transition-colors text-secondary">
                      <TikTokIcon className="w-5 h-5" />
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-serif font-semibold text-secondary">Endereço</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-primary-foreground/80">
                  <MapPin className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <p>Rua Irapé, 217</p>
                    <p>Tatuapé, São Paulo - SP</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-serif font-semibold text-secondary">Horário</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-primary-foreground/80">
                  <Clock className="w-5 h-5 mt-0.5 text-secondary shrink-0" />
                  <div>
                    <p>Terça a Sábado</p>
                    <p>09:00 às 19:00</p>
                    <p className="text-sm text-primary-foreground/50 mt-1">Atendimento com hora marcada</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-primary-foreground/10 text-center text-primary-foreground/50 text-sm">
            <p>&copy; {new Date().getFullYear()} Josafá Cabral Prótese Capilar. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      <FloatingWhatsApp />
    </div>
  );
}
