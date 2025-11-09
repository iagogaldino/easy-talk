import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-contact-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './contact-profile.component.html',
  styleUrls: ['./contact-profile.component.scss'],
})
export class ContactProfileComponent {
  @Input() conversation: Conversation | null = null;
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  protected close(): void {
    this.closed.emit();
  }
}
