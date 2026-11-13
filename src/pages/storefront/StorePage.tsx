import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { Product } from '../../types';
import { parseProductMeta, formatCurrency } from '../../utils/formatters';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { StoreHero } from '../../components/storefront/StoreHero';
import { StoreIndicators } from '../../components/storefront/StoreIndicators';
import { StoreContentPreview } from '../../components/storefront/StoreContentPreview';
import { StoreBonus } from '../../components/storefront/StoreBonus';
import { StoreHowToUse } from '../../components/storefront/StoreHowToUse';
import { StoreFinalCta } from '../../components/storefront/StoreFinalCta';
import { StoreFooter } from '../../components/storefront/StoreFooter';
import { Loader2, AlertCircle, ShoppingBag, ArrowRight } from 'lucide-react';

export const StorePage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (slug) {
          const prod = await productService.getBySlug(slug);
          setProduct(prod);
        } else {
          // Load active products list from API
          const { products } = await productService.list({ status: 'active', limit: 20 });
          setAllProducts(products);
          if (products && products.length > 0) {
            setProduct(products[0]);
          } else {
            setError('Nenhum produto digital ativo encontrado no momento.');
          }
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar os dados do produto.');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  const handleBuy = () => {
    if (!product) return;
    navigate(`/checkout?product_id=${product.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white text-brand-navy">
        <div className="w-16 h-16 rounded-3xl bg-brand-ice flex items-center justify-center mb-4 shadow-soft">
          <Loader2 className="w-8 h-8 animate-spin text-brand-navy" />
        </div>
        <p className="text-base font-extrabold text-brand-navy">Carregando catálogo...</p>
        <p className="text-xs font-semibold text-slate-400 mt-1">Conectando à API de Produtos Digitais</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-white text-brand-navy">
        <StoreHeader onBuyClick={() => {}} />
        <div className="max-w-md mx-auto my-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-brand-navy mb-2">Ops! Produto não disponível</h2>
          <p className="text-sm text-slate-600 mb-6">{error || 'Não encontramos as informações solicitadas.'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-brand-navy text-white font-bold text-sm hover:bg-brand-navy-700 transition-colors"
          >
            Voltar para o início
          </Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const meta = parseProductMeta(product.description);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 4.1 Cabeçalho */}
      <StoreHeader onBuyClick={handleBuy} productPrice={product.price} />

      {/* 4.2 Seção Principal (Hero) */}
      <StoreHero product={product} meta={meta} onBuyClick={handleBuy} />

      {/* 4.3 Indicadores do Produto */}
      <StoreIndicators meta={meta} />

      {/* Se houver outros produtos no catálogo, exibe seletor de materiais */}
      {allProducts.length > 1 && (
        <section className="bg-slate-50 py-8 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
              <span className="text-xs font-extrabold text-brand-navy uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200">
                📚 Mais Materiais no Catálogo
              </span>
              <span className="text-xs font-bold text-slate-500">
                Clique para ver a página do material:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {allProducts.map((p) => {
                const isSelected = p.id === product.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      if (p.slug) {
                        navigate(`/produto/${p.slug}`);
                      } else {
                        navigate(`/checkout?product_id=${p.id}`);
                      }
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                      isSelected
                        ? 'bg-brand-navy text-white border-brand-navy shadow-candy'
                        : 'bg-white text-brand-navy border-slate-200 hover:border-brand-pink'
                    }`}
                  >
                    <div className="truncate mr-3">
                      <span className="text-xs font-black block truncate">{p.name}</span>
                      <span className={`text-[11px] font-bold ${isSelected ? 'text-brand-yellow' : 'text-slate-500'}`}>
                        {formatCurrency(p.price)} • {p.product_type.toUpperCase()}
                      </span>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform ${isSelected ? 'text-brand-yellow' : 'text-slate-400'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4.4 Seção de Apresentação do Conteúdo */}
      <StoreContentPreview product={product} meta={meta} />

      {/* 4.5 Seção de Bônus (Opcional/Condicional) */}
      <StoreBonus bonus={meta.bonus} />

      {/* 4.6 Seção Como Usar */}
      <StoreHowToUse steps={meta.how_to_use} />

      {/* 4.7 Chamada Final de Compra */}
      <StoreFinalCta product={product} meta={meta} onBuyClick={handleBuy} />

      {/* 4.8 Rodapé */}
      <StoreFooter />
    </div>
  );
};
