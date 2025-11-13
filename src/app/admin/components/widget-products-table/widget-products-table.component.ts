import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductsTableWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-products-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-products-table.component.html',
  styleUrls: ['./widget-products-table.component.scss'],
})
export class WidgetProductsTableComponent {
  @Input() widget!: ProductsTableWidget;

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
}

