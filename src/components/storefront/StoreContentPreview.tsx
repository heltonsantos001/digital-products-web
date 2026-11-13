import React from 'react';
import { ProductVisualMeta, Product } from '../../types';
import { Sparkles, Eye } from 'lucide-react';

interface StoreContentPreviewProps {
  product: Product;
  meta: ProductVisualMeta;
}

export const StoreContentPreview: React.FC<StoreContentPreviewProps> = ({ product, meta }) => {
  // Use dynamic features from product visual meta, or generate sensible previews based on product
  const items = meta.features && meta.features.length > 0 ? meta.features : [
    {
      title: 'Atividades de Alfabetização',
      category: 'Linguagem',
      description: 'Cartelas lúdicas de associação letra-imagem para fixação dos fonemas.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Grafismo e Coordenação Motora',
      category: 'Habilidades Manuais',
      description: 'Linhas curvas, retas e labirintos divertidos para treino de caligrafia.',
      image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Matemática e Contagem Lúdica',
      category: 'Raciocínio Lógico',
      description: 'Atividades ilustradas para contagem de objetos, formas e números.',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Pintura e Discriminação Visual',
      category: 'Artes e Cores',
      description: 'Desenhos com bordas reforçadas para estimular a criatividade infantil.',
      image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
    },
  ];

  return (
    <section id="por-dentro" className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-brand-pink-light text-brand-pink font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Conteúdo Completo</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-brand-navy tracking-tight">
            Veja o que vem no seu produto
          </h2>
          <p className="text-slate-600 font-semibold text-base">
            Cada atividade foi pensada pedagogicamente para garantir o aprendizado leve, divertido e sem frustração.
          </p>
        </div>

        {/* Responsive Grid of Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-soft hover:shadow-float hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
            >
              {/* Image Preview Container */}
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <span className="text-white text-xs font-bold flex items-center gap-1.5 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <Eye className="w-3.5 h-3.5" /> Prévia do arquivo
                  </span>
                </div>
                {/* Dynamic Category Tag */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 rounded-full bg-brand-purple text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-brand-navy text-lg leading-snug group-hover:text-brand-pink transition-colors">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="text-slate-600 font-medium text-xs sm:text-sm mt-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-50 flex items-center justify-between text-xs font-bold text-slate-500">
                  <span className="text-brand-green font-extrabold flex items-center gap-1">
                    ✓ Incluso no kit
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] text-slate-600 font-black">
                    Alta Definição
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
