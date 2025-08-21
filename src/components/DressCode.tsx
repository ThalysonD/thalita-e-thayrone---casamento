import React from 'react';
import { Shirt, Palette, Sparkles } from 'lucide-react';
import Modal from './Modal';

const DressCode = () => {
    const [showGroomsmenPhoto, setShowGroomsmenPhoto] = React.useState(false);

    return (
        <section className="py-20 px-4 bg-gradient-to-br from-white via-[#FDF6EE] to-white">
            <div className="max-w-6xl mx-auto">
                {/* Background Decorations */}
                <div className="absolute inset-0 opacity-5">
                    <div className="text-[#C9A66B] text-6xl absolute top-20 left-10">❀</div>
                    <div className="text-[#C9A66B] text-4xl absolute bottom-20 right-10">✿</div>
                    <div className="text-[#C9A66B] text-5xl absolute top-1/2 right-1/4">❀</div>
                </div>

                <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-[#C9A66B]/20">
                    <div className="text-center mb-12">
                        <Shirt className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
                        <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-6">
                            Vestimentas
                        </h2>
                        <p className="font-['Playfair_Display'] text-lg text-gray-600">
                            Orientações especiais para nossos queridos madrinhos e madrinhas
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Madrinhas */}
                        <div className="bg-[#FDF6EE] rounded-2xl p-8 border border-[#C9A66B]/10">
                            <div className="text-center mb-6">
                                <div className="bg-[#C9A66B] p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-['Dancing_Script'] text-3xl text-[#C9A66B] font-bold mb-2">
                                    Madrinhas
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-['Playfair_Display'] font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-[#C9A66B]" />
                                        Cores Sugeridas
                                    </h4>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#4A773C] mx-auto mb-2 border-2 border-white shadow-md"></div>
                                            <span className="text-sm font-['Playfair_Display'] text-gray-600">Forest Green</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#6B8F47] mx-auto mb-2 border-2 border-white shadow-md"></div>
                                            <span className="text-sm font-['Playfair_Display'] text-gray-600">Cactus</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#3F5E3A] mx-auto mb-2 border-2 border-white shadow-md"></div>
                                            <span className="text-sm font-['Playfair_Display'] text-gray-600">Garden Green</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 font-['Playfair_Display'] text-gray-700">
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Vestidos longos</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Tecidos fluidos e elegantes</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Evitar branco, off-white e dourado</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Sapatos confortáveis para a celebração</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Padrinhos */}
                        <div className="bg-[#FDF6EE] rounded-2xl p-8 border border-[#C9A66B]/10">
                            <div className="text-center mb-6">
                                <div className="bg-[#C9A66B] p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                                    <Sparkles className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="font-['Dancing_Script'] text-3xl text-[#C9A66B] font-bold mb-2">
                                    Padrinhos
                                </h3>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="font-['Playfair_Display'] font-bold text-gray-800 mb-3 flex items-center gap-2">
                                        <Palette className="w-5 h-5 text-[#C9A66B]" />
                                        Dress Code
                                    </h4>

                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#D3D3D3] mx-auto mb-2 border-2 border-white shadow-md"></div>
                                            <span className="text-sm font-['Playfair_Display'] text-gray-600">Terno Cinza Claro</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#EDE6D6] mx-auto mb-2 border-2 border-white shadow-md"></div>
                                            <span className="text-sm font-['Playfair_Display'] text-gray-600">Gravata Champagne</span>
                                        </div>
                                        <div className="text-center">
                                            <div className="w-12 h-12 rounded-full bg-[#6B4226] mx-auto mb-2 border-2 border-white shadow-md"></div>
                                            <span className="text-sm font-['Playfair_Display'] text-gray-600">Sapato Marrom</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 font-['Playfair_Display'] text-gray-700">
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Terno cinza claro padronizado para todos</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Gravata champagne clara (já definida com os noivos)</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Sapato social marrom, clássico e elegante</span>
                                    </p>
                                    <p className="flex items-start gap-2">
                                        <span className="text-[#C9A66B] mt-1">•</span>
                                        <span>Cinto marrom combinando com o sapato</span>
                                    </p>
                                </div>

                                {/* Botão referência (abre Modal) */}
                                <div className="text-center mt-6">
                                    <button
                                        onClick={() => setShowGroomsmenPhoto(true)}
                                        className="inline-block px-6 py-2 bg-[#EDE6D6] text-gray-800 rounded-full shadow hover:bg-[#d6cfc0] transition font-semibold"
                                    >
                                        Visualizar referência
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Observações Gerais */}
                    <div className="mt-12 bg-gradient-to-r from-[#C9A66B]/10 to-[#FDF6EE] rounded-2xl p-6 border border-[#C9A66B]/20">
                        <h4 className="font-['Dancing_Script'] text-2xl text-[#C9A66B] font-bold mb-4 text-center">
                            Observações Importantes
                        </h4>
                        <div className="space-y-3 font-['Playfair_Display'] text-gray-700 text-center">
                            <p>✨ O mais importante é que vocês se sintam confortáveis e elegantes</p>
                            <p>💛 Em caso de dúvidas, não hesitem em nos contatar</p>
                            <p>🌸 Agradecemos por fazerem parte deste momento tão especial</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 text-[#C9A66B] text-2xl mt-8">
                        <span>✿</span>
                        <span>❀</span>
                        <span>✿</span>
                    </div>
                </div>
            </div>

            {/* Modal com foto de referência dos padrinhos */}
            <Modal
                isOpen={showGroomsmenPhoto}
                onClose={() => setShowGroomsmenPhoto(false)}
                title="Referência Visual - Padrinhos"
            >
                <div className="space-y-6">
                    <div className="text-center">
                        <Shirt className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
                        <p className="font-['Playfair_Display'] text-gray-600 mb-6">
                            Exemplo de combinação ideal para os padrinhos
                        </p>
                    </div>

                    {/* Foto de referência (bucket) */}
                    <div className="rounded-2xl overflow-hidden shadow-lg">
                        <img
                            src="https://ysbaerftptetchetcljv.supabase.co/storage/v1/object/public/wedding-photos/padrinho.jpg"
                            alt="Referência visual para padrinhos"
                            className="w-full h-[70vh] object-contain bg-black/5"
                        />
                    </div>

                    {/* Legenda das cores (alinhada ao look) */}
                    <div className="bg-[#FDF6EE] p-4 rounded-xl">
                        <h4 className="font-['Playfair_Display'] font-bold text-gray-800 mb-3 text-center">
                            Combinação de Cores
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#D3D3D3] border border-white shadow-sm"></div>
                                <span className="text-sm font-['Playfair_Display'] text-gray-700">Terno: Cinza Claro</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-white border border-gray-300 shadow-sm"></div>
                                <span className="text-sm font-['Playfair_Display'] text-gray-700">Camisa: Branca</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#EDE6D6] border border-white shadow-sm"></div>
                                <span className="text-sm font-['Playfair_Display'] text-gray-700">Gravata: Champagne</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded-full bg-[#6B4226] border border-white shadow-sm"></div>
                                <span className="text-sm font-['Playfair_Display'] text-gray-700">Sapato: Marrom</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="font-['Playfair_Display'] text-sm text-gray-500 italic">
                            Esta é apenas uma sugestão. O importante é manter a elegância! ✨
                        </p>
                    </div>
                </div>
            </Modal>
        </section>
    );
};

export default DressCode;
