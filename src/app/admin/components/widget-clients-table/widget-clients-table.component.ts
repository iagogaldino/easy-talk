import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ClientsTableWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-clients-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-clients-table.component.html',
  styleUrls: ['./widget-clients-table.component.scss'],
})
export class WidgetClientsTableComponent {
  @Input() widget!: ClientsTableWidget;

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

