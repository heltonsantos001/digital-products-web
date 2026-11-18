import React from 'react';
import { Product, ProductVisualMeta } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { getProductImageUrl } from '../../services/api';
import { ShoppingBag, Sparkles, Download, CheckCircle, ShieldCheck, Heart } from 'lucide-react';

interface StoreHeroProps {
  product: Product;
  meta: ProductVisualMeta;
  onBuyClick: () => void;
}

export const StoreHero: React.FC<StoreHeroProps> = ({ product, meta, onBuyClick }) => {
  return (
    <section id="material" className="relative bg-gradient-to-b from-[#DDF4FF] via-[#E8F8FF] to-[#F4FBFF] pt-10 pb-16 lg:pb-24 overflow-hidden border-b border-brand-ice-300/40">
      
      {/* Decorative playful circles/blobs */}
      <div className="absolute top-12 left-6 w-32 h-32 bg-brand-yellow-light/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-brand-pink-light/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-48 h-48 bg-brand-purple-light/40 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 3-column Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center">
          
          {/* AREA ESQUERDA: Texto, Faixa Rosa, Edição, Botão Amarelo (lg:col-span-4) */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-5">
            
            {/* Edition / Tag badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple-light border border-brand-purple/20 text-brand-purple font-extrabold text-xs tracking-wider uppercase shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-purple animate-bounce" />
              <span>{meta.edition || 'Edição Especial 2026'}</span>
            </div>

            {/* Main Big Title */}
            <h1 className="text-3xl sm:text-4xl xl:text-5xl font-black text-brand-navy leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Pink Banner / Highlight Strip */}
            <div className="inline-block w-full">
              <div className="bg-gradient-to-r from-brand-pink to-brand-pink-accent text-white px-5 py-2.5 rounded-2xl shadow-candy-pink inline-flex items-center justify-center lg:justify-start gap-2.5 w-full sm:w-auto font-black text-sm sm:text-base transform -rotate-1 hover:rotate-0 transition-transform">
                <Heart className="w-4 h-4 fill-white shrink-0" />
                <span>{meta.highlight_badge || 'Acesso imediato no seu e-mail após a compra'}</span>
              </div>
            </div>

            {/* Descriptive Text */}
            <p className="text-slate-700 font-semibold text-base sm:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
              {meta.summary}
            </p>

            {/* Price & CTA Block */}
            <div className="pt-2 space-y-3">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <button
                  onClick={onBuyClick}
                  className="candy-button w-full sm:w-auto bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-lg px-8 py-4 rounded-full flex items-center justify-center gap-3 cursor-pointer shadow-float group"
                >
                  <ShoppingBag className="w-6 h-6 stroke-[2.5] group-hover:scale-110 transition-transform" />
                  <span>COMPRAR POR {formatCurrency(product.price)}</span>
                </button>
              </div>

              {/* Digital Product Note */}
              <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-bold text-slate-500 pt-1">
                <span className="flex items-center gap-1.5 text-brand-navy-700">
                  <Download className="w-4 h-4 text-brand-green" />
                  Produto 100% Digital em PDF
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5 text-brand-navy-700">
                  <ShieldCheck className="w-4 h-4 text-brand-purple" />
                  Pagamento Seguro
                </span>
              </div>
            </div>

          </div>

          {/* AREA CENTRAL: Imagem principal do produto em formato Tablet / Mockup Digital (lg:col-span-4) */}
          <div className="lg:col-span-4 flex justify-center order-first lg:order-none">
            <div className="relative group max-w-xs sm:max-w-sm w-full">
              
              {/* Tablet Frame Mockup */}
              <div className="relative bg-brand-navy-900 p-3 sm:p-4 rounded-[2.5rem] shadow-2xl border-4 border-slate-700/60 ring-8 ring-white/80 transform hover:-translate-y-2 transition-transform duration-300">
                {/* Camera dot */}
                <div className="w-3 h-3 bg-slate-800 rounded-full mx-auto mb-2.5 border border-slate-600/40" />

                {/* Tablet Screen */}
                <div className="relative overflow-hidden rounded-2xl bg-white aspect-[4/5] flex items-center justify-center shadow-inner">
                  {product.thumbnail_url ? (
                    <img
                      src={getProductImageUrl(product.thumbnail_url)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="p-8 text-center bg-gradient-to-br from-brand-ice-100 to-white flex flex-col items-center justify-center h-full">
                      <Sparkles className="w-12 h-12 text-brand-yellow mb-3" />
                      <h3 className="font-black text-brand-navy text-lg">{product.name}</h3>
                      <p className="text-xs font-bold text-slate-500 mt-2">Material Digital Interativo</p>
                    </div>
                  )}

                  {/* Tablet Floating Tag */}
                  <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-soft border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-pink block">Disponível em PDF</span>
                      <span className="text-xs font-black text-brand-navy block truncate">{product.category_name || 'Material Pedagógico'}</span>
                    </div>
                    <span className="text-sm font-black text-brand-navy bg-brand-yellow px-2.5 py-1 rounded-lg">
                      {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>

                {/* Tablet Home Bar */}
                <div className="w-20 h-1 bg-slate-700 rounded-full mx-auto mt-2.5" />
              </div>

            </div>
          </div>

          {/* AREA DIREITA: Pré-visualizações das páginas impressas / demonstração (lg:col-span-3) */}
          <div className="lg:col-span-3 flex flex-col items-center lg:items-start space-y-4">
            <div className="w-full">
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-navy-700 bg-white/80 px-3 py-1 rounded-full shadow-xs inline-block mb-3">
                📖 Demonstração das Folhas
              </span>
            </div>

            {/* Cascading Paper Sheets Mockup */}
            <div className="relative w-full max-w-[280px] h-[320px] mx-auto lg:mx-0">
              
              {/* Back Page 1 */}
              <div className="absolute top-0 right-4 w-[210px] h-[270px] bg-white rounded-xl shadow-md border-2 border-slate-200 transform rotate-6 overflow-hidden p-2">
                <div className="w-full h-full bg-slate-50 rounded-lg p-3 border border-dashed border-slate-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-1 border-slate-200">
                    <span className="text-[9px] font-bold text-slate-400">Atividade #03</span>
                    <span className="text-[9px] font-bold text-brand-pink">Alfabetização</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 my-auto">
                    <div className="h-12 bg-rose-100/60 rounded-md border border-rose-200 flex items-center justify-center text-xs font-black text-rose-500">A</div>
                    <div className="h-12 bg-amber-100/60 rounded-md border border-amber-200 flex items-center justify-center text-xs font-black text-amber-500">E</div>
                    <div className="h-12 bg-emerald-100/60 rounded-md border border-emerald-200 flex items-center justify-center text-xs font-black text-emerald-500">I</div>
                    <div className="h-12 bg-blue-100/60 rounded-md border border-blue-200 flex items-center justify-center text-xs font-black text-blue-500">O</div>
                  </div>
                  <span className="text-[8px] font-semibold text-slate-400 text-center">Ligue as vogais correspondentes</span>
                </div>
              </div>

              {/* Middle Page 2 */}
              <div className="absolute top-6 right-8 w-[210px] h-[270px] bg-white rounded-xl shadow-lg border-2 border-slate-200 transform -rotate-3 overflow-hidden p-2">
                <div className="w-full h-full bg-amber-50/50 rounded-lg p-3 border border-dashed border-amber-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-1 border-amber-200">
                    <span className="text-[9px] font-bold text-slate-400">Atividade #08</span>
                    <span className="text-[9px] font-bold text-amber-600">Coordenação</span>
                  </div>
                  <div className="space-y-3 my-auto">
                    <div className="h-3 border-b-2 border-dotted border-amber-400" />
                    <div className="h-3 border-b-2 border-dashed border-rose-400" />
                    <div className="h-3 border-b-2 border-dotted border-emerald-400" />
                    <div className="h-3 border-b-2 border-dashed border-blue-400" />
                  </div>
                  <span className="text-[8px] font-semibold text-slate-400 text-center">Cubra os traçados com giz de cera</span>
                </div>
              </div>

              {/* Front Page 3 */}
              <div className="absolute top-12 left-0 w-[220px] h-[270px] bg-white rounded-xl shadow-float border-2 border-brand-ice-300 transform rotate-1 overflow-hidden p-2 hover:rotate-0 transition-transform">
                <div className="w-full h-full bg-gradient-to-b from-blue-50/60 to-white rounded-lg p-3 border border-dashed border-blue-200 flex flex-col justify-between">
                  <div className="flex items-center justify-between border-b pb-1.5 border-blue-100">
                    <span className="text-[10px] font-extrabold text-brand-navy">Pronto para Imprimir</span>
                    <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">PDF A4</span>
                  </div>
                  
                  <div className="space-y-2 my-auto text-left">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green shrink-0" />
                      <span>Traçados em alta resolução</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green shrink-0" />
                      <span>Economia de tinta preta e colorida</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                      <CheckCircle className="w-3.5 h-3.5 text-brand-green shrink-0" />
                      <span>Folhas individuais numeradas</span>
                    </div>
                  </div>

                  <div className="bg-brand-navy text-white text-[9px] font-black py-1.5 px-2 rounded-md text-center">
                    COMPLETO & PRONTO PARA USAR
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
