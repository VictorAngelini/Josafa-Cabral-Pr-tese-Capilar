import { ImagePlus, VideoIcon } from "lucide-react";

type MediaType = "video" | "photo";

function MediaPlaceholder({ index, type }: { index: number; type: MediaType }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[9/16] max-w-xs mx-auto w-full rounded-2xl overflow-hidden border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 shadow-sm">
        {type === "video" ? (
          <VideoIcon className="w-10 h-10 text-muted-foreground/40" />
        ) : (
          <ImagePlus className="w-10 h-10 text-muted-foreground/40" />
        )}
        <p className="text-xs text-muted-foreground/50 text-center px-4">
          {type === "video" ? "Vídeo" : "Foto"} {index} — em breve
        </p>
      </div>
    </div>
  );
}

export function BeforeAfterVideoSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-14">
          <p className="text-secondary uppercase tracking-widest text-xs font-semibold mb-3">Transformações Reais</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
            Antes e Depois
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mt-6" />
          <p className="mt-6 text-muted-foreground max-w-xl mx-auto text-base leading-relaxed">
            Cada resultado é único. Veja como a prótese capilar transforma não só o visual, mas a confiança e a qualidade de vida dos nossos clientes.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <MediaPlaceholder index={1} type="video" />
          <MediaPlaceholder index={2} type="photo" />
          <MediaPlaceholder index={3} type="video" />
        </div>
      </div>
    </section>
  );
}
