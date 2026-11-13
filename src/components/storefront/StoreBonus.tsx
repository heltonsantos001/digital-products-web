import React from 'react';
import { ProductVisualMeta } from '../../types';
import { Gift, Sparkles, CheckCircle2 } from 'lucide-react';

interface StoreBonusProps {
  bonus: ProductVisualMeta['bonus'];
}

export const StoreBonus: React.FC<StoreBonusProps> = ({ bonus }) => {
  if (!bonus) return null;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-r from-brand-yellow-light/40 via-brand-pink-light/30 to-brand-purple-light/40 border-b border-brand-yellow/20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="bg-white rounded-[2rem] p-6 sm:p-10 border-2 border-brand-yellow/40 shadow-float grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Bonus Image */}
          <div className="md:col-span-5 flex justify-center">
            <div className="relative group max-w-sm w-full">
              <div className="absolute -inset-2 bg-gradient-to-tr from-brand-yellow to-brand-pink rounded-3xl blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-slate-100 border-2 border-white shadow-md">
                <img
                  src={bonus.image}
                  alt={bonus.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-brand-pink text-white text-xs font-black px-3 py-1 rounded-full shadow-candy-pink">
                  {bonus.badge || 'BÔNUS GRÁTIS'}
                </div>
              </div>
            </div>
          </div>

          {/* Bonus Info */}
          <div className="md:col-span-7 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow text-brand-navy font-black text-xs uppercase tracking-wider shadow-xs">
              <Gift className="w-4 h-4 text-brand-navy fill-brand-navy" />
              <span>Presente Exclusivo Incluso</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-brand-navy leading-tight">
              {bonus.title}
            </h3>

            <p className="text-slate-700 font-semibold text-sm sm:text-base leading-relaxed">
              {bonus.description}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-extrabold text-slate-600">
              <span className="flex items-center gap-1.5 text-brand-green">
                <CheckCircle2 className="w-4 h-4" /> Arquivo liberado junto na compra
              </span>
              <span className="flex items-center gap-1.5 text-brand-purple">
                <Sparkles className="w-4 h-4" /> Sem nenhum custo adicional
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
