import { Injectable } from '@angular/core';
import { Widget } from '../models/widget.model';
import { WidgetService } from './widget.service';

/**
 * Interface para definição de uma tool (função) que a IA pode executar
 */
export interface WidgetTool {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required?: string[];
  };
}

/**
 * Interface para a resposta de execução de uma tool
 */
export interface ToolExecutionResult {
  success: boolean;
  widget?: Widget;
  error?: string;
  message?: string;
}

/**
 * Serviço que gerencia as tools (funções) que a IA pode executar para criar widgets
 * Este serviço permite que a IA decida qual widget abrir através de function calling
 */
@Injectable({
  providedIn: 'root',
})
export class WidgetToolsService {
  private tools: WidgetTool[] = [];

  constructor(private widgetService: WidgetService) {
    this.registerTools();
  }

  /**
   * Retorna todas as tools disponíveis para a IA
   */
  getAvailableTools(): WidgetTool[] {
    return [...this.tools];
  }

  /**
   * Retorna as tools no formato OpenAI Function Calling
   */
  getToolsForOpenAI(): Array<{
    type: 'function';
    function: WidgetTool;
  }> {
    return this.tools.map(tool => ({
      type: 'function' as const,
      function: tool,
    }));
  }

  /**
   * Executa uma tool baseada no nome e parâmetros fornecidos
   */
  executeTool(toolName: string, parameters: Record<string, any>): ToolExecutionResult {
    try {
      let widget: Widget | null = null;

      switch (toolName) {
        case 'create_kpi_metrics_widget':
          widget = this.widgetService.createKPIMetricsWidget(
            parameters['category'],
            parameters['columns']
          );
          break;

        case 'create_sales_chart_widget':
          widget = this.widgetService.createSalesChartWidget(
            parameters['period'] || 'day',
            parameters['chartType'] || 'line',
            parameters['days'] || 30
          );
          break;

        case 'create_product_chart_widget':
          widget = this.widgetService.createProductChartWidget(
            parameters['chartType'] || 'bar'
          );
          break;

        case 'create_region_chart_widget':
          widget = this.widgetService.createRegionChartWidget(
            parameters['chartType'] || 'bar'
          );
          break;

        case 'create_funnel_chart_widget':
          widget = this.widgetService.createFunnelChartWidget();
          break;

        case 'create_segment_chart_widget':
          widget = this.widgetService.createSegmentChartWidget(
            parameters['chartType'] || 'pie'
          );
          break;

        case 'create_seller_chart_widget':
          widget = this.widgetService.createSellerChartWidget(
            parameters['count'] || 8
          );
          break;

        case 'create_seller_profile_widget':
          widget = this.widgetService.createSellerProfileWidget(
            parameters['sellerName']
          );
          break;

        case 'create_sales_table_widget':
          widget = this.widgetService.createSalesTableWidget(
            parameters['limit'] || 10
          );
          break;

        case 'create_products_table_widget':
          widget = this.widgetService.createProductsTableWidget();
          break;

        case 'create_clients_table_widget':
          widget = this.widgetService.createClientsTableWidget();
          break;

        case 'create_employees_table_widget':
          widget = this.widgetService.createEmployeesTableWidget();
          break;

        case 'create_tasks_list_widget':
          widget = this.widgetService.createTasksListWidget(
            parameters['status']
          );
          break;

        case 'create_alerts_list_widget':
          widget = this.widgetService.createAlertsListWidget(
            parameters['unreadOnly'] || false
          );
          break;

        case 'create_events_list_widget':
          widget = this.widgetService.createEventsListWidget(
            parameters['limit'] || 10
          );
          break;

        case 'create_system_status_widget':
          widget = this.widgetService.createSystemStatusWidget();
          break;

        case 'create_operations_status_widget':
          widget = this.widgetService.createOperationsStatusWidget();
          break;

        case 'create_alerts_dashboard_widget':
          widget = this.widgetService.createAlertsDashboardWidget();
          break;

        case 'create_sales_comparison_widget':
          widget = this.widgetService.createSalesComparisonWidget(
            parameters['period1Days'] || 7,
            parameters['period2Days'] || 7
          );
          break;

        case 'create_sellers_comparison_widget':
          widget = this.widgetService.createSellersComparisonWidget();
          break;

        case 'create_products_comparison_widget':
          widget = this.widgetService.createProductsComparisonWidget();
          break;

        case 'create_regions_comparison_widget':
          widget = this.widgetService.createRegionsComparisonWidget();
          break;

        case 'create_deliveries_widget':
          widget = this.widgetService.createDeliveriesWidget(
            parameters['filter'] || 'all'
          );
          break;

        case 'create_documents_widget':
          widget = this.widgetService.createDocumentsWidget(
            parameters['filter'] || 'all'
          );
          break;

        case 'create_inactive_clients_widget':
          widget = this.widgetService.createInactiveClientsWidget(
            parameters['daysThreshold'] || 30,
            parameters['autoMessageEnabled'] !== false
          );
          break;

        case 'create_service_funnel_widget':
          widget = this.widgetService.createServiceFunnelWidget(
            parameters['period'] || 'month'
          );
          break;

        case 'create_widgets_menu_widget':
          widget = this.widgetService.createWidgetsMenuWidget();
          break;

        default:
          return {
            success: false,
            error: `Tool desconhecida: ${toolName}`,
          };
      }

      if (!widget) {
        return {
          success: false,
          error: `Falha ao criar widget: ${toolName}`,
        };
      }

      return {
        success: true,
        widget,
        message: `Widget ${widget.type} criado com sucesso`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || `Erro ao executar tool: ${toolName}`,
      };
    }
  }

  /**
   * Registra todas as tools disponíveis
   */
  private registerTools(): void {
    // KPIs e Métricas
    this.tools.push({
      name: 'create_kpi_metrics_widget',
      description: 'Cria um widget de KPIs e métricas de performance. Use quando o usuário pedir métricas, KPIs, indicadores ou dashboard.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'Categoria das métricas: vendas, atendimento ou todas',
            enum: ['sales', 'service', 'all'],
          },
          columns: {
            type: 'number',
            description: 'Número de colunas no grid (padrão: 2)',
          },
        },
        required: [],
      },
    });

    // Gráfico de Vendas
    this.tools.push({
      name: 'create_sales_chart_widget',
      description: 'Cria um gráfico de vendas por período. Use quando o usuário pedir gráfico de vendas, evolução de vendas ou vendas ao longo do tempo.',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            description: 'Período de agregação: dia, semana ou mês',
            enum: ['day', 'week', 'month'],
          },
          chartType: {
            type: 'string',
            description: 'Tipo de gráfico: linha ou barra',
            enum: ['line', 'bar'],
          },
          days: {
            type: 'number',
            description: 'Número de dias para exibir (padrão: 30)',
          },
        },
        required: [],
      },
    });

    // Gráfico de Produtos
    this.tools.push({
      name: 'create_product_chart_widget',
      description: 'Cria um gráfico de vendas por produto. Use quando o usuário pedir gráfico de produtos ou performance de produtos.',
      parameters: {
        type: 'object',
        properties: {
          chartType: {
            type: 'string',
            description: 'Tipo de gráfico: barra, pizza ou rosquinha',
            enum: ['bar', 'pie', 'doughnut'],
          },
        },
        required: [],
      },
    });

    // Gráfico de Regiões
    this.tools.push({
      name: 'create_region_chart_widget',
      description: 'Cria um gráfico de vendas por região. Use quando o usuário pedir gráfico de regiões ou vendas por região.',
      parameters: {
        type: 'object',
        properties: {
          chartType: {
            type: 'string',
            description: 'Tipo de gráfico: barra, pizza ou rosquinha',
            enum: ['bar', 'pie', 'doughnut'],
          },
        },
        required: [],
      },
    });

    // Funil de Vendas
    this.tools.push({
      name: 'create_funnel_chart_widget',
      description: 'Cria um gráfico de funil de vendas. Use quando o usuário pedir funil de vendas ou conversão.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Segmentação de Clientes
    this.tools.push({
      name: 'create_segment_chart_widget',
      description: 'Cria um gráfico de segmentação de clientes. Use quando o usuário pedir segmentação, distribuição de clientes ou clientes por segmento.',
      parameters: {
        type: 'object',
        properties: {
          chartType: {
            type: 'string',
            description: 'Tipo de gráfico: pizza ou rosquinha',
            enum: ['pie', 'doughnut'],
          },
        },
        required: [],
      },
    });

    // Gráfico de Vendedores
    this.tools.push({
      name: 'create_seller_chart_widget',
      description: 'Cria um gráfico de vendedores que atendem mais clientes. Use quando o usuário pedir gráfico de vendedores ou vendedores que atendem mais.',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Número de vendedores para exibir (padrão: 8)',
          },
        },
        required: [],
      },
    });

    // Perfil de Vendedor
    this.tools.push({
      name: 'create_seller_profile_widget',
      description: 'Cria um widget de perfil de vendedor específico. Use quando o usuário pedir perfil de vendedor, informações de vendedor ou detalhes de funcionário.',
      parameters: {
        type: 'object',
        properties: {
          sellerName: {
            type: 'string',
            description: 'Nome do vendedor (opcional, se não fornecido mostra o top vendedor)',
          },
        },
        required: [],
      },
    });

    // Tabela de Vendas
    this.tools.push({
      name: 'create_sales_table_widget',
      description: 'Cria uma tabela com vendas recentes. Use quando o usuário pedir tabela de vendas ou vendas detalhadas.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Número de registros para exibir (padrão: 10)',
          },
        },
        required: [],
      },
    });

    // Tabela de Produtos
    this.tools.push({
      name: 'create_products_table_widget',
      description: 'Cria uma tabela com todos os produtos. Use quando o usuário pedir tabela de produtos ou lista de produtos.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Tabela de Clientes
    this.tools.push({
      name: 'create_clients_table_widget',
      description: 'Cria uma tabela com todos os clientes. Use quando o usuário pedir tabela de clientes ou lista de clientes.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Tabela de Funcionários
    this.tools.push({
      name: 'create_employees_table_widget',
      description: 'Cria uma tabela com todos os funcionários. Use quando o usuário pedir tabela de funcionários ou lista de funcionários.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Lista de Tarefas
    this.tools.push({
      name: 'create_tasks_list_widget',
      description: 'Cria uma lista de tarefas. Use quando o usuário pedir lista de tarefas, tarefas pendentes ou tarefas em andamento.',
      parameters: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            description: 'Filtrar por status: pendentes, em andamento ou concluídas',
            enum: ['pending', 'in-progress', 'completed'],
          },
        },
        required: [],
      },
    });

    // Lista de Alertas
    this.tools.push({
      name: 'create_alerts_list_widget',
      description: 'Cria uma lista de alertas do sistema. Use quando o usuário pedir lista de alertas ou notificações.',
      parameters: {
        type: 'object',
        properties: {
          unreadOnly: {
            type: 'boolean',
            description: 'Mostrar apenas alertas não lidos (padrão: false)',
          },
        },
        required: [],
      },
    });

    // Lista de Eventos
    this.tools.push({
      name: 'create_events_list_widget',
      description: 'Cria uma lista de eventos recentes do sistema. Use quando o usuário pedir lista de eventos ou eventos recentes.',
      parameters: {
        type: 'object',
        properties: {
          limit: {
            type: 'number',
            description: 'Número de eventos para exibir (padrão: 10)',
          },
        },
        required: [],
      },
    });

    // Status do Sistema
    this.tools.push({
      name: 'create_system_status_widget',
      description: 'Cria um widget de status do sistema. Use quando o usuário pedir status do sistema ou monitoramento.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Status das Operações
    this.tools.push({
      name: 'create_operations_status_widget',
      description: 'Cria um widget de status das operações. Use quando o usuário pedir status das operações.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Dashboard de Alertas
    this.tools.push({
      name: 'create_alerts_dashboard_widget',
      description: 'Cria um dashboard de alertas. Use quando o usuário pedir dashboard de alertas ou visão geral de alertas.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Comparativo de Vendas
    this.tools.push({
      name: 'create_sales_comparison_widget',
      description: 'Cria um widget comparativo de vendas entre períodos. Use quando o usuário pedir comparativo de vendas ou comparação de períodos.',
      parameters: {
        type: 'object',
        properties: {
          period1Days: {
            type: 'number',
            description: 'Número de dias do período atual (padrão: 7)',
          },
          period2Days: {
            type: 'number',
            description: 'Número de dias do período anterior (padrão: 7)',
          },
        },
        required: [],
      },
    });

    // Comparativo de Vendedores
    this.tools.push({
      name: 'create_sellers_comparison_widget',
      description: 'Cria um widget comparativo de vendedores. Use quando o usuário pedir comparativo de vendedores ou comparação de performance.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Comparativo de Produtos
    this.tools.push({
      name: 'create_products_comparison_widget',
      description: 'Cria um widget comparativo de produtos. Use quando o usuário pedir comparativo de produtos.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Comparativo de Regiões
    this.tools.push({
      name: 'create_regions_comparison_widget',
      description: 'Cria um widget comparativo de regiões. Use quando o usuário pedir comparativo de regiões.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });

    // Entregas
    this.tools.push({
      name: 'create_deliveries_widget',
      description: 'Cria um widget de status de entregas. Use quando o usuário pedir entregas, status de pedidos ou acompanhamento de entregas.',
      parameters: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description: 'Filtrar por status: todas, implantado, aprovado, saiu-entrega ou entregue',
            enum: ['all', 'implantado', 'aprovado', 'saiu-entrega', 'entregue'],
          },
        },
        required: [],
      },
    });

    // Documentos
    this.tools.push({
      name: 'create_documents_widget',
      description: 'Cria um widget de documentos para envio (boletos, notas fiscais, etc). Use quando o usuário pedir documentos, boletos ou notas fiscais.',
      parameters: {
        type: 'object',
        properties: {
          filter: {
            type: 'string',
            description: 'Filtrar por status: todas, pendentes, enviados ou visualizados',
            enum: ['all', 'pending', 'sent', 'viewed'],
          },
        },
        required: [],
      },
    });

    // Clientes Inativos
    this.tools.push({
      name: 'create_inactive_clients_widget',
      description: 'Cria um widget de clientes inativos. Use quando o usuário pedir clientes inativos ou clientes sem contato.',
      parameters: {
        type: 'object',
        properties: {
          daysThreshold: {
            type: 'number',
            description: 'Número de dias de inatividade (padrão: 30)',
          },
          autoMessageEnabled: {
            type: 'boolean',
            description: 'Habilitar mensagem automática (padrão: true)',
          },
        },
        required: [],
      },
    });

    // Funil de Atendimento
    this.tools.push({
      name: 'create_service_funnel_widget',
      description: 'Cria um widget de funil de atendimento. Use quando o usuário pedir funil de atendimento, funil de leads ou funil de propostas.',
      parameters: {
        type: 'object',
        properties: {
          period: {
            type: 'string',
            description: 'Período: dia, semana, mês ou ano',
            enum: ['day', 'week', 'month', 'year'],
          },
        },
        required: [],
      },
    });

    // Menu de Widgets
    this.tools.push({
      name: 'create_widgets_menu_widget',
      description: 'Cria um menu com todos os widgets disponíveis. Use quando o usuário pedir menu de widgets, widgets disponíveis ou painel de controle.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    });
  }
}

