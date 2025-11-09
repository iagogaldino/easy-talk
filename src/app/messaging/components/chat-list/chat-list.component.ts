import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent {
  @Input({ required: true }) conversations: Conversation[] = [];
  @Input() selectedConversationId: string | null = null;
  @Output() conversationSelected = new EventEmitter<string>();

  protected trackByConversationId(_: number, conversation: Conversation): string {
    return conversation.id;
  }

  protected handleSelection(conversationId: string): void {
    this.conversationSelected.emit(conversationId);
  }
}

