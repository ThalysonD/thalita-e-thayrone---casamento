import React, { useEffect, useMemo, useState } from 'react';
import { Gift, ExternalLink, Copy, CreditCard, Check, ShoppingBag, AlertTriangle } from 'lucide-react';
import { supabase, Gift as GiftType } from '../lib/supabase';
import Modal from './Modal';

const INITIAL_COUNT = 12;
const LOAD_MORE_STEP = 20;

type G = GiftType;
type SettingRow = { key: string; value: string };
type TermRow = { term: string };

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

const GiftList = () => {
  const [gifts, setGifts] = useState<G[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [badTerms, setBadTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  // compra/presente
  const [purchasingGift, setPurchasingGift] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<G | null>(null);
  const [modalStep, setModalStep] = useState<'pix' | 'confirm' | 'success'>('pix');
  const [confirmPix, setConfirmPix] = useState(false);
  const [purchaseForm, setPurchaseForm] = useState({ name: '', phone: '' });

  // aviso (modal)
  const [warnOpen, setWarnOpen] = useState(false);
  const [warnText, setWarnText] = useState('Por favor, use um nome apropriado 🙂');

  // confirmação de cópia do PIX
  const [copyConfirmOpen, setCopyConfirmOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [giftsRes, settingsRes, termsRes] = await Promise.all([
          supabase.from('gifts').select('*'),
          supabase.from('site_settings').select('key,value'),
          supabase.from('blocked_terms').select('term').eq('is_active', true),
        ]);

        if (giftsRes.error) throw giftsRes.error;
        if (settingsRes.error) throw settingsRes.error;
        if (termsRes.error) throw termsRes.error;

        const terms = (termsRes.data as TermRow[] | null)?.map((r) => r.term) ?? [];
        setBadTerms(terms);

        const safeGifts = (giftsRes.data as G[]).map((g) => ({
          ...g,
          name: sanitizeText(g.name, terms),
          description: sanitizeText(g.description ?? undefined, terms),
          purchased_by: sanitizeText(g.purchased_by ?? undefined, terms),
        }));
        setGifts(safeGifts || []);

        const map: Record<string, string> = {};
        (settingsRes.data as SettingRow[]).forEach((r) => (map[r.key] = r.value));
        setSettings(map);
      } catch (e) {
        console.error('Erro ao carregar dados', e);
        setWarnText('Não foi possível carregar os presentes agora. Tente novamente em instantes.');
        setWarnOpen(true);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const pixKey = settings['pix_key'] ?? '';
  const presentListUrl = settings['present_list_url'] ?? '#';

  const handleCopyPix = async () => {
    if (!pixKey) return;
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopyConfirmOpen(true);
    } catch (e) {
      console.error('Falha ao copiar PIX', e);
      setWarnText('Não foi possível copiar a chave PIX. Copie manualmente, por favor.');
      setWarnOpen(true);
    }
  };

  // ordena por preço crescente; nulos no final
  const sortedGifts = useMemo(() => {
    const arr = [...gifts];
    arr.sort((a, b) => {
      const pa = typeof a.price === 'number' ? a.price : Number.POSITIVE_INFINITY;
      const pb = typeof b.price === 'number' ? b.price : Number.POSITIVE_INFINITY;
      if (pa === pb) return (a.name || '').localeCompare(b.name || '');
      return pa - pb;
    });
    return arr;
  }, [gifts]);

  const visibleGifts = useMemo(
    () => sortedGifts.slice(0, Math.min(visibleCount, sortedGifts.length)),
    [sortedGifts, visibleCount]
  );

  const brl = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  // ==== fluxo do modal ====
  const openPixModal = (gift: G) => {
    setSelectedGift(gift);
    setModalStep('pix');
    setConfirmPix(false);
    setPurchaseForm({ name: '', phone: '' });
  };

  const openConfirmModal = (gift: G) => {
    setSelectedGift(gift);
    setModalStep('confirm');
    setConfirmPix(true); // veio do "Já comprei"
    setPurchaseForm({ name: '', phone: '' });
  };

  const handleNextFromPix = () => {
    if (!confirmPix) return;
    setModalStep('confirm');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setPurchaseForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmitConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;
    const rawName = purchaseForm.name.trim();
    const phone = purchaseForm.phone.trim() || null;

    if (!rawName) return;

    if (hasBadTerms(rawName, badTerms)) {
      setWarnText('Por favor, use um nome apropriado 🙂');
      setWarnOpen(true);
      return;
    }

    const cleanName = sanitizeText(rawName, badTerms);
    await markAsGifted(selectedGift.id, cleanName, phone);
    setModalStep('success');
  };

  const markAsGifted = async (giftId: string, purchased_by: string, purchased_phone: string | null) => {
    setPurchasingGift(giftId);
    try {
      const { data, error } = await supabase
        .from('gifts')
        .update({
          is_purchased: true,
          purchased_by: sanitizeText(purchased_by, badTerms),
          purchased_phone,
        })
        .eq('id', giftId)
        .select()
        .single();
      if (error) throw error;

      const safe = {
        ...data,
        name: sanitizeText(data.name, badTerms),
        description: sanitizeText(data.description, badTerms),
        purchased_by: sanitizeText(data.purchased_by, badTerms),
      };

      setGifts((prev) => prev.map((g) => (g.id === giftId ? { ...g, ...safe } : g)));
    } catch (err) {
      console.error('Erro ao registrar presente', err);
      setWarnText('Erro ao registrar o presente. Tente novamente.');
      setWarnOpen(true);
    } finally {
      setPurchasingGift(null);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-[#FDF6EE] via-white to-[#FDF6EE]">
      <div className="max-w-6xl mx-auto">
        {/* Fundo decorativo */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="text-[#C9A66B] text-6xl absolute top-20 left-10">❀</div>
          <div className="text-[#C9A66B] text-4xl absolute bottom-20 right-10">✿</div>
          <div className="text-[#C9A66B] text-5xl absolute top-1/2 left-1/4">❀</div>
        </div>

        <div className="relative bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-[#C9A66B]/20">
          <div className="text-center">
            <Gift className="w-12 h-12 text-[#C9A66B] mx-auto mb-4" />
            <h2 className="font-['Dancing_Script'] text-4xl md:text-5xl text-[#C9A66B] font-bold mb-6">
              Lista de Presentes
            </h2>

            <div className="space-y-4 font-['Playfair_Display'] text-gray-700 leading-relaxed mb-8">
              <p className="text-lg md:text-xl">Sua presença já é uma bênção em nosso grande dia!</p>
              <p className="text-lg md:text-xl">
                Presentes <span className="font-semibold">da casa</span> ficam na nossa{' '}
                <button
                  onClick={() => window.open(presentListUrl, '_blank')}
                  className="underline decoration-[#C9A66B] underline-offset-2 hover:text-[#C9A66B]"
                >
                  Lista Oficial
                </button>
                . Aqui os presentes são <span className="font-semibold">simbólicos/PIX</span> — uma forma leve e divertida de nos abençoar: você escolhe, faz o PIX e a gente registra seu nome. 💛
              </p>
            </div>

            {/* CTA topo + PIX */}
            <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-12">
              <button
                onClick={() => window.open(presentListUrl, '_blank')}
                className="bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg inline-flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Acessar Lista Oficial
              </button>

              <div className="text-gray-400 text-lg">ou</div>

              <div className="bg-[#FDF6EE] p-6 rounded-2xl border-2 border-[#C9A66B]/20">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="w-5 h-5 text-[#C9A66B]" />
                  <span className="font-['Playfair_Display'] font-semibold text-gray-700">PIX</span>
                </div>
                <p className="font-['Playfair_Display'] text-sm text-gray-600 mb-2">Chave PIX:</p>
                <div className="flex items-center gap-2">
                  <code className="bg-white px-3 py-0 rounded-lg text-sm border flex-1 min-w-[220px] text-center">
                    {pixKey || '—'}
                  </code>

                  <button
                    onClick={handleCopyPix}
                    disabled={!pixKey}
                    className="p-2 text-[#C9A66B] hover:bg-[#C9A66B] hover:text-white rounded-lg transition-colors disabled:opacity-50"
                    title="Copiar chave PIX"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Grade de presentes */}
            {loading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-pulse bg-[#FDF6EE] rounded-2xl p-6 border border-[#C9A66B]/10 h-64" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {visibleGifts.map((gift) => (
                    <div
                      key={gift.id}
                      className="bg-[#FDF6EE] rounded-2xl p-6 border border-[#C9A66B]/10 relative overflow-hidden flex flex-col"
                    >
                      {gift.is_purchased && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Comprado
                        </div>
                      )}

                      <span className="absolute top-4 left-4 text-xs bg-[#C9A66B] text-white px-2 py-1 rounded-full">
                        Cota simbólica
                      </span>

                      {gift.image_url && (
                        <div className="mb-4 rounded-xl overflow-hidden">
                          <img
                            src={gift.image_url}
                            alt={gift.name}
                            className="w-full h-40 object-cover"
                            loading="lazy"
                          />
                        </div>
                      )}

                      <h3 className="font-['Playfair_Display'] font-bold text-lg text-gray-800 mb-2 line-clamp-2">
                        {sanitizeText(gift.name, badTerms)}
                      </h3>

                      {gift.description && (
                        <p className="font-['Playfair_Display'] text-gray-600 text-sm mb-3 line-clamp-3">
                          {sanitizeText(gift.description, badTerms)}
                        </p>
                      )}

                      <div className="mt-auto">
                        {typeof gift.price === 'number' ? (
                          <p className="font-['Playfair_Display'] font-bold text-[#C9A66B] text-xl">
                            {brl(gift.price)}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-500">Valor a combinar</p>
                        )}
                      </div>

                      {/* Ações */}
                      <div className="mt-4 grid grid-cols-1 gap-2">
                        {gift.is_purchased ? (
                          <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                            <p className="font-['Playfair_Display'] text-green-600 font-semibold">
                              Presente comprado por: {sanitizeText(gift.purchased_by || '—', badTerms)}
                            </p>
                          </div>
                        ) : (
                          <>
                            <button
                              onClick={() => openPixModal(gift)}
                              className="w-full h-11 bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2"
                            >
                              <CreditCard className="w-4 h-4" />
                              Presentear via PIX
                            </button>
                            <button
                              disabled={purchasingGift === gift.id}
                              onClick={() => openConfirmModal(gift)}
                              className="w-full h-11 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-['Playfair_Display'] font-semibold rounded-xl transition-all hover:scale-105 hover:shadow-lg inline-flex items-center justify-center gap-2"
                            >
                              <ShoppingBag className="w-4 h-4" />
                              {purchasingGift === gift.id ? 'Processando...' : 'Já comprei'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ver mais */}
                {visibleCount < sortedGifts.length && (
                  <div className="mt-10">
                    <button
                      onClick={() =>
                        setVisibleCount((c) => Math.min(c + LOAD_MORE_STEP, sortedGifts.length))
                      }
                      className="mx-auto block bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-8 py-3 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg"
                    >
                      Ver mais presentes
                    </button>
                  </div>
                )}
              </>
            )}

            <div className="flex justify-center gap-4 text-[#C9A66B] text-2xl mt-8">
              <span>✿</span>
              <span>❀</span>
              <span>✿</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal do fluxo PIX/confirm/sucesso */}
      {selectedGift && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => {
              setSelectedGift(null);
              setModalStep('pix');
              setConfirmPix(false);
              setPurchaseForm({ name: '', phone: '' });
            }}
          />
          {/* Card */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10">
            <h3 className="text-xl font-['Playfair_Display'] font-semibold text-[#3a3a3a] text-center mb-4">
              {modalStep === 'pix' ? 'Presentear via PIX' : modalStep === 'confirm' ? 'Confirmar Presente' : 'Obrigado!'}
            </h3>

            {modalStep === 'pix' && (
              <div className="space-y-5">
                <div className="text-center">
                  <CreditCard className="w-12 h-12 text-[#C9A66B] mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-3">Use a chave PIX abaixo para presentear:</p>
                </div>

                {/* Linha com chave e botão copiar */}
                <div className="flex items-center gap-2">
                  <code className="bg-[#FDF6EE] px-3 py-2 rounded-lg text-sm border flex-1 select-all text-center">
                    {pixKey || '—'}
                  </code>
                  <button
                    onClick={handleCopyPix}
                    disabled={!pixKey}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-[#C9A66B]/40 text-[#C9A66B] hover:bg-[#C9A66B] hover:text-white transition disabled:opacity-50"
                    title="Copiar chave PIX"
                  >
                    <Copy className="w-4 h-4" />
                    <span className="text-sm">Copiar</span>
                  </button>
                </div>

                <label className="flex items-start gap-3 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={confirmPix}
                    onChange={(e) => setConfirmPix(e.target.checked)}
                    className="mt-1"
                  />
                  Já enviei o PIX para esta chave.
                </label>
                <button
                  onClick={handleNextFromPix}
                  disabled={!confirmPix}
                  className="w-full bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-6 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continuar
                </button>
              </div>
            )}

            {modalStep === 'confirm' && (
              <form onSubmit={handleSubmitConfirm} className="space-y-4">
                <div className="text-center">
                  <ShoppingBag className="w-12 h-12 text-[#C9A66B] mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Confirme seus dados para registrarmos sua generosidade.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo *</label>
                  <input
                    type="text"
                    name="name"
                    value={purchaseForm.name}
                    onChange={handleFormChange}
                    required
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0"
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefone (opcional)</label>
                  <input
                    type="tel"
                    name="phone"
                    value={purchaseForm.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 border-2 border-[#C9A66B]/30 rounded-xl focus:border-[#C9A66B] focus:ring-0"
                    placeholder="(00) 00000-0000"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!!(selectedGift && purchasingGift === selectedGift.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-['Playfair_Display'] font-semibold px-6 py-3 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedGift && purchasingGift === selectedGift.id ? 'Processando...' : 'Confirmar Presente'}
                </button>
              </form>
            )}

            {modalStep === 'success' && (
              <div className="space-y-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-lg font-semibold">Presente confirmado!</p>
                <p className="text-gray-600">Muito obrigado por nos abençoar. Seu presente foi registrado com sucesso.</p>
                <button
                  onClick={() => {
                    setSelectedGift(null);
                    setModalStep('pix');
                    setConfirmPix(false);
                    setPurchaseForm({ name: '', phone: '' });
                  }}
                  className="w-full bg-[#C9A66B] hover:bg-[#B8956A] text-white font-['Playfair_Display'] font-semibold px-6 py-3 rounded-full transition-all"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: confirmação de cópia da chave PIX */}
      <Modal
        isOpen={copyConfirmOpen}
        onClose={() => setCopyConfirmOpen(false)}
        title="Chave PIX copiada!"
      >
        <div className="space-y-4 text-center">
          <div className="mx-auto w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="w-7 h-7 text-green-600" />
          </div>
          <p className="font-['Playfair_Display'] text-gray-700">
            A chave PIX foi copiada para a área de transferência. Você pode colar no seu app do banco e finalizar o presente. 💛
          </p>
          <button
            onClick={() => setCopyConfirmOpen(false)}
            className="mt-2 inline-flex items-center justify-center px-6 py-3 rounded-full bg-[#C9A66B] text-white font-['Playfair_Display'] hover:bg-[#B8956A] transition"
          >
            Entendi
          </button>
        </div>
      </Modal>

      {/* Modal de aviso (palavrões/erros) */}
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

export default GiftList;
