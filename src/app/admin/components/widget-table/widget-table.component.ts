import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { TableWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-table.component.html',
  styleUrls: ['./widget-table.component.scss'],
})
export class WidgetTableComponent implements OnInit {
  @Input() widget!: TableWidget;
  protected displayedColumns: string[] = [];
  protected dataSource: any[] = [];

  ngOnInit(): void {
    this.displayedColumns = this.widget.columns;
    this.dataSource = this.widget.rows.map(row => {
      const obj: any = {};
      this.widget.columns.forEach((col, index) => {
        obj[col] = row[index] || '';
      });
      return obj;
    });
  }
}

