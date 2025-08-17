import React from 'react';

const OpeningMessage = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto text-center">
        {/* Decorative Border */}
        <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-lg border-4 border-[#C9A66B]/20">
          {/* Corner Decorations */}
          <div className="absolute -top-2 -left-2 w-8 h-8 text-[#C9A66B] text-2xl">❀</div>
          <div className="absolute -top-2 -right-2 w-8 h-8 text-[#C9A66B] text-2xl">❀</div>
          <div className="absolute -bottom-2 -left-2 w-8 h-8 text-[#C9A66B] text-2xl">❀</div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 text-[#C9A66B] text-2xl">❀</div>

          <div className="space-y-6">
            <div className="text-[#C9A66B] text-4xl mb-6">✿</div>
            
            <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-8">
              Uma Nova História Começa
            </h2>

            <div className="space-y-6 font-['Playfair_Display'] text-gray-700 leading-relaxed">
              <p className="text-lg md:text-xl">
                Com os corações cheios de gratidão, anunciamos o início da nossa vida a dois, 
                abençoada por Deus.
              </p>
              
              <p className="text-lg md:text-xl">
                Acreditamos que o amor é um presente divino, e nosso casamento é a realização 
                de uma promessa que Ele mesmo escreveu em nossas vidas.
              </p>
              
              <p className="text-lg md:text-xl">
                Preparamos este espaço com muito carinho para compartilhar com você todas as 
                informações importantes sobre esse dia tão especial!
              </p>
            </div>

            <div className="flex justify-center gap-4 text-[#C9A66B] text-2xl mt-8">
              <span>✿</span>
              <span>❀</span>
              <span>✿</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OpeningMessage;