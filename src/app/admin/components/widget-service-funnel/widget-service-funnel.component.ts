import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ServiceFunnelWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-service-funnel',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './widget-service-funnel.component.html',
  styleUrls: ['./widget-service-funnel.component.scss'],
})
export class WidgetServiceFunnelComponent {
  @Input() widget!: ServiceFunnelWidget;

  getStageIcon(stage: string): string {
    switch (stage) {
      case 'entrada-lead':
        return 'input';
      case 'lead-contato':
        return 'phone';
      case 'proposta-fechada':
        return 'check_circle';
      case 'proposta-perdida':
        return 'cancel';
      default:
        return 'help';
    }
  }

  getStageColor(stage: string): string {
    switch (stage) {
      case 'entrada-lead':
        return '#3b82f6';
      case 'lead-contato':
        return '#8b5cf6';
      case 'proposta-fechada':
        return '#10b981';
      case 'proposta-perdida':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  }

  formatCurrency(value?: number): string {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getPeriodLabel(period: string): string {
    switch (period) {
      case 'day':
        return 'Diário';
      case 'week':
        return 'Semanal';
      case 'month':
        return 'Mensal';
      case 'year':
        return 'Anual';
      default:
        return period;
    }
  }
}

