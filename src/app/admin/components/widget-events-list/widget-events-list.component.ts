import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EventsListWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-events-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-events-list.component.html',
  styleUrls: ['./widget-events-list.component.scss'],
})
export class WidgetEventsListComponent {
  @Input() widget!: EventsListWidget;

  getTypeClass(type: string): string {
    return `event-type-${type}`;
  }

  getTypeIcon(type: string, icon?: string): string {
    if (icon) return icon;
    switch (type) {
      case 'sale':
        return '💰';
      case 'client':
        return '👤';
      case 'product':
        return '📦';
      case 'employee':
        return '👥';
      default:
        return '⚙';
    }
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('pt-BR');
  }
}

