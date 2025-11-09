import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Conversation } from '../../models/conversation.model';
import { ContactVoiceDialogComponent } from './contact-voice-dialog.component';

@Component({
  selector: 'app-contact-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './contact-profile.component.html',
  styleUrls: ['./contact-profile.component.scss'],
})
export class ContactProfileComponent {
  @Input() conversation: Conversation | null = null;
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  constructor(private readonly dialog: MatDialog) {}

  protected close(): void {
    this.closed.emit();
  }

  protected handleVoiceCall(): void {
    if (!this.conversation) {
      return;
    }

    this.dialog.open(ContactVoiceDialogComponent, {
      data: { conversation: this.conversation },
      width: '500px',
      autoFocus: false,
      panelClass: 'voice-dialog-panel',
    });
  }
}
