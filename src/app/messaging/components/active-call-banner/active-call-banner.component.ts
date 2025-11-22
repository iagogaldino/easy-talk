import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CallService, ActiveCall } from '../../services/call.service';
import { ConversationsService } from '../../services/conversations.service';

@Component({
  selector: 'app-active-call-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  template: `
    <div 
      class="active-call-banner" 
      [class.active-call-banner--dialing]="shouldShowBanner && activeCall.state === 'dialing'"
      [class.active-call-banner--connected]="shouldShowBanner && activeCall.state === 'connected'"
      [class.active-call-banner--ending]="shouldShowBanner && activeCall.state === 'ending'"
      *ngIf="shouldShowBanner && activeCall"
    >
      <div class="active-call-banner__content">
        <div class="active-call-banner__icon-wrapper">
          <mat-icon 
            class="active-call-banner__icon"
            [class.active-call-banner__icon--connected]="activeCall.state === 'connected'"
            [class.active-call-banner__icon--ending]="activeCall.state === 'ending'"
          >
            {{ getCallIcon() }}
          </mat-icon>
        </div>
        
        <div class="active-call-banner__info" *ngIf="activeCall">
          <div class="active-call-banner__contact">
            <span class="active-call-banner__name">{{ activeCall.conversation.profile?.displayName ?? activeCall.conversation.contactName }}</span>
            <span class="active-call-banner__status">
              {{ getStatusMessage() }}
            </span>
          </div>
          <div class="active-call-banner__timer" *ngIf="activeCall.state === 'connected'">
            {{ activeCall.timer }}
          </div>
        </div>

        <div class="active-call-banner__actions" *ngIf="activeCall">
          <button
            mat-stroked-button
            class="active-call-banner__action-btn active-call-banner__view-conversation-btn"
            (click)="goToConversation()"
            *ngIf="activeCall.state !== 'ending'"
          >
            <mat-icon>chat</mat-icon>
            Ver conversa
          </button>
          <button
            mat-icon-button
            class="active-call-banner__end-btn"
            (click)="endCall()"
            [disabled]="activeCall.state === 'ending'"
            [attr.aria-label]="activeCall.state === 'dialing' ? 'Cancelar chamada' : 'Desligar'"
          >
            <mat-icon>call_end</mat-icon>
          </button>
          <button
            mat-icon-button
            class="active-call-banner__close-btn"
            (click)="closeBanner()"
            [disabled]="activeCall.state === 'ending'"
            aria-label="Fechar banner"
          >
            <mat-icon>close</mat-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .active-call-banner {
        width: 100%;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        padding: 0.75rem 1rem;
        transition: background 300ms ease, border-bottom-color 300ms ease;
        pointer-events: all;
        position: relative;
        z-index: 1001;
      }

      .active-call-banner--dialing {
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.95), rgba(37, 99, 235, 0.95));
        border-bottom: 1px solid rgba(59, 130, 246, 0.3);
      }

      .active-call-banner--connected {
        background: linear-gradient(135deg, rgba(34, 197, 94, 0.95), rgba(22, 163, 74, 0.95));
        border-bottom: 1px solid rgba(34, 197, 94, 0.3);
      }

      .active-call-banner--ending {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95));
        border-bottom: 1px solid rgba(239, 68, 68, 0.3);
        animation: fadeOut 0.5s ease-out 1.5s forwards;
        opacity: 1;
      }

      .active-call-banner__content {
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 1400px;
        margin: 0 auto;
      }

      .active-call-banner__icon-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .active-call-banner__icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        color: #fff;
        animation: callPulse 1.6s ease-out infinite;
      }

      .active-call-banner__icon--connected {
        animation: none;
      }

      .active-call-banner__icon--ending {
        animation: none;
      }

      .active-call-banner__info {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 1rem;
        min-width: 0;
      }

      .active-call-banner__contact {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        min-width: 0;
      }

      .active-call-banner__name {
        font-weight: 600;
        font-size: 0.95rem;
        color: #fff;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .active-call-banner__status {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.85);
      }

      .active-call-banner__timer {
        font-family: 'Roboto Mono', monospace;
        font-size: 1rem;
        font-weight: 600;
        color: #fff;
        background: rgba(255, 255, 255, 0.2);
        padding: 0.25rem 0.75rem;
        border-radius: 8px;
        white-space: nowrap;
      }

      .active-call-banner__actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .active-call-banner__view-conversation-btn {
        color: #fff;
        border-color: rgba(255, 255, 255, 0.4);
        background: rgba(255, 255, 255, 0.1);
        border-width: 1px;
        border-radius: 20px;
        padding: 0.5rem 1rem;
        font-weight: 500;
        transition: all 200ms ease;
        pointer-events: all;
        cursor: pointer;
        position: relative;
        z-index: 1002;
      }

      .active-call-banner__view-conversation-btn:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.6);
        transform: translateY(-1px);
      }

      .active-call-banner__view-conversation-btn mat-icon {
        margin-right: 0.5rem;
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }

      .active-call-banner__end-btn {
        color: #fff;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: all 200ms ease;
        pointer-events: all;
        cursor: pointer;
        position: relative;
        z-index: 1002;
      }

      .active-call-banner__end-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
        transform: scale(1.05);
      }

      .active-call-banner__end-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .active-call-banner__end-btn mat-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
      }

      .active-call-banner__close-btn {
        color: rgba(255, 255, 255, 0.8);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        transition: all 200ms ease;
        opacity: 0.8;
      }

      .active-call-banner__close-btn:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.15);
        opacity: 1;
        transform: scale(1.1);
      }

      .active-call-banner__close-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      .active-call-banner__close-btn mat-icon {
        font-size: 1.2rem;
        width: 1.2rem;
        height: 1.2rem;
      }

      @keyframes callPulse {
        0% {
          transform: scale(1);
          opacity: 1;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.8;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }

      @keyframes fadeOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-100%);
        }
      }


      @media (max-width: 768px) {
        .active-call-banner__content {
          gap: 0.75rem;
        }

        .active-call-banner__info {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .active-call-banner__actions {
          flex-direction: column;
          gap: 0.25rem;
        }

        .active-call-banner__action-btn {
          font-size: 0.8rem;
          padding: 0.25rem 0.5rem;
        }
      }
    `,
  ],
})
export class ActiveCallBannerComponent implements OnInit, OnDestroy {
  activeCall: ActiveCall | null = null;
  shouldShowBanner = false;
  private subscription?: Subscription;

  constructor(
    private callService: CallService,
    private conversationsService: ConversationsService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // Combina a ligação ativa com a conversa selecionada
    // Só mostra o banner se houver ligação E a conversa selecionada for diferente da ligação
    this.subscription = combineLatest([
      this.callService.activeCall$,
      this.conversationsService.selectedConversationId$
    ]).pipe(
      map(([call, selectedConversationId]) => {
        // Se não há ligação, não mostra o banner
        if (!call) {
          return { call: null, shouldShow: false };
        }
        
        // Se a conversa selecionada é a mesma da ligação, não mostra o banner
        const isSameConversation = call.conversation.id === selectedConversationId;
        
        return {
          call,
          shouldShow: !isSameConversation
        };
      })
    ).subscribe(({ call, shouldShow }) => {
      this.activeCall = call;
      this.shouldShowBanner = shouldShow;
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  endCall(): void {
    this.callService.endCall();
  }

  closeBanner(): void {
    // Apenas fecha o banner sem encerrar a ligação
    this.callService.closeBanner();
  }

  goToConversation(): void {
    if (this.activeCall) {
      // Seleciona a conversa da ligação
      // Isso automaticamente esconderá o banner pois a conversa selecionada será a mesma da ligação
      this.conversationsService.selectConversation(this.activeCall.conversation.id);
      
      // Scroll suave para o topo
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }

  getStatusMessage(): string {
    if (!this.activeCall) {
      return '';
    }
    
    switch (this.activeCall.state) {
      case 'dialing':
        return 'Chamando...';
      case 'connected':
        return 'Em ligação';
      case 'ending':
        return 'Encerrando ligação...';
      default:
        return '';
    }
  }

  getCallIcon(): string {
    if (!this.activeCall) {
      return 'call';
    }
    
    switch (this.activeCall.state) {
      case 'dialing':
        return 'ring_volume';
      case 'connected':
        return 'call';
      case 'ending':
        return 'call_end';
      default:
        return 'call';
    }
  }
}

