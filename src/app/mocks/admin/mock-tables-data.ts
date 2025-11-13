export interface SalesTableItem {
  id: string;
  date: string;
  client: string;
  product: string;
  quantity: number;
  value: number;
  seller: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface ProductsTableItem {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  sales: number;
  revenue: number;
  status: 'available' | 'low-stock' | 'out-of-stock';
}

export interface ClientsTableItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalPurchases: number;
  totalValue: number;
  lastPurchase: string;
  status: 'active' | 'inactive' | 'vip';
}

export interface EmployeesTableItem {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  clientsCount: number;
  salesCount: number;
  totalSales: number;
  avatar?: string;
}

export const RECENT_SALES: SalesTableItem[] = [
  {
    id: '1',
    date: '2024-01-15',
    client: 'Maria Silva',
    product: 'Notebook Dell Inspiron',
    quantity: 1,
    value: 3299.99,
    seller: 'João Santos',
    status: 'completed',
  },
  {
    id: '2',
    date: '2024-01-15',
    client: 'Pedro Oliveira',
    product: 'Mouse Logitech MX Master',
    quantity: 2,
    value: 598.00,
    seller: 'Ana Costa',
    status: 'completed',
  },
  {
    id: '3',
    date: '2024-01-14',
    client: 'Carla Mendes',
    product: 'Teclado Mecânico RGB',
    quantity: 1,
    value: 449.90,
    seller: 'João Santos',
    status: 'pending',
  },
  {
    id: '4',
    date: '2024-01-14',
    client: 'Roberto Lima',
    product: 'Monitor LG 27" 4K',
    quantity: 1,
    value: 1899.00,
    seller: 'Ana Costa',
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-01-13',
    client: 'Fernanda Souza',
    product: 'Webcam Logitech C920',
    quantity: 1,
    value: 399.90,
    seller: 'Carlos Ferreira',
    status: 'completed',
  },
  {
    id: '6',
    date: '2024-01-13',
    client: 'Lucas Alves',
    product: 'SSD Samsung 1TB',
    quantity: 1,
    value: 549.99,
    seller: 'João Santos',
    status: 'cancelled',
  },
  {
    id: '7',
    date: '2024-01-12',
    client: 'Juliana Rocha',
    product: 'Headset HyperX Cloud II',
    quantity: 1,
    value: 699.90,
    seller: 'Ana Costa',
    status: 'completed',
  },
  {
    id: '8',
    date: '2024-01-12',
    client: 'Marcos Pereira',
    product: 'Placa de Vídeo RTX 4060',
    quantity: 1,
    value: 2499.99,
    seller: 'Carlos Ferreira',
    status: 'completed',
  },
  {
    id: '9',
    date: '2024-01-11',
    client: 'Patricia Gomes',
    product: 'Gabinete NZXT H510',
    quantity: 1,
    value: 599.90,
    seller: 'João Santos',
    status: 'completed',
  },
  {
    id: '10',
    date: '2024-01-11',
    client: 'Ricardo Barbosa',
    product: 'Fonte Corsair 750W',
    quantity: 1,
    value: 799.90,
    seller: 'Ana Costa',
    status: 'pending',
  },
];

export const PRODUCTS_DATA: ProductsTableItem[] = [
  {
    id: '1',
    name: 'Notebook Dell Inspiron',
    category: 'Notebooks',
    price: 3299.99,
    stock: 15,
    sales: 45,
    revenue: 148499.55,
    status: 'available',
  },
  {
    id: '2',
    name: 'Mouse Logitech MX Master',
    category: 'Periféricos',
    price: 299.00,
    stock: 3,
    sales: 120,
    revenue: 35880.00,
    status: 'low-stock',
  },
  {
    id: '3',
    name: 'Teclado Mecânico RGB',
    category: 'Periféricos',
    price: 449.90,
    stock: 0,
    sales: 85,
    revenue: 38241.50,
    status: 'out-of-stock',
  },
  {
    id: '4',
    name: 'Monitor LG 27" 4K',
    category: 'Monitores',
    price: 1899.00,
    stock: 8,
    sales: 32,
    revenue: 60768.00,
    status: 'available',
  },
  {
    id: '5',
    name: 'Webcam Logitech C920',
    category: 'Periféricos',
    price: 399.90,
    stock: 12,
    sales: 78,
    revenue: 31192.20,
    status: 'available',
  },
  {
    id: '6',
    name: 'SSD Samsung 1TB',
    category: 'Armazenamento',
    price: 549.99,
    stock: 2,
    sales: 95,
    revenue: 52249.05,
    status: 'low-stock',
  },
  {
    id: '7',
    name: 'Headset HyperX Cloud II',
    category: 'Áudio',
    price: 699.90,
    stock: 20,
    sales: 56,
    revenue: 39194.40,
    status: 'available',
  },
  {
    id: '8',
    name: 'Placa de Vídeo RTX 4060',
    category: 'Hardware',
    price: 2499.99,
    stock: 5,
    sales: 18,
    revenue: 44999.82,
    status: 'available',
  },
  {
    id: '9',
    name: 'Gabinete NZXT H510',
    category: 'Hardware',
    price: 599.90,
    stock: 10,
    sales: 42,
    revenue: 25195.80,
    status: 'available',
  },
  {
    id: '10',
    name: 'Fonte Corsair 750W',
    category: 'Hardware',
    price: 799.90,
    stock: 7,
    sales: 28,
    revenue: 22397.20,
    status: 'available',
  },
];

export const CLIENTS_DATA: ClientsTableItem[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '(11) 98765-4321',
    totalPurchases: 12,
    totalValue: 45230.50,
    lastPurchase: '2024-01-15',
    status: 'vip',
  },
  {
    id: '2',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@email.com',
    phone: '(11) 97654-3210',
    totalPurchases: 8,
    totalValue: 18950.00,
    lastPurchase: '2024-01-15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Carla Mendes',
    email: 'carla.mendes@email.com',
    phone: '(11) 96543-2109',
    totalPurchases: 5,
    totalValue: 8750.90,
    lastPurchase: '2024-01-14',
    status: 'active',
  },
  {
    id: '4',
    name: 'Roberto Lima',
    email: 'roberto.lima@email.com',
    phone: '(11) 95432-1098',
    totalPurchases: 15,
    totalValue: 52340.00,
    lastPurchase: '2024-01-14',
    status: 'vip',
  },
  {
    id: '5',
    name: 'Fernanda Souza',
    email: 'fernanda.souza@email.com',
    phone: '(11) 94321-0987',
    totalPurchases: 3,
    totalValue: 4200.80,
    lastPurchase: '2024-01-13',
    status: 'active',
  },
  {
    id: '6',
    name: 'Lucas Alves',
    email: 'lucas.alves@email.com',
    phone: '(11) 93210-9876',
    totalPurchases: 7,
    totalValue: 15230.50,
    lastPurchase: '2024-01-13',
    status: 'active',
  },
  {
    id: '7',
    name: 'Juliana Rocha',
    email: 'juliana.rocha@email.com',
    phone: '(11) 92109-8765',
    totalPurchases: 10,
    totalValue: 28950.00,
    lastPurchase: '2024-01-12',
    status: 'active',
  },
  {
    id: '8',
    name: 'Marcos Pereira',
    email: 'marcos.pereira@email.com',
    phone: '(11) 91098-7654',
    totalPurchases: 2,
    totalValue: 3500.00,
    lastPurchase: '2024-01-12',
    status: 'active',
  },
  {
    id: '9',
    name: 'Patricia Gomes',
    email: 'patricia.gomes@email.com',
    phone: '(11) 90987-6543',
    totalPurchases: 1,
    totalValue: 599.90,
    lastPurchase: '2023-12-20',
    status: 'inactive',
  },
  {
    id: '10',
    name: 'Ricardo Barbosa',
    email: 'ricardo.barbosa@email.com',
    phone: '(11) 89876-5432',
    totalPurchases: 6,
    totalValue: 12350.40,
    lastPurchase: '2024-01-11',
    status: 'active',
  },
];

export const EMPLOYEES_DATA: EmployeesTableItem[] = [
  {
    id: '1',
    name: 'João Santos',
    email: 'joao.santos@empresa.com',
    department: 'Vendas',
    position: 'Vendedor Sênior',
    clientsCount: 45,
    salesCount: 128,
    totalSales: 385420.50,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    department: 'Vendas',
    position: 'Vendedora',
    clientsCount: 38,
    salesCount: 95,
    totalSales: 289150.00,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    id: '3',
    name: 'Carlos Ferreira',
    email: 'carlos.ferreira@empresa.com',
    department: 'Vendas',
    position: 'Vendedor',
    clientsCount: 32,
    salesCount: 78,
    totalSales: 198750.90,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
  },
  {
    id: '4',
    name: 'Mariana Lima',
    email: 'mariana.lima@empresa.com',
    department: 'Vendas',
    position: 'Vendedora Júnior',
    clientsCount: 25,
    salesCount: 56,
    totalSales: 125430.00,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    id: '5',
    name: 'Roberto Alves',
    email: 'roberto.alves@empresa.com',
    department: 'Vendas',
    position: 'Vendedor',
    clientsCount: 28,
    salesCount: 62,
    totalSales: 152340.50,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
];

