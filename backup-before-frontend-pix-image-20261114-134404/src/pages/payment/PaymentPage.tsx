import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderService } from '../../services/order.service';
import { PublicOrder, CheckoutResult } from '../../types';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Mail,
  ShoppingBag,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Download,
} from 'lucide-react';
import axios from 'axios';

export const PaymentPage: React.FC = () => {
  const { uuid } = useParams<{ uuid: string }>();
  const location = useLocation();

  const stateData = location.state as {
    order?: CheckoutResult['order'];
    payment?: CheckoutResult['payment'];
  } | undefined;

  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<CheckoutResult['payment'] | null>(stateData?.payment || null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [simulatingWebhook, setSimulatingWebhook] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const pollIntervalRef = useRef<any>(null);

  const fetchOrderStatus = async () => {
    if (!uuid) return;
    try {
      const data = await orderService.getPublicOrder(uuid);
      setOrder(data);
      setErrorMsg(null);

      // Stop polling once paid, failed, or canceled
      if (data.status === 'paid' || data.payment_status === 'confirmed' || data.status === 'failed' || data.status === 'canceled') {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    } catch (err: any) {
      setErrorMsg('Não foi possível atualizar o status do pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderStatus();

    // Controlled Polling: every 3.5 seconds while waiting for payment confirmation
    pollIntervalRef.current = setInterval(() => {
      fetchOrderStatus();
    }, 3500);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [uuid]);

  const handleCopyPix = () => {
    const pixCode = paymentInfo?.qrCodePix;
    if (!pixCode) return;
    navigator.clipboard.writeText(pixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Helper for test/simulated payment confirmation in dev
  const handleSimulatePaymentConfirmation = async () => {
    if (!uuid || !order) return;
    setSimulatingWebhook(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      // In simulated gateway, we call the webhook or status update
      const eventPayload = {
        event_id: `evt_sim_${Date.now()}`,
        event_type: 'payment.confirmed',
        transaction_id: paymentInfo?.transactionId || `tx_${Date.now()}`,
        order_uuid: uuid,
        amount: order.total_amount,
        currency: 'BRL',
      };

      // We send it to webhook endpoint
      await axios.post(`${apiUrl}/webhooks/payments/simulated`, eventPayload, {
        headers: {
          'x-signature': 'simulated-signature-dev-mode',
        },
      });

      // Re-fetch immediate status
      await fetchOrderStatus();
    } catch (err: any) {
      // If webhook signature check fails due to secret, try direct status refresh
      await fetchOrderStatus();
    } finally {
      setSimulatingWebhook(false);
    }
  };

  if (loading && !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <RefreshCw className="w-10 h-10 animate-spin text-brand-navy mb-4" />
        <p className="font-extrabold text-brand-navy">Carregando detalhes do pagamento...</p>
      </div>
    );
  }

  if (errorMsg && !order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-soft border border-slate-100">
          <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-brand-navy mb-2">Pedido não Encontrado</h2>
          <p className="text-sm text-slate-600 mb-6">Não conseguimos localizar o pedido informado.</p>
          <Link
            to="/"
            className="inline-block px-6 py-3 rounded-full bg-brand-navy text-white font-bold text-sm"
          >
            Voltar para a Loja
          </Link>
        </div>
      </div>
    );
  }

  const isPaid = order?.status === 'paid' || order?.payment_status === 'confirmed';
  const isFailed = order?.status === 'failed' || order?.payment_status === 'failed';
  const isCanceled = order?.status === 'canceled';
  const isPending = !isPaid && !isFailed && !isCanceled;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8FF] via-slate-50 to-white text-brand-navy py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-navy flex items-center justify-center text-white shadow-candy">
              <Sparkles className="w-5 h-5 text-brand-yellow" />
            </div>
            <span className="font-black text-2xl text-brand-navy">
              Educa<span className="text-brand-pink">Kids</span>
            </span>
          </Link>
        </div>

        {/* 1. STATE: SUCESSO / PAGAMENTO CONFIRMADO */}
        {isPaid && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-300 shadow-float text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-candy-green">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-full">
                Pagamento Aprovado com Sucesso!
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-brand-navy">
                Obrigado pela sua compra!
              </h1>
              <p className="text-slate-600 font-semibold text-base max-w-lg mx-auto">
                Seu pedido foi confirmado e o material digital está sendo enviado para o seu e-mail cadastrado.
              </p>
            </div>

            {/* Delivery Info Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 text-left space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-500 block uppercase">E-mail de Destino</span>
                  <span className="text-base font-black text-brand-navy">
                    {order?.customer?.email || 'Seu e-mail cadastrado'}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-200/60 flex items-start gap-2.5 text-xs text-slate-700 font-semibold leading-relaxed">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  O link de download protegido e time-limited foi gerado pelo servidor e enviado para a sua caixa de entrada. Por segurança, o download é feito exclusivamente pelo link enviado.
                </span>
              </div>
            </div>

            {/* Order Details List */}
            <div className="bg-slate-50 rounded-2xl p-5 text-left space-y-3 border border-slate-100">
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Número do Pedido</span>
                <span className="font-mono text-brand-navy">{order?.uuid}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Data da Confirmação</span>
                <span className="text-brand-navy">{formatDate(order?.paid_at || order?.created_at)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 font-bold">
                <span>Total Pago</span>
                <span className="text-sm font-black text-emerald-700">{formatCurrency(order?.total_amount || 0)}</span>
              </div>

              {order?.items && order.items.length > 0 && (
                <div className="pt-3 border-t border-slate-200/60">
                  <span className="text-xs font-black text-brand-navy block mb-2">Itens Adquiridos:</span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs font-semibold text-slate-700 py-1">
                      <span>• {item.product_name}</span>
                      <span>{formatCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="candy-button inline-flex items-center gap-2 bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-base px-8 py-4 rounded-full shadow-candy"
              >
                <span>VOLTAR PARA A LOJA</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        )}

        {/* 2. STATE: PENDENTE / AGUARDANDO PAGAMENTO */}
        {isPending && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-100 shadow-float space-y-6">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100 text-center sm:text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black uppercase tracking-wider mb-2">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>Aguardando Pagamento</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-brand-navy">
                  Pague para Liberar o Material
                </h1>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Pedido: <span className="font-mono font-bold text-slate-700">{uuid}</span>
                </p>
              </div>

              <div className="text-center sm:text-right bg-slate-50 px-5 py-3 rounded-2xl border border-slate-100">
                <span className="text-xs font-bold text-slate-400 block uppercase">Valor Total</span>
                <span className="text-2xl font-black text-brand-navy">
                  {formatCurrency(order?.total_amount || 0)}
                </span>
              </div>
            </div>

            {/* PIX QR Code & Copia e Cola */}
            {paymentInfo?.qrCodePix ? (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <p className="text-sm font-bold text-slate-700">
                    Abra o app do seu banco e escaneie o QR Code abaixo:
                  </p>

                  <div className="inline-block p-4 bg-white rounded-3xl border-2 border-brand-green shadow-soft">
                    <QRCodeSVG
                      value={paymentInfo.qrCodePix}
                      size={200}
                      level="M"
                      includeMargin={true}
                    />
                  </div>

                  <p className="text-xs text-slate-500 font-medium">
                    A liberação é automática e acontece em poucos segundos após a transferência.
                  </p>
                </div>

                {/* Copia e Cola Code */}
                <div className="space-y-2">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Ou copie o código PIX Copia e Cola:
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={paymentInfo.qrCodePix}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyPix}
                      className="candy-button bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-xs px-5 py-3 rounded-2xl flex items-center gap-1.5 shrink-0 transition-all"
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-800" />
                          <span>COPIADO!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>COPIAR</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-3">
                <p className="text-sm font-semibold text-slate-600">
                  Siga as instruções de pagamento enviadas pelo gateway.
                </p>
                {paymentInfo?.paymentUrl && (
                  <a
                    href={paymentInfo.paymentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="candy-button inline-flex items-center gap-2 bg-brand-navy text-white px-6 py-3 rounded-full text-xs font-black"
                  >
                    <span>Abrir Tela de Pagamento do Gateway</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            {/* Live Polling Status Indicator */}
            <div className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-2xl bg-brand-ice-50 border border-brand-ice-200 text-brand-navy text-xs font-bold">
              <RefreshCw className="w-4 h-4 animate-spin text-brand-navy" />
              <span>Verificando pagamento em tempo real... Não feche esta tela.</span>
            </div>

            {/* Testing / Simulation helper */}
            <div className="pt-4 border-t border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>Ambiente de demonstração/testes integrado com o gateway:</span>
              <button
                onClick={handleSimulatePaymentConfirmation}
                disabled={simulatingWebhook}
                className="px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-900 rounded-xl font-bold transition-colors disabled:opacity-50"
              >
                {simulatingWebhook ? 'Processando Webhook...' : '⚡ Simular Aprovação de Pagamento'}
              </button>
            </div>

          </div>
        )}

        {/* 3. STATE: FALHOU OU RECUSADO */}
        {isFailed && (
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-rose-300 shadow-float text-center space-y-6">
            <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mx-auto">
              <XCircle className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-rose-100 text-rose-800 text-xs font-black uppercase rounded-full">
                Pagamento Recusado
              </span>
              <h1 className="text-3xl font-black text-brand-navy">
                Não foi possível processar o pagamento
              </h1>
              <p className="text-slate-600 font-semibold text-sm max-w-md mx-auto">
                O gateway não autorizou a cobrança. Você pode tentar novamente com outra forma de pagamento.
              </p>
            </div>

            <div className="pt-4">
              <Link
                to="/"
                className="candy-button inline-flex items-center gap-2 bg-brand-yellow text-brand-navy font-black text-sm px-8 py-4 rounded-full"
              >
                Tentar Novamente
              </Link>
            </div>
          </div>
        )}

        {/* 4. STATE: CANCELADO */}
        {isCanceled && (
          <div className="bg-white rounded-3xl p-8 text-center space-y-4 border border-slate-200">
            <AlertTriangle className="w-12 h-12 text-slate-400 mx-auto" />
            <h2 className="text-2xl font-black text-brand-navy">Pedido Cancelado</h2>
            <p className="text-sm text-slate-600">Este pedido foi cancelado no sistema.</p>
            <Link
              to="/"
              className="inline-block px-6 py-3 rounded-full bg-brand-navy text-white font-bold text-xs"
            >
              Voltar ao Catálogo
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};
