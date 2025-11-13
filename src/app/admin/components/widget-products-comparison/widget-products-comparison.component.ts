import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ProductsComparisonWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-products-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-products-comparison.component.html',
  styleUrls: ['./widget-products-comparison.component.scss'],
})
export class WidgetProductsComparisonComponent {
  @Input() widget!: ProductsComparisonWidget;

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  getChangeClass(percentage: number): string {
    return percentage >= 0 ? 'change-positive' : 'change-negative';
  }

  Math = Math;
}

