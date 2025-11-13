import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MetricWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-metric',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './widget-metric.component.html',
  styleUrls: ['./widget-metric.component.scss'],
})
export class WidgetMetricComponent {
  @Input() widget!: MetricWidget;

  protected getTrendValue(): number {
    return Math.abs(this.widget.trend?.value || 0);
  }
}

