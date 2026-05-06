import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function BeforeAfterVideoSection() {
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

        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-primary/5 group">
            <video
              ref={videoRef}
              src="/antes-depois.mp4"
              className="w-full aspect-video object-cover"
              muted
              playsInline
              loop
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              data-testid="video-before-after"
            />

            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={togglePlay}
                data-testid="button-play-pause"
                className="w-18 h-18 rounded-full bg-background/90 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-background group-hover:opacity-100 opacity-90"
                style={{ width: 72, height: 72 }}
                aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}
              >
                {playing ? (
                  <Pause className="w-7 h-7 text-primary fill-primary" />
                ) : (
                  <Play className="w-7 h-7 text-primary fill-primary ml-1" />
                )}
              </button>
            </div>

            <div className="absolute bottom-4 right-4">
              <button
                onClick={toggleMute}
                data-testid="button-mute-toggle"
                className="w-10 h-10 rounded-full bg-background/80 flex items-center justify-center hover:bg-background transition-colors"
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

          <p className="text-center text-muted-foreground text-sm mt-5 italic">
            Resultado real de cliente atendido no estúdio Josafá - Tatuapé, São Paulo
          </p>
        </div>
      </div>
    </section>
  );
}
