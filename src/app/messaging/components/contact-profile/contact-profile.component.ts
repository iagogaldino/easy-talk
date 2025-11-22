import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnDestroy, ChangeDetectorRef, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
export class ContactProfileComponent implements OnInit, OnDestroy, OnChanges {
  @Input() conversation: Conversation | null = null;
  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  protected callState: 'idle' | 'dialing' | 'connected' | 'ending' = 'idle';
  protected callTimer = '00:00';
  protected avatarUrl: string | null = null;
  private subscription?: Subscription;

  constructor(
    private cdr: ChangeDetectorRef,
    private callService: CallService,
  ) {}

  ngOnInit(): void {
    // Atualiza a URL do avatar quando a conversa muda
    this.updateAvatarUrl();
    
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['conversation']) {
      this.updateAvatarUrl();
    }
  }

  private updateAvatarUrl(): void {
    if (this.conversation) {
      this.avatarUrl = this.conversation.avatarUrl || this.conversation.profile?.avatarUrl || null;
      console.log('Avatar URL atualizado:', this.avatarUrl, 'para', this.conversation.contactName);
      this.cdr.detectChanges();
    } else {
      this.avatarUrl = null;
    }
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

  protected getAvatarUrl(conversation: Conversation | null): string | null {
    if (!conversation) return null;
    const url = conversation.avatarUrl || conversation.profile?.avatarUrl || null;
    console.log('Avatar URL para', conversation.contactName, ':', url);
    console.log('conversation.avatarUrl:', conversation.avatarUrl);
    console.log('conversation.profile?.avatarUrl:', conversation.profile?.avatarUrl);
    return url;
  }

  protected onImageError(event: Event): void {
    // Se a imagem falhar ao carregar, o template mostrará o fallback automaticamente
    const img = event.target as HTMLImageElement;
    console.error('Erro ao carregar imagem:', img.src);
    img.style.display = 'none';
  }

  protected onImageLoad(event: Event): void {
    console.log('Imagem carregada com sucesso:', (event.target as HTMLImageElement).src);
  }
}
