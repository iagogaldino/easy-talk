export interface KPIMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

/**
 * Mock de dados de KPIs para testes e desenvolvimento
 * Em produção, esses dados viriam de uma API
 */
export const MOCK_KPIS: KPIMetric[] = [
  {
    id: 'total-sales',
    label: 'Total de Vendas',
    value: 125430,
    unit: 'R$',
    icon: 'attach_money',
    trend: {
      value: 12.5,
      direction: 'up',
    },
    color: 'success',
  },
  {
    id: 'average-ticket',
    label: 'Ticket Médio',
    value: 342.50,
    unit: 'R$',
    icon: 'shopping_cart',
    trend: {
      value: 5.2,
      direction: 'up',
    },
    color: 'primary',
  },
  {
    id: 'conversion-rate',
    label: 'Taxa de Conversão',
    value: 23.8,
    unit: '%',
    icon: 'trending_up',
    trend: {
      value: 2.1,
      direction: 'up',
    },
    color: 'success',
  },
  {
    id: 'nps',
    label: 'NPS',
    value: 72,
    unit: '',
    icon: 'sentiment_satisfied',
    trend: {
      value: 8,
      direction: 'up',
    },
    color: 'success',
  },
  {
    id: 'avg-response-time',
    label: 'Tempo Médio de Atendimento',
    value: 4.2,
    unit: 'min',
    icon: 'access_time',
    trend: {
      value: 15.3,
      direction: 'down',
    },
    color: 'success',
  },
  {
    id: 'resolution-rate',
    label: 'Taxa de Resolução',
    value: 87.5,
    unit: '%',
    icon: 'check_circle',
    trend: {
      value: 3.2,
      direction: 'up',
    },
    color: 'success',
  },
  {
    id: 'active-clients',
    label: 'Clientes Ativos',
    value: 1248,
    unit: '',
    icon: 'people',
    trend: {
      value: 8.5,
      direction: 'up',
    },
    color: 'info',
  },
  {
    id: 'pending-tickets',
    label: 'Chamados Pendentes',
    value: 23,
    unit: '',
    icon: 'pending_actions',
    trend: {
      value: 12.0,
      direction: 'down',
    },
    color: 'warning',
  },
];

/**
 * Retorna todas as métricas de KPI disponíveis
 */
export function getAllKPIs(): KPIMetric[] {
  return [...MOCK_KPIS];
}

/**
 * Retorna KPIs por categoria
 */
export function getKPIsByCategory(category: 'sales' | 'service' | 'all'): KPIMetric[] {
  if (category === 'all') {
    return getAllKPIs();
  }

  const salesKPIs = ['total-sales', 'average-ticket', 'conversion-rate', 'active-clients'];
  const serviceKPIs = ['nps', 'avg-response-time', 'resolution-rate', 'pending-tickets'];

  const ids = category === 'sales' ? salesKPIs : serviceKPIs;
  return MOCK_KPIS.filter(kpi => ids.includes(kpi.id));
}

