import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Widget } from '../../models/widget.model';
import { Seller } from '../../../mocks/admin/mock-sellers';
import { WidgetCardComponent } from '../widget-card/widget-card.component';
import { WidgetChartComponent } from '../widget-chart/widget-chart.component';
import { WidgetTableComponent } from '../widget-table/widget-table.component';
import { WidgetMetricComponent } from '../widget-metric/widget-metric.component';
import { WidgetListComponent } from '../widget-list/widget-list.component';
import { WidgetButtonComponent } from '../widget-button/widget-button.component';
import { WidgetSellerChartComponent } from '../widget-seller-chart/widget-seller-chart.component';
import { WidgetSellerProfileComponent } from '../widget-seller-profile/widget-seller-profile.component';
import { WidgetKPIMetricsComponent } from '../widget-kpi-metrics/widget-kpi-metrics.component';
import { WidgetSalesChartComponent } from '../widget-sales-chart/widget-sales-chart.component';
import { WidgetProductChartComponent } from '../widget-product-chart/widget-product-chart.component';
import { WidgetRegionChartComponent } from '../widget-region-chart/widget-region-chart.component';
import { WidgetFunnelChartComponent } from '../widget-funnel-chart/widget-funnel-chart.component';
import { WidgetSegmentChartComponent } from '../widget-segment-chart/widget-segment-chart.component';
import { WidgetSalesTableComponent } from '../widget-sales-table/widget-sales-table.component';
import { WidgetProductsTableComponent } from '../widget-products-table/widget-products-table.component';
import { WidgetClientsTableComponent } from '../widget-clients-table/widget-clients-table.component';
import { WidgetEmployeesTableComponent } from '../widget-employees-table/widget-employees-table.component';
import { WidgetTasksListComponent } from '../widget-tasks-list/widget-tasks-list.component';
import { WidgetAlertsListComponent } from '../widget-alerts-list/widget-alerts-list.component';
import { WidgetEventsListComponent } from '../widget-events-list/widget-events-list.component';
import { WidgetSystemStatusComponent } from '../widget-system-status/widget-system-status.component';
import { WidgetOperationsStatusComponent } from '../widget-operations-status/widget-operations-status.component';
import { WidgetAlertsDashboardComponent } from '../widget-alerts-dashboard/widget-alerts-dashboard.component';
import { WidgetSalesComparisonComponent } from '../widget-sales-comparison/widget-sales-comparison.component';
import { WidgetSellersComparisonComponent } from '../widget-sellers-comparison/widget-sellers-comparison.component';
import { WidgetProductsComparisonComponent } from '../widget-products-comparison/widget-products-comparison.component';
import { WidgetRegionsComparisonComponent } from '../widget-regions-comparison/widget-regions-comparison.component';
import { WidgetsMenuComponent } from '../widgets-menu/widgets-menu.component';
import { WidgetDeliveriesComponent } from '../widget-deliveries/widget-deliveries.component';
import { WidgetDocumentsComponent } from '../widget-documents/widget-documents.component';
import { WidgetInactiveClientsComponent } from '../widget-inactive-clients/widget-inactive-clients.component';
import { WidgetServiceFunnelComponent } from '../widget-service-funnel/widget-service-funnel.component';
import { WidgetUsersManagementComponent } from '../widget-users-management/widget-users-management.component';

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
    WidgetSellerProfileComponent,
    WidgetKPIMetricsComponent,
    WidgetSalesChartComponent,
    WidgetProductChartComponent,
    WidgetRegionChartComponent,
    WidgetFunnelChartComponent,
    WidgetSegmentChartComponent,
    WidgetSalesTableComponent,
    WidgetProductsTableComponent,
    WidgetClientsTableComponent,
    WidgetEmployeesTableComponent,
    WidgetTasksListComponent,
    WidgetAlertsListComponent,
    WidgetEventsListComponent,
    WidgetSystemStatusComponent,
    WidgetOperationsStatusComponent,
    WidgetAlertsDashboardComponent,
    WidgetSalesComparisonComponent,
    WidgetSellersComparisonComponent,
    WidgetProductsComparisonComponent,
    WidgetRegionsComparisonComponent,
    WidgetsMenuComponent,
    WidgetDeliveriesComponent,
    WidgetDocumentsComponent,
    WidgetInactiveClientsComponent,
    WidgetServiceFunnelComponent,
    WidgetUsersManagementComponent,
  ],
  template: `
    <ng-container [ngSwitch]="widget.type">
      <app-widget-card *ngSwitchCase="'card'" [widget]="$any(widget)"></app-widget-card>
      <app-widget-chart *ngSwitchCase="'chart'" [widget]="$any(widget)"></app-widget-chart>
      <app-widget-table *ngSwitchCase="'table'" [widget]="$any(widget)"></app-widget-table>
      <app-widget-metric *ngSwitchCase="'metric'" [widget]="$any(widget)"></app-widget-metric>
      <app-widget-list *ngSwitchCase="'list'" [widget]="$any(widget)"></app-widget-list>
      <app-widget-button *ngSwitchCase="'button'" [widget]="$any(widget)"></app-widget-button>
      <app-widget-seller-chart *ngSwitchCase="'seller-chart'" [widget]="$any(widget)" [onSellerClick]="onSellerClick"></app-widget-seller-chart>
      <app-widget-seller-profile *ngSwitchCase="'seller-profile'" [widget]="$any(widget)" (close)="onClose(widget.id)"></app-widget-seller-profile>
      <app-widget-kpi-metrics *ngSwitchCase="'kpi-metrics'" [widget]="$any(widget)"></app-widget-kpi-metrics>
      <app-widget-sales-chart *ngSwitchCase="'sales-chart'" [widget]="$any(widget)"></app-widget-sales-chart>
      <app-widget-product-chart *ngSwitchCase="'product-chart'" [widget]="$any(widget)"></app-widget-product-chart>
      <app-widget-region-chart *ngSwitchCase="'region-chart'" [widget]="$any(widget)"></app-widget-region-chart>
      <app-widget-funnel-chart *ngSwitchCase="'funnel-chart'" [widget]="$any(widget)"></app-widget-funnel-chart>
      <app-widget-segment-chart *ngSwitchCase="'segment-chart'" [widget]="$any(widget)"></app-widget-segment-chart>
      <app-widget-sales-table *ngSwitchCase="'sales-table'" [widget]="$any(widget)"></app-widget-sales-table>
      <app-widget-products-table *ngSwitchCase="'products-table'" [widget]="$any(widget)"></app-widget-products-table>
      <app-widget-clients-table *ngSwitchCase="'clients-table'" [widget]="$any(widget)"></app-widget-clients-table>
      <app-widget-employees-table *ngSwitchCase="'employees-table'" [widget]="$any(widget)"></app-widget-employees-table>
      <app-widget-tasks-list *ngSwitchCase="'tasks-list'" [widget]="$any(widget)"></app-widget-tasks-list>
      <app-widget-alerts-list *ngSwitchCase="'alerts-list'" [widget]="$any(widget)"></app-widget-alerts-list>
      <app-widget-events-list *ngSwitchCase="'events-list'" [widget]="$any(widget)"></app-widget-events-list>
      <app-widget-system-status *ngSwitchCase="'system-status'" [widget]="$any(widget)"></app-widget-system-status>
      <app-widget-operations-status *ngSwitchCase="'operations-status'" [widget]="$any(widget)"></app-widget-operations-status>
      <app-widget-alerts-dashboard *ngSwitchCase="'alerts-dashboard'" [widget]="$any(widget)"></app-widget-alerts-dashboard>
      <app-widget-sales-comparison *ngSwitchCase="'sales-comparison'" [widget]="$any(widget)"></app-widget-sales-comparison>
      <app-widget-sellers-comparison *ngSwitchCase="'sellers-comparison'" [widget]="$any(widget)"></app-widget-sellers-comparison>
      <app-widget-products-comparison *ngSwitchCase="'products-comparison'" [widget]="$any(widget)"></app-widget-products-comparison>
      <app-widget-regions-comparison *ngSwitchCase="'regions-comparison'" [widget]="$any(widget)"></app-widget-regions-comparison>
      <app-widgets-menu *ngSwitchCase="'widgets-menu'" [widget]="$any(widget)" (widgetRequest)="handleWidgetRequest($event)"></app-widgets-menu>
      <app-widget-deliveries *ngSwitchCase="'deliveries'" [widget]="$any(widget)"></app-widget-deliveries>
      <app-widget-documents *ngSwitchCase="'documents'" [widget]="$any(widget)"></app-widget-documents>
      <app-widget-inactive-clients *ngSwitchCase="'inactive-clients'" [widget]="$any(widget)"></app-widget-inactive-clients>
      <app-widget-service-funnel *ngSwitchCase="'service-funnel'" [widget]="$any(widget)"></app-widget-service-funnel>
      <app-widget-users-management *ngSwitchCase="'users-management'" [widget]="$any(widget)"></app-widget-users-management>
    </ng-container>
  `,
})
export class WidgetRendererComponent {
  @Input() widget!: Widget;
  @Input() onSellerClick?: (seller: Seller) => void;
  @Input() onWidgetClose?: (widgetId: string) => void;
  @Input() onWidgetRequest?: (command: string) => void;
  @Output() sellerClick = new EventEmitter<Seller>();
  @Output() widgetClose = new EventEmitter<string>();
  @Output() widgetRequest = new EventEmitter<string>();

  onClose(widgetId: string): void {
    this.widgetClose.emit(widgetId);
  }

  handleWidgetRequest(command: string): void {
    if (this.onWidgetRequest) {
      this.onWidgetRequest(command);
    } else {
      this.widgetRequest.emit(command);
    }
  }
}

