import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

function VideoPlayer({ src, label, portrait = false }: { src: string; label: string; portrait?: boolean }) {
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
      <div className={`relative rounded-2xl overflow-hidden shadow-xl bg-black group ${portrait ? "aspect-[9/16] max-w-xs mx-auto w-full" : "aspect-video w-full"}`}>
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full object-contain"
          muted
          playsInline
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          data-testid={`video-${label}`}
        />

        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            data-testid={`button-play-${label}`}
            className="rounded-full bg-background/90 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-background opacity-90 group-hover:opacity-100"
            style={{ width: 64, height: 64 }}
            aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
          >
            {playing ? (
              <Pause className="w-6 h-6 text-primary fill-primary" />
            ) : (
              <Play className="w-6 h-6 text-primary fill-primary ml-1" />
            )}
          </button>
        </div>

        <div className="absolute bottom-3 right-3">
          <button
            onClick={toggleMute}
            data-testid={`button-mute-${label}`}
            className="w-9 h-9 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
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
          <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
        )}
      </div>
      <p className="text-center text-muted-foreground text-xs italic">
        {label}
      </p>
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

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <VideoPlayer
            src="/antes-depois.mp4"
            label="Transformação 1 — Estúdio Josafá, Tatuapé"
          />
          <VideoPlayer
            src="/antes-depois-2.mp4"
            label="Transformação 2 — Estúdio Josafá, Tatuapé"
            portrait
          />
        </div>
      </div>
    </section>
  );
}
