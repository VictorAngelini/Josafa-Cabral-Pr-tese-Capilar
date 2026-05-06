import { useListServices } from "@workspace/api-client-react";
import { Loader2, Scissors, Sparkles, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ServicesSection() {
  const { data: services, isLoading } = useListServices();

  const getIconForCategory = (category: string) => {
    if (category.toLowerCase().includes('prótese') || category.toLowerCase().includes('manutenção')) {
      return <ShieldCheck className="w-8 h-8 text-secondary mb-4" />;
    }
    if (category.toLowerCase().includes('corte')) {
      return <Scissors className="w-8 h-8 text-secondary mb-4" />;
    }
    return <Sparkles className="w-8 h-8 text-secondary mb-4" />;
  };

  return (
    <section id="servicos" className="py-24 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-primary font-semibold mb-6">Nossos Serviços</h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos uma gama completa de soluções capilares, executadas com maestria e foco absoluto no seu bem-estar.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-secondary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services?.map((service) => (
              <Card key={service.id} className="bg-card border-card-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  {getIconForCategory(service.category)}
                  <CardTitle className="text-xl font-serif text-primary">{service.name}</CardTitle>
                  <CardDescription className="text-sm font-medium text-secondary tracking-wide uppercase mt-2">
                    {service.category} • {service.duration}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
