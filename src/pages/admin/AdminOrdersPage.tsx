import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/order.service';
import { Order } from '../../types';
import { formatCurrency, formatDate, getStatusBadge } from '../../utils/formatters';
import { useAuth } from '../../contexts/AuthContext';
import { getErrorMessage } from '../../services/api';
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  User,
  Mail,
  CreditCard,
  Loader2,
  X,
  AlertCircle,
  Calendar,
} from 'lucide-react';

export const AdminOrdersPage: React.FC = () => {
  const { hasPermission } = useAuth();
  const canUpdate = hasPermission('orders.update');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Detail Modal
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
  const [newStatus, setNewStatus] = useState<string>('');
  const [statusReason, setStatusReason] = useState<string>('');

  const fetchOrders = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { orders: list } = await orderService.list({
        search: searchTerm || undefined,
        status: selectedStatus || undefined,
        limit: 50,
      });
      setOrders(list);
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const openDetail = async (orderId: number) => {
    setLoadingDetail(true);
    try {
      const full = await orderService.getById(orderId);
      setDetailOrder(full);
      setNewStatus(full.status);
      setStatusReason('');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailOrder) return;
    setUpdatingStatus(true);
    try {
      const updated = await orderService.updateStatus(detailOrder.id, newStatus, statusReason);
      setDetailOrder(updated);
      fetchOrders();
      alert('Status atualizado com sucesso!');
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Vendas & Pedidos
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Acompanhe pagamentos em tempo real, faturamento e detalhes dos compradores.
          </p>
        </div>
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
              placeholder="Buscar por cliente, e-mail ou código do pedido..."
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
            <option value="">Todos os Status</option>
            <option value="paid">Pago / Confirmado</option>
            <option value="pending">Aguardando Pagamento</option>
            <option value="failed">Falhou</option>
            <option value="canceled">Cancelado</option>
            <option value="refunded">Reembolsado</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy mb-2" />
            <p className="text-xs font-bold">Carregando pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Nenhum pedido encontrado</p>
            <p className="text-xs mt-1">Nenhuma venda corresponde aos critérios informados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Pedido</th>
                  <th className="py-4 px-4">Comprador</th>
                  <th className="py-4 px-4">Valor</th>
                  <th className="py-4 px-4">Gateway</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Data</th>
                  <th className="py-4 px-6 text-right">Detalhes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {orders.map((o) => {
                  const badge = getStatusBadge(o.status);
                  return (
                    <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-brand-navy font-bold block truncate max-w-[130px]">
                          {o.uuid}
                        </span>
                        <span className="text-[10px] text-slate-400 block">
                          ID #{o.id}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-extrabold text-brand-navy block">
                          {o.customer?.name || 'Cliente'}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium block truncate max-w-[180px]">
                          {o.customer?.email || '-'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black text-brand-navy">
                        {formatCurrency(o.total_amount, o.currency)}
                      </td>

                      <td className="py-4 px-4">
                        <span className="uppercase font-black text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {o.gateway_used || 'Gateway'}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badge.bg}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-slate-500 font-medium">
                        {formatDate(o.created_at)}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openDetail(o.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 text-brand-navy font-bold text-xs hover:bg-brand-navy hover:text-white transition-all inline-flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAIL MODAL */}
      {detailOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-pink block">
                  Detalhes da Venda
                </span>
                <h3 className="font-mono font-black text-brand-navy text-lg">{detailOrder.uuid}</h3>
              </div>
              <button onClick={() => setDetailOrder(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Box */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold block mb-1">CLIENTE</span>
                <span className="font-black text-brand-navy block text-sm">{detailOrder.customer?.name}</span>
                <span className="text-slate-500 font-medium">{detailOrder.customer?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block mb-1">TOTAL DO PEDIDO</span>
                <span className="text-lg font-black text-emerald-700 block">
                  {formatCurrency(detailOrder.total_amount, detailOrder.currency)}
                </span>
                <span className="text-[11px] text-slate-400 font-bold">
                  Status: {getStatusBadge(detailOrder.status).label}
                </span>
              </div>
            </div>

            {/* Items Purchased */}
            <div>
              <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider mb-2">
                Produtos Comprados
              </h4>
              <div className="space-y-2">
                {detailOrder.items?.map((item) => (
                  <div key={item.id} className="p-3 bg-white rounded-xl border border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <div>
                      <span className="font-extrabold text-brand-navy block">{item.product_name_snapshot}</span>
                      <span className="text-[10px] text-slate-400">{item.quantity}x unidade(s)</span>
                    </div>
                    <span className="font-black text-brand-navy">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Transaction Info */}
            {detailOrder.payment && (
              <div className="p-4 rounded-2xl bg-brand-ice-50 border border-brand-ice-200 text-xs space-y-2">
                <span className="font-black text-brand-navy block uppercase text-[10px]">
                  Dados da Transação no Gateway
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Gateway</span>
                    <span className="font-bold">{detailOrder.payment.gateway_name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">ID Transação Externa</span>
                    <span className="font-mono font-bold truncate block">{detailOrder.payment.gateway_transaction_id}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Forma de Pagamento</span>
                    <span className="font-bold uppercase">{detailOrder.payment.payment_method}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Status do Pagamento</span>
                    <span className="font-bold uppercase text-emerald-800">{detailOrder.payment.status}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Status Update Form (RBAC: orders.update) */}
            {canUpdate && (
              <form onSubmit={handleStatusUpdate} className="pt-4 border-t border-slate-100 space-y-3">
                <span className="text-xs font-black uppercase text-brand-navy tracking-wider block">
                  Alterar Status do Pedido (Operação Administrativa)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Novo Status</label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50 bg-white"
                    >
                      <option value="pending">Pendente</option>
                      <option value="paid">Pago</option>
                      <option value="failed">Falhou</option>
                      <option value="canceled">Cancelado</option>
                      <option value="refunded">Reembolsado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Motivo / Justificativa</label>
                    <input
                      type="text"
                      value={statusReason}
                      onChange={(e) => setStatusReason(e.target.value)}
                      placeholder="Ex: Confirmação manual de PIX"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-pink/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updatingStatus}
                    className="candy-button px-5 py-2 rounded-xl bg-brand-navy text-white text-xs font-bold disabled:opacity-50"
                  >
                    {updatingStatus ? 'Atualizando...' : 'Gravar Novo Status'}
                  </button>
                </div>
              </form>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setDetailOrder(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
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
