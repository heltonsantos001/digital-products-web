import React, { useState } from 'react';
import { ArrowUpRight, Heart, X, Shield, FileText } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const [modalType, setModalType] = useState<'terms' | 'privacy' | null>(null);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#fffdf9] border-t border-[#f0ebf5] pt-12 pb-8 text-[#2e263d]">
        <div className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
            {/* Identidade */}
            <div className="md:col-span-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#ede5f6] shadow-xs flex items-center justify-center bg-[#5bbfe8] shrink-0">
                  <img
                    src="/logo.png"
                    alt="Meu Mundo de Recortes"
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <span className="font-black text-base sm:text-lg text-[#1e192c]">
                  Meu Mundo de Recortes.
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#746b82] leading-relaxed max-w-sm">
                Recortar, colar e descobrir.<br />
                Um mundo para criar em família.
              </p>
            </div>

            {/* Links Rápidos - Coluna 1 */}
            <div className="md:col-span-3 space-y-2.5">
              <button
                onClick={() => scrollTo('materiais')}
                className="block text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors"
              >
                Buscar descobertas
              </button>
              <button
                onClick={() => scrollTo('todos-os-produtos')}
                className="block text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors"
              >
                Todos os materiais
              </button>
              <button
                onClick={() => scrollTo('como-funciona')}
                className="block text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors"
              >
                Como funciona
              </button>
              <button
                onClick={() => scrollTo('duvidas')}
                className="block text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors"
              >
                Dúvidas frequentes
              </button>
            </div>

            {/* Links Rápidos - Coluna 2 */}
            <div className="md:col-span-4 space-y-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors"
              >
                Instagram <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <div>
                <button
                  onClick={() => setModalType('terms')}
                  className="block text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors cursor-pointer"
                >
                  Condições de uso
                </button>
              </div>
              <div>
                <button
                  onClick={() => setModalType('privacy')}
                  className="block text-xs font-bold text-[#5c536c] hover:text-[#7f5fa8] transition-colors cursor-pointer"
                >
                  Compra e privacidade
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-[#f0ebf5] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#827891] text-center sm:text-left">
            <p>© 2026 Meu Mundo de Recortes · Idealização: Tony Herculano</p>
            <div className="flex items-center gap-1.5 font-medium justify-center">
              <Heart className="w-3.5 h-3.5 text-[#e57a8a] fill-[#e57a8a]/20" />
              <span>Para usar em família</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Modais de Termos e Privacidade */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3.5 sm:p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 rounded-full bg-[#f4effa] text-[#55466f] flex items-center justify-center hover:bg-[#ede5f7] transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            {modalType === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e192c] font-black text-lg sm:text-xl">
                  <FileText className="w-5 h-5 text-[#f59e0b] shrink-0" />
                  <span>Condições de Uso</span>
                </div>
                <div className="text-xs sm:text-sm text-[#665d75] space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                  <p>
                    O material digital <strong>Meu Mundo de Recortes</strong> é disponibilizado em formato PDF de alta resolução, pronto para impressão no formato A4.
                  </p>
                  <p>
                    <strong>Uso Permitido:</strong> O material destina-se ao uso pessoal, familiar ou pedagógico sem fins comerciais. Você pode imprimir quantas cópias forem necessárias para as crianças sob seu acompanhamento.
                  </p>
                  <p>
                    <strong>Restrições:</strong> É vedada a revenda, compartilhamento público, sublicenciamento ou comercialização dos arquivos digitais em qualquer plataforma online ou mídia física.
                  </p>
                </div>
              </div>
            )}

            {modalType === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#1e192c] font-black text-lg sm:text-xl">
                  <Shield className="w-5 h-5 text-[#10b981] shrink-0" />
                  <span>Compra e Privacidade</span>
                </div>
                <div className="text-xs sm:text-sm text-[#665d75] space-y-3 max-h-[60vh] overflow-y-auto pr-2 leading-relaxed">
                  <p>
                    Sua privacidade é respeitada com total transparência.
                  </p>
                  <p>
                    <strong>Dados de Compra:</strong> As informações coletadas durante o checkout (como nome e e-mail) destinam-se exclusivamente à identificação do seu pedido e ao envio automático do acesso seguro para download dos arquivos.
                  </p>
                  <p>
                    <strong>Pagamento Seguro:</strong> O processamento do pagamento ocorre em ambiente criptografado e seguro com proteção de dados.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-[#f0e8f6] flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#1c1e33] text-white text-xs font-bold hover:bg-[#121424] transition-colors cursor-pointer"
              >
                Entendi e Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
