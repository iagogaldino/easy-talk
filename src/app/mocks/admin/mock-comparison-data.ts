export interface SalesPeriodData {
  date: string;
  value: number;
}

export interface SellerComparisonData {
  seller: string;
  avatar?: string;
  period1: {
    sales: number;
    clients: number;
  };
  period2: {
    sales: number;
    clients: number;
  };
}

export interface ProductComparisonData {
  product: string;
  period1: {
    sales: number;
    quantity: number;
    revenue: number;
  };
  period2: {
    sales: number;
    quantity: number;
    revenue: number;
  };
}

export interface RegionComparisonData {
  region: string;
  period1: {
    sales: number;
    clients: number;
  };
  period2: {
    sales: number;
    clients: number;
  };
}

// Dados de vendas para comparação de períodos
export function getSalesComparisonData(days1: number, days2: number): {
  period1: SalesPeriodData[];
  period2: SalesPeriodData[];
  total1: number;
  total2: number;
} {
  const period1: SalesPeriodData[] = [];
  const period2: SalesPeriodData[] = [];
  let total1 = 0;
  let total2 = 0;

  const today = new Date();
  
  // Período 1 (mais recente)
  for (let i = days1 - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const value = Math.floor(Math.random() * 50000) + 20000;
    period1.push({
      date: date.toISOString().split('T')[0],
      value,
    });
    total1 += value;
  }

  // Período 2 (anterior)
  for (let i = days2 - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - days1 - i);
    const value = Math.floor(Math.random() * 50000) + 20000;
    period2.push({
      date: date.toISOString().split('T')[0],
      value,
    });
    total2 += value;
  }

  return { period1, period2, total1, total2 };
}

// Comparação de vendedores
export const SELLERS_COMPARISON_DATA: SellerComparisonData[] = [
  {
    seller: 'João Santos',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
    period1: { sales: 128, clients: 45 },
    period2: { sales: 115, clients: 42 },
  },
  {
    seller: 'Ana Costa',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
    period1: { sales: 95, clients: 38 },
    period2: { sales: 88, clients: 35 },
  },
  {
    seller: 'Carlos Ferreira',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
    period1: { sales: 78, clients: 32 },
    period2: { sales: 72, clients: 30 },
  },
  {
    seller: 'Mariana Lima',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
    period1: { sales: 56, clients: 25 },
    period2: { sales: 48, clients: 22 },
  },
];

// Comparação de produtos
export const PRODUCTS_COMPARISON_DATA: ProductComparisonData[] = [
  {
    product: 'Notebook Dell Inspiron',
    period1: { sales: 45, quantity: 45, revenue: 148499.55 },
    period2: { sales: 38, quantity: 38, revenue: 125399.62 },
  },
  {
    product: 'Mouse Logitech MX Master',
    period1: { sales: 120, quantity: 120, revenue: 35880.00 },
    period2: { sales: 105, quantity: 105, revenue: 31395.00 },
  },
  {
    product: 'Monitor LG 27" 4K',
    period1: { sales: 32, quantity: 32, revenue: 60768.00 },
    period2: { sales: 28, quantity: 28, revenue: 53172.00 },
  },
  {
    product: 'Headset HyperX Cloud II',
    period1: { sales: 56, quantity: 56, revenue: 39194.40 },
    period2: { sales: 48, quantity: 48, revenue: 33595.20 },
  },
];

// Comparação de regiões
export const REGIONS_COMPARISON_DATA: RegionComparisonData[] = [
  {
    region: 'Sudeste',
    period1: { sales: 485000, clients: 245 },
    period2: { sales: 425000, clients: 220 },
  },
  {
    region: 'Sul',
    period1: { sales: 320000, clients: 180 },
    period2: { sales: 295000, clients: 165 },
  },
  {
    region: 'Nordeste',
    period1: { sales: 280000, clients: 150 },
    period2: { sales: 260000, clients: 140 },
  },
  {
    region: 'Centro-Oeste',
    period1: { sales: 195000, clients: 95 },
    period2: { sales: 180000, clients: 88 },
  },
];

