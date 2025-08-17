import React, { useState } from 'react';
import { Mail, Users, Baby, Check, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

type GuestDetails = {
  name: string;
  type: 'adult' | 'child';
};

const RSVP: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    adults: '1',
    children: '0',
  });

  const [guestDetails, setGuestDetails] = useState<GuestDetails[]>([]);
  const [showGuestDetails, setShowGuestDetails] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalGuests = parseInt(formData.adults) + parseInt(formData.children);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // se o usuário mudar os números, volta à etapa principal
    setShowGuestDetails(false);
    setGuestDetails([]);
  };

  const buildGuestDetails = () => {
    const details: GuestDetails[] = [];
    // convidado principal
    details.push({ name: formData.name, type: 'adult' });
    // adultos adicionais
    for (let i = 1; i < parseInt(formData.adults); i++) {
      details.push({ name: '', type: 'adult' });
    }
    // crianças
    for (let i = 0; i < parseInt(formData.children); i++) {
      details.push({ name: '', type: 'child' });
    }
    return details;
  };

  const handleGuestDetailChange = (index: number, value: string) => {
    setGuestDetails(prev => {
      const copy = [...prev];
      copy[index].name = value;
      return copy;
    });
  };

  const goBack = () => {
    setShowGuestDetails(false);
    setGuestDetails([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Se tiver mais de 1 pessoa e ainda não abriu a etapa de nomes, abre agora
    if (totalGuests > 1 && !showGuestDetails) {
      setGuestDetails(buildGuestDetails());
      setShowGuestDetails(true);
      return;
    }

    // Validar nomes na etapa de detalhes
    if (showGuestDetails) {
      const hasEmpty = guestDetails.some(g => !g.name.trim());
      if (hasEmpty) {
        alert('Por favor, preencha o nome de todos os convidados.');
        return;
      }
    }

    setIsLoading(true);
    try {
      const guestNames = showGuestDetails
        ? guestDetails.map(g => g.name).join(', ')
        : formData.name;

      const { error } = await supabase.from('guests').insert([
        {
          name: guestNames,
          adults: parseInt(formData.adults),
          children: parseInt(formData.children),
        },
      ]);

      if (error) throw error;

      setIsSubmitted(true);
      // opcional: reset de formulário após sucesso
      setFormData({ name: '', adults: '1', children: '0' });
      setGuestDetails([]);
      setShowGuestDetails(false);
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar presença. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border-4 border-[#C9A66B]/20">
          <div className="text-center mb-8">
            <Mail className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
            <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-4">
              Confirmação de Presença
            </h2>
            <p className="font-['Playfair_Display'] text-lg text-gray-600">
              Sua presença é fundamental para tornar nosso dia ainda mais especial!
            </p>
          </div>

          {isSubmitted ? (
            <div className="text-center p-8">
              <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="font-['Playfair_Display'] text-2xl text-green-600 font-semibold mb-2">
                Presença Confirmada!
              </h3>
              <p className="text-gray-600">
                Obrigado por confirmar. Mal podemos esperar para celebrar com você!
              </p>
            </div>
          ) : showGuestDetails ? (
            // ===== Etapa 2: Detalhes dos convidados =====
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-2">
                <Users className="w-8 h-8 text-[#C9A66B] mx-auto mb-2" />
                <h3 className="font-['Playfair_Display'] text-xl font-semibold text-gray-800">
                  Detalhes dos Convidados
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Informe o nome de todos os convidados
                </p>
              </div>

              {guestDetails.map((guest, index) => (
                <div key={index}>
                  <label className="block font-['Playfair_Display'] text-sm font-medium text-gray-700 mb-2">
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-[#C9A66B]" />
                      {guest.type === 'adult' ? 'Adulto' : 'Criança'}{' '}
                      {index === 0 ? '(Responsável)' : `${index + 1}`}
                    </span>
                  </label>
                  <input
                    type="text"
                    value={guest.name}
                    onChange={(e) => handleGuestDetailChange(index, e.target.value)}
                    required
                    disabled={index === 0} // responsável já vem do campo principal
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0 transition-colors font-['Playfair_Display'] disabled:bg-gray-50"
                    placeholder="Nome completo"
                  />
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={goBack}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-['Playfair_Display'] font-semibold px-6 py-3 rounded-full transition-all duration-300"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Confirmando...' : 'Confirmar Presença'}
                </button>
              </div>
            </form>
          ) : (
            // ===== Etapa 1: Form principal =====
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-['Playfair_Display'] text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0 transition-colors font-['Playfair_Display']"
                  placeholder="Digite seu nome completo"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-['Playfair_Display'] text-sm font-medium text-gray-700 mb-2">
                    <Users className="w-4 h-4 inline mr-1" />
                    Adultos
                  </label>
                  <select
                    name="adults"
                    value={formData.adults}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0 transition-colors font-['Playfair_Display']"
                  >
                    {[...Array(6)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-['Playfair_Display'] text-sm font-medium text-gray-700 mb-2">
                    <Baby className="w-4 h-4 inline mr-1" />
                    Crianças
                  </label>
                  <select
                    name="children"
                    value={formData.children}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0 transition-colors font-['Playfair_Display']"
                  >
                    {[...Array(5)].map((_, i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="w-full bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading
                  ? 'Processando...'
                  : totalGuests > 1
                    ? 'Continuar'
                    : 'Confirmar Presença'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default RSVP;
