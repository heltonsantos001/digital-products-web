import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Sparkles, BookOpen, Layers, CheckCircle2 } from 'lucide-react';

interface StoreHeaderProps {
  onBuyClick?: () => void;
  productPrice?: number;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onBuyClick, productPrice }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleScrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-navy-100/60 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-navy-800 to-brand-navy-700 flex items-center justify-center shadow-candy text-white font-extrabold text-xl group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-brand-yellow-bright animate-pulse" />
            </div>
            <div>
              <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-brand-navy block leading-none">
                Educa<span className="text-brand-pink">Kids</span>
              </span>
              <span className="text-xs font-bold text-slate-500 tracking-wider uppercase block mt-1">
                Materiais Digitais
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollTo('material')}
              className="text-brand-navy-800 hover:text-brand-pink font-bold text-sm tracking-wide transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-brand-purple" />
              O material
            </button>
            <button
              onClick={() => handleScrollTo('por-dentro')}
              className="text-brand-navy-800 hover:text-brand-pink font-bold text-sm tracking-wide transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-4 h-4 text-brand-green" />
              Por dentro
            </button>
            <button
              onClick={() => handleScrollTo('como-usar')}
              className="text-brand-navy-800 hover:text-brand-pink font-bold text-sm tracking-wide transition-colors flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
              Como usar
            </button>
          </nav>

          {/* Right Action: Buy Button */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={onBuyClick}
              className="candy-button bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-sm px-6 py-3 rounded-full flex items-center gap-2 cursor-pointer transition-all"
            >
              <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              <span>QUERO O MATERIAL</span>
              {productPrice !== undefined && (
                <span className="bg-brand-navy text-white text-xs font-extrabold px-2 py-0.5 rounded-full ml-1">
                  R$ {productPrice.toFixed(2).replace('.', ',')}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onBuyClick}
              className="candy-button bg-brand-yellow text-brand-navy font-black text-xs px-3.5 py-2 rounded-full flex items-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>COMPRAR</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-navy-800 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3">
            <button
              onClick={() => handleScrollTo('material')}
              className="text-left font-bold text-brand-navy text-base py-2 border-b border-slate-100 flex items-center justify-between"
            >
              <span>O material</span>
              <BookOpen className="w-4 h-4 text-brand-purple" />
            </button>
            <button
              onClick={() => handleScrollTo('por-dentro')}
              className="text-left font-bold text-brand-navy text-base py-2 border-b border-slate-100 flex items-center justify-between"
            >
              <span>Por dentro</span>
              <Layers className="w-4 h-4 text-brand-green" />
            </button>
            <button
              onClick={() => handleScrollTo('como-usar')}
              className="text-left font-bold text-brand-navy text-base py-2 border-b border-slate-100 flex items-center justify-between"
            >
              <span>Como usar</span>
              <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
            </button>
          </nav>
          <div className="pt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBuyClick?.();
              }}
              className="candy-button w-full justify-center bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-base py-3.5 rounded-full flex items-center gap-2"
            >
              <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
              <span>QUERO O MATERIAL AGORA</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
