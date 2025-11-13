import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ButtonWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './widget-button.component.html',
  styleUrls: ['./widget-button.component.scss'],
})
export class WidgetButtonComponent {
  @Input() widget!: ButtonWidget;

  protected handleClick(): void {
    console.log('Button clicked:', this.widget.action);
    // Aqui você pode adicionar lógica para diferentes ações
  }
}

