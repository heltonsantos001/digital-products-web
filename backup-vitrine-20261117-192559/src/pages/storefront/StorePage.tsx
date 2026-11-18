import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { Product } from '../../types';
import { parseProductMeta, formatCurrency } from '../../utils/formatters';
import { getProductImageUrl } from '../../services/api';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { StoreHero } from '../../components/storefront/StoreHero';
import { StoreIndicators } from '../../components/storefront/StoreIndicators';
import { StoreContentPreview } from '../../components/storefront/StoreContentPreview';
import { StoreBonus } from '../../components/storefront/StoreBonus';
import { StoreHowToUse } from '../../components/storefront/StoreHowToUse';
import { StoreFinalCta } from '../../components/storefront/StoreFinalCta';
import { StoreFooter } from '../../components/storefront/StoreFooter';
import {
  Loader2, AlertCircle, ArrowRight, ArrowUpRight, BookOpen, CheckCircle2,
  ChevronDown, Download, Heart, Search, ShieldCheck, Sparkles, Printer
} from 'lucide-react';

export const StorePage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        if (slug) {
          const prod = await productService.getBySlug(slug);
          setProduct(prod);
        } else {
          const { products } = await productService.list({ status: 'active', limit: 50 });
          setAllProducts(products || []);
          if (products?.length) setProduct(products[0]);
          else setError('Nenhum material disponível no momento. Volte em breve!');
        }
      } catch (err: any) {
        setError(err.message || 'Não foi possível carregar os materiais.');
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [slug]);

  const handleBuy = () => {
    if (product) navigate(`/checkout?product_id=${product.id}`);
  };

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLocaleLowerCase('pt-BR');
    if (!term) return allProducts;
    return allProducts.filter((item) =>
      `${item.name} ${item.category_name || ''} ${item.description || ''}`
        .toLocaleLowerCase('pt-BR').includes(term)
    );
  }, [allProducts, searchTerm]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbf9ff] text-[#29243d]">
        <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center mb-4 shadow-lg">
          <Loader2 className="w-8 h-8 animate-spin text-[#8b69c9]" />
        </div>
        <p className="text-base font-extrabold">Preparando seus materiais...</p>
        <p className="text-xs font-semibold text-slate-400 mt-1">Só um instante</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-between bg-[#fbf9ff] text-[#29243d]">
        <StoreHeader onBuyClick={() => {}} />
        <div className="max-w-md mx-auto my-auto px-4 py-16 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black mb-2">Ops! Não encontramos os materiais</h2>
          <p className="text-sm text-slate-600 mb-6">{error || 'Tente novamente em alguns instantes.'}</p>
          <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#29243d] text-white font-bold text-sm">Voltar ao início</Link>
        </div>
        <StoreFooter />
      </div>
    );
  }

  const meta = parseProductMeta(product.description);

  // Página de produto: mantém os componentes e o fluxo de compra já existentes.
  if (slug) {
    return (
      <div className="flex flex-col min-h-screen storefront-theme">
        <StoreHeader onBuyClick={handleBuy} productPrice={product.price} />
        <StoreHero product={product} meta={meta} onBuyClick={handleBuy} />
        <StoreIndicators meta={meta} />
        <StoreContentPreview product={product} meta={meta} />
        <StoreBonus bonus={meta.bonus} />
        <StoreHowToUse steps={meta.how_to_use} />
        <StoreFinalCta product={product} meta={meta} onBuyClick={handleBuy} />
        <StoreFooter />
      </div>
    );
  }

  const faqs = [
    { q: 'Preciso imprimir o PDF inteiro?', a: 'Não. Você pode escolher quais páginas deseja imprimir e usar somente as atividades do momento.' },
    { q: 'Como recebo meu arquivo?', a: 'Após a confirmação do pagamento, as instruções de acesso são enviadas para o e-mail informado na compra.' },
    { q: 'Posso usar o material mais de uma vez?', a: 'Sim! Depois de baixar, você pode guardar o arquivo e imprimir as páginas novamente quando precisar.' },
    { q: 'Para quem são os materiais?', a: 'Os materiais foram pensados para famílias, educadores e pessoas que acompanham o desenvolvimento infantil.' },
  ];

  return (
    <div className="min-h-screen flex flex-col storefront-theme bg-[#fbf9ff] text-[#29243d]">
      <StoreHeader onBuyClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[#f0e9fb]">
          <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-white/60 blur-3xl" />
          <div className="absolute -bottom-28 right-0 w-96 h-96 rounded-full bg-[#e3d2f7] blur-3xl" />
          <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10 sm:pb-16 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[.16em] text-[#8060b5] shadow-sm mb-6">
              <Sparkles className="w-4 h-4" /> Menos procura, mais descobertas
            </div>
            <h1 className="max-w-4xl mx-auto text-[2.35rem] leading-[1.08] sm:text-5xl lg:text-6xl font-black tracking-tight text-[#29243d]">
              As imagens da tarefinha, em um <span className="relative inline-block z-0">só lugar<span className="absolute bottom-1 left-0 right-0 h-3 bg-[#ffd95b] -z-10 -rotate-1" /></span>.
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-sm sm:text-base leading-7 text-[#686178] font-medium">
              Um mundo de imagens para recortar, colorir e aprender juntinhos. Escolha o tema, imprima e deixe a imaginação brincar.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-3">
              <button onClick={() => document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl bg-[#ffd34f] hover:bg-[#ffc936] text-[#29243d] font-extrabold text-sm px-6 py-3.5 shadow-[0_4px_0_#e8b52e] transition hover:-translate-y-0.5 inline-flex items-center gap-2">
                Encontrar meu material <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => document.getElementById('como-funciona')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-xl px-5 py-3 text-sm font-bold text-[#51476a] hover:bg-white/70 inline-flex items-center gap-2">
                Explorar por dentro <BookOpen className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[11px] font-bold text-[#716b80]">
              <span className="inline-flex items-center gap-1.5"><Download className="w-3.5 h-3.5" /> PDF digital</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Pagamento seguro</span>
              <span className="inline-flex items-center gap-1.5"><Heart className="w-3.5 h-3.5" /> Feito com carinho</span>
            </div>
          </div>
          <div className="max-w-5xl mx-auto px-6 relative z-10">
            <div className="relative mx-auto max-w-3xl rounded-[2rem] bg-white/75 border border-white p-3 shadow-[0_24px_70px_rgba(77,53,112,.13)] -mb-2">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                {[allProducts[0], allProducts[1] || allProducts[0], allProducts[2] || allProducts[0]].map((item, index) => (
                  <div key={`${item?.id || 'preview'}-${index}`} className={`rounded-2xl overflow-hidden bg-[#f7f2fc] aspect-[4/5] ${index === 1 ? 'sm:-translate-y-4' : ''}`}>
                    {item?.thumbnail_url ? <img src={getProductImageUrl(item.thumbnail_url)} alt={item.name} className="w-full h-full object-cover" /> : <div className="h-full flex items-center justify-center text-[#9a83bd]"><Sparkles className="w-10 h-10" /></div>}
                  </div>
                ))}
              </div>
              <div className="absolute -left-3 sm:-left-10 top-1/2 -translate-y-1/2 rounded-full bg-[#ffd95b] w-14 h-14 sm:w-20 sm:h-20 flex flex-col items-center justify-center text-[#29243d] shadow-lg rotate-[-10deg]">
                <span className="text-xl sm:text-2xl font-black">{allProducts.length}</span><span className="text-[8px] sm:text-[9px] font-extrabold uppercase">materiais</span>
              </div>
              <div className="absolute -right-2 sm:-right-8 bottom-5 rounded-full bg-white px-3 py-2 text-[10px] font-extrabold text-[#8060b5] shadow-lg rotate-3">Criatividade para aprender ✦</div>
            </div>
          </div>
          <div className="h-12 sm:h-20" />
        </section>

        <section id="catalogo" className="py-16 sm:py-20 bg-[#fbf9ff]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">
              <div>
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#9275bd]">Um mundo para explorar</span>
                <h2 className="text-3xl sm:text-4xl font-black mt-2 tracking-tight">Qual vai ser a descoberta de hoje?</h2>
                <p className="text-sm text-[#777084] mt-2">Materiais que facilitam a tarefinha e abrem espaço para criar.</p>
              </div>
              <label className="relative w-full md:max-w-xs">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b91aa]" />
                <input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Buscar uma descoberta..." className="w-full rounded-full border border-[#e8e1ef] bg-white py-3 pl-11 pr-4 text-sm outline-none focus:border-[#a98bd0] focus:ring-4 focus:ring-[#a98bd0]/10" />
              </label>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="rounded-full bg-[#e9def7] text-[#72549e] px-4 py-2 text-xs font-extrabold">✦ Todos os materiais</span>
              <span className="rounded-full bg-white border border-[#eee8f4] text-[#777084] px-4 py-2 text-xs font-bold">Recortar e colar</span>
              <span className="rounded-full bg-white border border-[#eee8f4] text-[#777084] px-4 py-2 text-xs font-bold">Colorir e aprender</span>
            </div>
            {filteredProducts.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((item, index) => (
                  <article key={item.id} className="group rounded-[1.6rem] bg-white border border-[#eee8f4] p-3 shadow-[0_8px_30px_rgba(55,38,82,.045)] hover:shadow-[0_18px_45px_rgba(55,38,82,.12)] hover:-translate-y-1 transition-all">
                    <Link to={item.slug ? `/produto/${item.slug}` : `/checkout?product_id=${item.id}`} className="block">
                      <div className="relative overflow-hidden rounded-[1.2rem] bg-[#f1eaf8] aspect-[4/3]">
                        {item.thumbnail_url ? <img src={getProductImageUrl(item.thumbnail_url)} alt={item.name} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" /> : <div className="w-full h-full flex items-center justify-center text-[#9b83bf]"><BookOpen className="w-12 h-12" /></div>}
                        <span className="absolute top-3 left-3 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-extrabold text-[#76579f] shadow-sm">{item.category_name || 'Material digital'}</span>
                        <span className="absolute bottom-3 right-3 rounded-full bg-[#ffda65] px-3 py-1.5 text-xs font-black text-[#29243d]">{formatCurrency(item.price)}</span>
                      </div>
                      <div className="px-2 pt-4 pb-2">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-lg font-black leading-snug text-[#302943]">{item.name}</h3>
                          <ArrowUpRight className="w-5 h-5 shrink-0 text-[#9a80bd] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </div>
                        <p className="mt-2 text-xs leading-5 text-[#81798d] line-clamp-2">{parseProductMeta(item.description).summary || 'Um material digital preparado para aprender brincando.'}</p>
                        <div className="mt-4 pt-3 border-t border-[#f1edf5] flex items-center justify-between text-[10px] font-extrabold text-[#8b8297]">
                          <span className="inline-flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5 text-[#76a68c]" /> Arquivo digital</span>
                          <span className="text-[#76579f]">Conhecer material →</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl bg-white border border-[#eee8f4] p-10 text-center text-sm text-[#81798d]">Nenhum material encontrado para essa busca.</div>
            )}
          </div>
        </section>

        <section id="como-funciona" className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-5 sm:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#9275bd]">Por dentro do nosso mundo</span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">Um pedacinho de cada descoberta</h2>
              <p className="text-sm text-[#777084] mt-3">Materiais digitais para imprimir, explorar e aproveitar no seu ritmo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: <BookOpen className="w-6 h-6" />, title: 'Escolha o tema', desc: 'Encontre um material que combine com a curiosidade de hoje.', color: 'bg-[#eee5fa] text-[#8060b5]' },
                { icon: <Download className="w-6 h-6" />, title: 'Receba o arquivo', desc: 'Após a confirmação, receba as orientações de acesso por e-mail.', color: 'bg-[#fff2c9] text-[#a57b16]' },
                { icon: <Printer className="w-6 h-6" />, title: 'Imprima e brinque', desc: 'Use as páginas quando quiser e transforme aprendizado em diversão.', color: 'bg-[#e5f2e9] text-[#5d9674]' },
              ].map((step) => (
                <div key={step.title} className="rounded-[1.5rem] bg-[#fbf9ff] border border-[#f0eaf6] p-7">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${step.color}`}>{step.icon}</div>
                  <h3 className="mt-5 font-black text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#777084]">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="duvidas" className="py-16 sm:py-20 bg-[#f3edf9]">
          <div className="max-w-3xl mx-auto px-5 sm:px-8">
            <div className="text-center mb-9">
              <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#9275bd]">Antes de começar</span>
              <h2 className="text-3xl sm:text-4xl font-black mt-2">Ficou com alguma dúvida?</h2>
              <p className="text-sm text-[#777084] mt-3">A gente te ajuda a encontrar o caminho.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div key={faq.q} className="rounded-2xl bg-white border border-[#e9e0f1] overflow-hidden">
                  <button onClick={() => setActiveFaq(activeFaq === index ? null : index)} className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left font-extrabold text-sm">
                    {faq.q}<ChevronDown className={`w-4 h-4 shrink-0 text-[#8b6bb7] transition-transform ${activeFaq === index ? 'rotate-180' : ''}`} />
                  </button>
                  {activeFaq === index && <p className="px-5 pb-5 text-sm leading-6 text-[#777084]">{faq.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <StoreFooter />
    </div>
  );
};
