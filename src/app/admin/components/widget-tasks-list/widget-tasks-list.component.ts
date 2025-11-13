import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TasksListWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-tasks-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-tasks-list.component.html',
  styleUrls: ['./widget-tasks-list.component.scss'],
})
export class WidgetTasksListComponent {
  @Input() widget!: TasksListWidget;

  getPriorityClass(priority: string): string {
    return `priority-${priority}`;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  }
}

