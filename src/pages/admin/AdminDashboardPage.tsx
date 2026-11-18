import React, { useEffect, useState } from 'react';
import { dashboardService } from '../../services/dashboard.service';
import { DashboardData } from '../../types';
import { formatCurrency, formatFileSize } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Package,
  Users,
  AlertTriangle,
  TrendingUp,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await dashboardService.getOverview();
      setData(res);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-500">
        <RefreshCw className="w-8 h-8 animate-spin text-brand-navy mb-3" />
        <p className="text-sm font-bold">Carregando métricas da plataforma...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 text-center max-w-lg mx-auto">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="font-black text-rose-900 text-lg mb-1">Falha ao Carregar Dashboard</h3>
        <p className="text-xs sm:text-sm text-rose-700 mb-4">{error || 'Não foi possível buscar as métricas.'}</p>
        <button
          onClick={fetchOverview}
          className="px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in-50 duration-200">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-brand-navy tracking-tight break-words">
            Visão Geral do Negócio
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
            Métricas de vendas, conversão, entregas digitais e catálogo ativo.
          </p>
        </div>

        <button
          onClick={fetchOverview}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>Atualizar Dados</span>
        </button>
      </div>

      {/* 4 Main Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Receita Total */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft flex items-center justify-between group hover:border-emerald-200 transition-all">
          <div className="min-w-0 mr-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              Receita Confirmada
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 block leading-none truncate">
              {formatCurrency(data.financial.totalRevenue, data.financial.currency)}
            </span>
            <span className="text-[11px] font-bold text-emerald-600 mt-1.5 block flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 shrink-0" />
              <span>{data.orders.paidOrders} pedidos pagos</span>
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Total de Pedidos */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft flex items-center justify-between group hover:border-brand-navy-200 transition-all">
          <div className="min-w-0 mr-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              Total de Pedidos
            </span>
            <span className="text-2xl sm:text-3xl font-black text-brand-navy block leading-none truncate">
              {data.orders.totalOrders}
            </span>
            <span className="text-[11px] font-bold text-slate-500 mt-1.5 block truncate">
              Volume geral gerado
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-blue-50 text-brand-navy-700 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Pedidos Pendentes */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft flex items-center justify-between group hover:border-amber-200 transition-all">
          <div className="min-w-0 mr-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              Aguardando Pagamento
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-600 block leading-none truncate">
              {data.orders.pendingOrders}
            </span>
            <span className="text-[11px] font-bold text-amber-700 mt-1.5 block truncate">
              PIX / Boletos abertos
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
        </div>

        {/* Entregas Digitais Realizadas */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-soft flex items-center justify-between group hover:border-brand-purple/20 transition-all">
          <div className="min-w-0 mr-3">
            <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-400 block mb-1">
              Entregas por E-mail
            </span>
            <span className="text-2xl sm:text-3xl font-black text-brand-purple block leading-none truncate">
              {data.deliveries.sent}
            </span>
            <span className="text-[11px] font-bold text-slate-500 mt-1.5 block truncate">
              {data.deliveries.failed > 0 ? `${data.deliveries.failed} falhas registradas` : '100% de sucesso'}
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-50 text-brand-purple flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2.5]" />
          </div>
        </div>

      </div>

      {/* Row 2: Charts and Top Sellers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sales by Period Chart (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base sm:text-lg font-black text-brand-navy">
                Vendas por Período
              </h3>
              <p className="text-xs font-semibold text-slate-400">
                Histórico diário de receita gerada pela plataforma
              </p>
            </div>
            <span className="text-xs font-black text-slate-500 bg-slate-100 px-3 py-1 rounded-full self-start sm:self-auto">
              Últimos dias
            </span>
          </div>

          {data.salesByPeriod && data.salesByPeriod.length > 0 ? (
            <div className="space-y-4 pt-4">
              <div className="h-48 flex items-end gap-2 sm:gap-6 pt-6 border-b border-slate-100 pb-2 overflow-x-auto">
                {data.salesByPeriod.map((item: any, idx) => {
                  const itemRevenue = item.total_revenue ?? item.total_amount ?? 0;
                  const maxRevenue = Math.max(...data.salesByPeriod.map((d: any) => d.total_revenue ?? d.total_amount ?? 1));
                  const heightPercent = Math.max(14, Math.round((itemRevenue / maxRevenue) * 100));
                  const dateLabel = item.day || item.date || `D-${idx}`;

                  return (
                    <div key={idx} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] sm:text-[10px] font-black text-brand-navy bg-slate-100 px-1 py-0.5 rounded shadow-xs whitespace-nowrap">
                        {formatCurrency(itemRevenue)}
                      </div>
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className="w-full max-w-[40px] rounded-t-xl bg-gradient-to-t from-brand-navy to-brand-pink transition-all group-hover:from-brand-yellow group-hover:to-brand-yellow-hover"
                      />
                      <span className="text-[10px] font-bold text-slate-400 truncate max-w-[50px]">
                        {dateLabel.length > 5 ? dateLabel.slice(5) : dateLabel}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 text-xs font-bold text-slate-500 pt-2">
                <span>Barras representam receita total por dia</span>
                <span className="text-brand-navy font-black">
                  Total no período: {formatCurrency(data.salesByPeriod.reduce((acc, c: any) => acc + (c.total_revenue || 0), 0))}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <Sparkles className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-xs font-bold">Nenhuma transação registrada no período recente.</p>
            </div>
          )}
        </div>

        {/* Top Products / Best Sellers (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-navy">
              Produtos Mais Vendidos
            </h3>
            <p className="text-xs font-semibold text-slate-400">
              Ranking por volume de unidades vendidas
            </p>
          </div>

          <div className="space-y-3">
            {data.topProducts && data.topProducts.length > 0 ? (
              data.topProducts.map((prod: any, idx) => (
                <div
                  key={prod.id || idx}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate mr-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-brand-yellow text-brand-navy font-black text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-black text-brand-navy block truncate leading-tight">
                        {prod.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block">
                        {prod.total_sold || 0} unidades vendidas
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-emerald-700 shrink-0">
                    {formatCurrency(prod.total_revenue || 0)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400">
                <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold">Ainda sem histórico de vendas.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Row 3: Deliveries Overview */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base sm:text-lg font-black text-brand-navy">
              Saúde do Pipeline de Entregas Digitais
            </h3>
            <p className="text-xs font-semibold text-slate-400">
              Taxa de entrega com sucesso dos arquivos PDF enviados via SendGrid / SMTP
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Fila Ativa
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Disparos Concluídos
              </span>
              <span className="text-2xl font-black text-emerald-700 block leading-tight">
                {data.deliveries.sent}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Aguardando Envio
              </span>
              <span className="text-2xl font-black text-amber-700 block leading-tight">
                {data.deliveries.pending}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xl shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-slate-400 block">
                Falhas de Entrega
              </span>
              <span className="text-2xl font-black text-rose-700 block leading-tight">
                {data.deliveries.failed}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
