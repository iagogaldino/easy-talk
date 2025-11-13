import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ListWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './widget-list.component.html',
  styleUrls: ['./widget-list.component.scss'],
})
export class WidgetListComponent {
  @Input() widget!: ListWidget;
}

