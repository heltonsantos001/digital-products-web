import { ProductVisualMeta } from '../types';

export function formatCurrency(value: number, currency: string = 'BRL'): string {
  try {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency || 'BRL',
    }).format(value);
  } catch {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  }
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function parseProductMeta(rawDesc: string): ProductVisualMeta {
  if (!rawDesc) {
    return {
      summary: '',
      indicators: [
        { label: 'Formato', value: 'PDF' },
        { label: 'Entrega', value: 'Imediata' },
      ],
      how_to_use: [
        { step: 1, title: 'Baixe o produto', desc: 'Receba o material instantaneamente após a confirmação.' },
        { step: 2, title: 'Escolha o conteúdo', desc: 'Acesse o material no celular, tablet ou computador.' },
        { step: 3, title: 'Utilize ou imprima', desc: 'Pronto para uso digital ou impressão de alta qualidade.' },
      ]
    };
  }

  try {
    const parsed = JSON.parse(rawDesc);
    if (typeof parsed === 'object' && parsed !== null) {
      return {
        summary: parsed.summary || rawDesc,
        edition: parsed.edition,
        highlight_badge: parsed.highlight_badge,
        indicators: parsed.indicators || [
          { label: 'Páginas', value: '18+' },
          { label: 'Formato', value: 'PDF A4' },
          { label: 'Entrega', value: 'E-mail' },
        ],
        features: parsed.features || [],
        bonus: parsed.bonus || null,
        how_to_use: parsed.how_to_use || [
          { step: 1, title: 'Baixe o produto', desc: 'Receba o material instantaneamente no seu e-mail.' },
          { step: 2, title: 'Escolha o conteúdo', desc: 'Selecione as páginas ou temas que deseja usar.' },
          { step: 3, title: 'Utilize ou imprima', desc: 'Aproveite o conteúdo quantas vezes quiser.' },
        ]
      };
    }
  } catch {
    // rawDesc is plain text string
  }

  return {
    summary: rawDesc,
    edition: 'Edição 2026',
    indicators: [
      { label: 'Entrega', value: 'Digital' },
      { label: 'Acesso', value: 'Imediato' },
      { label: 'Formato', value: 'PDF' },
    ],
    how_to_use: [
      { step: 1, title: 'Baixe o produto', desc: 'Receba o material instantaneamente após o pagamento.' },
      { step: 2, title: 'Escolha o conteúdo', desc: 'Acesse no celular, computador ou imprima as folhas.' },
      { step: 3, title: 'Utilize ou imprima', desc: 'Use com as crianças em casa ou na sala de aula.' },
    ]
  };
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'paid':
    case 'confirmed':
    case 'sent':
    case 'active':
      return {
        label: status === 'paid' ? 'Pago' : status === 'confirmed' ? 'Confirmado' : status === 'sent' ? 'Enviado' : 'Ativo',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        dot: 'bg-emerald-500'
      };
    case 'pending':
    case 'processing':
      return {
        label: status === 'processing' ? 'Processando' : 'Pendente',
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
        dot: 'bg-amber-500 animate-pulse'
      };
    case 'failed':
    case 'suspended':
      return {
        label: status === 'suspended' ? 'Suspenso' : 'Falhou',
        bg: 'bg-rose-100 text-rose-800 border-rose-200',
        dot: 'bg-rose-500'
      };
    case 'canceled':
      return {
        label: 'Cancelado',
        bg: 'bg-gray-100 text-gray-700 border-gray-200',
        dot: 'bg-gray-400'
      };
    case 'refunded':
      return {
        label: 'Reembolsado',
        bg: 'bg-purple-100 text-purple-800 border-purple-200',
        dot: 'bg-purple-500'
      };
    case 'inactive':
    case 'archived':
      return {
        label: status === 'archived' ? 'Arquivado' : 'Inativo',
        bg: 'bg-gray-100 text-gray-600 border-gray-200',
        dot: 'bg-gray-400'
      };
    default:
      return {
        label: status,
        bg: 'bg-gray-100 text-gray-800 border-gray-200',
        dot: 'bg-gray-500'
      };
  }
}
