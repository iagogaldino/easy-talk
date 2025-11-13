import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SellersComparisonWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-sellers-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-sellers-comparison.component.html',
  styleUrls: ['./widget-sellers-comparison.component.scss'],
})
export class WidgetSellersComparisonComponent {
  @Input() widget!: SellersComparisonWidget;

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  getChangeClass(percentage: number): string {
    return percentage >= 0 ? 'change-positive' : 'change-negative';
  }

  Math = Math;
}

