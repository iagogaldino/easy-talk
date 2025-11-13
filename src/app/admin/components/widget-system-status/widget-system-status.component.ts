import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SystemStatusWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-system-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-system-status.component.html',
  styleUrls: ['./widget-system-status.component.scss'],
})
export class WidgetSystemStatusComponent {
  @Input() widget!: SystemStatusWidget;

  getOverallStatusClass(): string {
    return `status-${this.widget.status.overall}`;
  }

  getServiceStatusClass(status: string): string {
    return `service-${status}`;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString('pt-BR');
  }
}

