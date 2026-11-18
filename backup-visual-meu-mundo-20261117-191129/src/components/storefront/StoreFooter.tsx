import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Shield, FileText, HelpCircle, X } from 'lucide-react';

export const StoreFooter: React.FC = () => {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | 'support' | null>(null);

  return (
    <>
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            
            {/* Brand identity */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-navy-800 to-brand-navy-700 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5 text-brand-yellow" />
                </div>
                <span className="font-extrabold text-xl text-white tracking-tight">
                  Educa<span className="text-brand-pink">Kids</span>
                </span>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                Plataforma oficial de materiais pedagógicos e educativos digitais. Criamos conteúdos lúdicos que estimulam o aprendizado prático e saudável para crianças.
              </p>
              <div className="text-xs text-slate-400 bg-slate-800/80 p-3 rounded-xl border border-slate-700 inline-block">
                ⚡ Entrega 100% digital via streaming protegido por e-mail após confirmação do pagamento.
              </div>
            </div>

            {/* Quick Links / Legal */}
            <div className="space-y-3">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
                Informações Legais
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button
                    onClick={() => setModalType('privacy')}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <Shield className="w-3.5 h-3.5 text-brand-green" />
                    Política de Privacidade
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('terms')}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-brand-yellow" />
                    Termos de Uso
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setModalType('support')}
                    className="hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-brand-purple" />
                    Central de Ajuda & Dúvidas
                  </button>
                </li>
              </ul>
            </div>

            {/* Support / Contact */}
            <div className="space-y-3">
              <h4 className="text-white font-extrabold text-sm uppercase tracking-wider">
                Atendimento & Suporte
              </h4>
              <p className="text-xs leading-relaxed">
                Segunda a Sexta, das 09h às 18h.
              </p>
              <div className="flex items-center gap-2 text-xs text-brand-yellow font-bold">
                <Mail className="w-4 h-4 shrink-0" />
                <span>suporte@educakids.com.br</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/admin/login"
                  className="text-[11px] text-slate-400 hover:text-slate-300 underline block"
                >
                  Área do Administrador
                </Link>
              </div>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© {new Date().getFullYear()} EducaKids Digital. Todos os direitos reservados.</p>
            <p>Arquitetura segura com download temporário com hash criptográfico.</p>
          </div>
        </div>
      </footer>

      {/* Legal & Support Modals */}
      {modalType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalType(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {modalType === 'privacy' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-navy font-black text-xl">
                  <Shield className="w-6 h-6 text-brand-green" />
                  <span>Política de Privacidade</span>
                </div>
                <div className="text-sm text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  <p>
                    A sua privacidade é prioridade para nós. Os dados coletados (nome e e-mail) durante a compra são utilizados exclusivamente para:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Identificação do pedido e emissão do comprovante.</li>
                    <li>Envio automatizado do link seguro de download dos materiais adquiridos.</li>
                    <li>Comunicação de suporte referente à compra.</li>
                  </ul>
                  <p>
                    Não compartilhamos, alugamos ou comercializamos dados com terceiros. Todos os pagamentos são processados em ambientes criptografados com certificados SSL/TLS.
                  </p>
                </div>
              </div>
            )}

            {modalType === 'terms' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-navy font-black text-xl">
                  <FileText className="w-6 h-6 text-brand-yellow" />
                  <span>Termos de Uso</span>
                </div>
                <div className="text-sm text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  <p>
                    Ao adquirir os produtos digitais nesta plataforma, você concorda com as seguintes condições de uso:
                  </p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>O material é para uso pessoal, pedagógico ou escolar não comercial.</li>
                    <li>É expressamente proibida a revenda, sublicenciamento ou redistribuição pública dos arquivos digitais.</li>
                    <li>Você tem o direito de imprimir o material quantas vezes forem necessárias para as crianças sob sua responsabilidade.</li>
                    <li>O link de download é pessoal e intransferível, possuindo validade temporal e limite de tentativas por segurança.</li>
                  </ul>
                </div>
              </div>
            )}

            {modalType === 'support' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-navy font-black text-xl">
                  <HelpCircle className="w-6 h-6 text-brand-purple" />
                  <span>Central de Ajuda & Suporte</span>
                </div>
                <div className="text-sm text-slate-600 space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                  <p className="font-bold text-brand-navy">Como recebo meu produto?</p>
                  <p>
                    Logo após a confirmação do pagamento, você receberá um e-mail com o link direto e seguro para baixar seus arquivos em formato PDF ou compactado.
                  </p>
                  <p className="font-bold text-brand-navy">Não recebi o e-mail, e agora?</p>
                  <p>
                    Verifique a sua caixa de Spam ou Lixeira. Se não encontrar, envie um e-mail para <strong className="text-brand-pink">suporte@educakids.com.br</strong> informando o e-mail utilizado na compra para reenvio imediato.
                  </p>
                  <p className="font-bold text-brand-navy">Posso imprimir em qualquer impressora?</p>
                  <p>
                    Sim! Os arquivos vêm configurados no padrão A4 pronto para impressão doméstica ou gráfica rápida, colorida ou preto e branco.
                  </p>
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2.5 rounded-xl bg-brand-navy text-white text-sm font-bold hover:bg-brand-navy-700 transition-colors"
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
