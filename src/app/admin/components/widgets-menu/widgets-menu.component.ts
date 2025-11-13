import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WidgetsMenuWidget } from '../../models/widget.model';
import { RecentWidgetsService, RecentWidget } from '../../services/recent-widgets.service';

@Component({
  selector: 'app-widgets-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './widgets-menu.component.html',
  styleUrls: ['./widgets-menu.component.scss'],
})
export class WidgetsMenuComponent implements OnInit {
  @Input() widget!: WidgetsMenuWidget;
  @Output() widgetRequest = new EventEmitter<string>();

  filterText = '';
  recentWidgets: RecentWidget[] = [];
  displayedRecentCount = 5; // Mostra 5 inicialmente
  readonly INITIAL_DISPLAY_COUNT = 5;
  readonly LOAD_MORE_COUNT = 10;

  constructor(private recentWidgetsService: RecentWidgetsService) {}

  ngOnInit(): void {
    this.loadRecentWidgets();
  }

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

  loadRecentWidgets(): void {
    this.recentWidgets = this.recentWidgetsService.getRecentWidgets();
    // Reset para mostrar apenas os primeiros 5
    this.displayedRecentCount = this.INITIAL_DISPLAY_COUNT;
  }

  get displayedRecentWidgets(): RecentWidget[] {
    return this.recentWidgets.slice(0, this.displayedRecentCount);
  }

  get hasMoreRecentWidgets(): boolean {
    return this.recentWidgets.length > this.displayedRecentCount;
  }

  showMoreRecentWidgets(): void {
    this.displayedRecentCount = Math.min(
      this.displayedRecentCount + this.LOAD_MORE_COUNT,
      this.recentWidgets.length
    );
  }

  openRecentWidget(recentWidget: RecentWidget): void {
    this.widgetRequest.emit(recentWidget.command);
  }

  removeRecentWidget(widgetId: string, event: Event): void {
    event.stopPropagation();
    this.recentWidgetsService.removeRecentWidget(widgetId);
    this.loadRecentWidgets();
  }

  formatRecentTime(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) {
      return 'Agora';
    } else if (minutes < 60) {
      return `${minutes} min atrás`;
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else if (days === 1) {
      return 'Ontem';
    } else {
      return `${days} dias atrás`;
    }
  }
}

