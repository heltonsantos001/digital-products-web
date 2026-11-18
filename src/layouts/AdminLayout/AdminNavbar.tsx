import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Bell, Shield, Sparkles } from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-20 flex items-center justify-between px-4 sm:px-8 shadow-xs">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2.5 rounded-2xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="hidden sm:block">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Meu Mundo de Recortes
          </span>
          <span className="text-sm font-black text-brand-navy">
            Controle de Operações & Vendas
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Super admin badge */}
        {user?.is_super_admin ? (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-extrabold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Super Admin
          </span>
        ) : (
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
            <Shield className="w-3.5 h-3.5 text-brand-purple" />
            Administrador
          </span>
        )}

        <div className="h-8 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-brand-navy text-white font-extrabold flex items-center justify-center text-sm shadow-candy">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-black text-brand-navy block leading-tight">
              {user?.name}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 block">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
