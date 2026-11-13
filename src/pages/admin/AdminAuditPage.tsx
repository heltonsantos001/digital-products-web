import React, { useEffect, useState } from 'react';
import { auditService } from '../../services/audit.service';
import { AuditLog } from '../../types';
import { formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';
import { ClipboardList, Search, RefreshCw, Eye, Shield, Loader2, X, AlertCircle } from 'lucide-react';

export const AdminAuditPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { logs: list } = await auditService.list({ limit: 50 });
      setLogs(list);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l =>
    (l.action && l.action.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.entity && l.entity.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.administrator_name && l.administrator_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (l.ip_address && l.ip_address.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Trilha de Auditoria & Segurança
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Registro imutável de todas as ações administrativas realizadas no sistema.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Atualizar Logs</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por ação, entidade, administrador ou IP..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-xs font-semibold"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy mb-2" />
            <p className="text-xs font-bold">Carregando logs de auditoria...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Nenhum registro de auditoria encontrado</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Data / Hora</th>
                  <th className="py-4 px-4">Administrador</th>
                  <th className="py-4 px-4">Ação</th>
                  <th className="py-4 px-4">Entidade</th>
                  <th className="py-4 px-4">IP de Origem</th>
                  <th className="py-4 px-6 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 text-slate-500 font-medium">
                      {formatDate(log.created_at)}
                    </td>

                    <td className="py-4 px-4 font-extrabold text-brand-navy">
                      {log.administrator_name || (log.administrator_id ? `Admin #${log.administrator_id}` : 'Sistema')}
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-mono text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-brand-navy font-bold">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-slate-600 uppercase font-black text-[10px]">
                      {log.entity} {log.entity_id ? `(#${log.entity_id})` : ''}
                    </td>

                    <td className="py-4 px-4 font-mono text-slate-400 text-[11px]">
                      {log.ip_address || '-'}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-brand-navy font-bold text-xs hover:bg-brand-navy hover:text-white transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Ver Payload</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase text-brand-pink tracking-wider">Log de Auditoria #{selectedLog.id}</span>
                <h3 className="font-black text-brand-navy text-lg">{selectedLog.action}</h3>
              </div>
              <button onClick={() => setSelectedLog(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-xs space-y-1.5 border border-slate-100 font-semibold text-slate-700">
              <div><strong>Data:</strong> {formatDate(selectedLog.created_at)}</div>
              <div><strong>Administrador:</strong> {selectedLog.administrator_name || selectedLog.administrator_id}</div>
              <div><strong>Entidade Afetada:</strong> {selectedLog.entity} (ID: {selectedLog.entity_id || '-'})</div>
              <div><strong>IP:</strong> {selectedLog.ip_address || '-'}</div>
              <div><strong>Navegador / User Agent:</strong> {selectedLog.user_agent || '-'}</div>
            </div>

            {selectedLog.new_values && (
              <div>
                <span className="text-xs font-black uppercase text-slate-500 block mb-1">Novos Valores / Payload:</span>
                <pre className="bg-slate-900 text-emerald-400 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(selectedLog.new_values), null, 2);
                    } catch {
                      return selectedLog.new_values;
                    }
                  })()}
                </pre>
              </div>
            )}

            {selectedLog.old_values && (
              <div>
                <span className="text-xs font-black uppercase text-slate-500 block mb-1">Valores Anteriores:</span>
                <pre className="bg-slate-900 text-amber-300 p-4 rounded-2xl text-[11px] font-mono overflow-x-auto max-h-48">
                  {(() => {
                    try {
                      return JSON.stringify(JSON.parse(selectedLog.old_values), null, 2);
                    } catch {
                      return selectedLog.old_values;
                    }
                  })()}
                </pre>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
