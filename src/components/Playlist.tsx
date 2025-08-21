// src/components/Playlist.tsx
import { Music } from 'lucide-react';
import { useMusic } from '../hooks/MusicProvider';

const TRACKS = [
  { title: 'Iris - Dean Lewis', url: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-playlist/Iris%20-%20Dean%20Lewis.mp3' },
  { title: 'JVKE - her', url: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-playlist/JVKE%20-%20her.mp3' },
  { title: 'Ed Sheeran - Thinking out Loud', url: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-playlist/SpotMate%20-%20Ed%20Sheeran%20-%20Thinking%20out%20Loud.mp3' },
];

const Playlist = () => {
  const { playing, currentSrc, setTrack, toggle } = useMusic();
  const currentTrack = TRACKS.find((t) => t.url === currentSrc);

  const handleShufflePlay = async () => {
    if (playing && currentTrack) {
      await toggle();
      return;
    }
    const randomTrack = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    await setTrack(randomTrack.url);
    if (!playing) await toggle();
  };

  const handlePlayTrack = async (t: { url: string }) => {
    const isCurrent = t.url === currentSrc;
    if (isCurrent) {
      await toggle(); // pausa/retoma a atual
    } else {
      await setTrack(t.url);
      // Se não estiver tocando, dá o play.
      if (!playing) await toggle();
    }
  };

  return (
    <section className="py-20 px-4 bg-[#FDF6EE]">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-[#C9A66B]/20">
          <div className="text-center">
            <Music className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
            <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-4">
              Nossa Trilha Sonora
            </h2>
            <p className="font-['Playfair_Display'] text-lg text-gray-600 mb-6">
              🎶 Um toque musical especial escolhido com carinho
            </p>

            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-[#C9A66B]/20 p-4">
              <button
                onClick={handleShufflePlay}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#C9A66B]/40 px-6 py-3 text-[#C9A66B] hover:shadow font-['Playfair_Display']"
              >
                {playing && currentTrack ? '⏸️ Pausar trilha' : '▶️ Tocar trilha'}
              </button>

              {/* Faixa atual apenas */}
              <div className="mt-6 text-left">
                {currentTrack ? (
                  <div className="py-3 flex items-center justify-between border-t border-b border-[#C9A66B]/10">
                    <div className="font-['Playfair_Display'] text-[#C9A66B] font-semibold">
                      {currentTrack.title}
                      {playing && <span className="ml-2 text-sm">• tocando</span>}
                    </div>
                    <button
                      onClick={() => handlePlayTrack(currentTrack)}
                      className="text-sm rounded-xl border border-[#C9A66B]/40 px-3 py-1 text-[#C9A66B] hover:shadow"
                    >
                      {playing ? 'Pausar' : 'Retomar'}
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600 text-sm text-center">
                    Nenhuma música tocando no momento. Clique em{" "}
                    <span className="text-[#C9A66B] font-semibold">Tocar trilha</span> para começar.
                  </p>
                )}
              </div>

              {currentTrack && (
                <div className="mt-4 flex items-center justify-center gap-3 text-[#C9A66B]">
                  <span className="text-sm md:text-base">{currentTrack.title}</span>
                </div>
              )}
            </div>

            <div className="mt-8 text-[#C9A66B] text-xl">♪ ♫ ♪</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Playlist;
