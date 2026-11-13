import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productService } from '../../services/product.service';
import { orderService } from '../../services/order.service';
import { Product } from '../../types';
import { formatCurrency, parseProductMeta } from '../../utils/formatters';
import { getErrorMessage } from '../../services/api';
import {
  ShoppingBag,
  ShieldCheck,
  Lock,
  ArrowLeft,
  Mail,
  User,
  CreditCard,
  QrCode,
  FileText,
  Loader2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const checkoutFormSchema = z.object({
  name: z.string().min(2, 'Informe seu nome completo'),
  email: z.string().email('Informe um e-mail válido para entrega do arquivo'),
  payment_method: z.enum(['pix', 'simulated', 'bank_slip']),
});

type CheckoutFormData = z.infer<typeof checkoutFormSchema>;

export const CheckoutPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product_id');

  const [product, setProduct] = useState<Product | null>(null);
  const [loadingProduct, setLoadingProduct] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: '',
      email: '',
      payment_method: 'pix',
    },
  });

  const selectedPaymentMethod = watch('payment_method');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoadingProduct(true);
      try {
        if (productId) {
          const prod = await productService.getById(Number(productId));
          setProduct(prod);
        } else {
          // If no product_id, fetch first active product
          const { products } = await productService.list({ status: 'active', limit: 1 });
          if (products && products.length > 0) {
            setProduct(products[0]);
          } else {
            setApiError('Nenhum produto digital ativo encontrado para compra.');
          }
        }
      } catch (err) {
        setApiError('Não foi possível carregar o produto selecionado.');
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const onSubmit = async (data: CheckoutFormData) => {
    if (!product) return;
    setSubmitting(true);
    setApiError(null);

    try {
      const result = await orderService.checkout({
        customer: {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
        },
        items: [
          {
            product_id: product.id,
            quantity: 1,
          },
        ],
        payment_method: data.payment_method,
        gateway: 'simulated',
      });

      // Navigate to payment page with order UUID
      navigate(`/pagamento/${result.order.uuid}`, {
        state: {
          order: result.order,
          payment: result.payment,
          product,
        },
      });
    } catch (err) {
      setApiError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 animate-spin text-brand-navy mb-4" />
        <p className="font-extrabold text-brand-navy">Preparando ambiente seguro de checkout...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl max-w-md w-full text-center shadow-soft border border-slate-100">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-brand-navy mb-2">Produto Indisponível</h2>
          <p className="text-sm text-slate-600 mb-6">{apiError || 'Não encontramos o produto desejado.'}</p>
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

  const meta = parseProductMeta(product.description);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#EBF8FF] via-slate-50 to-white text-brand-navy py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-brand-ice-300/40">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-brand-navy hover:text-brand-pink transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para o material</span>
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Checkout Seguro & Criptografado</span>
          </div>
        </div>

        {apiError && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-bold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{apiError}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-navy tracking-tight">
                Finalizar Compra
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">
                Não é necessário criar conta. Seu material será entregue no e-mail informado abaixo.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Customer Info Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-black text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-purple" />
                  <span>1. Seus Dados para Entrega</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    placeholder="Ex: Maria Clara Souza"
                    className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink text-sm font-semibold transition-all"
                  />
                  {errors.name && (
                    <p className="text-rose-600 text-xs font-bold mt-1.5">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    E-mail para Recebimento do Arquivo *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="seuemail@exemplo.com"
                      className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink text-sm font-semibold transition-all"
                    />
                    <Mail className="w-4 h-4 text-slate-400 absolute right-4 top-3.5 pointer-events-none" />
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium mt-1">
                    Certifique-se de digitar corretamente. O link de download será enviado para cá.
                  </p>
                  {errors.email && (
                    <p className="text-rose-600 text-xs font-bold mt-1.5">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-black text-brand-navy uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-green" />
                  <span>2. Forma de Pagamento</span>
                </h3>

                <div className="space-y-3">
                  {/* PIX Option */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedPaymentMethod === 'pix'
                        ? 'border-brand-green bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="pix"
                        {...register('payment_method')}
                        className="w-4 h-4 text-brand-green focus:ring-brand-green"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-brand-navy">PIX</span>
                            <span className="text-[10px] font-black bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase">
                              Imediato
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Aprovação instantânea e liberação em segundos
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Simulated Gateway Option */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedPaymentMethod === 'simulated'
                        ? 'border-brand-purple bg-purple-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="simulated"
                        {...register('payment_method')}
                        className="w-4 h-4 text-brand-purple focus:ring-brand-purple"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-xs">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-brand-navy">Gateway Simulado</span>
                            <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase">
                              Ambiente de Testes
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Permite simular o fluxo com resposta imediata
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Bank Slip Option */}
                  <label
                    className={`p-4 rounded-2xl border-2 cursor-pointer flex items-center justify-between transition-all ${
                      selectedPaymentMethod === 'bank_slip'
                        ? 'border-brand-navy bg-slate-50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value="bank_slip"
                        {...register('payment_method')}
                        className="w-4 h-4 text-brand-navy focus:ring-brand-navy"
                      />
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-black text-xs">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-brand-navy">Boleto Bancário</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium">
                            Compensação em até 1 a 2 dias úteis
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="candy-button w-full bg-brand-yellow hover:bg-brand-yellow-hover text-brand-navy font-black text-lg py-4 rounded-full flex items-center justify-center gap-2 cursor-pointer shadow-float disabled:opacity-50 transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Gerando Cobrança Segura...</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                      <span>CONFIRMAR E GERAR PAGAMENTO</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>

          {/* Right Column: Order Summary (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-soft space-y-6">
            <h3 className="text-base font-black text-brand-navy tracking-tight flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span>Resumo do Pedido</span>
            </h3>

            {/* Product Item Card */}
            <div className="flex gap-4 p-4 rounded-2xl bg-brand-ice-50 border border-brand-ice-200">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-white shadow-xs">
                {product.thumbnail_url ? (
                  <img
                    src={product.thumbnail_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
                    PDF
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase text-brand-pink tracking-wider block">
                  {product.category_name || 'Material Pedagógico'}
                </span>
                <h4 className="text-sm font-black text-brand-navy leading-snug line-clamp-2 mt-0.5">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-bold text-slate-500">1x unidade</span>
                  <span className="text-sm font-black text-brand-navy">
                    {formatCurrency(product.price)}
                  </span>
                </div>
              </div>
            </div>

            {/* What is included bullet points */}
            <div className="space-y-2.5 text-xs font-semibold text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                <span>Arquivo digital original em alta definição</span>
              </div>
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                <span>Pronto para imprimir em impressora comum</span>
              </div>
              <div className="flex items-center gap-2 text-brand-navy font-bold">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                <span>Acesso vitalício ao material</span>
              </div>
            </div>

            {/* Pricing Summary Breakdown */}
            <div className="space-y-3 pt-3 border-t border-slate-100 text-sm">
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Subtotal</span>
                <span>{formatCurrency(product.price)}</span>
              </div>
              <div className="flex justify-between text-slate-600 font-semibold">
                <span>Frete (Envio Digital)</span>
                <span className="text-brand-green font-bold">GRÁTIS</span>
              </div>
              <div className="flex justify-between text-lg font-black text-brand-navy pt-2 border-t border-slate-100">
                <span>Total a Pagar</span>
                <span className="text-brand-navy">{formatCurrency(product.price)}</span>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed font-semibold">
                <strong>Garantia de Satisfação:</strong> Seus dados são protegidos e seu link de download é gerado automaticamente logo após a aprovação.
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
