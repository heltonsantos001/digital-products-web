import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Truck,
  ShieldCheck,
  ClipboardList,
  Settings,
  LogOut,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, hasPermission, logout } = useAuth();

  const navItems = [
    {
      label: 'Dashboard',
      to: '/admin',
      icon: <LayoutDashboard className="w-5 h-5" />,
      permission: 'reports.view',
      exact: true,
    },
    {
      label: 'Produtos Digitais',
      to: '/admin/produtos',
      icon: <Package className="w-5 h-5" />,
      permission: 'products.view',
    },
    {
      label: 'Categorias',
      to: '/admin/categorias',
      icon: <FolderTree className="w-5 h-5" />,
      permission: 'products.view',
    },
    {
      label: 'Vendas & Pedidos',
      to: '/admin/pedidos',
      icon: <ShoppingBag className="w-5 h-5" />,
      permission: 'orders.view',
    },
    {
      label: 'Clientes',
      to: '/admin/clientes',
      icon: <Users className="w-5 h-5" />,
      permission: 'orders.view',
    },
    {
      label: 'Entregas Digitais',
      to: '/admin/entregas',
      icon: <Truck className="w-5 h-5" />,
      permission: 'deliveries.view',
    },
    {
      label: 'Administradores',
      to: '/admin/usuarios',
      icon: <ShieldCheck className="w-5 h-5" />,
      permission: 'admins.view',
    },
    {
      label: 'Auditoria & Logs',
      to: '/admin/auditoria',
      icon: <ClipboardList className="w-5 h-5" />,
      permission: 'audit.view',
    },
    {
      label: 'Configurações',
      to: '/admin/configuracoes',
      icon: <Settings className="w-5 h-5" />,
      permission: 'settings.manage',
    },
  ];

  // Filter items based on actual RBAC permissions (Section 6.9)
  const allowedNavItems = navItems.filter(item => {
    if (!item.permission) return true;
    return hasPermission(item.permission);
  });

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-brand-navy-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-brand-navy-800 shadow-xl`}
      >
        <div>
          {/* Logo Header */}
          <div className="h-20 flex items-center justify-between px-6 border-b border-brand-navy-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-candy">
                <img
                  src="/logo.png"
                  alt="Meu Mundo de Recortes"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div>
                <span className="font-extrabold text-sm text-white block leading-tight">
                  Meu Mundo de Recortes
                </span>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-yellow-bright block">
                  Painel Administrativo
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-brand-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile snippet */}
          <div className="px-6 py-4 border-b border-brand-navy-800/80 bg-brand-navy-800/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-navy-700 text-brand-yellow font-black flex items-center justify-center text-sm border border-brand-navy-600">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <span className="text-xs font-bold text-white block truncate">
                  {user?.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-400 block truncate">
                  {user?.is_super_admin ? 'Super Administrador' : user?.roles?.[0] || 'Administrador'}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-4 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-250px)]">
            <span className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500 block mb-2">
              Menu Principal
            </span>
            {allowedNavItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all ${
                    isActive
                      ? 'bg-brand-pink text-white shadow-candy-pink'
                      : 'text-slate-300 hover:bg-brand-navy-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-brand-navy-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-slate-400 hover:bg-brand-navy-800 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-brand-green" />
              Ver Loja Pública
            </span>
            <span className="text-[10px] bg-brand-navy-800 px-2 py-0.5 rounded text-slate-300">Abrir</span>
          </a>

          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair do Painel</span>
          </button>
        </div>
      </aside>
    </>
  );
};
