import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Send, User, AlertTriangle } from 'lucide-react';
import { supabase, Message as MessageType } from '../lib/supabase';
import Modal from './Modal';

type TermRow = { term: string };

// ===== util: filtro simples de termos =====
const strip = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const hasBadTerms = (text: string, terms: string[]) => {
  if (!text) return false;
  const base = strip(text.toLowerCase());
  return terms.some((t) => {
    const r = new RegExp(`\\b${esc(strip(t.toLowerCase()))}\\b`, 'i');
    return r.test(base);
  });
};

const sanitizeText = (text?: string | null, terms: string[] = []) => {
  if (!text) return text ?? '';
  let out = text;
  terms.forEach((term) => {
    const re1 = new RegExp(`\\b${esc(term)}\\b`, 'gi');
    out = out.replace(re1, '***');
    const naked = strip(term);
    if (naked !== term) {
      const re2 = new RegExp(`\\b${esc(naked)}\\b`, 'gi');
      out = out.replace(re2, '***');
    }
  });
  return out;
};
// =========================================

const Messages = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [badTerms, setBadTerms] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState({ name: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingMessages, setFetchingMessages] = useState(true);

  // estado do modal de aviso
  const [warnOpen, setWarnOpen] = useState(false);
  const [warnText] = useState('Por favor, use palavras carinhosas 🙂');

  useEffect(() => {
    (async () => {
      try {
        const [{ data: termsData, error: termsErr }, { data: msgsData, error: msgsErr }] =
          await Promise.all([
            supabase.from('blocked_terms').select('term').eq('is_active', true),
            supabase.from('messages').select('*').order('created_at', { ascending: false }),
          ]);

        if (termsErr) throw termsErr;
        if (msgsErr) throw msgsErr;

        const terms = (termsData as TermRow[] | null)?.map((r) => r.term) ?? [];
        setBadTerms(terms);

        const safe =
          (msgsData as MessageType[] | null)?.map((m) => ({
            ...m,
            name: sanitizeText(m.name, terms),
            message: sanitizeText(m.message, terms),
          })) ?? [];

        setMessages(safe);
      } catch (error) {
        console.error('Error fetching messages/terms:', error);
      } finally {
        setFetchingMessages(false);
      }
    })();
  }, []);

  // auto-fecha o “enviado com sucesso”
  useEffect(() => {
    if (!isSubmitted) return;
    const id = setTimeout(() => setIsSubmitted(false), 3000);
    return () => clearTimeout(id);
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newMessage.name.trim();
    const msg = newMessage.message.trim();
    if (!name || !msg) return;

    if (hasBadTerms(name, badTerms) || hasBadTerms(msg, badTerms)) {
      setWarnOpen(true);
      return;
    }

    setIsLoading(true);
    try {
      const clean = {
        name: sanitizeText(name, badTerms),
        message: sanitizeText(msg, badTerms),
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([clean])
        .select()
        .single();

      if (error) throw error;

      setMessages((prev) => [data as MessageType, ...prev]);
      setNewMessage({ name: '', message: '' });
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting message:', error);
      // Se quiser, pode abrir outro modal aqui também
      setWarnOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewMessage((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-[#C9A66B]/20">
          <div className="text-center mb-12">
            <MessageCircle className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
            <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-4">
              Deixe seu Recado
            </h2>
            <p className="font-['Playfair_Display'] text-lg text-gray-600">
              Suas palavras de carinho significam muito para nós!
            </p>
          </div>

          {/* Formulário */}
          <div className="mb-12">
            {isSubmitted ? (
              <div className="text-center p-8 bg-green-50 rounded-2xl border-2 border-green-200">
                <Heart className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="font-['Playfair_Display'] text-lg text-green-600 font-semibold">
                  Obrigado pela mensagem carinhosa! ❤️
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block font-['Playfair_Display'] text-sm font-medium text-gray-700 mb-2">
                    Seu Nome
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newMessage.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0 transition-colors font-['Playfair_Display']"
                    placeholder="Digite seu nome"
                    maxLength={80}
                  />
                </div>

                <div>
                  <label className="block font-['Playfair_Display'] text-sm font-medium text-gray-700 mb-2">
                    Sua Mensagem
                  </label>
                  <textarea
                    name="message"
                    value={newMessage.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0 transition-colors font-['Playfair_Display'] resize-none"
                    placeholder="Escreva uma mensagem carinhosa para o casal..."
                    maxLength={600}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                  {isLoading ? 'Enviando...' : 'Enviar Mensagem'}
                </button>
              </form>
            )}
          </div>

          {/* Lista de recados */}
          <div className="space-y-6">
            <h3 className="font-['Dancing_Script'] text-2xl text-[#C9A66B] font-bold text-center mb-6">
              Recados dos Convidados
            </h3>

            {fetchingMessages ? (
              <div className="text-center py-8">
                <div className="animate-pulse space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="bg-[#FDF6EE] p-6 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-[#C9A66B]/20 rounded-full"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-[#C9A66B]/20 rounded w-32"></div>
                          <div className="h-4 bg-[#C9A66B]/20 rounded w-full"></div>
                          <div className="h-4 bg-[#C9A66B]/20 rounded w-3/4"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="font-['Playfair_Display'] text-gray-500">
                  Seja o primeiro a deixar uma mensagem carinhosa! ❤️
                </p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="bg-[#FDF6EE] p-6 rounded-2xl border border-[#C9A66B]/10">
                  <div className="flex items-start gap-4">
                    <div className="bg-[#C9A66B] p-2 rounded-full flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-['Playfair_Display'] font-semibold text-gray-800">
                          {sanitizeText(msg.name, badTerms)}
                        </h4>
                        <span className="text-sm text-gray-500">
                          {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <p className="font-['Playfair_Display'] text-gray-700 leading-relaxed whitespace-pre-line">
                        {sanitizeText(msg.message, badTerms)}
                      </p>
                    </div>
                    <Heart className="w-5 h-5 text-[#C9A66B] flex-shrink-0" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal de aviso (palavrões/negatividade) */}
      <Modal
        isOpen={warnOpen}
        onClose={() => setWarnOpen(false)}
        title="Ops! Vamos manter o clima do amor 💛"
      >
        <div className="space-y-4 text-center">
          <AlertTriangle className="w-10 h-10 text-[#C9A66B] mx-auto" />
          <p className="font-['Playfair_Display'] text-gray-700">
            {warnText}
          </p>
          <button
            onClick={() => setWarnOpen(false)}
            className="mt-2 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C9A66B] text-white font-['Playfair_Display'] hover:bg-[#B8956A] transition"
          >
            Entendi
          </button>
        </div>
      </Modal>
    </section>
  );
};

export default Messages;
