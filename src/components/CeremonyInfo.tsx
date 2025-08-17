import React from 'react';
import { MapPin, Clock, Church } from 'lucide-react';

const CeremonyInfo = () => {
  const openGoogleMaps = () => {
    window.open('https://maps.app.goo.gl/9RAFVepNABbgj1eL7', '_blank');
  };

  return (
    <section className="py-20 px-4 bg-[#FDF6EE]">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 md:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-xl group">
              <img
                src="https://horariosmissa.com.br/wp-content/uploads/2024/06/comunidade-sao-leonardo-paracatu-minas-gerais-1024x576.jpg"
                alt="Igreja São Leonardo"
                className="w-full h-80 md:h-96 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute top-4 left-4 bg-[#C9A66B] text-white px-3 py-1 rounded-full text-sm font-['Playfair_Display']">
                Cerimônia
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 md:order-2 text-center md:text-left">
            <Church className="w-12 h-12 text-[#C9A66B] mx-auto md:mx-0 mb-4" />

            <h3 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-6">
              Cerimônia Religiosa
            </h3>

            <div className="space-y-4 font-['Playfair_Display'] text-gray-700">
              <div className="flex items-start gap-3 justify-center md:justify-start">
                <Church className="w-6 h-6 text-[#C9A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-lg">Igreja São Leonardo</p>
                </div>
              </div>

              <div className="flex items-start gap-3 justify-center md:justify-start">
                <MapPin className="w-6 h-6 text-[#C9A66B] mt-1 flex-shrink-0" />
                <div>
                  <p className="text-lg">Rua Manoel V Fernandes, 188</p>
                  <p className="text-gray-600">Cidade Nova – Paracatu-MG</p>
                </div>
              </div>

              <div className="flex items-center gap-3 justify-center md:justify-start">
                <Clock className="w-6 h-6 text-[#C9A66B] flex-shrink-0" />
                <p className="text-lg font-semibold">18h30</p>
              </div>
            </div>

            <button
              onClick={openGoogleMaps}
              className="mt-8 bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
            >
              <MapPin className="w-5 h-5" />
              Abrir no Google Maps
            </button>
          </div>
        </div>

        {/* Decorative Divider */}
        <div className="flex justify-center mt-16">
          <div className="flex items-center gap-4 text-[#C9A66B] text-2xl">
            <span>✿</span>
            <span>❀</span>
            <span>✿</span>
            <span>❀</span>
            <span>✿</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CeremonyInfo;