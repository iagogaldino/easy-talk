import { Injectable } from '@angular/core';
import { 
  SellerProfileWidget, 
  SellerChartWidget, 
  KPIMetricsWidget,
  SalesChartWidget,
  ProductChartWidget,
  RegionChartWidget,
  FunnelChartWidget,
  SegmentChartWidget,
  SalesTableWidget,
  ProductsTableWidget,
  ClientsTableWidget,
  EmployeesTableWidget,
  TasksListWidget,
  AlertsListWidget,
  EventsListWidget,
  SystemStatusWidget,
  OperationsStatusWidget,
  AlertsDashboardWidget,
  SalesComparisonWidget,
  SellersComparisonWidget,
  ProductsComparisonWidget,
  RegionsComparisonWidget,
  WidgetsMenuWidget,
} from '../models/widget.model';
import { MOCK_SELLERS, getTopSellers, Seller } from '../../mocks/admin/mock-sellers';
import { getAllKPIs, getKPIsByCategory } from '../../mocks/admin/mock-kpis';
import { 
  getSalesByPeriod, 
  PRODUCT_SALES, 
  REGION_SALES, 
  SALES_FUNNEL,
  CLIENT_SEGMENTS,
} from '../../mocks/admin/mock-sales-data';
import {
  RECENT_SALES,
  PRODUCTS_DATA,
  CLIENTS_DATA,
  EMPLOYEES_DATA,
} from '../../mocks/admin/mock-tables-data';
import {
  TASKS_DATA,
  ALERTS_DATA,
  EVENTS_DATA,
} from '../../mocks/admin/mock-lists-data';
import {
  SYSTEM_SERVICES,
  OPERATIONS_STATUS,
  ALERTS_SUMMARY,
  RECENT_ALERTS,
} from '../../mocks/admin/mock-status-data';
import {
  getSalesComparisonData,
  SELLERS_COMPARISON_DATA,
  PRODUCTS_COMPARISON_DATA,
  REGIONS_COMPARISON_DATA,
} from '../../mocks/admin/mock-comparison-data';

@Injectable({
  providedIn: 'root',
})
export class WidgetService {
  /**
   * Lista de todos os tipos de widgets disponíveis para criação via chat
   */
  getAvailableWidgetTypes(): string[] {
    return [
      'card',
      'chart',
      'table',
      'metric',
      'list',
      'button',
      'seller-chart',
      'seller-profile',
      'kpi-metrics',
      'sales-chart',
      'product-chart',
      'region-chart',
      'funnel-chart',
      'segment-chart',
      'sales-table',
      'products-table',
      'clients-table',
      'employees-table',
      'tasks-list',
      'alerts-list',
      'events-list',
      'system-status',
      'operations-status',
      'alerts-dashboard',
      'sales-comparison',
      'sellers-comparison',
      'products-comparison',
      'regions-comparison',
      'widgets-menu',
    ];
  }

  /**
   * Cria um widget de perfil de vendedor
   */
  createSellerProfileWidget(sellerName?: string): SellerProfileWidget | null {
    let seller: Seller | undefined;

    if (sellerName) {
      // Busca o vendedor pelo nome
      seller = MOCK_SELLERS.find(
        s =>
          s.name.toLowerCase() === sellerName.toLowerCase() ||
          s.name.toLowerCase().includes(sellerName.toLowerCase()) ||
          sellerName.toLowerCase().includes(s.name.toLowerCase().split(' ')[0])
      );
    }

    // Se não encontrou, usa o top seller
    if (!seller) {
      const topSellers = getTopSellers(1);
      seller = topSellers[0];
    }

    if (!seller) {
      return null;
    }

    return {
      id: this.generateId(),
      type: 'seller-profile',
      title: 'Perfil do Vendedor',
      seller: {
        name: seller.name,
        clientsCount: seller.clientsCount,
        avatar: seller.avatar,
        email: seller.email,
        department: seller.department,
      },
    };
  }

  /**
   * Cria um widget de gráfico de vendedores
   */
  createSellerChartWidget(count: number = 8): SellerChartWidget {
    const sellers = getTopSellers(count).map(seller => ({
      name: seller.name,
      clientsCount: seller.clientsCount,
      avatar: seller.avatar,
    }));

    return {
      id: this.generateId(),
      type: 'seller-chart',
      title: 'Vendedores que Atendem Mais Clientes',
      sellers,
    };
  }

  /**
   * Busca um vendedor pelo nome
   */
  findSellerByName(name: string): Seller | null {
    const nameLower = name.toLowerCase();
    
    // Busca exata primeiro
    let seller = MOCK_SELLERS.find(s => s.name.toLowerCase() === nameLower);
    
    if (seller) {
      return seller;
    }

    // Busca por nome completo contido na mensagem
    seller = MOCK_SELLERS.find(s => 
      nameLower.includes(s.name.toLowerCase()) || 
      s.name.toLowerCase().includes(nameLower)
    );

    if (seller) {
      return seller;
    }

    // Busca por partes do nome (primeiro ou último nome)
    seller = MOCK_SELLERS.find(s => {
      const nameParts = s.name.toLowerCase().split(' ');
      return nameParts.some(part => 
        part.length > 3 && nameLower.includes(part)
      ) || nameParts.some(part => 
        part.length > 3 && part.includes(nameLower)
      );
    });

    return seller || null;
  }

  /**
   * Lista todos os vendedores disponíveis
   */
  getAllSellers(): Seller[] {
    return [...MOCK_SELLERS];
  }

  /**
   * Lista os top N vendedores
   */
  getTopSellers(count: number = 5): Seller[] {
    return getTopSellers(count);
  }

  /**
   * Cria um widget de KPIs/Métricas
   */
  createKPIMetricsWidget(category?: 'sales' | 'service' | 'all', columns: number = 2): KPIMetricsWidget {
    const metrics = category 
      ? getKPIsByCategory(category)
      : getAllKPIs();

    return {
      id: this.generateId(),
      type: 'kpi-metrics',
      title: category === 'sales' 
        ? 'KPIs de Vendas' 
        : category === 'service' 
        ? 'KPIs de Atendimento'
        : 'Métricas e KPIs',
      metrics: metrics.map(kpi => ({
        id: kpi.id,
        label: kpi.label,
        value: kpi.value,
        unit: kpi.unit,
        icon: kpi.icon,
        trend: kpi.trend,
        color: kpi.color,
      })),
      columns,
    };
  }

  /**
   * Cria um widget de gráfico de vendas por período
   */
  createSalesChartWidget(period: 'day' | 'week' | 'month' = 'day', chartType: 'line' | 'bar' = 'line', days: number = 30): SalesChartWidget {
    const salesData = getSalesByPeriod(days);
    
    return {
      id: this.generateId(),
      type: 'sales-chart',
      title: `Vendas por ${period === 'day' ? 'Dia' : period === 'week' ? 'Semana' : 'Mês'}`,
      chartType,
      period,
      data: salesData,
    };
  }

  /**
   * Cria um widget de gráfico de vendas por produto
   */
  createProductChartWidget(chartType: 'bar' | 'pie' | 'doughnut' = 'bar'): ProductChartWidget {
    return {
      id: this.generateId(),
      type: 'product-chart',
      title: 'Vendas por Produto',
      chartType,
      data: PRODUCT_SALES,
    };
  }

  /**
   * Cria um widget de gráfico de vendas por região
   */
  createRegionChartWidget(chartType: 'bar' | 'pie' | 'doughnut' = 'bar'): RegionChartWidget {
    return {
      id: this.generateId(),
      type: 'region-chart',
      title: 'Vendas por Região',
      chartType,
      data: REGION_SALES,
    };
  }

  /**
   * Cria um widget de funil de vendas
   */
  createFunnelChartWidget(): FunnelChartWidget {
    return {
      id: this.generateId(),
      type: 'funnel-chart',
      title: 'Funil de Vendas',
      data: SALES_FUNNEL,
    };
  }

  /**
   * Cria um widget de distribuição de clientes por segmento
   */
  createSegmentChartWidget(chartType: 'pie' | 'doughnut' = 'pie'): SegmentChartWidget {
    return {
      id: this.generateId(),
      type: 'segment-chart',
      title: 'Distribuição de Clientes por Segmento',
      chartType,
      data: CLIENT_SEGMENTS.map(segment => ({
        segment: segment.segment,
        count: segment.count,
        percentage: segment.percentage,
        color: segment.color,
      })),
    };
  }

  /**
   * Cria um widget de tabela de vendas recentes
   */
  createSalesTableWidget(limit: number = 10): SalesTableWidget {
    return {
      id: this.generateId(),
      type: 'sales-table',
      title: 'Vendas Recentes',
      data: RECENT_SALES.slice(0, limit),
    };
  }

  /**
   * Cria um widget de tabela de produtos
   */
  createProductsTableWidget(): ProductsTableWidget {
    return {
      id: this.generateId(),
      type: 'products-table',
      title: 'Produtos',
      data: PRODUCTS_DATA,
    };
  }

  /**
   * Cria um widget de tabela de clientes
   */
  createClientsTableWidget(): ClientsTableWidget {
    return {
      id: this.generateId(),
      type: 'clients-table',
      title: 'Clientes',
      data: CLIENTS_DATA,
    };
  }

  /**
   * Cria um widget de tabela de funcionários
   */
  createEmployeesTableWidget(): EmployeesTableWidget {
    return {
      id: this.generateId(),
      type: 'employees-table',
      title: 'Funcionários',
      data: EMPLOYEES_DATA,
    };
  }

  /**
   * Cria um widget de lista de tarefas
   */
  createTasksListWidget(status?: 'pending' | 'in-progress' | 'completed'): TasksListWidget {
    let tasks = TASKS_DATA;
    if (status) {
      tasks = TASKS_DATA.filter(task => task.status === status);
    }
    return {
      id: this.generateId(),
      type: 'tasks-list',
      title: status ? `Tarefas ${status === 'completed' ? 'Concluídas' : status === 'in-progress' ? 'Em Andamento' : 'Pendentes'}` : 'Tarefas',
      data: tasks,
    };
  }

  /**
   * Cria um widget de lista de alertas
   */
  createAlertsListWidget(unreadOnly: boolean = false): AlertsListWidget {
    let alerts = ALERTS_DATA;
    if (unreadOnly) {
      alerts = ALERTS_DATA.filter(alert => !alert.read);
    }
    return {
      id: this.generateId(),
      type: 'alerts-list',
      title: unreadOnly ? 'Alertas Não Lidos' : 'Alertas',
      data: alerts,
    };
  }

  /**
   * Cria um widget de lista de eventos recentes
   */
  createEventsListWidget(limit: number = 10): EventsListWidget {
    return {
      id: this.generateId(),
      type: 'events-list',
      title: 'Eventos Recentes',
      data: EVENTS_DATA.slice(0, limit),
    };
  }

  /**
   * Cria um widget de status do sistema
   */
  createSystemStatusWidget(): SystemStatusWidget {
    const overallStatus = SYSTEM_SERVICES.some(s => s.status === 'offline') 
      ? 'critical' 
      : SYSTEM_SERVICES.some(s => s.status === 'degraded') 
      ? 'warning' 
      : 'healthy';

    return {
      id: this.generateId(),
      type: 'system-status',
      title: 'Status do Sistema',
      status: {
        overall: overallStatus,
        services: SYSTEM_SERVICES,
        metrics: {
          cpuUsage: Math.floor(Math.random() * 30) + 40,
          memoryUsage: Math.floor(Math.random() * 20) + 50,
          diskUsage: Math.floor(Math.random() * 15) + 60,
          activeUsers: Math.floor(Math.random() * 50) + 20,
        },
      },
    };
  }

  /**
   * Cria um widget de status das operações
   */
  createOperationsStatusWidget(): OperationsStatusWidget {
    return {
      id: this.generateId(),
      type: 'operations-status',
      title: 'Status das Operações',
      operations: OPERATIONS_STATUS,
    };
  }

  /**
   * Cria um widget de dashboard de alertas
   */
  createAlertsDashboardWidget(): AlertsDashboardWidget {
    return {
      id: this.generateId(),
      type: 'alerts-dashboard',
      title: 'Dashboard de Alertas',
      summary: ALERTS_SUMMARY,
      recentAlerts: RECENT_ALERTS,
    };
  }

  /**
   * Cria um widget de comparação de vendas
   */
  createSalesComparisonWidget(period1Days: number = 7, period2Days: number = 7): SalesComparisonWidget {
    const comparisonData = getSalesComparisonData(period1Days, period2Days);
    const change = comparisonData.total1 - comparisonData.total2;
    const percentage = (change / comparisonData.total2) * 100;

    return {
      id: this.generateId(),
      type: 'sales-comparison',
      title: 'Comparativo de Vendas',
      comparison: {
        period1: {
          label: `Últimos ${period1Days} dias`,
          value: comparisonData.total1,
          data: comparisonData.period1,
        },
        period2: {
          label: `Anteriores ${period2Days} dias`,
          value: comparisonData.total2,
          data: comparisonData.period2,
        },
        change: {
          value: change,
          percentage,
          direction: change >= 0 ? 'up' : 'down',
        },
      },
    };
  }

  /**
   * Cria um widget de comparação de vendedores
   */
  createSellersComparisonWidget(): SellersComparisonWidget {
    const comparison = SELLERS_COMPARISON_DATA.map(seller => {
      const salesChange = seller.period1.sales - seller.period2.sales;
      const salesPercentage = (salesChange / seller.period2.sales) * 100;
      const clientsChange = seller.period1.clients - seller.period2.clients;
      const clientsPercentage = (clientsChange / seller.period2.clients) * 100;

      return {
        seller: seller.seller,
        avatar: seller.avatar,
        period1: seller.period1,
        period2: seller.period2,
        change: {
          salesChange,
          salesPercentage,
          clientsChange,
          clientsPercentage,
        },
      };
    });

    return {
      id: this.generateId(),
      type: 'sellers-comparison',
      title: 'Comparativo de Vendedores',
      comparison,
    };
  }

  /**
   * Cria um widget de comparação de produtos
   */
  createProductsComparisonWidget(): ProductsComparisonWidget {
    const comparison = PRODUCTS_COMPARISON_DATA.map(product => {
      const salesChange = product.period1.sales - product.period2.sales;
      const salesPercentage = (salesChange / product.period2.sales) * 100;
      const revenueChange = product.period1.revenue - product.period2.revenue;
      const revenuePercentage = (revenueChange / product.period2.revenue) * 100;

      return {
        product: product.product,
        period1: product.period1,
        period2: product.period2,
        change: {
          salesChange,
          salesPercentage,
          revenueChange,
          revenuePercentage,
        },
      };
    });

    return {
      id: this.generateId(),
      type: 'products-comparison',
      title: 'Comparativo de Produtos',
      comparison,
    };
  }

  /**
   * Cria um widget de comparação de regiões
   */
  createRegionsComparisonWidget(): RegionsComparisonWidget {
    const comparison = REGIONS_COMPARISON_DATA.map(region => {
      const salesChange = region.period1.sales - region.period2.sales;
      const salesPercentage = (salesChange / region.period2.sales) * 100;
      const clientsChange = region.period1.clients - region.period2.clients;
      const clientsPercentage = (clientsChange / region.period2.clients) * 100;

      return {
        region: region.region,
        period1: region.period1,
        period2: region.period2,
        change: {
          salesChange,
          salesPercentage,
          clientsChange,
          clientsPercentage,
        },
      };
    });

    return {
      id: this.generateId(),
      type: 'regions-comparison',
      title: 'Comparativo de Regiões',
      comparison,
    };
  }

  /**
   * Cria um widget de menu de widgets disponíveis
   */
  createWidgetsMenuWidget(): WidgetsMenuWidget {
    return {
      id: this.generateId(),
      type: 'widgets-menu',
      title: 'Painel de Controle',
      categories: [
        {
          name: 'Indicadores de Performance',
          widgets: [
            {
              id: 'kpi-metrics',
              name: 'KPIs e Métricas',
              description: 'Visualize indicadores de performance',
              icon: '📊',
              command: 'mostrar métricas e kpis',
            },
          ],
        },
        {
          name: 'Gráficos e Análises',
          widgets: [
            {
              id: 'seller-chart',
              name: 'Gráfico de Vendedores',
              description: 'Vendedores que atendem mais clientes',
              icon: '👥',
              command: 'mostrar gráfico de vendedores',
            },
            {
              id: 'sales-chart',
              name: 'Vendas por Período',
              description: 'Evolução das vendas ao longo do tempo',
              icon: '📈',
              command: 'mostrar gráfico de vendas',
            },
            {
              id: 'product-chart',
              name: 'Vendas por Produto',
              description: 'Performance de vendas por produto',
              icon: '📦',
              command: 'mostrar gráfico de produtos',
            },
            {
              id: 'region-chart',
              name: 'Vendas por Região',
              description: 'Análise de vendas por região',
              icon: '🗺️',
              command: 'mostrar gráfico de regiões',
            },
            {
              id: 'funnel-chart',
              name: 'Funil de Vendas',
              description: 'Visualize o funil de conversão',
              icon: '🔽',
              command: 'mostrar funil de vendas',
            },
            {
              id: 'segment-chart',
              name: 'Segmentação de Clientes',
              description: 'Distribuição de clientes por segmento',
              icon: '🎯',
              command: 'mostrar segmentação de clientes',
            },
          ],
        },
        {
          name: 'Tabelas e Listas',
          widgets: [
            {
              id: 'sales-table',
              name: 'Tabela de Vendas',
              description: 'Vendas recentes detalhadas',
              icon: '💰',
              command: 'mostrar tabela de vendas',
            },
            {
              id: 'products-table',
              name: 'Tabela de Produtos',
              description: 'Lista completa de produtos',
              icon: '📋',
              command: 'mostrar tabela de produtos',
            },
            {
              id: 'clients-table',
              name: 'Tabela de Clientes',
              description: 'Informações dos clientes',
              icon: '👤',
              command: 'mostrar tabela de clientes',
            },
            {
              id: 'employees-table',
              name: 'Tabela de Funcionários',
              description: 'Performance dos funcionários',
              icon: '👔',
              command: 'mostrar tabela de funcionários',
            },
            {
              id: 'tasks-list',
              name: 'Lista de Tarefas',
              description: 'Tarefas pendentes e em andamento',
              icon: '✅',
              command: 'mostrar lista de tarefas',
            },
            {
              id: 'alerts-list',
              name: 'Lista de Alertas',
              description: 'Alertas e notificações do sistema',
              icon: '🔔',
              command: 'mostrar lista de alertas',
            },
            {
              id: 'events-list',
              name: 'Lista de Eventos',
              description: 'Eventos recentes do sistema',
              icon: '📅',
              command: 'mostrar lista de eventos',
            },
          ],
        },
        {
          name: 'Status e Alertas',
          widgets: [
            {
              id: 'system-status',
              name: 'Status do Sistema',
              description: 'Monitoramento do sistema',
              icon: '⚙️',
              command: 'mostrar status do sistema',
            },
            {
              id: 'operations-status',
              name: 'Status das Operações',
              description: 'Status das operações em execução',
              icon: '🔄',
              command: 'mostrar status das operações',
            },
            {
              id: 'alerts-dashboard',
              name: 'Dashboard de Alertas',
              description: 'Visão geral de todos os alertas',
              icon: '📊',
              command: 'mostrar dashboard de alertas',
            },
          ],
        },
        {
          name: 'Comparativos',
          widgets: [
            {
              id: 'sales-comparison',
              name: 'Comparativo de Vendas',
              description: 'Compare vendas entre períodos',
              icon: '📊',
              command: 'mostrar comparativo de vendas',
            },
            {
              id: 'sellers-comparison',
              name: 'Comparativo de Vendedores',
              description: 'Compare performance dos vendedores',
              icon: '👥',
              command: 'mostrar comparativo de vendedores',
            },
            {
              id: 'products-comparison',
              name: 'Comparativo de Produtos',
              description: 'Compare performance dos produtos',
              icon: '📦',
              command: 'mostrar comparativo de produtos',
            },
            {
              id: 'regions-comparison',
              name: 'Comparativo de Regiões',
              description: 'Compare vendas por região',
              icon: '🗺️',
              command: 'mostrar comparativo de regiões',
            },
          ],
        },
      ],
    };
  }

  /**
   * Gera um ID único para widgets
   */
  private generateId(): string {
    return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

