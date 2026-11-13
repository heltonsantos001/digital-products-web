import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldAlert } from 'lucide-react';

interface PermissionGuardProps {
  permission?: string;
  permissions?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  permission,
  permissions,
  children,
  fallback,
}) => {
  const { hasPermission, hasAnyPermission } = useAuth();

  let isAllowed = true;

  if (permission) {
    isAllowed = hasPermission(permission);
  } else if (permissions && permissions.length > 0) {
    isAllowed = hasAnyPermission(permissions);
  }

  if (!isAllowed) {
    if (fallback) return <>{fallback}</>;

    return (
      <div className="p-8 max-w-lg mx-auto my-12 bg-white rounded-2xl border border-rose-100 shadow-soft text-center">
        <div className="w-14 h-14 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-brand-navy mb-2">Acesso Restrito</h2>
        <p className="text-sm text-slate-600 mb-6">
          Seu perfil administrativo não possui a permissão necessária ({permission || permissions?.join(', ')}) para visualizar esta seção.
        </p>
        <span className="inline-block px-3 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full">
          Código 403 • Permissão Insuficiente
        </span>
      </div>
    );
  }

  return <>{children}</>;
};
