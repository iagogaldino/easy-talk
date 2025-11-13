import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WidgetsMenuWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widgets-menu',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './widgets-menu.component.html',
  styleUrls: ['./widgets-menu.component.scss'],
})
export class WidgetsMenuComponent {
  @Input() widget!: WidgetsMenuWidget;
  @Output() widgetRequest = new EventEmitter<string>();

  filterText = '';

  get filteredCategories() {
    if (!this.filterText.trim()) {
      return this.widget.categories;
    }

    const filterLower = this.filterText.toLowerCase().trim();
    
    return this.widget.categories
      .map(category => ({
        ...category,
        widgets: category.widgets.filter(widgetItem =>
          widgetItem.name.toLowerCase().includes(filterLower) ||
          widgetItem.description?.toLowerCase().includes(filterLower) ||
          widgetItem.id.toLowerCase().includes(filterLower)
        )
      }))
      .filter(category => category.widgets.length > 0);
  }

  onWidgetClick(command: string): void {
    this.widgetRequest.emit(command);
  }

  clearFilter(): void {
    this.filterText = '';
  }
}

