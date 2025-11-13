import { ServiceFunnelStage } from '../../admin/models/widget.model';

export function getServiceFunnelData(_period: 'day' | 'week' | 'month' | 'year' = 'month'): {
  stages: ServiceFunnelStage[];
  totalLeads: number;
  conversionRate: number;
} {
  const stages: ServiceFunnelStage[] = [
    {
      stage: 'entrada-lead',
      label: 'Entrada de Lead',
      count: 150,
      percentage: 100,
      value: 0,
    },
    {
      stage: 'lead-contato',
      label: 'Lead em Contato',
      count: 120,
      percentage: 80,
      value: 0,
    },
    {
      stage: 'proposta-fechada',
      label: 'Proposta Fechada',
      count: 45,
      percentage: 30,
      value: 67500.00,
    },
    {
      stage: 'proposta-perdida',
      label: 'Proposta Perdida',
      count: 75,
      percentage: 50,
      value: 0,
    },
  ];

  const totalLeads = stages[0].count;
  const closedProposals = stages.find(s => s.stage === 'proposta-fechada')?.count || 0;
  const contactedLeads = stages.find(s => s.stage === 'lead-contato')?.count || 0;
  const conversionRate = contactedLeads > 0 ? (closedProposals / contactedLeads) * 100 : 0;

  return {
    stages,
    totalLeads,
    conversionRate: Math.round(conversionRate * 100) / 100,
  };
}

export function getServiceFunnelByPeriod(period: 'day' | 'week' | 'month' | 'year') {
  // Ajusta os valores baseado no período
  const baseData = getServiceFunnelData('month');
  
  const multipliers: Record<string, number> = {
    day: 0.033, // ~1/30
    week: 0.25, // ~1/4
    month: 1,
    year: 12,
  };

  const multiplier = multipliers[period] || 1;

  return {
    stages: baseData.stages.map(stage => ({
      ...stage,
      count: Math.round(stage.count * multiplier),
      percentage: stage.percentage, // Mantém a porcentagem
    })),
    totalLeads: Math.round(baseData.totalLeads * multiplier),
    conversionRate: baseData.conversionRate,
  };
}

