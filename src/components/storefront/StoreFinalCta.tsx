import React from 'react';
import { Product, ProductVisualMeta } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { ShoppingBag, ShieldCheck, Zap, Lock } from 'lucide-react';

interface StoreFinalCtaProps {
  product: Product;
  meta: ProductVisualMeta;
  onBuyClick: () => void;
}

export const StoreFinalCta: React.FC<StoreFinalCtaProps> = ({ product, meta, onBuyClick }) => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-tr from-brand-navy-900 via-brand-navy-800 to-brand-navy-700 text-white relative overflow-hidden">
      
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand-pink/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-yellow/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-brand-yellow font-extrabold text-xs uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-brand-yellow" />
          <span>Oferta Especial de Lançamento</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
          Garanta o seu {product.name} agora mesmo!
        </h2>

        <p className="text-slate-300 font-semibold text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          {meta.summary || 'Acesso imediato no seu e-mail logo após a confirmação. Baixe, imprima e aproveite com as crianças!'}
        </p>

        {/* Big Yellow Buy Button */}
        <div className="pt-4 flex flex-col items-center justify-center space-y-4">
          <button
            onClick={onBuyClick}
            className="candy-button bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xl px-10 py-5 rounded-full flex items-center justify-center gap-3 cursor-pointer shadow-float group"
          >
            <ShoppingBag className="w-7 h-7 stroke-[2.5] group-hover:scale-110 transition-transform" />
            <span>QUERO COMPRAR POR APENAS {formatCurrency(product.price)}</span>
          </button>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-slate-300 pt-2">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-brand-green" />
              Ambiente 100% Criptografado
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-yellow" />
              Entrega Automática por E-mail
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-brand-pink" />
              PIX com Liberação Instantânea
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
