import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { Conversation } from '../../models/conversation.model';
import { CallService } from '../../services/call.service';

@Component({
  selector: 'app-contact-profile',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './contact-profile.component.html',
  styleUrls: ['./contact-profile.component.scss'],
})
export class ContactProfileComponent implements OnInit, OnDestroy {
  @Input() conversation: Conversation | null = null;
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  protected callState: 'idle' | 'dialing' | 'connected' | 'ending' = 'idle';
  protected callTimer = '00:00';
  private subscription?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private callService: CallService,
  ) {}

  ngOnInit(): void {
    // Observa mudanças na ligação ativa
    this.subscription = this.callService.activeCall$.subscribe((activeCall) => {
      if (activeCall && activeCall.conversation.id === this.conversation?.id) {
        this.callState = activeCall.state;
        this.callTimer = activeCall.timer;
      } else {
        this.callState = 'idle';
        this.callTimer = '00:00';
      }
      this.cdr.detectChanges();
    });
  }

  protected close(): void {
    // Encerra a ligação se estiver ativa para este contato
    const activeCall = this.callService.getActiveCall();
    if (activeCall && activeCall.conversation.id === this.conversation?.id) {
      this.callService.endCall();
    }
    this.closed.emit();
  }

  protected handleVoiceCall(): void {
    if (!this.conversation) {
      return;
    }

    const activeCall = this.callService.getActiveCall();
    
    if (activeCall && activeCall.conversation.id === this.conversation.id) {
      // Se já está em ligação com este contato, encerra
      this.callService.endCall();
    } else if (this.callState === 'idle') {
      // Inicia nova ligação
      this.callService.startCall(this.conversation);
    }
  }

  protected get callStatusMessage(): string {
    if (this.callState === 'dialing') {
      return 'Chamando...';
    }
    if (this.callState === 'connected') {
      return 'Chamada em andamento';
    }
    return '';
  }

  protected get callDescription(): string {
    if (this.callState === 'dialing') {
      return 'Aguardando atendimento do cliente.';
    }
    if (this.callState === 'connected') {
      return 'Chamada ativa - você pode analisar imagens enquanto conversa.';
    }
    return '';
  }

  protected get callIcon(): string {
    if (this.callState === 'connected') {
      return 'call';
    }
    return 'ring_volume';
  }

  protected getCallButtonIcon(): string {
    if (this.callState === 'connected') {
      return 'call_end';
    }
    if (this.callState === 'dialing') {
      return 'close';
    }
    return 'call';
  }

  protected getCallButtonText(): string {
    if (this.callState === 'connected') {
      return 'Desligar';
    }
    if (this.callState === 'dialing') {
      return 'Cancelar';
    }
    return 'Ligar';
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
