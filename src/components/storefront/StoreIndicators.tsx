import React from 'react';
import { ProductVisualMeta } from '../../types';
import { Image, Layers, FileText, CheckCircle, Sparkles } from 'lucide-react';

interface StoreIndicatorsProps {
  meta: ProductVisualMeta;
}

export const StoreIndicators: React.FC<StoreIndicatorsProps> = ({ meta }) => {
  const indicators = meta.indicators || [
    { label: 'Imagens Exclusivas', value: '77+' },
    { label: 'Temas Pedagógicos', value: '11' },
    { label: 'Páginas Prontas para Imprimir', value: '18+' },
  ];

  const getIconForIndex = (index: number) => {
    switch (index % 4) {
      case 0:
        return <Image className="w-6 h-6 text-brand-pink" />;
      case 1:
        return <Layers className="w-6 h-6 text-brand-purple" />;
      case 2:
        return <FileText className="w-6 h-6 text-brand-yellow" />;
      default:
        return <CheckCircle className="w-6 h-6 text-brand-green" />;
    }
  };

  return (
    <section className="bg-white py-8 border-b border-slate-100 shadow-xs relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {indicators.map((ind, idx) => (
            <div key={idx} className={`pt-4 md:pt-0 ${idx > 0 ? 'md:pl-6' : ''} flex items-center gap-4 group`}>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-brand-ice-50 transition-all shadow-xs">
                {getIconForIndex(idx)}
              </div>
              <div>
                <span className="text-2xl sm:text-3xl font-black text-brand-navy block leading-none tracking-tight">
                  {ind.value}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 block mt-1 leading-tight">
                  {ind.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
