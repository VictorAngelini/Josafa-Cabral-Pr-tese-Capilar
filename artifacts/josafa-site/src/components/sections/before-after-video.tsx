import { useRef, useState, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

function VideoPlayer({ src, label, poster }: { src: string; label: string; poster?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    if (!container || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused) {
          video.pause();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) { videoRef.current.pause(); } else { videoRef.current.play(); }
    setPlaying(!playing);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <div ref={containerRef} className="flex flex-col gap-3">
      <div className="relative aspect-[9/16] max-w-xs mx-auto w-full rounded-2xl overflow-hidden shadow-xl bg-black group">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          className="w-full h-full object-contain"
          muted
          playsInline
          loop
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        />
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
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

function PhotoCard({ src, label }: { src: string; label: string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl overflow-hidden shadow-xl bg-black">
        <img
          src={src}
          alt={label}
          className="w-full h-full object-cover"
        />
      </div>
      <p className="text-center text-muted-foreground text-xs italic">{label}</p>
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

        <div className="max-w-5xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
            <VideoPlayer
              src="/transformacao-1.mp4"
              poster="/poster-1.jpg"
              label="Transformação 1 — Estúdio Josafá Cabral, Tatuapé"
            />
            <VideoPlayer
              src="/transformacao-2.mp4"
              poster="/poster-2.jpg"
              label="Transformação 2 — Estúdio Josafá Cabral, Tatuapé"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <PhotoCard
              src="/antes-depois-2.png"
              label="Transformação 3 — Estúdio Josafá Cabral, Tatuapé"
            />
            <PhotoCard
              src="/antes-depois-3.jpg"
              label="Transformação 4 — Estúdio Josafá Cabral, Tatuapé"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
