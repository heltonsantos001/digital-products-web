import React, { useEffect, useState } from 'react';
import { settingsService } from '../../services/settings.service';
import { SystemSetting } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/api';
import {
  Settings,
  CreditCard,
  Mail,
  Shield,
  HardDrive,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const canManage = hasPermission('settings.manage');

  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'payment' | 'email' | 'storage' | 'security'>('general');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchSettings = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const list = await settingsService.getAll();
      setSettings(list);
      const initial: Record<string, string> = {};
      list.forEach(s => {
        initial[s.key] = s.value;
      });
      setFormValues(initial);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, val: string) => {
    setFormValues(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canManage) return;
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload = Object.entries(formValues).map(([key, value]) => ({
        key,
        value,
      }));
      await settingsService.update(payload);
      setSuccessMsg('Configurações atualizadas com sucesso no banco de dados!');
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchSettings();
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: <Settings className="w-4 h-4" /> },
    { id: 'payment', label: 'Pagamentos', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'email', label: 'E-mail & Entrega', icon: <Mail className="w-4 h-4" /> },
    { id: 'storage', label: 'Armazenamento', icon: <HardDrive className="w-4 h-4" /> },
    { id: 'security', label: 'Segurança', icon: <Shield className="w-4 h-4" /> },
  ];

  const currentTabSettings = settings.filter(s => s.category === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Configurações da Plataforma
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Parâmetros operacionais do sistema, gateways, limites de download e segurança.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-brand-navy text-white shadow-candy'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Form Container */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft p-6 sm:p-8">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-brand-navy" />
            <p className="text-xs font-bold">Carregando configurações...</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <div className="divide-y divide-slate-100">
              {currentTabSettings.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400 font-bold">
                  Nenhuma configuração nesta categoria.
                </p>
              ) : (
                currentTabSettings.map((s) => {
                  const isSecret = s.is_secret === 1;

                  return (
                    <div key={s.id} className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      <div className="md:col-span-5">
                        <label className="text-xs font-black text-brand-navy block">
                          {s.key}
                        </label>
                        <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                          {s.description || 'Configuração operacional'}
                        </span>
                      </div>

                      <div className="md:col-span-7">
                        <input
                          type={isSecret ? 'password' : 'text'}
                          disabled={!canManage}
                          value={formValues[s.key] ?? s.value}
                          onChange={(e) => handleChange(s.key, e.target.value)}
                          className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 disabled:bg-slate-50 disabled:text-slate-500"
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {canManage && currentTabSettings.length > 0 && (
              <div className="pt-6 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="candy-button bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xs sm:text-sm px-8 py-3.5 rounded-full flex items-center gap-2 shadow-float disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Salvando...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>SALVAR CONFIGURAÇÕES</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </form>
        )}
      </div>

    </div>
  );
};
