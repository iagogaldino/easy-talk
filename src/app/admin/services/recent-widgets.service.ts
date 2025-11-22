import { Injectable } from '@angular/core';
import { Widget } from '../models/widget.model';

export interface RecentWidget {
  widgetId: string;
  widgetType: string;
  title: string;
  icon?: string;
  command: string;
  accessedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class RecentWidgetsService {
  private readonly STORAGE_KEY = 'recent_widgets';
  private readonly MAX_RECENT_WIDGETS = 15; // Máximo total de widgets recentes

  /**
   * Adiciona um widget à lista de recentes
   * Se já houver 15 widgets, remove os mais antigos automaticamente
   * Remove duplicatas baseado no tipo de widget ou comando (não no ID único)
   */
  addRecentWidget(widget: Widget, command: string, icon?: string): void {
    const recentWidgets = this.getRecentWidgets();
    
    // Remove se já existir um widget do mesmo tipo ou com o mesmo comando (para evitar duplicatas)
    // Isso garante que mesmo que o widget tenha um ID único diferente, não haverá duplicatas
    const filtered = recentWidgets.filter(rw => 
      rw.widgetType !== widget.type && rw.command !== command
    );
    
    // Adiciona no início
    const newRecent: RecentWidget = {
      widgetId: widget.id,
      widgetType: widget.type,
      title: widget.title || this.getDefaultTitle(widget.type),
      icon,
      command,
      accessedAt: new Date(),
    };
    
    const updated = [newRecent, ...filtered].slice(0, this.MAX_RECENT_WIDGETS);
    
    this.saveRecentWidgets(updated);
  }

  /**
   * Obtém a lista de widgets recentes
   */
  getRecentWidgets(): RecentWidget[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return [];
      }
      
      const parsed = JSON.parse(stored);
      return parsed.map((rw: any) => ({
        ...rw,
        accessedAt: new Date(rw.accessedAt),
      }));
    } catch (error) {
      console.error('Erro ao carregar widgets recentes:', error);
      return [];
    }
  }

  /**
   * Remove um widget da lista de recentes
   */
  removeRecentWidget(widgetId: string): void {
    const recentWidgets = this.getRecentWidgets();
    const filtered = recentWidgets.filter(rw => rw.widgetId !== widgetId);
    this.saveRecentWidgets(filtered);
  }

  /**
   * Limpa todos os widgets recentes
   */
  clearRecentWidgets(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Salva a lista de widgets recentes no localStorage
   */
  private saveRecentWidgets(widgets: RecentWidget[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(widgets));
    } catch (error) {
      console.error('Erro ao salvar widgets recentes:', error);
    }
  }

  /**
   * Obtém um título padrão baseado no tipo do widget
   */
  private getDefaultTitle(widgetType: string): string {
    const titles: Record<string, string> = {
      'kpi-metrics': 'KPIs e Métricas',
      'seller-chart': 'Gráfico de Vendedores',
      'sales-chart': 'Vendas por Período',
      'product-chart': 'Vendas por Produto',
      'region-chart': 'Vendas por Região',
      'funnel-chart': 'Funil de Vendas',
      'segment-chart': 'Segmentação de Clientes',
      'sales-table': 'Tabela de Vendas',
      'products-table': 'Tabela de Produtos',
      'clients-table': 'Tabela de Clientes',
      'employees-table': 'Tabela de Funcionários',
      'tasks-list': 'Lista de Tarefas',
      'alerts-list': 'Lista de Alertas',
      'events-list': 'Lista de Eventos',
      'system-status': 'Status do Sistema',
      'operations-status': 'Status das Operações',
      'alerts-dashboard': 'Dashboard de Alertas',
      'sales-comparison': 'Comparativo de Vendas',
      'sellers-comparison': 'Comparativo de Vendedores',
      'products-comparison': 'Comparativo de Produtos',
      'regions-comparison': 'Comparativo de Regiões',
      'deliveries': 'Status de Entregas',
      'documents': 'Documentos para Envio',
      'inactive-clients': 'Clientes Inativos',
      'service-funnel': 'Funil de Atendimento',
    };
    
    return titles[widgetType] || 'Widget';
  }
}

