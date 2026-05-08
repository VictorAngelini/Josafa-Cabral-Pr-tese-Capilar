import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, ImagePlus } from "lucide-react";

function VideoPlayer({ src, label }: { src: string; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[9/16] max-w-xs mx-auto w-full rounded-2xl overflow-hidden shadow-xl bg-black group">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          muted
          playsInline
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow"
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          >
            {playing ? (
              <Pause className="w-4 h-4 text-primary fill-primary" />
            ) : (
              <Play className="w-4 h-4 text-primary fill-primary ml-0.5" />
            )}
          </button>
          <button
            onClick={toggleMute}
            className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow"
            aria-label={muted ? "Ativar som" : "Silenciar"}
          >
            {muted ? (
              <VolumeX className="w-4 h-4 text-primary" />
            ) : (
              <Volume2 className="w-4 h-4 text-primary" />
            )}
          </button>
        </div>
        {!playing && (
          <div
            className="absolute inset-0 flex items-center justify-center cursor-pointer"
            onClick={togglePlay}
          />
        )}
      </div>
      <p className="text-center text-muted-foreground text-xs italic">{label}</p>
    </div>
  );
}

function MediaPlaceholder() {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[9/16] max-w-xs mx-auto w-full rounded-2xl overflow-hidden border-2 border-dashed border-border bg-card flex flex-col items-center justify-center gap-3 shadow-sm">
        <ImagePlus className="w-10 h-10 text-muted-foreground/40" />
        <p className="text-xs text-muted-foreground/50 text-center px-4">Em breve</p>
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
          <VideoPlayer
            src="/transformacao-1.mp4"
            label="Transformação 1 — Estúdio Josafá Cabral, Tatuapé"
          />
          <VideoPlayer
            src="/transformacao-2.mp4"
            label="Transformação 2 — Estúdio Josafá Cabral, Tatuapé"
          />
          <MediaPlaceholder />
        </div>
      </div>
    </section>
  );
}
