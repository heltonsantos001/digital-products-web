import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { StoreFooter } from '../../components/storefront/StoreFooter';
import { StoreProductImage } from '../../components/storefront/StoreProductImage';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Heart,
  Instagram,
  Layers,
  Printer,
  Scissors,
  Search,
  Sparkles,
  ShoppingBag,
  X,
} from 'lucide-react';

const FAQS = [
  {
    q: 'Vou receber um livro físico?',
    a: 'Não. O material é 100% digital em formato PDF. Você recebe o acesso imediatamente após a confirmação do pagamento para baixar e imprimir quantas vezes quiser.',
  },
  {
    q: 'Preciso imprimir o PDF inteiro?',
    a: 'Não! Você pode imprimir apenas as páginas ou temas que a criança for usar naquele momento.',
  },
  {
    q: 'Como recebo o meu arquivo?',
    a: 'Quando fizer a compra de um material, a confirmação do pagamento gera o acesso seguro para download e o arquivo PDF é enviado diretamente para o seu e-mail.',
  },
  {
    q: 'Para quem o material foi pensado?',
    a: 'Para famílias com crianças na educação infantil e nos primeiros anos escolares que precisam de imagens para recortar e colar. É um material complementar às orientações da escola; o recorte deve ser acompanhado por um adulto.',
  },
  {
    q: 'Posso imprimir mais de uma vez?',
    a: 'Sim! O arquivo é seu para uso pessoal e familiar. Você pode reimprimir as páginas sempre que precisar.',
  },
  {
    q: 'Tem alguma brincadeira inclusa?',
    a: 'Sim! Além das imagens para recortar e colar, os materiais contam com atividades lúdicas e jogos educativos para brincar em família.',
  },
];

export const StorePage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'recortar'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(2);

  // Modais
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProductModal, setSelectedProductModal] = useState<Product | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        if (slug) {
          const item = await productService.getBySlug(slug);
          if (isMounted) {
            setAllProducts([item]);
          }
        } else {
          const res = await productService.list({ status: 'active', limit: 100 });
          if (isMounted && res.products && res.products.length > 0) {
            setAllProducts(res.products);
          }
        }
      } catch (err) {
        console.warn('Carregamento de produtos:', err);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  // Produto mais recente independente do campo de busca
  const latestProduct = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return null;
    return [...allProducts].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      if (dateB !== dateA) return dateB - dateA;
      return b.id - a.id;
    })[0];
  }, [allProducts]);

  // Produtos filtrados pela busca
  const matchingProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return allProducts.filter((p) => {
      const matchesSearch =
        !term ||
        p.name.toLowerCase().includes(term) ||
        (p.description || '').toLowerCase().includes(term) ||
        (p.category_name || '').toLowerCase().includes(term);

      const matchesCat =
        activeCategory === 'all' ||
        (p.category_name || '').toLowerCase().includes('recortar');

      return matchesSearch && matchesCat;
    });
  }, [allProducts, searchTerm, activeCategory]);

  const previewItems = useMemo(() => {
    const themes = [
      { bg: 'bg-[#fff5f6]', border: 'border-[#fde2e6]' },
      { bg: 'bg-[#f0f8fc]', border: 'border-[#dff0f8]' },
      { bg: 'bg-[#fef9ec]', border: 'border-[#fbf0d4]' },
      { bg: 'bg-[#f6f1fc]', border: 'border-[#ede3f8]' },
    ];
    const seen = new Set<number>();
    const items: Array<{
      product: Product;
      categoryName: string;
      themeCardBg: string;
      themeCardBorder: string;
    }> = [];
    for (const prod of allProducts) {
      const catId = prod.category_id ?? prod.id;
      if (!seen.has(catId)) {
        seen.add(catId);
        const themeIndex = items.length % themes.length;
        items.push({
          product: prod,
          categoryName: prod.category_name || 'Material',
          themeCardBg: themes[themeIndex].bg,
          themeCardBorder: themes[themeIndex].border,
        });
        if (items.length >= 4) break;
      }
    }
    return items;
  }, [allProducts]);

  const handleBuy = (targetProduct?: Product | null) => {
    const p = targetProduct || selectedProductModal || latestProduct;
    if (p && p.id) {
      navigate(`/checkout?product_id=${p.id}`);
    } else {
      navigate('/checkout');
    }
  };

  const openProductModal = (p: Product | null) => {
    if (!p) return;
    setSelectedProductModal(p);
    setProductModalOpen(true);
  };

  const openPreview = (index: number) => {
    setCurrentPreviewIndex(index);
    setPreviewModalOpen(true);
  };

  const nextPreview = () => {
    setCurrentPreviewIndex((prev) => (prev + 1) % Math.max(previewItems.length, 1));
  };

  const prevPreview = () => {
    setCurrentPreviewIndex(
      (prev) => (prev - 1 + Math.max(previewItems.length, 1)) % Math.max(previewItems.length, 1)
    );
  };

  const currentPreviewItem = previewItems[currentPreviewIndex];

  return (
    <div className="min-h-screen bg-white text-[#1e192c] storefront-theme selection:bg-[#fed766]">
      <StoreHeader onBuyClick={() => handleBuy(latestProduct)} />

      <main className="overflow-x-hidden">
        {/* HERO SECTION ("✦ MENOS PROCURA, MAIS DESCOBERTAS") */}
        <section className="relative overflow-hidden bg-dot-pattern pt-8 pb-10 sm:pt-14 sm:pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black tracking-wider sm:tracking-widest text-[#2f2740] uppercase mb-3 sm:mb-4 bg-white/80 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-[#eee7f4] shadow-2xs">
              <span className="text-[#e29e24] text-xs sm:text-sm">✦</span>
              <span>MENOS PROCURA, MAIS DESCOBERTAS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1d182c] tracking-tight leading-[1.18] max-w-2xl mx-auto px-2 break-words">
              As imagens da tarefinha, em um{' '}
              <span className="highlight-yellow">só lugar.</span>
            </h1>

            <p className="mt-3.5 max-w-md sm:max-w-lg mx-auto text-xs sm:text-sm text-[#665e74] leading-relaxed font-normal px-2">
              Um mundo de imagens para recortar, colar e aprender juntinhos. Escolha o tema, imprima e deixe a imaginação brincar.
            </p>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 max-w-md mx-auto">
              <button
                onClick={() => {
                  const el = document.getElementById('materiais');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full sm:w-auto rounded-2xl bg-[#fbc737] hover:bg-[#f2be2c] text-[#29200f] font-black text-xs sm:text-sm px-6 py-3.5 shadow-[0_4px_0_#d8a420] active:translate-y-0.5 active:shadow-none transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Encontrar meu material</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <button
                onClick={() => openPreview(0)}
                className="w-full sm:w-auto rounded-2xl bg-white/90 hover:bg-[#f6f2fb] border border-[#ede5f6] text-[#2f2840] font-black text-xs sm:text-sm px-5 py-3.5 flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-2xs"
              >
                <span>Espiar por dentro</span>
                <BookOpen className="w-4 h-4 text-[#5c4f74] shrink-0" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-[11px] sm:text-xs text-[#786f87] font-semibold">
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-[#886ea9]" /> PDF digital
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5 text-[#886ea9]" /> Para imprimir em casa
              </span>
            </div>

            {/* Showcase do Produto Mais Recente com Abertura do Componente de Compra */}
            {latestProduct && (
              <div className="mt-7 max-w-sm sm:max-w-md mx-auto relative group">
                <div
                  onClick={() => openProductModal(latestProduct)}
                  className="cursor-pointer transition-all duration-300 group-hover:scale-[1.01] text-left rounded-3xl border border-[#ede5f7] bg-white p-3.5 sm:p-4 shadow-soft hover:shadow-xl"
                  title="Clique para ver detalhes e comprar este material"
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-xs">
                    <StoreProductImage
                      src={latestProduct.thumbnail_url}
                      alt={latestProduct.name}
                      aspectRatio="aspect-[4/3] sm:aspect-[16/10]"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-xs rounded-full px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#352d43] shadow-xs flex items-center gap-1.5 z-10">
                      <Sparkles className="w-3 h-3 text-[#e29e24]" />
                      <span>NOVIDADE · MAIS RECENTE</span>
                    </div>
                  </div>

                  <div className="mt-3.5 px-1 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold text-[#8670a3] uppercase tracking-wider block">
                        {latestProduct.category_name || 'Material em PDF'}
                      </span>
                      <h3 className="font-black text-sm sm:text-base text-[#1e192c] leading-tight truncate">
                        {latestProduct.name}
                      </h3>
                      <span className="text-xs sm:text-sm font-black text-[#2e263d] block mt-0.5">
                        {formatCurrency(latestProduct.price)}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProductModal(latestProduct);
                      }}
                      className="shrink-0 rounded-xl bg-[#1b1d33] hover:bg-[#111322] text-white font-extrabold text-xs px-3.5 py-2.5 flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <span>Comprar</span>
                      <ShoppingBag className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Três Indicadores no Hero */}
            <div className="mt-8 pt-6 border-t border-[#f0ebf5] max-w-xl mx-auto grid grid-cols-3 divide-x divide-[#f0ebf5] text-center">
              <div className="px-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#f4effa] text-[#5f5178] flex items-center justify-center mx-auto mb-1.5">
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#352c46] block leading-tight">
                  Material em PDF
                </span>
              </div>
              <div className="px-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#f4effa] text-[#5f5178] flex items-center justify-center mx-auto mb-1.5">
                  <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#352c46] block leading-tight">
                  Imprima só o que precisar
                </span>
              </div>
              <div className="px-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl bg-[#f4effa] text-[#5f5178] flex items-center justify-center mx-auto mb-1.5">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[#e57a8a]" />
                </div>
                <span className="text-[10px] sm:text-xs font-bold text-[#352c46] block leading-tight">
                  Para descobrir em família
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO SEARCH ("UM MUNDO PARA EXPLORAR") */}
        <section id="materiais" className="py-10 sm:py-16 bg-[#fffdfb] border-t border-[#f5edf8]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                <Sparkles className="w-3.5 h-3.5 text-[#8264ad]" />
                <span>UM MUNDO PARA EXPLORAR</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1d182c] tracking-tight mt-1.5 break-words">
                Qual vai ser a descoberta de hoje?
              </h2>
              <p className="text-xs sm:text-sm text-[#736a83] mt-2">
                Materiais que facilitam a tarefinha e abrem espaço para criar.
              </p>
            </div>

            {/* Barra de Filtros e Campo de Busca */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-full px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeCategory === 'all'
                      ? 'bg-[#ede7f6] text-[#6f4ea2] border border-[#d8c7ef]'
                      : 'bg-white text-[#706680] border border-[#eee8f4] hover:bg-[#faf7fc]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Todos os materiais</span>
                </button>

                <button
                  onClick={() => setActiveCategory('recortar')}
                  className={`rounded-full px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    activeCategory === 'recortar'
                      ? 'bg-[#ede7f6] text-[#6f4ea2] border border-[#d8c7ef]'
                      : 'bg-white text-[#706680] border border-[#eee8f4] hover:bg-[#faf7fc]'
                  }`}
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Recortar e colar</span>
                </button>
              </div>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9c93ab]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar uma descoberta..."
                  className="w-full rounded-2xl border border-[#ece4f3] bg-white py-2.5 sm:py-3 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-[#9675c7] text-[#2b243b] placeholder-[#a299af]"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label="Limpar busca"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Resultados da Busca: Mostra TODOS os materiais que contêm o termo pesquisado */}
            {searchTerm.trim() !== '' ? (
              <div className="mt-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-[#74668b]">
                    Encontrado(s) {matchingProducts.length} material(is) para "{searchTerm}"
                  </span>
                </div>

                {matchingProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {matchingProducts.map((p) => (
                      <div
                        key={p.id}
                        className="rounded-[1.75rem] border border-[#eee7f4] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                      >
                        <div>
                          <div
                            onClick={() => openProductModal(p)}
                            className="relative cursor-pointer overflow-hidden aspect-[4/3] bg-[#f5effa]"
                          >
                            <div className="absolute top-3 left-3 bg-white/95 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#352d43] shadow-xs flex items-center gap-1 z-10">
                              <BookOpen className="w-3 h-3 text-[#7859a8]" />
                              <span>PDF PARA IMPRIMIR</span>
                            </div>

                            <StoreProductImage
                              src={p.thumbnail_url}
                              alt={p.name}
                              aspectRatio="aspect-[4/3]"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>

                          <div className="p-5">
                            <span className="text-xs font-bold text-[#6f6481] block">
                              {p.category_name || 'Recortar e colar'}
                            </span>

                            <h3
                              onClick={() => openProductModal(p)}
                              className="font-black text-lg sm:text-xl text-[#1e192c] tracking-tight mt-1.5 cursor-pointer hover:text-[#795aa7] transition-colors break-words line-clamp-2"
                            >
                              {p.name}
                            </h3>

                            {p.description && (
                              <p className="text-xs text-[#5d546f] leading-relaxed mt-2 line-clamp-2">
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="p-5 pt-0">
                          <div className="pt-3.5 border-t border-[#f2ebf7] flex items-center justify-between gap-3">
                            <div>
                              <span className="block text-[10px] font-medium text-[#938a9e]">
                                Arquivo digital
                              </span>
                              <strong className="block font-black text-xl text-[#1e182b] leading-tight">
                                {formatCurrency(p.price)}
                              </strong>
                              <span className="block text-[9px] text-[#9d94a9]">
                                Sem entrega física
                              </span>
                            </div>

                            <button
                              onClick={() => openProductModal(p)}
                              className="rounded-xl bg-[#1b1d33] hover:bg-[#111322] text-white font-extrabold text-xs px-4 py-2.5 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                            >
                              <span>Conhecer</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 px-4 rounded-3xl bg-[#fdfaf7] border border-[#f5ece4] text-center max-w-md mx-auto">
                    <Search className="w-8 h-8 text-[#caa885] mx-auto mb-2" />
                    <h3 className="font-black text-base text-[#2f273b]">
                      Nenhuma descoberta com esse nome
                    </h3>
                    <p className="text-xs text-[#786b86] mt-1">
                      Não encontramos materiais com o termo "{searchTerm}". Tente outro nome ou veja nossa coleção completa logo abaixo.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Quando NÃO há pesquisa ativa: estado elegante de descoberta sem repetir desnecessariamente o produto mais recente */
              <div className="mt-8 rounded-3xl bg-[#faf6fe] border border-[#eee5fa] p-6 sm:p-8 text-center max-w-2xl mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs text-[#7651a8] flex items-center justify-center mx-auto mb-3">
                  <Search className="w-6 h-6" />
                </div>
                <h3 className="font-black text-base sm:text-lg text-[#201931]">
                  Encontre a tarefinha ideal
                </h3>
                <p className="text-xs sm:text-sm text-[#6c5e82] max-w-md mx-auto mt-1.5 leading-relaxed">
                  Digite acima o tema que você deseja procurar ou explore todos os nossos materiais digitais logo abaixo.
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('todos-os-produtos');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#52347b] border border-[#decfe8] font-bold text-xs hover:bg-[#f6effe] transition-colors cursor-pointer"
                  >
                    <span>Ver todos os materiais abaixo</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* NOVA SEÇÃO: TODOS OS PRODUTOS (ENTRE SEARCH E CATEGORIA) */}
        <section id="todos-os-produtos" className="py-12 sm:py-16 bg-[#fbf9fe] border-t border-[#f0e8f7]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-left max-w-2xl mb-8">
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                <Layers className="w-3.5 h-3.5 text-[#8264ad]" />
                <span>COLEÇÃO COMPLETA</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1d182c] tracking-tight mt-1.5 break-words">
                Todos os materiais
              </h2>
              <p className="text-xs sm:text-sm text-[#736a83] mt-2">
                Conheça todas as opções disponíveis prontas para baixar, imprimir e criar com a criançada.
              </p>
            </div>

            {allProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {allProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="rounded-[1.75rem] border border-[#eee7f4] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div
                        onClick={() => openProductModal(prod)}
                        className="relative cursor-pointer overflow-hidden aspect-[4/3] bg-[#f5effa]"
                      >
                        <div className="absolute top-3 left-3 bg-white/95 rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#352d43] shadow-xs flex items-center gap-1 z-10">
                          <BookOpen className="w-3 h-3 text-[#7859a8]" />
                          <span>PDF PARA IMPRIMIR</span>
                        </div>

                        <StoreProductImage
                          src={prod.thumbnail_url}
                          alt={prod.name}
                          aspectRatio="aspect-[4/3]"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="p-5">
                        <span className="text-xs font-bold text-[#6f6481] block">
                          {prod.category_name || 'Recortar e colar'}
                        </span>

                        <h3
                          onClick={() => openProductModal(prod)}
                          className="font-black text-lg sm:text-xl text-[#1e192c] tracking-tight mt-1.5 cursor-pointer hover:text-[#795aa7] transition-colors break-words line-clamp-2"
                        >
                          {prod.name}
                        </h3>

                        {prod.description && (
                          <p className="text-xs text-[#5d546f] leading-relaxed mt-2 line-clamp-2">
                            {prod.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <div className="pt-3.5 border-t border-[#f2ebf7] flex items-center justify-between gap-3">
                        <div>
                          <span className="block text-[10px] font-medium text-[#938a9e]">
                            Arquivo digital
                          </span>
                          <strong className="block font-black text-xl text-[#1e182b] leading-tight">
                            {formatCurrency(prod.price)}
                          </strong>
                          <span className="block text-[9px] text-[#9d94a9]">
                            Produto digital. Sem entrega física.
                          </span>
                        </div>

                        <button
                          onClick={() => openProductModal(prod)}
                          className="rounded-xl bg-[#1b1d33] hover:bg-[#111322] text-white font-extrabold text-xs px-4 py-2.5 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          <span>Conhecer</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p className="text-sm font-bold">Carregando catálogo de materiais...</p>
              </div>
            )}
          </div>
        </section>

        {/* SEÇÃO DE CATEGORIAS / PRÉVIAS ("PODE ESPIAR") */}
        <section id="por-dentro" className="py-12 sm:py-16 bg-[#ffffff]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                  <BookOpen className="w-3.5 h-3.5 text-[#8264ad]" />
                  <span>UM PEDACINHO DO VOLUME 1</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1e192c] tracking-tight mt-1.5 leading-tight break-words">
                  Pode espiar.<br className="hidden sm:inline" /> Tem descoberta em cada página.
                </h2>
                <p className="text-xs sm:text-sm text-[#736a83] mt-2">
                  Prévias reais do material para você conhecer antes de escolher.
                </p>
              </div>

              <div>
                <button
                  onClick={() => openPreview(0)}
                  className="font-black text-xs sm:text-sm text-[#2a223c] hover:text-[#7f5fa8] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Ampliar as páginas</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
              {previewItems.map((item, idx) => (
                <div
                  key={item.product.id}
                  onClick={() => openPreview(idx)}
                  className={`rounded-2xl sm:rounded-3xl p-3 border ${item.themeCardBorder} ${item.themeCardBg} shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between`}
                >
                  <div className="rounded-xl overflow-hidden bg-white shadow-xs aspect-[3/4] relative group">
                    <StoreProductImage
                      src={item.product.thumbnail_url}
                      alt={item.product.name}
                      aspectRatio="aspect-[3/4]"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#352d43] shadow-xs flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5 text-[#7859a8]" />
                      <span>PDF</span>
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 shadow-xs flex items-center justify-center text-[#55496d]">
                      <Search className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <h4 className="font-black text-xs sm:text-sm text-[#1e192c] leading-tight truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-[#746b82] mt-0.5 truncate">
                        {item.categoryName}
                      </p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#887b9f] shrink-0 mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* É SIMPLES COMEÇAR */}
        <section id="como-funciona" className="py-12 sm:py-16 bg-[#faf7fd]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-left max-w-xl">
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                DO PDF À COLAGEM EM FAMÍLIA
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1e192c] tracking-tight mt-1.5 break-words">
                É simples começar<span className="text-[#e57a8a]">.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#736a83] mt-2">
                Mais tempo criando. Menos tempo procurando.
              </p>
            </div>

            <div className="mt-8 space-y-6 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-[#ecd58e] flex items-center justify-center shrink-0 bg-[#fffdf7]">
                  <Download className="w-5 h-5 text-[#302742]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#fdd853] text-[#29200f] text-[10px] font-black flex items-center justify-center">
                    01
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#1e182b]">
                    Escolha e baixe
                  </h3>
                  <p className="text-xs text-[#675e75] leading-relaxed mt-1">
                    Escolha seu material e finalize a compra. O PDF é liberado imediatamente após a confirmação.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-[#cfbce7] flex items-center justify-center shrink-0 bg-[#faf7fd]">
                  <Printer className="w-5 h-5 text-[#302742]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#d6b7f3] text-[#2f1b46] text-[10px] font-black flex items-center justify-center">
                    02
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#1e182b]">
                    Imprima o que precisar
                  </h3>
                  <p className="text-xs text-[#675e75] leading-relaxed mt-1">
                    Encontre o tema no índice e selecione as páginas. Tudo preparado em tamanho A4 para impressão caseira.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="relative w-12 h-12 rounded-full border-2 border-dashed border-[#f5bccc] flex items-center justify-center shrink-0 bg-[#fff9fa]">
                  <Scissors className="w-5 h-5 text-[#302742]" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#fca5ba] text-[#4b1422] text-[10px] font-black flex items-center justify-center">
                    03
                  </span>
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-[#1e182b]">
                    Recorte, cole e descubra
                  </h3>
                  <p className="text-xs text-[#675e75] leading-relaxed mt-1">
                    Separe cola, tesoura sem ponta e um pouquinho de imaginação para momentos inesquecíveis em família.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-2xl bg-[#eaf3ec] border border-[#d3e7d8] p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <Heart className="w-5 h-5 text-[#3f6d49] shrink-0" />
                <div>
                  <p className="font-bold text-xs sm:text-sm text-[#204027]">
                    A tarefinha também pode ser um momento de conexão.
                  </p>
                  <p className="text-[11px] sm:text-xs text-[#43674c] mt-0.5">
                    Um recorte de cada vez, uma descoberta juntos.
                  </p>
                </div>
              </div>
              <span className="text-[#3f6d49] font-bold text-sm">✦</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="duvidas" className="py-12 sm:py-16 bg-[#fffdfb]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-left mb-6">
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                ANTES DE COMEÇAR
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1e192c] tracking-tight mt-1.5 break-words">
                Ficou com alguma dúvida?
              </h2>
              <p className="text-xs sm:text-sm text-[#736a83] mt-2">
                A gente te ajuda a encontrar o caminho.
              </p>

              <div className="mt-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#6a4f9b] hover:text-[#523681] transition-colors"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Converse no Instagram</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="divide-y divide-[#eee7f4] border-t border-b border-[#eee7f4]">
              {FAQS.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div key={faq.q} className="py-4">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#231d33] hover:text-[#7f5fa8] transition-colors cursor-pointer"
                    >
                      <span className="break-words pr-2">{faq.q}</span>
                      <span className="text-[#785ba5] text-lg font-bold shrink-0">
                        {isOpen ? '×' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-2.5 text-xs text-[#635a72] leading-relaxed pr-6 animate-in fade-in-50 duration-150">
                        {faq.a}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BANNER FINAL CTA */}
        <section className="py-8 bg-[#fffdfb]">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <div className="relative rounded-[2rem] bg-[#fbe7b7] p-6 sm:p-12 overflow-hidden shadow-xs">
              <div className="relative z-10 max-w-lg">
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#714f10]">
                  PEQUENOS RECORTES, GRANDES DESCOBERTAS.
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1e192b] tracking-tight mt-2 leading-tight break-words">
                  A próxima ideia começa com uma imagem.
                </h2>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      const el = document.getElementById('materiais');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="w-full sm:w-auto rounded-xl bg-[#1a1c31] hover:bg-[#111322] text-white font-black text-xs sm:text-sm px-6 py-3.5 shadow-sm transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Explorar os materiais</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="absolute top-6 right-8 text-3xl sm:text-5xl text-[#d49925] opacity-80 select-none pointer-events-none">
                ✦
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* MODAL DE PRÉVIA ("POR DENTRO DO MATERIAL") */}
      {previewModalOpen && previewItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 relative shadow-2xl animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setPreviewModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f4effa] text-[#55466f] flex items-center justify-center hover:bg-[#ede5f7] transition-colors cursor-pointer"
              aria-label="Fechar prévia"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="pr-10">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#8264ad]">
                POR DENTRO DO MATERIAL
              </span>
              <h3 className="text-lg sm:text-xl font-black text-[#1e192c] mt-0.5 truncate">
                {currentPreviewItem?.categoryName || currentPreviewItem?.product.name}
              </h3>
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden bg-[#faf7fd] border border-[#f0ebf5] aspect-[3/4]">
              <StoreProductImage
                src={currentPreviewItem?.product.thumbnail_url}
                alt={currentPreviewItem?.product.name || 'Prévia'}
                aspectRatio="aspect-[3/4]"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-xs font-bold text-[#554c67]">
              <button
                onClick={prevPreview}
                className="w-8 h-8 rounded-full bg-[#f5effa] hover:bg-[#ecdeff] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Prévia anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span>
                {currentPreviewIndex + 1} de {previewItems.length} prévias
              </span>

              <button
                onClick={nextPreview}
                className="w-8 h-8 rounded-full bg-[#f5effa] hover:bg-[#ecdeff] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Próxima prévia"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPONENTE DE COMPRA: MODAL DE DETALHES COM BOTÃO DE COMPRA */}
      {productModalOpen && selectedProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 relative shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f4effa] text-[#55466f] flex items-center justify-center hover:bg-[#ede5f7] transition-colors cursor-pointer z-10"
              aria-label="Fechar detalhes"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl overflow-hidden bg-[#f5effa] border border-[#ede5f8] aspect-[4/3] flex items-center justify-center">
              <StoreProductImage
                src={selectedProductModal.thumbnail_url}
                alt={selectedProductModal.name}
                aspectRatio="aspect-[4/3]"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#746b85] uppercase tracking-wider block">
                {selectedProductModal.category_name
                  ? `${selectedProductModal.category_name} · PDF DIGITAL`
                  : 'PDF DIGITAL PARA IMPRIMIR'}
              </span>
              <h3 className="font-black text-xl sm:text-2xl text-[#1e192c] tracking-tight mt-1 break-words">
                {selectedProductModal.name}
              </h3>

              {selectedProductModal.description && (
                <p className="text-xs text-[#5f5670] leading-relaxed mt-2.5">
                  {selectedProductModal.description}
                </p>
              )}

              <div className="mt-5 pt-4 border-t border-[#f0ebf5] flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] text-[#9a91a6] font-medium">
                    Valor único
                  </span>
                  <strong className="font-black text-2xl text-[#1e182b]">
                    {formatCurrency(selectedProductModal.price)}
                  </strong>
                </div>

                <button
                  onClick={() => handleBuy(selectedProductModal)}
                  className="rounded-xl bg-[#1b1d33] hover:bg-[#111322] text-white font-black text-xs sm:text-sm px-6 py-3.5 shadow-sm transition-all flex items-center gap-2 cursor-pointer shrink-0"
                >
                  <span>Comprar agora</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rodapé */}
      <StoreFooter />
    </div>
  );
};
