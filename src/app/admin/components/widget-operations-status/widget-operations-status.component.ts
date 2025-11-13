import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { OperationsStatusWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-operations-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-operations-status.component.html',
  styleUrls: ['./widget-operations-status.component.scss'],
})
export class WidgetOperationsStatusComponent {
  @Input() widget!: OperationsStatusWidget;

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleString('pt-BR');
  }
}

