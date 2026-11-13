import React, { useEffect, useState } from 'react';
import { orderService } from '../../services/order.service';
import { Order } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';
import { Users, Search, ShoppingBag, Mail, Eye, Loader2, X, AlertCircle } from 'lucide-react';

interface AggregatedCustomer {
  id: number;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const AdminCustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<AggregatedCustomer[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Selected customer for purchase history modal
  const [selectedCustomer, setSelectedCustomer] = useState<AggregatedCustomer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchOrdersAndAggregateCustomers = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { orders } = await orderService.list({ limit: 100 });
      setAllOrders(orders);

      // Aggregate customers from orders
      const map = new Map<number, AggregatedCustomer>();
      for (const o of orders) {
        if (!o.customer || !o.customer.id) continue;
        const cId = o.customer.id;
        const existing = map.get(cId);
        if (existing) {
          existing.totalOrders += 1;
          if (o.status === 'paid' || o.payment_status === 'confirmed') {
            existing.totalSpent += o.total_amount;
          }
          if (new Date(o.created_at) > new Date(existing.lastOrderDate)) {
            existing.lastOrderDate = o.created_at;
          }
        } else {
          map.set(cId, {
            id: cId,
            name: o.customer.name,
            email: o.customer.email,
            totalOrders: 1,
            totalSpent: o.status === 'paid' || o.payment_status === 'confirmed' ? o.total_amount : 0,
            lastOrderDate: o.created_at,
          });
        }
      }

      setCustomers(Array.from(map.values()));
    } catch (err) {
      setErrorMsg(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndAggregateCustomers();
  }, []);

  const openCustomerHistory = async (cust: AggregatedCustomer) => {
    setSelectedCustomer(cust);
    setLoadingHistory(true);
    try {
      // Filter orders by customer_id using API
      const { orders } = await orderService.list({ customer_id: cust.id, limit: 50 });
      setCustomerOrders(orders);
    } catch {
      // Fallback to local filter
      setCustomerOrders(allOrders.filter(o => o.customer?.id === cust.id));
    } finally {
      setLoadingHistory(false);
    }
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
            Base de Clientes
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Consulte compradores, total investido e histórico de pedidos realizados.
          </p>
        </div>
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
            placeholder="Pesquisar cliente por nome ou e-mail..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 text-xs font-semibold"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-soft overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-brand-navy mb-2" />
            <p className="text-xs font-bold">Carregando clientes...</p>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-bold text-slate-600">Nenhum cliente encontrado</p>
            <p className="text-xs mt-1">Os clientes são criados automaticamente a cada nova compra na loja.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-black uppercase tracking-wider text-slate-400">
                  <th className="py-4 px-6">Cliente</th>
                  <th className="py-4 px-4">E-mail</th>
                  <th className="py-4 px-4">Total de Pedidos</th>
                  <th className="py-4 px-4">Total Gasto</th>
                  <th className="py-4 px-4">Última Compra</th>
                  <th className="py-4 px-6 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-extrabold text-brand-navy">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-brand-ice-200 text-brand-navy flex items-center justify-center font-black text-xs">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <span>{cust.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-slate-600 font-medium">
                      {cust.email}
                    </td>

                    <td className="py-4 px-4 text-slate-700 font-bold">
                      {cust.totalOrders} pedido(s)
                    </td>

                    <td className="py-4 px-4 font-black text-emerald-700">
                      {formatCurrency(cust.totalSpent)}
                    </td>

                    <td className="py-4 px-4 text-slate-400 font-medium">
                      {formatDate(cust.lastOrderDate)}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openCustomerHistory(cust)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 text-brand-navy font-bold text-xs hover:bg-brand-navy hover:text-white transition-all inline-flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Histórico</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Customer Purchase History Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-brand-navy text-lg">{selectedCustomer.name}</h3>
                <p className="text-xs text-slate-500 font-medium">{selectedCustomer.email}</p>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400 block">
                Histórico de Vendas do Cliente
              </span>

              {loadingHistory ? (
                <div className="py-8 text-center text-slate-400">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-navy" />
                  <p className="text-xs font-bold">Carregando pedidos do cliente...</p>
                </div>
              ) : customerOrders.length === 0 ? (
                <p className="text-xs text-slate-500 py-6 text-center">Nenhum pedido encontrado para este cliente.</p>
              ) : (
                <div className="space-y-2">
                  {customerOrders.map((o) => (
                    <div key={o.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-mono font-bold text-brand-navy block truncate max-w-[200px]">
                          {o.uuid}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {formatDate(o.created_at)} • Status: {o.status.toUpperCase()}
                        </span>
                      </div>
                      <span className="font-black text-brand-navy text-sm">
                        {formatCurrency(o.total_amount, o.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
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
