// src/components/Header.tsx
import { useState, useEffect } from 'react';
import { Heart, Calendar, Clock, Music } from 'lucide-react';
import Modal from './Modal';
import RSVPModal from './RSVPModal';
import { useMusic } from '../hooks/MusicProvider'; // ajuste o path se usar alias @/

const TRACKS = [
  { title: 'Iris - Dean Lewis', url: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-playlist/Iris%20-%20Dean%20Lewis.mp3' },
  { title: 'JVKE - her', url: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-playlist/JVKE%20-%20her.mp3' },
  { title: 'Ed Sheeran - Thinking out Loud', url: 'https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-playlist/SpotMate%20-%20Ed%20Sheeran%20-%20Thinking%20out%20Loud.mp3' },
];

const Header = () => {
  const [isRSVPModalOpen, setIsRSVPModalOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // --- player global
  const { playing, currentSrc, setTrack, toggle } = useMusic();
  const isThisPlaying = playing && TRACKS.some(t => t.url === currentSrc);

  useEffect(() => {
    const weddingAt = new Date('2025-11-15T18:30:00').getTime();
    const timer = setInterval(() => {
      const now = Date.now();
      const distance = Math.max(0, weddingAt - now);
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
      if (distance === 0) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePlayToggle = async () => {
    // se já está tocando alguma das faixas, apenas pausa/retoma
    if (isThisPlaying) {
      await toggle();
      return;
    }
    const random = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    await setTrack(random.url);
    if (!playing) await toggle();
  };


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            `url('https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-photos/wallpaperflare.com_wallpaper.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 text-[#C9A66B] opacity-20 text-6xl">❀</div>
      <div className="absolute bottom-10 right-10 text-[#C9A66B] opacity-20 text-6xl">❀</div>
      <div className="absolute top-1/4 right-10 text-[#C9A66B] opacity-10 text-4xl">✿</div>
      <div className="absolute bottom-1/4 left-10 text-[#C9A66B] opacity-10 text-4xl">✿</div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 animate-fade-in">
        <div className="bg-black/20 backdrop-blur-sm rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20">
          <Heart className="w-12 h-12 text-[#C9A66B] mx-auto mb-6 animate-pulse" />

          <h1 className="font-['Dancing_Script'] text-4xl md:text-7xl font-bold text-[#C9A66B] mb-4 drop-shadow-lg">
            Thalita Rabelo
          </h1>
          <div className="text-2xl md:text-3xl text-[#C9A66B] mb-2">❤️</div>
          <h1 className="font-['Dancing_Script'] text-4xl md:text-7xl font-bold text-[#C9A66B] mb-8 drop-shadow-lg">
            Thayrone Dornelas
          </h1>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8 text-lg md:text-xl">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#C9A66B]" />
              <span className="font-['Playfair_Display']">15 de Novembro de 2025</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#C9A66B]" />
              <span className="font-['Playfair_Display']">18h30</span>
            </div>
          </div>

          <div className="mb-8 p-6 bg-white/10 rounded-2xl border border-[#C9A66B]/30">
            <p className="font-['Playfair_Display'] text-lg md:text-xl italic leading-relaxed">
              "Grandes coisas fez o Senhor por nós.<br />
              Por isso estamos alegres."<br />
              <span className="text-[#C9A66B] text-base">— Salmo 126:3</span>
            </p>
          </div>

          {/* Countdown */}
          <div className="grid grid-cols-4 gap-4 mb-8 max-w-md mx-auto">
            {[
              { label: 'Dias', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Min', value: timeLeft.minutes },
              { label: 'Seg', value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-[#C9A66B]/20 backdrop-blur-sm rounded-2xl p-4 border border-[#C9A66B]/30"
              >
                <div className="text-2xl md:text-3xl font-bold text-[#C9A66B] font-['Playfair_Display']">
                  {item.value.toString().padStart(2, '0')}
                </div>
                <div className="text-xs md:text-sm text-white/80 font-['Playfair_Display']">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

          {/* Botão Confirmar Presença */}
          <button
            onClick={() => setIsRSVPModalOpen(true)}
            className="bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg text-lg"
          >
            Confirmar Presença
          </button>

          {/* Botão Tocar Playlist (logo abaixo) */}
          <div className="mt-4">
            <button
              onClick={handlePlayToggle}
              className="inline-flex items-center gap-2 rounded-full border border-[#C9A66B]
                         px-6 py-3 text-[#C9A66B] bg-white hover:bg-[#C9A66B]/10 transition
                         font-['Playfair_Display']"
              title={isThisPlaying ? 'Pausar trilha' : 'Tocar trilha'}
            >
              <Music className="w-5 h-5" />
              {isThisPlaying ? 'Pausar trilha' : 'Tocar trilha'}
            </button>
          </div>
        </div>
      </div>

      {/* RSVP Modal */}
      <Modal
        isOpen={isRSVPModalOpen}
        onClose={() => setIsRSVPModalOpen(false)}
        title="Confirmação de Presença"
      >
        {isRSVPModalOpen && <RSVPModal onSuccess={() => setIsRSVPModalOpen(false)} />}
      </Modal>
    </section>
  );
};

export default Header;
