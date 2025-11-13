import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlertsDashboardWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-alerts-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-alerts-dashboard.component.html',
  styleUrls: ['./widget-alerts-dashboard.component.scss'],
})
export class WidgetAlertsDashboardComponent {
  @Input() widget!: AlertsDashboardWidget;

  getTypeClass(type: string): string {
    return `alert-type-${type}`;
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}

