import { InactiveClient } from '../../admin/models/widget.model';

export const MOCK_INACTIVE_CLIENTS: InactiveClient[] = [
  {
    id: 'client-1',
    name: 'João Silva',
    phone: '+55 11 98765-4321',
    lastContactDate: new Date('2024-10-15T10:00:00'),
    daysInactive: 29,
    lastOrderDate: new Date('2024-10-10T14:30:00'),
    totalOrders: 5,
    totalValue: 6250.00,
  },
  {
    id: 'client-2',
    name: 'Maria Santos',
    phone: '+55 11 97654-3210',
    lastContactDate: new Date('2024-10-20T15:30:00'),
    daysInactive: 24,
    lastOrderDate: new Date('2024-10-18T11:00:00'),
    totalOrders: 3,
    totalValue: 4500.00,
  },
  {
    id: 'client-3',
    name: 'Pedro Oliveira',
    phone: '+55 11 96543-2109',
    lastContactDate: new Date('2024-09-30T09:00:00'),
    daysInactive: 44,
    lastOrderDate: new Date('2024-09-25T16:45:00'),
    totalOrders: 8,
    totalValue: 12000.00,
  },
  {
    id: 'client-4',
    name: 'Ana Costa',
    phone: '+55 11 95432-1098',
    lastContactDate: new Date('2024-11-01T14:20:00'),
    daysInactive: 12,
    lastOrderDate: new Date('2024-10-28T10:15:00'),
    totalOrders: 2,
    totalValue: 3200.00,
  },
  {
    id: 'client-5',
    name: 'Carlos Ferreira',
    phone: '+55 11 94321-0987',
    lastContactDate: new Date('2024-09-15T11:30:00'),
    daysInactive: 59,
    lastOrderDate: new Date('2024-09-10T13:20:00'),
    totalOrders: 12,
    totalValue: 18500.00,
  },
  {
    id: 'client-6',
    name: 'Fernanda Lima',
    phone: '+55 11 93210-9876',
    lastContactDate: new Date('2024-10-25T16:00:00'),
    daysInactive: 19,
    lastOrderDate: new Date('2024-10-22T09:30:00'),
    totalOrders: 4,
    totalValue: 5600.00,
  },
  {
    id: 'client-7',
    name: 'Roberto Alves',
    phone: '+55 11 92109-8765',
    lastContactDate: new Date('2024-08-20T10:00:00'),
    daysInactive: 85,
    lastOrderDate: new Date('2024-08-15T14:00:00'),
    totalOrders: 6,
    totalValue: 9800.00,
  },
  {
    id: 'client-8',
    name: 'Juliana Martins',
    phone: '+55 11 91098-7654',
    lastContactDate: new Date('2024-11-05T13:45:00'),
    daysInactive: 8,
    lastOrderDate: new Date('2024-11-02T15:20:00'),
    totalOrders: 7,
    totalValue: 11200.00,
  },
];

export function getInactiveClientsByDays(daysThreshold: number): InactiveClient[] {
  return MOCK_INACTIVE_CLIENTS.filter(client => client.daysInactive >= daysThreshold);
}

export function getInactiveClientsStats(daysThreshold: number = 30) {
  const clients = getInactiveClientsByDays(daysThreshold);
  return {
    total: clients.length,
    totalValue: clients.reduce((sum, client) => sum + client.totalValue, 0),
    averageDaysInactive: clients.length > 0 
      ? clients.reduce((sum, client) => sum + client.daysInactive, 0) / clients.length 
      : 0,
    totalOrders: clients.reduce((sum, client) => sum + client.totalOrders, 0),
  };
}

