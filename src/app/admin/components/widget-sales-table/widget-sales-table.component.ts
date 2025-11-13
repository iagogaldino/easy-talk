import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SalesTableWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-sales-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-sales-table.component.html',
  styleUrls: ['./widget-sales-table.component.scss'],
})
export class WidgetSalesTableComponent {
  @Input() widget!: SalesTableWidget;

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR');
  }
}

