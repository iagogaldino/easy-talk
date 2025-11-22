export type WidgetType = 'card' | 'chart' | 'table' | 'button' | 'input' | 'text' | 'list' | 'metric' | 'seller-chart' | 'seller-profile' | 'kpi-metrics' | 'sales-chart' | 'product-chart' | 'region-chart' | 'funnel-chart' | 'segment-chart' | 'sales-table' | 'products-table' | 'clients-table' | 'employees-table' | 'tasks-list' | 'alerts-list' | 'events-list' | 'system-status' | 'operations-status' | 'alerts-dashboard' | 'sales-comparison' | 'sellers-comparison' | 'products-comparison' | 'regions-comparison' | 'widgets-menu' | 'deliveries' | 'documents' | 'inactive-clients' | 'service-funnel';

export interface BaseWidget {
  id: string;
  type: WidgetType;
  title?: string;
}

export interface CardWidget extends BaseWidget {
  type: 'card';
  content: string;
  color?: 'primary' | 'accent' | 'warn' | 'default';
  actions?: Array<{
    label: string;
    action: string;
  }>;
}

export interface ChartWidget extends BaseWidget {
  type: 'chart';
  chartType: 'line' | 'bar' | 'pie' | 'doughnut';
  data: Array<{ label: string; value: number }>;
  labels?: string[];
}

export interface TableWidget extends BaseWidget {
  type: 'table';
  columns: string[];
  rows: string[][];
}

export interface ButtonWidget extends BaseWidget {
  type: 'button';
  label: string;
  action: string;
  color?: 'primary' | 'accent' | 'warn';
}

export interface InputWidget extends BaseWidget {
  type: 'input';
  placeholder?: string;
  label?: string;
  inputType?: 'text' | 'number' | 'email' | 'password';
}

export interface TextWidget extends BaseWidget {
  type: 'text';
  content: string;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
}

export interface ListWidget extends BaseWidget {
  type: 'list';
  items: string[];
  ordered?: boolean;
}

export interface MetricWidget extends BaseWidget {
  type: 'metric';
  value: string | number;
  label: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
}

export interface SellerChartWidget extends BaseWidget {
  type: 'seller-chart';
  sellers: Array<{
    name: string;
    clientsCount: number;
    avatar?: string;
  }>;
}

export interface SellerProfileWidget extends BaseWidget {
  type: 'seller-profile';
  seller: {
    name: string;
    clientsCount: number;
    avatar?: string;
    email?: string;
    department?: string;
  };
}

export interface KPIMetricsWidget extends BaseWidget {
  type: 'kpi-metrics';
  metrics: Array<{
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
  }>;
  columns?: number; // Número de colunas no grid (padrão: 2)
}

export interface SalesChartWidget extends BaseWidget {
  type: 'sales-chart';
  chartType: 'line' | 'bar';
  period: 'day' | 'week' | 'month';
  data: Array<{
    date: string;
    value: number;
  }>;
}

export interface ProductChartWidget extends BaseWidget {
  type: 'product-chart';
  chartType: 'bar' | 'pie' | 'doughnut';
  data: Array<{
    product: string;
    sales: number;
    quantity: number;
    category: string;
  }>;
}

export interface RegionChartWidget extends BaseWidget {
  type: 'region-chart';
  chartType: 'bar' | 'pie' | 'doughnut';
  data: Array<{
    region: string;
    sales: number;
    clients: number;
  }>;
}

export interface FunnelChartWidget extends BaseWidget {
  type: 'funnel-chart';
  data: Array<{
    stage: string;
    value: number;
    percentage: number;
  }>;
}

export interface SegmentChartWidget extends BaseWidget {
  type: 'segment-chart';
  chartType: 'pie' | 'doughnut';
  data: Array<{
    segment: string;
    count: number;
    percentage: number;
    color: string;
  }>;
}

export interface SalesTableWidget extends BaseWidget {
  type: 'sales-table';
  data: Array<{
    id: string;
    date: string;
    client: string;
    product: string;
    quantity: number;
    value: number;
    seller: string;
    status: 'completed' | 'pending' | 'cancelled';
  }>;
}

export interface ProductsTableWidget extends BaseWidget {
  type: 'products-table';
  data: Array<{
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    sales: number;
    revenue: number;
    status: 'available' | 'low-stock' | 'out-of-stock';
  }>;
}

export interface ClientsTableWidget extends BaseWidget {
  type: 'clients-table';
  data: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    totalPurchases: number;
    totalValue: number;
    lastPurchase: string;
    status: 'active' | 'inactive' | 'vip';
  }>;
}

export interface EmployeesTableWidget extends BaseWidget {
  type: 'employees-table';
  data: Array<{
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    clientsCount: number;
    salesCount: number;
    totalSales: number;
    avatar?: string;
  }>;
}

export interface TasksListWidget extends BaseWidget {
  type: 'tasks-list';
  data: Array<{
    id: string;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'pending' | 'in-progress' | 'completed';
    assignee?: string;
    dueDate?: string;
    category?: string;
  }>;
}

export interface AlertsListWidget extends BaseWidget {
  type: 'alerts-list';
  data: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    timestamp: string;
    read: boolean;
    actionUrl?: string;
  }>;
}

export interface EventsListWidget extends BaseWidget {
  type: 'events-list';
  data: Array<{
    id: string;
    title: string;
    description?: string;
    type: 'sale' | 'client' | 'product' | 'employee' | 'system';
    timestamp: string;
    icon?: string;
  }>;
}

// Widgets de Status e Alertas
export interface SystemStatusWidget extends BaseWidget {
  type: 'system-status';
  status: {
    overall: 'healthy' | 'warning' | 'critical';
    services: Array<{
      name: string;
      status: 'online' | 'offline' | 'degraded';
      uptime?: number;
      lastCheck?: string;
    }>;
    metrics: {
      cpuUsage: number;
      memoryUsage: number;
      diskUsage: number;
      activeUsers: number;
    };
  };
}

export interface OperationsStatusWidget extends BaseWidget {
  type: 'operations-status';
  operations: Array<{
    id: string;
    name: string;
    status: 'running' | 'completed' | 'failed' | 'pending';
    progress?: number;
    startTime?: string;
    endTime?: string;
    duration?: string;
  }>;
}

export interface AlertsDashboardWidget extends BaseWidget {
  type: 'alerts-dashboard';
  summary: {
    total: number;
    critical: number;
    warning: number;
    info: number;
    resolved: number;
  };
  recentAlerts: Array<{
    id: string;
    title: string;
    type: 'critical' | 'warning' | 'info';
    timestamp: string;
    resolved: boolean;
  }>;
}

// Widgets Comparativos
export interface SalesComparisonWidget extends BaseWidget {
  type: 'sales-comparison';
  comparison: {
    period1: {
      label: string;
      value: number;
      data: Array<{ date: string; value: number }>;
    };
    period2: {
      label: string;
      value: number;
      data: Array<{ date: string; value: number }>;
    };
    change: {
      value: number;
      percentage: number;
      direction: 'up' | 'down';
    };
  };
}

export interface SellersComparisonWidget extends BaseWidget {
  type: 'sellers-comparison';
  comparison: Array<{
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
    change: {
      salesChange: number;
      salesPercentage: number;
      clientsChange: number;
      clientsPercentage: number;
    };
  }>;
}

export interface ProductsComparisonWidget extends BaseWidget {
  type: 'products-comparison';
  comparison: Array<{
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
    change: {
      salesChange: number;
      salesPercentage: number;
      revenueChange: number;
      revenuePercentage: number;
    };
  }>;
}

export interface RegionsComparisonWidget extends BaseWidget {
  type: 'regions-comparison';
  comparison: Array<{
    region: string;
    period1: {
      sales: number;
      clients: number;
    };
    period2: {
      sales: number;
      clients: number;
    };
    change: {
      salesChange: number;
      salesPercentage: number;
      clientsChange: number;
      clientsPercentage: number;
    };
  }>;
}

export interface WidgetsMenuWidget extends BaseWidget {
  type: 'widgets-menu';
  categories: Array<{
    name: string;
    widgets: Array<{
      id: string;
      name: string;
      description?: string;
      icon?: string;
      command: string;
    }>;
  }>;
}

export interface DeliveryStatus {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  status: 'implantado' | 'aprovado' | 'saiu-entrega' | 'entregue';
  statusDate: Date;
  estimatedDelivery?: Date;
  address: string;
}

export interface DeliveriesWidget extends BaseWidget {
  type: 'deliveries';
  deliveries: DeliveryStatus[];
  filter?: 'all' | 'implantado' | 'aprovado' | 'saiu-entrega' | 'entregue';
}

export interface Document {
  id: string;
  orderNumber: string;
  clientName: string;
  clientPhone: string;
  documentType: 'boleto' | 'nota-promissoria' | 'nota-fiscal' | 'pedido';
  documentUrl: string;
  sentDate?: Date;
  status: 'pending' | 'sent' | 'viewed';
  amount?: number;
  dueDate?: Date;
}

export interface DocumentsWidget extends BaseWidget {
  type: 'documents';
  documents: Document[];
  filter?: 'all' | 'pending' | 'sent' | 'viewed';
}

export interface InactiveClient {
  id: string;
  name: string;
  phone: string;
  lastContactDate: Date;
  daysInactive: number;
  lastOrderDate?: Date;
  totalOrders: number;
  totalValue: number;
}

export interface InactiveClientsWidget extends BaseWidget {
  type: 'inactive-clients';
  clients: InactiveClient[];
  daysThreshold: number;
  autoMessageEnabled: boolean;
}

export interface ServiceFunnelStage {
  stage: 'entrada-lead' | 'lead-contato' | 'proposta-fechada' | 'proposta-perdida';
  label: string;
  count: number;
  percentage: number;
  value?: number;
}

export interface ServiceFunnelWidget extends BaseWidget {
  type: 'service-funnel';
  stages: ServiceFunnelStage[];
  period: 'day' | 'week' | 'month' | 'year';
  totalLeads: number;
  conversionRate: number;
}

export type Widget = 
  | CardWidget 
  | ChartWidget 
  | TableWidget 
  | ButtonWidget 
  | InputWidget 
  | TextWidget 
  | ListWidget 
  | MetricWidget
  | SellerChartWidget
  | SellerProfileWidget
  | KPIMetricsWidget
  | SalesChartWidget
  | ProductChartWidget
  | RegionChartWidget
  | FunnelChartWidget
  | SegmentChartWidget
  | SalesTableWidget
  | ProductsTableWidget
  | ClientsTableWidget
  | EmployeesTableWidget
  | TasksListWidget
  | AlertsListWidget
  | EventsListWidget
  | SystemStatusWidget
  | OperationsStatusWidget
  | AlertsDashboardWidget
  | SalesComparisonWidget
  | SellersComparisonWidget
  | ProductsComparisonWidget
  | RegionsComparisonWidget
  | WidgetsMenuWidget
  | DeliveriesWidget
  | DocumentsWidget
  | InactiveClientsWidget
  | ServiceFunnelWidget;

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  widget?: Widget;
  displayedContent?: string; // Conteúdo exibido progressivamente (efeito typewriter)
  isTyping?: boolean; // Indica se a mensagem está sendo digitada
  threadId?: string; // ID do thread de conversa para manter contexto
}

