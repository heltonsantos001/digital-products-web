import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Scissors, Layers, BookOpen, Sparkles } from 'lucide-react';

interface StoreHeaderProps {
  onBuyClick?: () => void;
}

export const StoreHeader: React.FC<StoreHeaderProps> = ({ onBuyClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      {/* 1. Barra de anúncio superior */}
      <div className="w-full bg-[#f4effa] text-[#5c4d74] font-semibold py-1.5 sm:py-2 px-3 text-center border-b border-[#ece4f5] flex items-center justify-center gap-1.5 overflow-hidden">
        <Scissors className="w-3.5 h-3.5 text-[#886ba8] shrink-0" />
        <p className="truncate text-[10px] sm:text-xs">
          Recortar, colar e descobrir. Um mundo de possibilidades!
        </p>
        <span className="text-[#886ba8] shrink-0 text-xs">✦</span>
      </div>

      {/* 2. Header principal fixo */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#f1ebf6]">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-16 sm:h-[72px] flex items-center justify-between">
          {/* Logo e nome da marca */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-2.5 group shrink-0"
            aria-label="Meu Mundo de Recortes - Início"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-[#ede5f6] shadow-xs group-hover:scale-105 transition-transform flex items-center justify-center bg-[#5bbfe8] shrink-0">
              <img
                src="/logo.png"
                alt="Meu Mundo de Recortes"
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-black text-xs sm:text-base leading-none text-[#1e192c] tracking-tight">
                Meu Mundo
              </span>
              <span className="font-black text-xs sm:text-base leading-tight text-[#1e192c] tracking-tight">
                de Recortes.
              </span>
            </div>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <button
              onClick={() => scrollTo('materiais')}
              className="text-xs font-extrabold text-[#5c526f] hover:text-[#7f5fa8] transition-colors cursor-pointer"
            >
              Buscar descoberta
            </button>
            <button
              onClick={() => scrollTo('todos-os-produtos')}
              className="text-xs font-extrabold text-[#5c526f] hover:text-[#7f5fa8] transition-colors cursor-pointer"
            >
              Todos os materiais
            </button>
            <button
              onClick={() => scrollTo('por-dentro')}
              className="text-xs font-extrabold text-[#5c526f] hover:text-[#7f5fa8] transition-colors cursor-pointer"
            >
              Por dentro do PDF
            </button>
            <button
              onClick={() => scrollTo('como-funciona')}
              className="text-xs font-extrabold text-[#5c526f] hover:text-[#7f5fa8] transition-colors cursor-pointer"
            >
              Como funciona
            </button>
          </nav>

          {/* Botão de Menu Mobile */}
          <div className="flex md:hidden items-center shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-2xl bg-[#f4effa] text-[#4f3f6b] flex items-center justify-center hover:bg-[#ede5f7] transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-[#f1ebf6] px-5 py-4 shadow-xl animate-in slide-in-from-top-2 duration-150">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => scrollTo('materiais')}
                className="text-left font-bold text-sm text-[#3b324d] hover:text-[#7f5fa8] py-2 transition-colors flex items-center justify-between"
              >
                <span>Buscar descoberta</span>
                <span className="text-xs text-[#8f75b3]">Buscar</span>
              </button>
              <button
                onClick={() => scrollTo('todos-os-produtos')}
                className="text-left font-bold text-sm text-[#3b324d] hover:text-[#7f5fa8] py-2 transition-colors flex items-center justify-between"
              >
                <span>Todos os materiais</span>
                <span className="text-xs text-[#8f75b3]">Catálogo</span>
              </button>
              <button
                onClick={() => scrollTo('por-dentro')}
                className="text-left font-bold text-sm text-[#3b324d] hover:text-[#7f5fa8] py-2 transition-colors flex items-center justify-between"
              >
                <span>Por dentro do PDF</span>
                <span className="text-xs text-[#8f75b3]">Espiar</span>
              </button>
              <button
                onClick={() => scrollTo('como-funciona')}
                className="text-left font-bold text-sm text-[#3b324d] hover:text-[#7f5fa8] py-2 transition-colors flex items-center justify-between"
              >
                <span>Como funciona</span>
                <span className="text-xs text-[#8f75b3]">Passo a passo</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
