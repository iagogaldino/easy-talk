export interface TaskItem {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in-progress' | 'completed';
  assignee?: string;
  dueDate?: string;
  category?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  type: 'sale' | 'client' | 'product' | 'employee' | 'system';
  timestamp: string;
  icon?: string;
}

export const TASKS_DATA: TaskItem[] = [
  {
    id: '1',
    title: 'Revisar estoque de produtos',
    description: 'Verificar produtos com estoque baixo e fazer pedidos',
    priority: 'high',
    status: 'pending',
    assignee: 'João Santos',
    dueDate: '2024-01-20',
    category: 'Estoque',
  },
  {
    id: '2',
    title: 'Atualizar preços dos produtos',
    description: 'Ajustar preços conforme nova tabela de fornecedores',
    priority: 'urgent',
    status: 'in-progress',
    assignee: 'Ana Costa',
    dueDate: '2024-01-18',
    category: 'Preços',
  },
  {
    id: '3',
    title: 'Treinamento de novos vendedores',
    description: 'Conduzir treinamento sobre novos produtos',
    priority: 'medium',
    status: 'pending',
    assignee: 'Carlos Ferreira',
    dueDate: '2024-01-25',
    category: 'RH',
  },
  {
    id: '4',
    title: 'Reunião com fornecedor',
    description: 'Negociar condições de pagamento',
    priority: 'high',
    status: 'completed',
    assignee: 'Mariana Lima',
    dueDate: '2024-01-15',
    category: 'Compras',
  },
  {
    id: '5',
    title: 'Relatório mensal de vendas',
    description: 'Preparar relatório completo de vendas do mês',
    priority: 'medium',
    status: 'pending',
    assignee: 'Roberto Alves',
    dueDate: '2024-01-22',
    category: 'Relatórios',
  },
  {
    id: '6',
    title: 'Atualizar site com novos produtos',
    description: 'Adicionar fotos e descrições dos novos produtos',
    priority: 'low',
    status: 'in-progress',
    assignee: 'Ana Costa',
    dueDate: '2024-01-30',
    category: 'Marketing',
  },
  {
    id: '7',
    title: 'Verificar feedback dos clientes',
    description: 'Analisar avaliações e comentários recentes',
    priority: 'medium',
    status: 'pending',
    assignee: 'João Santos',
    dueDate: '2024-01-19',
    category: 'Atendimento',
  },
  {
    id: '8',
    title: 'Organizar evento de lançamento',
    description: 'Planejar evento para lançamento de nova linha',
    priority: 'high',
    status: 'pending',
    assignee: 'Carlos Ferreira',
    dueDate: '2024-02-05',
    category: 'Marketing',
  },
];

export const ALERTS_DATA: AlertItem[] = [
  {
    id: '1',
    title: 'Estoque Baixo',
    message: 'Mouse Logitech MX Master está com apenas 3 unidades em estoque',
    type: 'warning',
    timestamp: '2024-01-15T10:30:00',
    read: false,
    actionUrl: '/products',
  },
  {
    id: '2',
    title: 'Produto Esgotado',
    message: 'Teclado Mecânico RGB está sem estoque',
    type: 'error',
    timestamp: '2024-01-15T09:15:00',
    read: false,
    actionUrl: '/products',
  },
  {
    id: '3',
    title: 'Nova Venda Realizada',
    message: 'Venda de R$ 3.299,99 realizada por João Santos',
    type: 'success',
    timestamp: '2024-01-15T11:45:00',
    read: true,
    actionUrl: '/sales',
  },
  {
    id: '4',
    title: 'Cliente VIP',
    message: 'Maria Silva atingiu status VIP com R$ 45.230,50 em compras',
    type: 'info',
    timestamp: '2024-01-14T16:20:00',
    read: true,
    actionUrl: '/clients',
  },
  {
    id: '5',
    title: 'Meta Mensal Atingida',
    message: 'Parabéns! A meta de vendas do mês foi atingida',
    type: 'success',
    timestamp: '2024-01-14T14:00:00',
    read: true,
    actionUrl: '/dashboard',
  },
  {
    id: '6',
    title: 'Pagamento Pendente',
    message: 'Pedido #1234 aguardando confirmação de pagamento',
    type: 'warning',
    timestamp: '2024-01-13T13:30:00',
    read: false,
    actionUrl: '/orders',
  },
  {
    id: '7',
    title: 'Nova Avaliação',
    message: 'Cliente deixou uma avaliação 5 estrelas',
    type: 'info',
    timestamp: '2024-01-13T10:00:00',
    read: true,
    actionUrl: '/reviews',
  },
  {
    id: '8',
    title: 'Manutenção Programada',
    message: 'Sistema será atualizado hoje às 23h',
    type: 'info',
    timestamp: '2024-01-12T08:00:00',
    read: true,
  },
];

export const EVENTS_DATA: EventItem[] = [
  {
    id: '1',
    title: 'Nova venda realizada',
    description: 'Venda de Notebook Dell Inspiron para Maria Silva',
    type: 'sale',
    timestamp: '2024-01-15T11:45:00',
    icon: '💰',
  },
  {
    id: '2',
    title: 'Cliente VIP cadastrado',
    description: 'Roberto Lima atingiu status VIP',
    type: 'client',
    timestamp: '2024-01-14T16:20:00',
    icon: '⭐',
  },
  {
    id: '3',
    title: 'Produto adicionado ao estoque',
    description: '50 unidades de SSD Samsung 1TB adicionadas',
    type: 'product',
    timestamp: '2024-01-14T14:30:00',
    icon: '📦',
  },
  {
    id: '4',
    title: 'Novo funcionário contratado',
    description: 'Mariana Lima ingressou na equipe de vendas',
    type: 'employee',
    timestamp: '2024-01-13T09:00:00',
    icon: '👤',
  },
  {
    id: '5',
    title: 'Venda cancelada',
    description: 'Venda #6 foi cancelada pelo cliente',
    type: 'sale',
    timestamp: '2024-01-13T15:20:00',
    icon: '❌',
  },
  {
    id: '6',
    title: 'Atualização do sistema',
    description: 'Sistema atualizado para versão 2.1.0',
    type: 'system',
    timestamp: '2024-01-12T23:00:00',
    icon: '🔄',
  },
  {
    id: '7',
    title: 'Nova avaliação recebida',
    description: 'Cliente deixou avaliação 5 estrelas',
    type: 'client',
    timestamp: '2024-01-12T10:00:00',
    icon: '⭐',
  },
  {
    id: '8',
    title: 'Produto esgotado',
    description: 'Teclado Mecânico RGB está sem estoque',
    type: 'product',
    timestamp: '2024-01-11T18:00:00',
    icon: '⚠️',
  },
  {
    id: '9',
    title: 'Meta de vendas atingida',
    description: 'Meta mensal de R$ 500.000 foi atingida',
    type: 'sale',
    timestamp: '2024-01-11T12:00:00',
    icon: '🎉',
  },
  {
    id: '10',
    title: 'Reunião agendada',
    description: 'Reunião com fornecedor agendada para próxima semana',
    type: 'system',
    timestamp: '2024-01-10T14:00:00',
    icon: '📅',
  },
];

