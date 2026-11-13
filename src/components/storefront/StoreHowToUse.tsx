import React from 'react';
import { ProductVisualMeta } from '../../types';
import { DownloadCloud, MousePointerClick, Printer, Sparkles } from 'lucide-react';

interface StoreHowToUseProps {
  steps?: ProductVisualMeta['how_to_use'];
}

export const StoreHowToUse: React.FC<StoreHowToUseProps> = ({ steps }) => {
  const defaultSteps = [
    {
      step: 1,
      title: 'Baixe o produto',
      desc: 'Assim que o pagamento for aprovado, seu link protegido chega no e-mail com acesso instantâneo.',
    },
    {
      step: 2,
      title: 'Escolha o conteúdo',
      desc: 'Abra os arquivos em qualquer celular, tablet ou computador e selecione as atividades de hoje.',
    },
    {
      step: 3,
      title: 'Utilize ou imprima o material',
      desc: 'Imprima em papel sulfite comum na sua impressora e comece a brincadeira e o aprendizado.',
    },
  ];

  const currentSteps = steps && steps.length > 0 ? steps : defaultSteps;

  const stepStyles = [
    {
      numColor: 'bg-brand-pink text-white shadow-candy-pink',
      icon: <DownloadCloud className="w-8 h-8 text-brand-pink" />,
      border: 'border-brand-pink/20',
      tag: 'Passo 01',
    },
    {
      numColor: 'bg-brand-yellow text-brand-navy shadow-candy',
      icon: <MousePointerClick className="w-8 h-8 text-brand-yellow" />,
      border: 'border-brand-yellow/30',
      tag: 'Passo 02',
    },
    {
      numColor: 'bg-brand-purple text-white shadow-soft',
      icon: <Printer className="w-8 h-8 text-brand-purple" />,
      border: 'border-brand-purple/20',
      tag: 'Passo 03',
    },
  ];

  return (
    <section id="como-usar" className="py-16 sm:py-24 bg-white border-b border-slate-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-ice text-brand-navy font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-yellow" />
            <span>Simples e Prático</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            Como usar o seu material?
          </h2>
          <p className="text-slate-600 font-semibold text-base">
            Em menos de 2 minutos você tem tudo pronto para usar com as crianças.
          </p>
        </div>

        {/* 3 Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {currentSteps.map((s, idx) => {
            const style = stepStyles[idx % stepStyles.length];
            return (
              <div
                key={idx}
                className={`bg-slate-50/80 rounded-3xl p-8 border ${style.border} shadow-soft hover:shadow-float hover:-translate-y-1 transition-all flex flex-col justify-between relative`}
              >
                {/* Big Step Number Pill */}
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${style.numColor}`}>
                    {s.step || idx + 1}
                  </div>
                  <div className="p-3 bg-white rounded-2xl shadow-xs">
                    {style.icon}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {style.tag}
                  </span>
                  <h3 className="text-xl font-black text-brand-navy leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-slate-600 font-medium text-sm leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-brand-green">
                  <span>✓ 100% digital e sem frete</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
