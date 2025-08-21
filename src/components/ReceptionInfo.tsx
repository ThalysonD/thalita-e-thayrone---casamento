import React from 'react';
import { MapPin, Music, Utensils } from 'lucide-react';

const ReceptionInfo = () => {
  const openGoogleMaps = () => {
    window.open('https://maps.google.com/?q=Rua+Frei+Anselmo+488+Lavrado+Paracatu+MG', '_blank');
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center md:text-left">
            <Utensils className="w-12 h-12 text-[#C9A66B] mx-auto md:mx-0 mb-4" />

            <h3 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-6">
              Festa & Recepção
            </h3>

            <div className="space-y-4 font-['Playfair_Display'] text-gray-700">
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-6 h-6 text-[#C9A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg">Rua Frei Anselmo, 488</p>
                  <p className="text-gray-600">Lavrado – Paracatu-MG</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Music className="w-6 h-6 text-[#C9A66B] flex-shrink-0" />
                <p className="text-lg">Jantar, música e muita alegria!</p>
              </div>
            </div>

            <p className="mt-6 text-gray-600 font-['Playfair_Display'] text-lg italic">
              Após a cerimônia, vamos celebrar juntos este momento único com um jantar especial
              e uma festa que promete ser inesquecível!
            </p>

            <button
              onClick={openGoogleMaps}
              className="mt-8 bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Abrir no Google Maps
            </button>
          </div>

          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl group">
            <img
              src="https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-photos/WhatsApp%20Image%202025-08-19%20at%2011.52.54.jpeg"
              alt="Recepção de Casamento"
              className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className="absolute top-4 right-4 bg-[#C9A66B] text-white px-3 py-1 rounded-full text-sm font-['Playfair_Display']">
              Recepção
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReceptionInfo;