export interface SalesData {
  date: string;
  value: number;
  category?: string;
  product?: string;
  region?: string;
}

export interface ProductSales {
  product: string;
  sales: number;
  quantity: number;
  category: string;
}

export interface RegionSales {
  region: string;
  sales: number;
  clients: number;
}

export interface FunnelStage {
  stage: string;
  value: number;
  percentage: number;
}

/**
 * Mock de dados de vendas por período (últimos 30 dias)
 */
export function getSalesByPeriod(days: number = 30): SalesData[] {
  const data: SalesData[] = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simula variação de vendas
    const baseValue = 8000 + Math.random() * 4000;
    const weekendMultiplier = (date.getDay() === 0 || date.getDay() === 6) ? 0.7 : 1;
    const value = Math.round(baseValue * weekendMultiplier);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value,
    });
  }
  
  return data;
}

/**
 * Mock de dados de vendas por produto
 */
export const PRODUCT_SALES: ProductSales[] = [
  { product: 'Notebook Dell', sales: 45000, quantity: 25, category: 'Informática' },
  { product: 'Mouse Logitech', sales: 12000, quantity: 200, category: 'Periféricos' },
  { product: 'Teclado Mecânico', sales: 18000, quantity: 90, category: 'Periféricos' },
  { product: 'Monitor LG 27"', sales: 35000, quantity: 35, category: 'Monitores' },
  { product: 'Webcam HD', sales: 15000, quantity: 150, category: 'Periféricos' },
  { product: 'Headset HyperX', sales: 22000, quantity: 110, category: 'Áudio' },
  { product: 'SSD 500GB', sales: 28000, quantity: 140, category: 'Armazenamento' },
  { product: 'Memória RAM 16GB', sales: 32000, quantity: 160, category: 'Componentes' },
];

/**
 * Mock de dados de vendas por região
 */
export const REGION_SALES: RegionSales[] = [
  { region: 'Sudeste', sales: 185000, clients: 450 },
  { region: 'Sul', sales: 125000, clients: 320 },
  { region: 'Nordeste', sales: 98000, clients: 280 },
  { region: 'Norte', sales: 45000, clients: 120 },
  { region: 'Centro-Oeste', sales: 67000, clients: 180 },
];

/**
 * Mock de funil de vendas
 */
export const SALES_FUNNEL: FunnelStage[] = [
  { stage: 'Visitantes', value: 10000, percentage: 100 },
  { stage: 'Leads', value: 2500, percentage: 25 },
  { stage: 'Oportunidades', value: 800, percentage: 8 },
  { stage: 'Propostas', value: 400, percentage: 4 },
  { stage: 'Vendas', value: 200, percentage: 2 },
];

/**
 * Mock de distribuição de clientes por segmento
 */
export interface ClientSegment {
  segment: string;
  count: number;
  percentage: number;
  color: string;
}

export const CLIENT_SEGMENTS: ClientSegment[] = [
  { segment: 'Pequenas Empresas', count: 450, percentage: 36, color: '#4caf50' },
  { segment: 'Médias Empresas', count: 320, percentage: 26, color: '#2196f3' },
  { segment: 'Grandes Empresas', count: 280, percentage: 22, color: '#ff9800' },
  { segment: 'Pessoa Física', count: 198, percentage: 16, color: '#9c27b0' },
];

