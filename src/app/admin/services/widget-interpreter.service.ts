import { Injectable } from '@angular/core';
import { Widget } from '../models/widget.model';
import { getTopSellers } from '../../mocks/admin/mock-sellers';

@Injectable({
  providedIn: 'root',
})
export class WidgetInterpreterService {
  /**
   * Interpreta uma mensagem e tenta gerar um widget baseado em comandos naturais
   */
  interpretMessage(message: string): Widget | null {
    const lowerMessage = message.toLowerCase().trim();

    // Comandos para criar widgets
    if (lowerMessage.startsWith('criar widget') || lowerMessage.startsWith('crie widget')) {
      return this.parseWidgetCommand(message);
    }

    // Comandos diretos
    if (lowerMessage.includes('card') || lowerMessage.includes('cartão')) {
      return this.createCardWidget(message);
    }

    if (lowerMessage.includes('gráfico') || lowerMessage.includes('grafico') || lowerMessage.includes('chart')) {
      return this.createChartWidget(message);
    }

    if (lowerMessage.includes('tabela') || lowerMessage.includes('table')) {
      return this.createTableWidget(message);
    }

    if (lowerMessage.includes('métrica') || lowerMessage.includes('metrica') || lowerMessage.includes('metric')) {
      return this.createMetricWidget(message);
    }

    if (lowerMessage.includes('lista') || lowerMessage.includes('list')) {
      return this.createListWidget(message);
    }

    if (lowerMessage.includes('botão') || lowerMessage.includes('botao') || lowerMessage.includes('button')) {
      return this.createButtonWidget(message);
    }

    // Comando para gráfico de vendedores
    if (lowerMessage.includes('vendedor') || lowerMessage.includes('vendedores') || 
        lowerMessage.includes('atendem') || lowerMessage.includes('clientes')) {
      return this.createSellerChartWidget(message);
    }

    return null;
  }

  private parseWidgetCommand(message: string): Widget | null {
    // Exemplo: "criar widget card com título 'Meu Card' e conteúdo 'Texto aqui'"
    const cardMatch = message.match(/card.*título['"]?\s*([^'"]+).*conteúdo['"]?\s*([^'"]+)/i);
    if (cardMatch) {
      return {
        id: this.generateId(),
        type: 'card',
        title: cardMatch[1].trim(),
        content: cardMatch[2].trim(),
      };
    }

    return null;
  }

  private createCardWidget(message: string): Widget {
    // Extrai título e conteúdo da mensagem
    const titleMatch = message.match(/título['"]?\s*[:=]?\s*['"]?([^'"]+)/i) || 
                       message.match(/title['"]?\s*[:=]?\s*['"]?([^'"]+)/i);
    const contentMatch = message.match(/conteúdo['"]?\s*[:=]?\s*['"]?([^'"]+)/i) ||
                        message.match(/content['"]?\s*[:=]?\s*['"]?([^'"]+)/i);

    return {
      id: this.generateId(),
      type: 'card',
      title: titleMatch ? titleMatch[1].trim() : 'Card',
      content: contentMatch ? contentMatch[1].trim() : message,
      color: this.extractColor(message),
    };
  }

  private createChartWidget(message: string): Widget {
    // Detecta tipo de gráfico
    let chartType: 'line' | 'bar' | 'pie' | 'doughnut' = 'bar';
    if (message.match(/linha|line/i)) chartType = 'line';
    else if (message.match(/pizza|pie/i)) chartType = 'pie';
    else if (message.match(/rosquinha|doughnut/i)) chartType = 'doughnut';

    // Tenta extrair dados da mensagem
    const dataMatch = message.match(/dados['"]?\s*[:=]?\s*\[(.*?)\]/i);
    let data: Array<{ label: string; value: number }> = [
      { label: 'Item 1', value: 10 },
      { label: 'Item 2', value: 20 },
      { label: 'Item 3', value: 30 },
    ];

    if (dataMatch) {
      try {
        const parsed = JSON.parse(`[${dataMatch[1]}]`);
        data = parsed.map((item: any, index: number) => ({
          label: item.label || `Item ${index + 1}`,
          value: typeof item === 'number' ? item : item.value || 0,
        }));
      } catch {
        // Mantém dados padrão
      }
    }

    return {
      id: this.generateId(),
      type: 'chart',
      chartType,
      data,
    };
  }

  private createTableWidget(message: string): Widget {
    // Tenta extrair colunas e linhas
    const columnsMatch = message.match(/colunas['"]?\s*[:=]?\s*\[(.*?)\]/i);
    const rowsMatch = message.match(/linhas['"]?\s*[:=]?\s*\[(.*?)\]/i);

    let columns = ['Coluna 1', 'Coluna 2', 'Coluna 3'];
    let rows: string[][] = [
      ['Dado 1', 'Dado 2', 'Dado 3'],
      ['Dado 4', 'Dado 5', 'Dado 6'],
    ];

    if (columnsMatch) {
      try {
        columns = JSON.parse(`[${columnsMatch[1]}]`);
      } catch {
        // Mantém padrão
      }
    }

    if (rowsMatch) {
      try {
        rows = JSON.parse(`[${rowsMatch[1]}]`);
      } catch {
        // Mantém padrão
      }
    }

    return {
      id: this.generateId(),
      type: 'table',
      columns,
      rows,
    };
  }

  private createMetricWidget(message: string): Widget {
    const valueMatch = message.match(/valor['"]?\s*[:=]?\s*['"]?([^'"]+)/i) ||
                      message.match(/value['"]?\s*[:=]?\s*['"]?([^'"]+)/i);
    const labelMatch = message.match(/label['"]?\s*[:=]?\s*['"]?([^'"]+)/i) ||
                      message.match(/rótulo['"]?\s*[:=]?\s*['"]?([^'"]+)/i);

    return {
      id: this.generateId(),
      type: 'metric',
      value: valueMatch ? valueMatch[1].trim() : '0',
      label: labelMatch ? labelMatch[1].trim() : 'Métrica',
    };
  }

  private createListWidget(message: string): Widget {
    const itemsMatch = message.match(/itens['"]?\s*[:=]?\s*\[(.*?)\]/i) ||
                      message.match(/items['"]?\s*[:=]?\s*\[(.*?)\]/i);

    let items = ['Item 1', 'Item 2', 'Item 3'];

    if (itemsMatch) {
      try {
        items = JSON.parse(`[${itemsMatch[1]}]`);
      } catch {
        // Tenta separar por vírgula
        items = itemsMatch[1].split(',').map(item => item.trim());
      }
    }

    return {
      id: this.generateId(),
      type: 'list',
      items,
      ordered: message.includes('ordenada') || message.includes('ordered'),
    };
  }

  private createButtonWidget(message: string): Widget {
    const labelMatch = message.match(/label['"]?\s*[:=]?\s*['"]?([^'"]+)/i) ||
                      message.match(/texto['"]?\s*[:=]?\s*['"]?([^'"]+)/i);

    return {
      id: this.generateId(),
      type: 'button',
      label: labelMatch ? labelMatch[1].trim() : 'Clique aqui',
      action: 'click',
      color: this.extractColor(message) || 'primary',
    };
  }

  private createSellerChartWidget(_message: string): Widget {
    // Usa dados mockados de vendedores - em produção viria de uma API
    const sellers = getTopSellers(8).map(seller => ({
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

  private extractColor(message: string): 'primary' | 'accent' | 'warn' | undefined {
    if (message.match(/primary|primário|primario/i)) return 'primary';
    if (message.match(/accent|acento/i)) return 'accent';
    if (message.match(/warn|aviso|alerta/i)) return 'warn';
    return undefined;
  }

  private generateId(): string {
    return `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

