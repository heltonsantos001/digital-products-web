import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import { AdminUser, Role, Permission } from '../../types';
import { formatDate, getStatusBadge } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/api';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Key,
  Shield,
  Sparkles,
  Loader2,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';

export const AdminUsersPage: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuth();
  const canCreate = hasPermission('admins.create');
  const canUpdate = hasPermission('admins.update');
  const canDelete = hasPermission('admins.delete');

  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modals
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form inputs
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [selectedPermIds, setSelectedPermIds] = useState<number[]>([]);
  const [status, setStatus] = useState<'active' | 'inactive' | 'suspended'>('active');
  const [saving, setSaving] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [adminsRes, rolesRes, permsRes] = await Promise.all([
        adminService.listAdmins(1, 50),
        adminService.listRoles(),
        adminService.listPermissions(),
      ]);
      setAdmins(adminsRes.admins);
      setRoles(rolesRes);
      setPermissions(permsRes);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const openCreate = () => {
    setEditingAdmin(null);
    setName('');
    setEmail('');
    setPassword('');
    setIsSuperAdmin(false);
    setSelectedRoleIds(roles[0] ? [roles[0].id] : []);
    setSelectedPermIds([]);
    setStatus('active');
    setModalOpen(true);
  };

  const openEdit = (adm: AdminUser) => {
    setEditingAdmin(adm);
    setName(adm.name);
    setEmail(adm.email);
    setPassword('');
    setIsSuperAdmin(adm.is_super_admin);
    setStatus(adm.status || 'active');

    // Find role IDs matching admin roles names
    const matchedRoleIds = roles
      .filter(r => adm.roles?.includes(r.name))
      .map(r => r.id);
    setSelectedRoleIds(matchedRoleIds);
    setSelectedPermIds([]);
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);

    try {
      if (editingAdmin) {
        await adminService.updateAdmin(editingAdmin.id, {
          name: name.trim(),
          email: email.trim(),
          password: password ? password : undefined,
          status,
          roleIds: selectedRoleIds,
        });
      } else {
        await adminService.createAdmin({
          name: name.trim(),
          email: email.trim(),
          password,
          is_super_admin: currentUser?.is_super_admin ? isSuperAdmin : false,
          roleIds: selectedRoleIds,
        });
      }
      setModalOpen(false);
      fetchAll();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (id === currentUser?.id) {
      alert('Você não pode desativar seu próprio usuário.');
      return;
    }
    if (!window.confirm('Deseja desativar este administrador?')) return;
    try {
      await adminService.deleteAdmin(id);
      fetchAll();
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const toggleRole = (roleId: number) => {
    if (selectedRoleIds.includes(roleId)) {
      setSelectedRoleIds(selectedRoleIds.filter(id => id !== roleId));
    } else {
      setSelectedRoleIds([...selectedRoleIds, roleId]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Gestão de Administradores
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Controle de perfis, cargos e permissões de acesso hierárquico (RBAC).
          </p>
        </div>

        {canCreate && (
          <button
            onClick={openCreate}
            className="candy-button bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xs sm:text-sm px-6 py-3 rounded-full flex items-center gap-2 shadow-candy"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NOVO ADMINISTRADOR</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Admins Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy mb-2" />
            <p className="text-xs font-bold">Carregando administradores...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Nome / E-mail</th>
                  <th className="py-4 px-4">Tipo de Acesso</th>
                  <th className="py-4 px-4">Cargos / Roles</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Último Acesso</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {admins.map((adm) => {
                  const badge = getStatusBadge(adm.status || 'active');
                  const isCurrent = adm.id === currentUser?.id;

                  return (
                    <tr key={adm.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-brand-navy text-white font-black flex items-center justify-center text-sm shadow-xs">
                            {adm.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="font-extrabold text-brand-navy block">
                              {adm.name} {isCurrent && <span className="text-[10px] text-brand-pink font-bold">(Você)</span>}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium block">
                              {adm.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        {adm.is_super_admin ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            SUPER ADMIN
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                            <Shield className="w-3.5 h-3.5 text-brand-purple" />
                            COMUM
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {adm.roles && adm.roles.length > 0 ? (
                            adm.roles.map((r, idx) => (
                              <span key={idx} className="bg-brand-ice-100 text-brand-navy-900 px-2 py-0.5 rounded text-[10px] font-bold">
                                {r}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-[11px]">-</span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {formatDate(adm.updated_at || adm.created_at)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {canUpdate && (
                            <button
                              onClick={() => openEdit(adm)}
                              title="Editar Administrador"
                              className="p-2 rounded-xl text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          {canDelete && !isCurrent && (
                            <button
                              onClick={() => handleDelete(adm.id)}
                              title="Desativar"
                              className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admin Modal (Create / Edit) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-brand-navy text-lg">
                {editingAdmin ? 'Editar Administrador' : 'Cadastrar Administrador'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-bold text-slate-700">
              <div>
                <label className="block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo Lima"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>

              <div>
                <label className="block mb-1">E-mail *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="carlos@platform.com"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>

              <div>
                <label className="block mb-1">
                  {editingAdmin ? 'Nova Senha (deixe em branco para manter a atual)' : 'Senha de Acesso * (mínimo 8 caracteres)'}
                </label>
                <input
                  type="password"
                  required={!editingAdmin}
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                />
              </div>

              {editingAdmin && (
                <div>
                  <label className="block mb-1">Status da Conta</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 bg-white"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="suspended">Suspenso</option>
                  </select>
                </div>
              )}

              {/* Roles Selection */}
              <div>
                <label className="block mb-2">Cargos / Papéis Atribuídos:</label>
                <div className="space-y-2">
                  {roles.map((r) => (
                    <label
                      key={r.id}
                      className={`p-3 rounded-2xl border cursor-pointer flex items-center justify-between transition-all ${
                        selectedRoleIds.includes(r.id)
                          ? 'border-brand-navy bg-slate-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={selectedRoleIds.includes(r.id)}
                          onChange={() => toggleRole(r.id)}
                          className="w-4 h-4 text-brand-navy rounded"
                        />
                        <div>
                          <span className="font-extrabold text-brand-navy block">{r.display_name}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{r.description}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{r.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Only Super Admin can toggle is_super_admin (Security fix C3 from audit) */}
              {currentUser?.is_super_admin && !editingAdmin && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="font-black text-amber-900 block text-xs">Administrador Supremo</span>
                    <span className="text-[10px] text-amber-700 block font-normal">
                      Concede acesso irrestrito a todas as permissões do sistema.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSuperAdmin}
                    onChange={(e) => setIsSuperAdmin(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded"
                  />
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="candy-button px-6 py-2.5 rounded-xl bg-brand-yellow text-brand-navy font-black disabled:opacity-50"
                >
                  {saving ? 'Gravando...' : 'Salvar Administrador'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
