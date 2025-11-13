import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { KPIMetricsWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-kpi-metrics',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './widget-kpi-metrics.component.html',
  styleUrls: ['./widget-kpi-metrics.component.scss'],
})
export class WidgetKPIMetricsComponent {
  @Input() widget!: KPIMetricsWidget;

  protected getTrendValue(trend?: { value: number; direction: 'up' | 'down' }): number {
    return Math.abs(trend?.value || 0);
  }

  protected formatValue(value: string | number, unit?: string): string {
    if (typeof value === 'number') {
      // Formata números grandes com separador de milhar
      const formatted = value.toLocaleString('pt-BR', {
        minimumFractionDigits: value % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
      });
      return unit ? `${formatted} ${unit}` : formatted;
    }
    return unit ? `${value} ${unit}` : String(value);
  }

  protected getGridColumns(): string {
    const columns = this.widget.columns || 2;
    return `repeat(${columns}, 1fr)`;
  }
}

