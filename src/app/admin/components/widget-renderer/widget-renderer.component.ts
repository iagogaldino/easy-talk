import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Widget } from '../../models/widget.model';
import { WidgetCardComponent } from '../widget-card/widget-card.component';
import { WidgetChartComponent } from '../widget-chart/widget-chart.component';
import { WidgetTableComponent } from '../widget-table/widget-table.component';
import { WidgetMetricComponent } from '../widget-metric/widget-metric.component';
import { WidgetListComponent } from '../widget-list/widget-list.component';
import { WidgetButtonComponent } from '../widget-button/widget-button.component';
import { WidgetSellerChartComponent } from '../widget-seller-chart/widget-seller-chart.component';

@Component({
  selector: 'app-widget-renderer',
  standalone: true,
  imports: [
    CommonModule,
    WidgetCardComponent,
    WidgetChartComponent,
    WidgetTableComponent,
    WidgetMetricComponent,
    WidgetListComponent,
    WidgetButtonComponent,
    WidgetSellerChartComponent,
  ],
  template: `
    <ng-container [ngSwitch]="widget.type">
      <app-widget-card *ngSwitchCase="'card'" [widget]="$any(widget)"></app-widget-card>
      <app-widget-chart *ngSwitchCase="'chart'" [widget]="$any(widget)"></app-widget-chart>
      <app-widget-table *ngSwitchCase="'table'" [widget]="$any(widget)"></app-widget-table>
      <app-widget-metric *ngSwitchCase="'metric'" [widget]="$any(widget)"></app-widget-metric>
      <app-widget-list *ngSwitchCase="'list'" [widget]="$any(widget)"></app-widget-list>
      <app-widget-button *ngSwitchCase="'button'" [widget]="$any(widget)"></app-widget-button>
      <app-widget-seller-chart *ngSwitchCase="'seller-chart'" [widget]="$any(widget)"></app-widget-seller-chart>
    </ng-container>
  `,
})
export class WidgetRendererComponent {
  @Input() widget!: Widget;
}

