import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FunnelChartWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-funnel-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-funnel-chart.component.html',
  styleUrls: ['./widget-funnel-chart.component.scss'],
})
export class WidgetFunnelChartComponent {
  @Input() widget!: FunnelChartWidget;

  protected getMaxValue(): number {
    return Math.max(...this.widget.data.map(d => d.value));
  }

  protected getBarWidth(percentage: number): string {
    return `${percentage}%`;
  }
}

