import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { Conversation, Message } from '../../models/conversation.model';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextFieldModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
})
export class ChatWindowComponent {
  @Input() conversation: Conversation | null = null;
  @Output() messageSent = new EventEmitter<string>();
  @Output() profileRequested = new EventEmitter<void>();

  protected draft = '';

  protected get hasDraft(): boolean {
    return this.draft.trim().length > 0;
  }

  protected submitMessage(): void {
    if (!this.hasDraft) {
      return;
    }

    this.messageSent.emit(this.draft.trim());
    this.draft = '';
  }

  protected handleComposerKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submitMessage();
    }
  }

  protected trackByMessageId(_: number, message: Message): string {
    return message.id;
  }

  protected openProfile(): void {
    this.profileRequested.emit();
  }
}

