import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CardWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.scss'],
})
export class WidgetCardComponent {
  @Input() widget!: CardWidget;

  protected handleAction(action: string): void {
    console.log('Card action:', action);
    // Aqui você pode adicionar lógica para diferentes ações
  }
}

