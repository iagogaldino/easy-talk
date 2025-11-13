import { DeliveryStatus } from '../../admin/models/widget.model';

export const MOCK_DELIVERIES: DeliveryStatus[] = [
  {
    id: 'del-1',
    orderNumber: 'PED-2024-001',
    clientName: 'João Silva',
    clientPhone: '+55 11 98765-4321',
    status: 'implantado',
    statusDate: new Date('2024-11-10T10:00:00'),
    estimatedDelivery: new Date('2024-11-15T18:00:00'),
    address: 'Rua das Flores, 123 - São Paulo, SP',
  },
  {
    id: 'del-2',
    orderNumber: 'PED-2024-002',
    clientName: 'Maria Santos',
    clientPhone: '+55 11 97654-3210',
    status: 'aprovado',
    statusDate: new Date('2024-11-11T14:30:00'),
    estimatedDelivery: new Date('2024-11-16T18:00:00'),
    address: 'Av. Paulista, 1000 - São Paulo, SP',
  },
  {
    id: 'del-3',
    orderNumber: 'PED-2024-003',
    clientName: 'Pedro Oliveira',
    clientPhone: '+55 11 96543-2109',
    status: 'saiu-entrega',
    statusDate: new Date('2024-11-13T08:00:00'),
    estimatedDelivery: new Date('2024-11-13T18:00:00'),
    address: 'Rua Augusta, 500 - São Paulo, SP',
  },
  {
    id: 'del-4',
    orderNumber: 'PED-2024-004',
    clientName: 'Ana Costa',
    clientPhone: '+55 11 95432-1098',
    status: 'entregue',
    statusDate: new Date('2024-11-12T16:45:00'),
    address: 'Rua Consolação, 789 - São Paulo, SP',
  },
  {
    id: 'del-5',
    orderNumber: 'PED-2024-005',
    clientName: 'Carlos Ferreira',
    clientPhone: '+55 11 94321-0987',
    status: 'implantado',
    statusDate: new Date('2024-11-13T09:15:00'),
    estimatedDelivery: new Date('2024-11-18T18:00:00'),
    address: 'Rua Bela Cintra, 456 - São Paulo, SP',
  },
  {
    id: 'del-6',
    orderNumber: 'PED-2024-006',
    clientName: 'Fernanda Lima',
    clientPhone: '+55 11 93210-9876',
    status: 'saiu-entrega',
    statusDate: new Date('2024-11-13T07:30:00'),
    estimatedDelivery: new Date('2024-11-13T17:00:00'),
    address: 'Av. Faria Lima, 2000 - São Paulo, SP',
  },
  {
    id: 'del-7',
    orderNumber: 'PED-2024-007',
    clientName: 'Roberto Alves',
    clientPhone: '+55 11 92109-8765',
    status: 'aprovado',
    statusDate: new Date('2024-11-12T15:20:00'),
    estimatedDelivery: new Date('2024-11-17T18:00:00'),
    address: 'Rua Haddock Lobo, 300 - São Paulo, SP',
  },
  {
    id: 'del-8',
    orderNumber: 'PED-2024-008',
    clientName: 'Juliana Martins',
    clientPhone: '+55 11 91098-7654',
    status: 'entregue',
    statusDate: new Date('2024-11-11T11:30:00'),
    address: 'Rua Oscar Freire, 150 - São Paulo, SP',
  },
];

export function getDeliveriesByStatus(status?: 'all' | 'implantado' | 'aprovado' | 'saiu-entrega' | 'entregue'): DeliveryStatus[] {
  if (!status || status === 'all') {
    return MOCK_DELIVERIES;
  }
  return MOCK_DELIVERIES.filter(delivery => delivery.status === status);
}

export function getDeliveriesStats() {
  return {
    total: MOCK_DELIVERIES.length,
    implantado: MOCK_DELIVERIES.filter(d => d.status === 'implantado').length,
    aprovado: MOCK_DELIVERIES.filter(d => d.status === 'aprovado').length,
    saiuEntrega: MOCK_DELIVERIES.filter(d => d.status === 'saiu-entrega').length,
    entregue: MOCK_DELIVERIES.filter(d => d.status === 'entregue').length,
  };
}

