import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RegionsComparisonWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-regions-comparison',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-regions-comparison.component.html',
  styleUrls: ['./widget-regions-comparison.component.scss'],
})
export class WidgetRegionsComparisonComponent {
  @Input() widget!: RegionsComparisonWidget;

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  getChangeClass(percentage: number): string {
    return percentage >= 0 ? 'change-positive' : 'change-negative';
  }

  Math = Math;
}

