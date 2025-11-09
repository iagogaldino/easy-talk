import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { Conversation } from '../models/conversation.model';
import { MOCK_CONVERSATIONS } from '../../mocks/messaging/mock-conversations';

@Injectable({ providedIn: 'root' })
export class ConversationsService {
  private readonly conversationsSubject = new BehaviorSubject<Conversation[]>(MOCK_CONVERSATIONS);
  private readonly selectedConversationIdSubject = new BehaviorSubject<string>(MOCK_CONVERSATIONS[0]?.id ?? '');

  readonly conversations$ = this.conversationsSubject.asObservable();
  readonly selectedConversationId$ = this.selectedConversationIdSubject.asObservable();
  readonly selectedConversation$ = this.selectedConversationId$.pipe(
    map((id) => this.conversationsSubject.value.find((conversation) => conversation.id === id) ?? null),
  );

  selectConversation(conversationId: string): void {
    this.selectedConversationIdSubject.next(conversationId);
  }
}

