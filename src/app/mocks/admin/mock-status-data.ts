export interface SystemService {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  uptime?: number;
  lastCheck?: string;
}

export interface OperationStatus {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'failed' | 'pending';
  progress?: number;
  startTime?: string;
  endTime?: string;
  duration?: string;
}

export const SYSTEM_SERVICES: SystemService[] = [
  {
    name: 'API Principal',
    status: 'online',
    uptime: 99.9,
    lastCheck: '2024-01-15T10:30:00',
  },
  {
    name: 'Banco de Dados',
    status: 'online',
    uptime: 99.8,
    lastCheck: '2024-01-15T10:30:00',
  },
  {
    name: 'Cache Redis',
    status: 'online',
    uptime: 99.7,
    lastCheck: '2024-01-15T10:30:00',
  },
  {
    name: 'Serviço de Email',
    status: 'degraded',
    uptime: 95.2,
    lastCheck: '2024-01-15T10:30:00',
  },
  {
    name: 'Integração Pagamentos',
    status: 'online',
    uptime: 99.5,
    lastCheck: '2024-01-15T10:30:00',
  },
];

export const OPERATIONS_STATUS: OperationStatus[] = [
  {
    id: '1',
    name: 'Processamento de Vendas',
    status: 'running',
    progress: 75,
    startTime: '2024-01-15T09:00:00',
    duration: '1h 30m',
  },
  {
    id: '2',
    name: 'Backup Diário',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-15T02:00:00',
    endTime: '2024-01-15T02:30:00',
    duration: '30m',
  },
  {
    id: '3',
    name: 'Sincronização de Estoque',
    status: 'completed',
    progress: 100,
    startTime: '2024-01-15T08:00:00',
    endTime: '2024-01-15T08:15:00',
    duration: '15m',
  },
  {
    id: '4',
    name: 'Relatório Mensal',
    status: 'pending',
    progress: 0,
  },
  {
    id: '5',
    name: 'Atualização de Preços',
    status: 'failed',
    progress: 45,
    startTime: '2024-01-15T07:00:00',
    endTime: '2024-01-15T07:20:00',
    duration: '20m',
  },
];

export const ALERTS_SUMMARY = {
  total: 24,
  critical: 2,
  warning: 8,
  info: 12,
  resolved: 2,
};

export const RECENT_ALERTS = [
  {
    id: '1',
    title: 'Estoque Crítico',
    type: 'critical' as const,
    timestamp: '2024-01-15T10:30:00',
    resolved: false,
  },
  {
    id: '2',
    title: 'Serviço de Email Degradado',
    type: 'warning' as const,
    timestamp: '2024-01-15T09:15:00',
    resolved: false,
  },
  {
    id: '3',
    title: 'Nova Venda Realizada',
    type: 'info' as const,
    timestamp: '2024-01-15T11:45:00',
    resolved: true,
  },
  {
    id: '4',
    title: 'Backup Concluído',
    type: 'info' as const,
    timestamp: '2024-01-15T02:30:00',
    resolved: true,
  },
];

