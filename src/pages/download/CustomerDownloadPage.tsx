import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, Sparkles, ShieldCheck, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

export const CustomerDownloadPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
  const downloadUrl = `${apiBaseUrl}/downloads/${token}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8FF] via-slate-50 to-white text-brand-navy py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-float text-center space-y-6">
        
        <div className="w-16 h-16 rounded-3xl bg-brand-yellow-light/60 text-brand-navy flex items-center justify-center mx-auto shadow-candy">
          <Download className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Link Seguro Autorizado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">
            Seu Material Digital está Pronto!
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-600 max-w-md mx-auto">
            Clique no botão abaixo para iniciar o download direto do arquivo em seu dispositivo.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-left space-y-2.5 text-xs text-slate-700 font-semibold">
          <div className="flex items-center gap-2 text-brand-navy font-bold">
            <ShieldCheck className="w-4 h-4 text-brand-green" />
            <span>Link protegido e intransferível</span>
          </div>
          <div className="flex items-center gap-2 text-brand-navy font-bold">
            <FileText className="w-4 h-4 text-brand-purple" />
            <span>Arquivo original em alta definição para impressão</span>
          </div>
        </div>

        <div className="pt-2">
          <a
            href={downloadUrl}
            download
            className="candy-button inline-flex items-center justify-center gap-3 w-full bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-base py-4 rounded-full shadow-float transition-all"
          >
            <Download className="w-5 h-5 stroke-[2.5]" />
            <span>BAIXAR ARQUIVO AGORA</span>
          </a>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <Link
            to="/"
            className="text-xs font-bold text-slate-400 hover:text-brand-navy transition-colors"
          >
            ← Voltar para a Loja Oficial
          </Link>
        </div>

      </div>
    </div>
  );
};
