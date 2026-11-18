import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../../services/product.service';
import { getProductImageUrl } from '../../services/api';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { StoreHeader } from '../../components/storefront/StoreHeader';
import { StoreFooter } from '../../components/storefront/StoreFooter';
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
    a: 'Quando as vendas de um material estiverem disponíveis, o botão de compra levará ao checkout da plataforma indicada. A confirmação do pagamento e o acesso ao PDF são feitos por essa plataforma.',
  },
  {
    q: 'Para quem o Volume 1 foi pensado?',
    a: 'Para famílias com crianças na educação infantil e nos primeiros anos escolares que precisam de imagens para recortar e colar. É um material complementar às orientações da escola; o recorte deve ser acompanhado por um adulto.',
  },
  {
    q: 'Posso imprimir mais de uma vez?',
    a: 'Sim! O arquivo é seu para uso pessoal e familiar. Você pode reimprimir as páginas sempre que precisar.',
  },
  {
    q: 'Tem alguma brincadeira no Volume 1?',
    a: 'Sim! Além das imagens para recortar e colar, o Volume 1 inclui um jogo da memória dos animais para brincar em família.',
  },
];

export const StorePage: React.FC = () => {
  const { slug } = useParams<{ slug?: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'recortar'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(2);

  // Modais
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);
  const [productModalOpen, setProductModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        if (slug) {
          const item = await productService.getBySlug(slug);
          if (isMounted) {
            setProduct(item);
            setAllProducts([item]);
          }
        } else {
          const res = await productService.list({ status: 'active', limit: 50 });
          if (isMounted && res.products && res.products.length > 0) {
            setAllProducts(res.products);
            setProduct(res.products[0]);
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

  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return allProducts;
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(term) ||
        (p.category_name || '').toLowerCase().includes(term)
    );
  }, [allProducts, searchTerm]);

  useEffect(() => {
    if (filteredProducts.length > 0 && searchTerm) {
      setProduct(filteredProducts[0]);
    } else if (!searchTerm && allProducts.length > 0) {
      setProduct(allProducts[0]);
    }
  }, [filteredProducts, searchTerm]);

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
    const p = targetProduct || product;
    if (p && p.id) {
      navigate(`/checkout?product_id=${p.id}`);
    } else {
      navigate('/checkout?product_id=3');
    }
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
  const displayPrice = product ? formatCurrency(product.price) : 'R$ 19,90';

  return (
    <div className="min-h-screen bg-white text-[#1e192c] storefront-theme selection:bg-[#fed766]">
      <StoreHeader onBuyClick={() => handleBuy()} />

      <main className="overflow-x-hidden">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-dot-pattern pt-8 pb-10 sm:pt-14 sm:pb-16 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-black tracking-widest text-[#2f2740] uppercase mb-3 sm:mb-4">
              <span className="text-[#e29e24]">✦</span>
              <span>MENOS PROCURA, MAIS DESCOBERTAS</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#1d182c] tracking-tight leading-[1.18] max-w-2xl mx-auto px-2">
              As imagens da tarefinha, em um{' '}
              <span className="highlight-yellow">só lugar.</span>
            </h1>

            <p className="mt-3.5 max-w-md sm:max-w-lg mx-auto text-xs sm:text-sm text-[#665e74] leading-relaxed font-normal px-2">
              Um mundo de imagens para recortar, colar e aprender juntinhos. Escolha o tema, imprima e deixe a imaginação brincar.
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  const el = document.getElementById('materiais');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="rounded-2xl bg-[#fbc737] hover:bg-[#f2be2c] text-[#29200f] font-black text-xs sm:text-sm px-5 sm:px-6 py-3.5 shadow-[0_4px_0_#d8a420] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Encontrar meu material</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openPreview(0)}
                className="rounded-2xl bg-transparent hover:bg-[#f6f2fb] text-[#2f2840] font-black text-xs sm:text-sm px-4 py-3.5 flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span>Espiar por dentro</span>
                <BookOpen className="w-4 h-4 text-[#5c4f74]" />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-[#786f87] font-medium">
              <span className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5" /> PDF digital
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <Printer className="w-3.5 h-3.5" /> Para imprimir em casa
              </span>
            </div>

            <div className="mt-6 max-w-sm sm:max-w-md mx-auto relative group">
              <div
                onClick={() => openPreview(0)}
                className="cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                title="Clique para espiar o material por dentro"
              >
                <div className="rounded-2xl overflow-hidden aspect-[3/4] bg-[#ebf3ee] flex items-center justify-center shadow-lg">
                  <img
                    src={getProductImageUrl(product?.thumbnail_url) || '/hero-showcase.png'}
                    alt={product?.name || 'Material'}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-[#f0ebf5] max-w-xl mx-auto grid grid-cols-3 divide-x divide-[#f0ebf5] text-center">
              <div className="px-1 sm:px-2">
                <Download className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-[#5f5178] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-[#352c46] block leading-tight">
                  Material em PDF
                </span>
              </div>
              <div className="px-1 sm:px-2">
                <Printer className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-[#5f5178] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-[#352c46] block leading-tight">
                  Imprima só o que precisar
                </span>
              </div>
              <div className="px-1 sm:px-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mx-auto text-[#5f5178] mb-1" />
                <span className="text-[10px] sm:text-xs font-bold text-[#352c46] block leading-tight">
                  Para descobrir em família
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* CATÁLOGO ("Qual vai ser a descoberta de hoje?") */}
        <section id="materiais" className="py-12 sm:py-16 bg-[#fffdfb]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-left max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                <Sparkles className="w-3.5 h-3.5 text-[#8264ad]" />
                <span>UM MUNDO PARA EXPLORAR</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1d182c] tracking-tight mt-1.5">
                Qual vai ser a descoberta de hoje?
              </h2>
              <p className="text-xs sm:text-sm text-[#736a83] mt-2">
                Materiais que facilitam a tarefinha e abrem espaço para criar.
              </p>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-full px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
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
                  className={`rounded-full px-4 py-2 text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
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
                  className="w-full rounded-2xl border border-[#ece4f3] bg-white py-2.5 pl-10 pr-4 text-xs sm:text-sm outline-none focus:border-[#9675c7] text-[#2b243b] placeholder-[#a299af]"
                />
              </div>
            </div>

            {/* Card do Produto */}
            <div className="mt-8 max-w-lg mx-auto sm:mx-0">
              <div className="rounded-[2rem] border border-[#eee7f4] bg-white overflow-hidden shadow-xs hover:shadow-lg transition-all">
                <div
                  onClick={() => setProductModalOpen(true)}
                  className="relative bg-[#ebf3ee] flex items-center justify-center cursor-pointer group overflow-hidden aspect-[3/4] sm:aspect-[4/3]"
                >
                  <div className="absolute top-3.5 left-3.5 bg-white/95 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#352d43] shadow-xs flex items-center gap-1.5 z-10">
                    <BookOpen className="w-3 h-3 text-[#7859a8]" />
                    <span>PDF PARA IMPRIMIR</span>
                  </div>

                  <img
                    src={getProductImageUrl(product?.thumbnail_url) || '/product-cover-card.png'}
                    alt={product?.name || 'Material'}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#6f6481]">
                      {product?.category_name || 'Recortar e colar'}
                    </span>
                  </div>

                  <h3
                    onClick={() => setProductModalOpen(true)}
                    className="font-black text-2xl text-[#1e192c] tracking-tight mt-2 cursor-pointer hover:text-[#795aa7] transition-colors"
                  >
                    {product?.name || 'Meu Mundo de Recortes'}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5d546f] leading-relaxed mt-3">
                    {product?.description || ''}
                  </p>

                  <div className="mt-6 pt-4 border-t border-[#f2ebf7] flex items-center justify-between gap-4">
                    <div>
                      <span className="block text-[11px] font-medium text-[#938a9e]">
                        Arquivo digital
                      </span>
                      <strong className="block font-black text-2xl text-[#1e182b] leading-tight">
                        {displayPrice}
                      </strong>
                      <span className="block text-[10px] text-[#9d94a9]">
                        Produto digital. Sem entrega física.
                      </span>
                    </div>

                    <button
                      onClick={() => setProductModalOpen(true)}
                      className="rounded-xl bg-[#1b1d33] hover:bg-[#111322] text-white font-extrabold text-xs sm:text-sm px-5 py-3 shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <span>Conhecer o material</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PODE ESPIAR */}
        <section id="por-dentro" className="py-12 sm:py-16 bg-[#fbf9fd]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                  <BookOpen className="w-3.5 h-3.5 text-[#8264ad]" />
                  <span>UM PEDACINHO DO VOLUME 1</span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1e192c] tracking-tight mt-1.5 leading-tight">
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
                    <img
                      src={getProductImageUrl(item.product.thumbnail_url) || '/product-cover-card.png'}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 bg-white/90 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#352d43] shadow-xs flex items-center gap-1">
                      <BookOpen className="w-2.5 h-2.5 text-[#7859a8]" />
                      <span>PDF</span>
                    </div>
                    <div className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-white/90 shadow-sm flex items-center justify-center text-[#55496d]">
                      <Search className="w-3 h-3" />
                    </div>
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-1">
                    <div>
                      <h4 className="font-black text-xs sm:text-sm text-[#1e192c] leading-tight">
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
        <section id="como-funciona" className="py-12 sm:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-left max-w-xl">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                DO PDF À COLAGEM EM FAMÍLIA
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1e192c] tracking-tight mt-1.5">
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
                    Escolha seu material e faça a compra. O PDF é disponibilizado pela plataforma de pagamento, após a confirmação.
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
                    Encontre o tema no índice e selecione as páginas. O Volume 1 foi preparado para papel A4, em um só lado.
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
                    Separe cola, tesoura sem ponta e um pouquinho de imaginação. Um adulto acompanha a brincadeira.
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
              <div className="text-[11px] font-black uppercase tracking-wider text-[#8264ad]">
                ANTES DE COMEÇAR
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#1e192c] tracking-tight mt-1.5">
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
                      <span>{faq.q}</span>
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
            <div className="relative rounded-[2rem] bg-[#fbe7b7] p-8 sm:p-12 overflow-hidden shadow-xs">
              <div className="relative z-10 max-w-lg">
                <span className="text-[10px] font-black uppercase tracking-[.18em] text-[#714f10]">
                  PEQUENOS RECORTES, GRANDES DESCOBERTAS.
                </span>
                <h2 className="text-2xl sm:text-4xl font-black text-[#1e192b] tracking-tight mt-2 leading-tight">
                  A próxima ideia começa com uma imagem.
                </h2>
                <div className="mt-6">
                  <button
                    onClick={() => {
                      const el = document.getElementById('materiais');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="rounded-xl bg-[#1a1c31] hover:bg-[#111322] text-white font-black text-xs sm:text-sm px-6 py-3.5 shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
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
              <h3 className="text-lg sm:text-xl font-black text-[#1e192c] mt-0.5">
                {currentPreviewItem?.categoryName || currentPreviewItem?.product.name}
              </h3>
            </div>

            <div className="mt-4 rounded-2xl overflow-hidden bg-[#faf7fd] border border-[#f0ebf5] aspect-[3/4] flex items-center justify-center">
              <img
                src={getProductImageUrl(currentPreviewItem?.product.thumbnail_url) || '/product-cover-card.png'}
                alt={currentPreviewItem?.product.name}
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

      {/* MODAL DE DETALHES DO PRODUTO */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 relative shadow-2xl max-h-[92vh] overflow-y-auto animate-in zoom-in-95 duration-150">
            <button
              onClick={() => setProductModalOpen(false)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#f4effa] text-[#55466f] flex items-center justify-center hover:bg-[#ede5f7] transition-colors cursor-pointer z-10"
              aria-label="Fechar detalhes"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="rounded-2xl bg-[#ebf3ee] p-4 flex items-center justify-center relative">
              <img
                src={getProductImageUrl(product?.thumbnail_url) || '/product-cover-card.png'}
                alt={product?.name || 'Material'}
                className="max-h-56 object-contain drop-shadow-sm"
              />
            </div>

            <div className="mt-4">
              <span className="text-[11px] font-bold text-[#746b85]">
                {product?.category_name ? `${product.category_name} · PDF DIGITAL` : 'PDF DIGITAL'}
              </span>
              <h3 className="font-black text-2xl text-[#1e192c] tracking-tight mt-1">
                {product?.name || 'Meu Mundo de Recortes'}
              </h3>

              <p className="text-xs text-[#5f5670] leading-relaxed mt-3">
                {product?.description || ''}
              </p>

              <div className="mt-6 pt-4 border-t border-[#f0ebf5] flex items-center justify-between gap-4">
                <div>
                  <span className="block text-[10px] text-[#9a91a6] font-medium">
                    Valor único
                  </span>
                  <strong className="font-black text-2xl text-[#1e182b]">
                    {displayPrice}
                  </strong>
                </div>

                <button
                  onClick={() => handleBuy()}
                  className="rounded-xl bg-[#1b1d33] hover:bg-[#111322] text-white font-black text-xs sm:text-sm px-6 py-3.5 shadow-sm transition-all flex items-center gap-2 cursor-pointer"
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
