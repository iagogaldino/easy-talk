import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { DocumentsWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-documents',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './widget-documents.component.html',
  styleUrls: ['./widget-documents.component.scss'],
})
export class WidgetDocumentsComponent {
  @Input() widget!: DocumentsWidget;

  getDocumentTypeIcon(type: string): string {
    switch (type) {
      case 'boleto':
        return 'receipt';
      case 'nota-promissoria':
        return 'description';
      case 'nota-fiscal':
        return 'article';
      case 'pedido':
        return 'shopping_cart';
      default:
        return 'description';
    }
  }

  getDocumentTypeLabel(type: string): string {
    switch (type) {
      case 'boleto':
        return 'Boleto';
      case 'nota-promissoria':
        return 'Nota Promissória';
      case 'nota-fiscal':
        return 'Nota Fiscal';
      case 'pedido':
        return 'Pedido';
      default:
        return type;
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending':
        return 'schedule';
      case 'sent':
        return 'send';
      case 'viewed':
        return 'visibility';
      default:
        return 'help';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'sent':
        return 'status-sent';
      case 'viewed':
        return 'status-viewed';
      default:
        return '';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'sent':
        return 'Enviado';
      case 'viewed':
        return 'Visualizado';
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

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  }

  getFilteredDocuments() {
    if (!this.widget.filter || this.widget.filter === 'all') {
      return this.widget.documents;
    }
    return this.widget.documents.filter(d => d.status === this.widget.filter);
  }

  sendDocument(documentId: string): void {
    // Implementar lógica de envio
    console.log('Enviar documento:', documentId);
  }

  getPendingCount(): number {
    return this.widget.documents.filter(d => d.status === 'pending').length;
  }

  getSentCount(): number {
    return this.widget.documents.filter(d => d.status === 'sent').length;
  }

  getViewedCount(): number {
    return this.widget.documents.filter(d => d.status === 'viewed').length;
  }
}

