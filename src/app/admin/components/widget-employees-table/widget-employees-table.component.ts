import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { EmployeesTableWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-employees-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-employees-table.component.html',
  styleUrls: ['./widget-employees-table.component.scss'],
})
export class WidgetEmployeesTableComponent {
  @Input() widget!: EmployeesTableWidget;

  formatCurrency(value: number): string {
    return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
}

