import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DeliveriesWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-deliveries',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule, MatButtonToggleModule],
  templateUrl: './widget-deliveries.component.html',
  styleUrls: ['./widget-deliveries.component.scss'],
})
export class WidgetDeliveriesComponent {
  @Input() widget!: DeliveriesWidget;
  
  selectedFilter: 'all' | 'implantado' | 'aprovado' | 'saiu-entrega' | 'entregue' = 'all';

  getStatusIcon(status: string): string {
    switch (status) {
      case 'implantado':
        return 'inventory';
      case 'aprovado':
        return 'check_circle';
      case 'saiu-entrega':
        return 'local_shipping';
      case 'entregue':
        return 'done_all';
      default:
        return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'implantado':
        return 'status-implantado';
      case 'aprovado':
        return 'status-aprovado';
      case 'saiu-entrega':
        return 'status-entrega';
      case 'entregue':
        return 'status-entregue';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'implantado':
        return 'Implantado';
      case 'aprovado':
        return 'Aprovado';
      case 'saiu-entrega':
        return 'Saiu para Entrega';
      case 'entregue':
        return 'Entregue';
      default:
        return status;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getFilteredDeliveries() {
    const filter = this.selectedFilter === 'all' ? null : this.selectedFilter;
    if (!filter) {
      return this.widget.deliveries;
    }
    return this.widget.deliveries.filter(d => d.status === filter);
  }

  setFilter(filter: 'all' | 'implantado' | 'aprovado' | 'saiu-entrega' | 'entregue'): void {
    this.selectedFilter = filter;
  }

  getFilterCount(filter: 'all' | 'implantado' | 'aprovado' | 'saiu-entrega' | 'entregue'): number {
    if (filter === 'all') {
      return this.widget.deliveries.length;
    }
    return this.widget.deliveries.filter(d => d.status === filter).length;
  }

  getImplantadoCount(): number {
    return this.widget.deliveries.filter(d => d.status === 'implantado').length;
  }

  getAprovadoCount(): number {
    return this.widget.deliveries.filter(d => d.status === 'aprovado').length;
  }

  getSaiuEntregaCount(): number {
    return this.widget.deliveries.filter(d => d.status === 'saiu-entrega').length;
  }

  getEntregueCount(): number {
    return this.widget.deliveries.filter(d => d.status === 'entregue').length;
  }
}

