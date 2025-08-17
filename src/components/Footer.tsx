import { Heart, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="py-16 px-4 bg-[#FDF6EE] border-t border-[#C9A66B]/20">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <Heart className="w-12 h-12 text-[#C9A66B] mx-auto mb-4 animate-pulse" />
          <h2 className="font-['Dancing_Script'] text-3xl md:text-4xl text-[#C9A66B] font-bold mb-2">
            Com amor,
          </h2>
          <p className="font-['Dancing_Script'] text-2xl md:text-3xl text-gray-700">
            Thalita & Thayrone
          </p>
        </div>

        {/* Links para Instagram dos noivos */}
        <div className="flex justify-center gap-6 mb-8">
          {/* Instagram Thalita (noiva) */}
          <a
            href="https://www.instagram.com/thallitarabelo/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-400 hover:bg-pink-500 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Instagram da Noiva"
          >
            <Instagram className="w-6 h-6" />
          </a>

          {/* Instagram Thayrone (noivo) */}
          <a
            href="https://www.instagram.com/thayronedornelas/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 hover:shadow-lg"
            aria-label="Instagram do Noivo"
          >
            <Instagram className="w-6 h-6" />
          </a>
        </div>

        <div className="flex justify-center gap-4 text-[#C9A66B] text-3xl mb-6">
          <span>✿</span>
          <span>❤️</span>
          <span>✿</span>
        </div>

        <p className="font-['Playfair_Display'] text-gray-600 text-sm">
          15 de Novembro de 2025 • Igreja São Leonardo • Paracatu-MG
        </p>

        <div className="mt-8 pt-6 border-t border-[#C9A66B]/20">
          <p className="font-['Playfair_Display'] text-xs text-gray-500">
            Site criado com amor para nosso dia especial ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
