import { useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";

export function CursoSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);

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
    <section id="curso" className="py-24 bg-card">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-12">
          <p className="text-secondary uppercase tracking-widest text-xs font-semibold mb-3">Formação Profissional</p>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight mb-6">
            Nosso Curso
          </h2>
          <div className="w-16 h-0.5 bg-secondary mx-auto mb-10" />
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            Na conclusão do curso de prótese capilar, ressaltamos a importância da <strong className="text-primary font-semibold">autonomia</strong>, que permite ao profissional tomar decisões seguras e personalizadas em cada atendimento; do <strong className="text-primary font-semibold">senso estético</strong>, essencial para criar resultados que valorizem a beleza, a autoestima e a individualidade de cada cliente; e da <strong className="text-primary font-semibold">padronização</strong>, que garante qualidade, técnica apurada e constância nos procedimentos. Esses três pilares juntos consolidam uma formação completa, unindo técnica, arte e responsabilidade.
          </p>
        </div>

        <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black group aspect-video w-full max-w-3xl mx-auto">
          <video
            ref={videoRef}
            src="/curso.mp4"
            className="w-full h-full object-contain"
            muted
            playsInline
            loop
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Click overlay to play when paused */}
          {!playing && (
            <div
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              onClick={togglePlay}
            >
              <div className="w-20 h-20 rounded-full bg-background/90 flex items-center justify-center shadow-xl hover:scale-105 transition-transform">
                <Play className="w-8 h-8 text-primary fill-primary ml-1" />
              </div>
            </div>
          )}

          {/* Bottom controls bar — visible on hover */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors shadow"
              aria-label={playing ? "Pausar" : "Reproduzir"}
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
        </div>
      </div>
    </section>
  );
}
