import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { InactiveClientsWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-inactive-clients',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatSlideToggleModule,
    FormsModule,
  ],
  templateUrl: './widget-inactive-clients.component.html',
  styleUrls: ['./widget-inactive-clients.component.scss'],
})
export class WidgetInactiveClientsComponent {
  @Input() widget!: InactiveClientsWidget;

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getDaysBadgeClass(days: number): string {
    if (days >= 60) return 'badge-critical';
    if (days >= 45) return 'badge-warning';
    return 'badge-info';
  }

  sendMessage(clientId: string): void {
    // Implementar lógica de envio de mensagem
    console.log('Enviar mensagem para cliente:', clientId);
  }

  toggleAutoMessage(): void {
    this.widget.autoMessageEnabled = !this.widget.autoMessageEnabled;
    // Implementar lógica de ativação/desativação
    console.log('Auto mensagem:', this.widget.autoMessageEnabled ? 'ativada' : 'desativada');
  }

  getTotalValue(): number {
    return this.widget.clients.reduce((sum, c) => sum + c.totalValue, 0);
  }
}

