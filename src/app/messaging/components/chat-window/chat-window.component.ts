import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, AfterViewInit, AfterViewChecked, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
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
export class ChatWindowComponent implements AfterViewInit, AfterViewChecked, OnChanges {
  @Input() conversation: Conversation | null = null;
  @Output() messageSent = new EventEmitter<string>();
  @Output() profileRequested = new EventEmitter<void>();

  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef<HTMLElement>;

  protected draft = '';
  private shouldScrollToBottom = true;
  private previousMessagesLength = 0;
  protected avatarImageError = false;

  protected get hasDraft(): boolean {
    return this.draft.trim().length > 0;
  }

  protected get shouldShowAvatarImage(): boolean {
    if (!this.conversation) return false;
    const hasAvatarUrl = !!(this.conversation.avatarUrl || this.conversation.profile?.avatarUrl);
    return hasAvatarUrl && !this.avatarImageError;
  }

  protected submitMessage(): void {
    if (!this.hasDraft) {
      return;
    }

    this.messageSent.emit(this.draft.trim());
    this.draft = '';
    
    // Marca para fazer scroll após enviar mensagem
    this.shouldScrollToBottom = true;
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

  protected onImageError(_event: Event): void {
    // Se a imagem falhar ao carregar, marca o erro para mostrar o fallback
    this.avatarImageError = true;
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    // Verifica se há novas mensagens
    const currentMessagesLength = this.conversation?.messages?.length ?? 0;
    if (currentMessagesLength !== this.previousMessagesLength) {
      this.previousMessagesLength = currentMessagesLength;
      this.shouldScrollToBottom = true;
    }

    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Quando a conversa muda, marca para fazer scroll e reseta o erro da imagem
    if (changes['conversation']) {
      this.avatarImageError = false;
      if (!changes['conversation'].firstChange) {
        this.shouldScrollToBottom = true;
        this.previousMessagesLength = 0;
      }
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }
}

