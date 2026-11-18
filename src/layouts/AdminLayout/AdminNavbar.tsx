import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Menu, Shield, Sparkles } from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 h-16 sm:h-20 flex items-center justify-between px-3.5 sm:px-8 shadow-xs">
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="hidden sm:block truncate">
          <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Meu Mundo de Recortes
          </span>
          <span className="text-xs sm:text-sm font-black text-brand-navy truncate block">
            Controle de Operações & Vendas
          </span>
        </div>
        <div className="sm:hidden truncate">
          <span className="text-xs font-black text-brand-navy block truncate">
            Painel Administrativo
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Super admin badge */}
        {user?.is_super_admin ? (
          <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] sm:text-xs font-extrabold shadow-xs">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-600 shrink-0" />
            <span>Super Admin</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-bold">
            <Shield className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-purple shrink-0" />
            <span>Admin</span>
          </span>
        )}

        <div className="h-6 sm:h-8 w-px bg-slate-200 hidden sm:block" />

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-brand-navy text-white font-extrabold flex items-center justify-center text-xs sm:text-sm shadow-candy shrink-0">
            {user?.name?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block text-left">
            <span className="text-xs font-black text-brand-navy block leading-tight truncate max-w-[140px]">
              {user?.name}
            </span>
            <span className="text-[11px] font-semibold text-slate-400 block truncate max-w-[140px]">
              {user?.email}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
