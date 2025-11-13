import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AlertsListWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-alerts-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-alerts-list.component.html',
  styleUrls: ['./widget-alerts-list.component.scss'],
})
export class WidgetAlertsListComponent {
  @Input() widget!: AlertsListWidget;

  getTypeClass(type: string): string {
    return `alert-type-${type}`;
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return 'ℹ';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}

