export interface Seller {
  name: string;
  clientsCount: number;
  email?: string;
  avatar?: string;
  department?: string;
}

/**
 * Mock de dados de vendedores para testes e desenvolvimento
 * Em produção, esses dados viriam de uma API
 */
export const MOCK_SELLERS: Seller[] = [
  {
    name: 'João Silva',
    clientsCount: 45,
    email: 'joao.silva@empresa.com',
    department: 'Vendas',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Maria Santos',
    clientsCount: 38,
    email: 'maria.santos@empresa.com',
    department: 'Vendas',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Pedro Oliveira',
    clientsCount: 52,
    email: 'pedro.oliveira@empresa.com',
    department: 'Vendas',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Ana Costa',
    clientsCount: 29,
    email: 'ana.costa@empresa.com',
    department: 'Atendimento',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Carlos Souza',
    clientsCount: 41,
    email: 'carlos.souza@empresa.com',
    department: 'Vendas',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Juliana Ferreira',
    clientsCount: 35,
    email: 'juliana.ferreira@empresa.com',
    department: 'Atendimento',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Roberto Alves',
    clientsCount: 48,
    email: 'roberto.alves@empresa.com',
    department: 'Vendas',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=faces',
  },
  {
    name: 'Fernanda Lima',
    clientsCount: 33,
    email: 'fernanda.lima@empresa.com',
    department: 'Atendimento',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=faces',
  },
];

/**
 * Retorna os vendedores ordenados por quantidade de clientes (maior para menor)
 */
export function getSellersSortedByClients(): Seller[] {
  return [...MOCK_SELLERS].sort((a, b) => b.clientsCount - a.clientsCount);
}

/**
 * Retorna os top N vendedores por quantidade de clientes
 */
export function getTopSellers(count: number = 5): Seller[] {
  return getSellersSortedByClients().slice(0, count);
}

/**
 * Retorna estatísticas dos vendedores
 */
export function getSellersStats() {
  const totalClients = MOCK_SELLERS.reduce((sum, seller) => sum + seller.clientsCount, 0);
  const averageClients = totalClients / MOCK_SELLERS.length;
  const topSeller = getSellersSortedByClients()[0];

  return {
    totalSellers: MOCK_SELLERS.length,
    totalClients,
    averageClients: Math.round(averageClients * 10) / 10,
    topSeller,
  };
}

