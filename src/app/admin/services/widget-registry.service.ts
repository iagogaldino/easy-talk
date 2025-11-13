import { Injectable } from '@angular/core';
import { Widget } from '../models/widget.model';
import { WidgetService } from './widget.service';

export interface WidgetCommand {
  /**
   * Palavras-chave que devem estar presentes na mensagem
   */
  keywords: string[];
  
  /**
   * Função que cria o widget quando os comandos são detectados
   */
  createWidget: (message: string, widgetService: WidgetService) => Widget | null;
  
  /**
   * Prioridade: quanto maior, mais prioritário (padrão: 0)
   * Útil quando múltiplos comandos podem corresponder à mesma mensagem
   */
  priority?: number;
  
  /**
   * Se true, todas as keywords devem estar presentes (AND)
   * Se false, apenas uma precisa estar presente (OR) - padrão
   */
  requireAll?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class WidgetRegistryService {
  private commands: WidgetCommand[] = [];

  constructor(private widgetService: WidgetService) {
    this.registerDefaultCommands();
  }

  /**
   * Registra um novo comando de widget
   */
  registerCommand(command: WidgetCommand): void {
    this.commands.push(command);
    // Ordena por prioridade (maior primeiro)
    this.commands.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Interpreta uma mensagem e retorna o widget correspondente
   */
  interpretMessage(message: string): Widget | null {
    const lowerMessage = message.toLowerCase().trim();

    // Verifica cada comando registrado
    for (const command of this.commands) {
      const matches = command.requireAll
        ? command.keywords.every(keyword => lowerMessage.includes(keyword))
        : command.keywords.some(keyword => lowerMessage.includes(keyword));

      if (matches) {
        const widget = command.createWidget(message, this.widgetService);
        if (widget) {
          return widget;
        }
      }
    }

    return null;
  }

  /**
   * Registra todos os comandos padrão do sistema
   */
  private registerDefaultCommands(): void {
    // Comandos para gráfico de vendedores (alta prioridade)
    this.registerCommand({
      keywords: ['vendedor', 'vendedores', 'atendem', 'clientes'],
      priority: 10,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('perfil') || lowerMessage.includes('mostrar') || 
            lowerMessage.includes('abrir') || lowerMessage.includes('ver')) {
          return service.createSellerProfileWidget(message) || null;
        }
        return service.createSellerChartWidget(8);
      },
    });

    // Comando direto para perfil de vendedor
    this.registerCommand({
      keywords: ['perfil', 'vendedor', 'funcionário', 'funcionario'],
      priority: 15,
      requireAll: false,
      createWidget: (message, service) => {
        return service.createSellerProfileWidget(message) || null;
      },
    });

    // KPIs e métricas
    this.registerCommand({
      keywords: ['kpi', 'dashboard', 'indicador', 'métrica', 'metrica', 'metricas', 'métricas'],
      priority: 10,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        let category: 'sales' | 'service' | 'all' | undefined;
        if (lowerMessage.includes('venda')) category = 'sales';
        else if (lowerMessage.includes('atendimento') || lowerMessage.includes('serviço')) category = 'service';
        return service.createKPIMetricsWidget(category);
      },
    });

    // Gráficos de vendas por período
    this.registerCommand({
      keywords: ['vendas', 'período', 'periodo', 'tempo'],
      priority: 8,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        let period: 'day' | 'week' | 'month' = 'day';
        let chartType: 'line' | 'bar' = 'line';
        
        if (lowerMessage.includes('semana')) period = 'week';
        else if (lowerMessage.includes('mês') || lowerMessage.includes('mes')) period = 'month';
        
        if (lowerMessage.includes('barra') || lowerMessage.includes('bar')) chartType = 'bar';
        
        const daysMatch = message.match(/(\d+)\s*dias?/i);
        const days = daysMatch ? parseInt(daysMatch[1], 10) : 30;
        
        return service.createSalesChartWidget(period, chartType, days);
      },
    });

    // Gráfico de produtos
    this.registerCommand({
      keywords: ['produto', 'produtos', 'venda'],
      priority: 8,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        let chartType: 'bar' | 'pie' | 'doughnut' = 'bar';
        if (lowerMessage.includes('pizza') || lowerMessage.includes('pie')) chartType = 'pie';
        else if (lowerMessage.includes('rosquinha') || lowerMessage.includes('doughnut')) chartType = 'doughnut';
        return service.createProductChartWidget(chartType);
      },
    });

    // Gráfico de regiões
    this.registerCommand({
      keywords: ['região', 'regiao', 'regional'],
      priority: 8,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        let chartType: 'bar' | 'pie' | 'doughnut' = 'bar';
        if (lowerMessage.includes('pizza') || lowerMessage.includes('pie')) chartType = 'pie';
        else if (lowerMessage.includes('rosquinha') || lowerMessage.includes('doughnut')) chartType = 'doughnut';
        return service.createRegionChartWidget(chartType);
      },
    });

    // Funil de vendas
    this.registerCommand({
      keywords: ['funil'],
      priority: 8,
      createWidget: (_message, service) => service.createFunnelChartWidget(),
    });

    // Segmentação de clientes
    this.registerCommand({
      keywords: ['segmento', 'cliente', 'distribuição', 'distribuicao'],
      priority: 8,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        let chartType: 'pie' | 'doughnut' = 'pie';
        if (lowerMessage.includes('rosquinha') || lowerMessage.includes('doughnut')) chartType = 'doughnut';
        return service.createSegmentChartWidget(chartType);
      },
    });

    // Tabelas
    this.registerCommand({
      keywords: ['tabela', 'table', 'venda', 'vendas'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createSalesTableWidget(10),
    });

    this.registerCommand({
      keywords: ['tabela', 'table', 'produto', 'produtos'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createProductsTableWidget(),
    });

    this.registerCommand({
      keywords: ['tabela', 'table', 'cliente', 'clientes'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createClientsTableWidget(),
    });

    this.registerCommand({
      keywords: ['tabela', 'table', 'funcionário', 'funcionario', 'funcionários', 'funcionarios'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createEmployeesTableWidget(),
    });

    // Listas
    this.registerCommand({
      keywords: ['lista', 'list', 'tarefa', 'tarefas', 'task'],
      priority: 7,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        let status: 'pending' | 'in-progress' | 'completed' | undefined;
        if (lowerMessage.includes('pendente')) status = 'pending';
        else if (lowerMessage.includes('andamento') || lowerMessage.includes('progresso')) status = 'in-progress';
        else if (lowerMessage.includes('concluída') || lowerMessage.includes('concluidas')) status = 'completed';
        return service.createTasksListWidget(status);
      },
    });

    this.registerCommand({
      keywords: ['lista', 'list', 'alerta', 'alertas', 'alert'],
      priority: 7,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        const unreadOnly = lowerMessage.includes('não lido') || lowerMessage.includes('nao lido') || 
                           lowerMessage.includes('não lidos') || lowerMessage.includes('nao lidos') ||
                           lowerMessage.includes('unread');
        return service.createAlertsListWidget(unreadOnly);
      },
    });

    this.registerCommand({
      keywords: ['lista', 'list', 'evento', 'eventos', 'event'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createEventsListWidget(10),
    });

    // Status e alertas
    this.registerCommand({
      keywords: ['status', 'sistema'],
      priority: 7,
      requireAll: true,
      createWidget: (_message, service) => service.createSystemStatusWidget(),
    });

    this.registerCommand({
      keywords: ['status', 'operação', 'operacao'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createOperationsStatusWidget(),
    });

    this.registerCommand({
      keywords: ['dashboard', 'alerta', 'alertas'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createAlertsDashboardWidget(),
    });

    // Comparativos
    this.registerCommand({
      keywords: ['comparativo', 'comparação', 'comparacao', 'venda', 'vendas'],
      priority: 7,
      requireAll: false,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        const days1Match = lowerMessage.match(/(\d+)\s*dias?\s*(?:atual|recente|hoje)/i);
        const days2Match = lowerMessage.match(/(\d+)\s*dias?\s*(?:anterior|passado)/i);
        const period1Days = days1Match ? parseInt(days1Match[1], 10) : 7;
        const period2Days = days2Match ? parseInt(days2Match[1], 10) : 7;
        return service.createSalesComparisonWidget(period1Days, period2Days);
      },
    });

    this.registerCommand({
      keywords: ['comparativo', 'comparação', 'comparacao', 'vendedor', 'vendedores'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createSellersComparisonWidget(),
    });

    this.registerCommand({
      keywords: ['comparativo', 'comparação', 'comparacao', 'produto', 'produtos'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createProductsComparisonWidget(),
    });

    this.registerCommand({
      keywords: ['comparativo', 'comparação', 'comparacao', 'região', 'regiao'],
      priority: 7,
      requireAll: false,
      createWidget: (_message, service) => service.createRegionsComparisonWidget(),
    });

    // Menu de widgets
    this.registerCommand({
      keywords: ['menu', 'widget', 'widgets', 'disponível', 'disponivel', 'lista'],
      priority: 5,
      requireAll: false,
      createWidget: (_message, service) => service.createWidgetsMenuWidget(),
    });

    // Comandos genéricos (baixa prioridade)
    this.registerCommand({
      keywords: ['gráfico', 'grafico', 'chart'],
      priority: 1,
      createWidget: (message, service) => {
        const lowerMessage = message.toLowerCase();
        if (lowerMessage.includes('venda') && (lowerMessage.includes('período') || lowerMessage.includes('periodo') || lowerMessage.includes('tempo'))) {
          return service.createSalesChartWidget();
        }
        if (lowerMessage.includes('produto')) {
          return service.createProductChartWidget();
        }
        if (lowerMessage.includes('região') || lowerMessage.includes('regiao')) {
          return service.createRegionChartWidget();
        }
        if (lowerMessage.includes('funil')) {
          return service.createFunnelChartWidget();
        }
        if (lowerMessage.includes('segmento') || lowerMessage.includes('cliente')) {
          return service.createSegmentChartWidget();
        }
        return null;
      },
    });
  }
}

