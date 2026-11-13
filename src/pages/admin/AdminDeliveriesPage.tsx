import React, { useEffect, useState } from 'react';
import { deliveryService } from '../../services/delivery.service';
import { DigitalDelivery } from '../../types';
import { formatDate, getStatusBadge } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/api';
import {
  Truck,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  Mail,
  Key,
} from 'lucide-react';

export const AdminDeliveriesPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const canResend = hasPermission('deliveries.resend');

  const [deliveries, setDeliveries] = useState<DigitalDelivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [resendingId, setResendingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDeliveries = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { deliveries: list } = await deliveryService.list({
        search: searchTerm || undefined,
        status: selectedStatus || undefined,
        limit: 50,
      });
      setDeliveries(list);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDeliveries();
  };

  const handleResend = async (id: number) => {
    if (!window.confirm('Deseja solicitar o reenvio deste material para o e-mail do cliente?')) return;
    setResendingId(id);
    try {
      await deliveryService.resend(id);
      alert('Entrega reenviada com sucesso!');
      fetchDeliveries();
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setResendingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Entregas Digitais
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Monitore o envio automático de links protegidos por e-mail e faça reenvios.
          </p>
        </div>

        <button
          onClick={fetchDeliveries}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <RotateCw className="w-3.5 h-3.5 text-slate-500" />
          <span>Atualizar</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por e-mail de destino, cliente ou identificador..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-xs font-semibold"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-2xl bg-brand-navy text-white text-xs font-bold hover:bg-brand-navy-800 transition-colors"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-2xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-slate-700 bg-white"
          >
            <option value="">Todos os Status de Envio</option>
            <option value="sent">Enviado (Sucesso)</option>
            <option value="pending">Pendente</option>
            <option value="processing">Processando</option>
            <option value="failed">Falhou</option>
          </select>
        </div>
      </div>

      {/* Deliveries Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy mb-2" />
            <p className="text-xs font-bold">Carregando entregas...</p>
          </div>
        ) : deliveries.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Truck className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Nenhuma entrega registrada</p>
            <p className="text-xs mt-1">As entregas são disparadas após a confirmação de cada pagamento.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Identificador</th>
                  <th className="py-4 px-4">Destinatário</th>
                  <th className="py-4 px-4">Produto</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Downloads</th>
                  <th className="py-4 px-4">Data Envio</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {deliveries.map((d) => {
                  const badge = getStatusBadge(d.status);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-brand-navy font-bold block truncate max-w-[130px]">
                          {d.delivery_identifier}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          Pedido: {d.order_uuid?.slice(0, 8)}...
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-extrabold text-brand-navy block">
                          {d.customer_name || 'Cliente'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[170px]">
                          {d.recipient_email}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-brand-navy font-bold max-w-xs truncate">
                        {d.product_name || `Produto #${d.product_id}`}
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                        {d.error_message && (
                          <span className="text-[10px] text-rose-600 block mt-0.5 truncate max-w-[150px]" title={d.error_message}>
                            Erro: {d.error_message}
                          </span>
                        )}
                      </td>

                      <td className="py-4 px-4">
                        <span className="text-slate-700 font-bold">
                          {d.download_count} download(s)
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          Tentativas: {d.attempts_count}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {formatDate(d.sent_at || d.created_at)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        {canResend && (
                          <button
                            onClick={() => handleResend(d.id)}
                            disabled={resendingId === d.id}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 text-brand-purple font-bold text-xs hover:bg-brand-purple hover:text-white transition-all inline-flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            <span>{resendingId === d.id ? 'Reenviando...' : 'Reenviar'}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
