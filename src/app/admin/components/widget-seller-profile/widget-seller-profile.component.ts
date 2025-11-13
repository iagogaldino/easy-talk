import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SellerProfileWidget } from '../../models/widget.model';

@Component({
  selector: 'app-widget-seller-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './widget-seller-profile.component.html',
  styleUrls: ['./widget-seller-profile.component.scss'],
})
export class WidgetSellerProfileComponent {
  @Input() widget!: SellerProfileWidget;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}

