import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Conversation } from '../../models/conversation.model';

interface VoiceCallDialogData {
  conversation: Conversation;
}

@Component({
  selector: 'app-contact-voice-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title>Iniciar chamada de voz</h2>
    <div mat-dialog-content class="voice-dialog">
      <div class="voice-dialog__contact">
        <ng-container *ngIf="avatarUrl; else fallbackAvatar">
          <img class="voice-dialog__avatar-image" [src]="avatarUrl" [alt]="displayName" />
        </ng-container>
        <ng-template #fallbackAvatar>
          <div class="voice-dialog__avatar" [style.background-color]="avatarColor">
            {{ contactInitials }}
          </div>
        </ng-template>
        <h3>{{ displayName }}</h3>
        <p>{{ phoneNumber }}</p>
      </div>

      <ng-container [ngSwitch]="simulationStep">
        <div *ngSwitchCase="'idle'" class="voice-dialog__options">
          <button
            mat-stroked-button
            color="primary"
            class="voice-dialog__option-btn"
            (click)="startSimulation('phone')"
          >
            <mat-icon>call</mat-icon>
            <span>
              <strong>Ligar normal</strong>
              <small>Simulação de chamada telefônica</small>
            </span>
          </button>
          <button
            mat-flat-button
            color="primary"
            class="voice-dialog__option-btn voice-dialog__option-btn--whatsapp"
            (click)="startSimulation('whatsapp')"
          >
            <mat-icon>phone_in_talk</mat-icon>
            <span>
              <strong>Ligar pelo WhatsApp</strong>
              <small>Simulação de chamada pelo app</small>
            </span>
          </button>
        </div>

        <div *ngSwitchDefault class="voice-dialog__simulation">
          <div
            class="voice-dialog__pulse"
            [ngClass]="{
              'voice-dialog__pulse--connected': simulationStep === 'connected',
              'voice-dialog__pulse--whatsapp': simulationChannel === 'whatsapp'
            }"
          >
            <mat-icon>{{ simulationIcon }}</mat-icon>
          </div>

          <div class="voice-dialog__status">
            <span class="voice-dialog__channel">{{ simulationChannelLabel }}</span>
            <span class="voice-dialog__status-title">{{ simulationStatusMessage }}</span>
            <p>{{ simulationDescription }}</p>
            <div *ngIf="simulationStep === 'connected'" class="voice-dialog__timer">
              {{ simulationTimer }}
            </div>
          </div>

          <div class="voice-dialog__simulation-actions">
            <button mat-stroked-button color="warn" (click)="resetSimulation()">Encerrar simulação</button>
          </div>
        </div>
      </ng-container>
    </div>

    <div mat-dialog-actions class="voice-dialog__footer">
      <button mat-button (click)="close()">Fechar</button>
    </div>
  `,
  styles: [
    `
      .voice-dialog {
        display: grid;
        gap: 1.75rem;
        padding-bottom: 0.5rem;
      }

      .voice-dialog__contact {
        display: grid;
        justify-items: center;
        gap: 0.5rem;
        text-align: center;
      }

      .voice-dialog__avatar,
      .voice-dialog__avatar-image {
        width: 72px;
        height: 72px;
        border-radius: 50%;
      }

      .voice-dialog__avatar {
        display: grid;
        place-items: center;
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .voice-dialog__avatar-image {
        object-fit: cover;
      }

      .voice-dialog__contact h3 {
        margin: 0;
        font-size: 1.35rem;
        font-weight: 600;
      }

      .voice-dialog__contact p {
        margin: 0;
        color: rgba(15, 23, 42, 0.64);
      }

      .voice-dialog__options {
        display: grid;
        gap: 0.75rem;
      }

      .voice-dialog__option-btn {
        display: grid;
        grid-template-columns: auto 1fr;
        align-items: center;
        gap: 0.75rem;
        text-align: left;
        padding: 0.75rem 1rem;
        border-radius: 18px;
      }

      .voice-dialog__option-btn mat-icon {
        font-size: 1.5rem;
      }

      .voice-dialog__option-btn strong {
        display: block;
        font-weight: 600;
      }

      .voice-dialog__option-btn small {
        display: block;
        color: rgba(15, 23, 42, 0.56);
      }

      .voice-dialog__option-btn--whatsapp {
        background: linear-gradient(135deg, #22c55e, #16a34a);
        color: #fff;
      }

      .voice-dialog__option-btn--whatsapp small {
        color: rgba(255, 255, 255, 0.8);
      }

      .voice-dialog__simulation {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 1.5rem;
        align-items: center;
      }

      .voice-dialog__pulse {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: rgba(37, 99, 235, 0.18);
        color: #1d4ed8;
        display: grid;
        place-items: center;
        font-size: 2rem;
        animation: voicePulse 1.6s ease-out infinite;
      }

      .voice-dialog__pulse--whatsapp {
        background: rgba(34, 197, 94, 0.18);
        color: #15803d;
      }

      .voice-dialog__pulse--connected {
        background: #22c55e;
        color: #fff;
        animation: none;
        box-shadow: 0 0 0 8px rgba(34, 197, 94, 0.25);
      }

      .voice-dialog__status {
        display: grid;
        gap: 0.3rem;
      }

      .voice-dialog__channel {
        display: inline-flex;
        align-items: center;
        gap: 0.3rem;
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        color: rgba(15, 23, 42, 0.56);
      }

      .voice-dialog__status-title {
        font-size: 1.35rem;
        font-weight: 600;
      }

      .voice-dialog__status p {
        margin: 0;
        color: rgba(15, 23, 42, 0.64);
      }

      .voice-dialog__timer {
        margin-top: 0.3rem;
        font-family: 'Roboto Mono', monospace;
        font-size: 1.25rem;
        font-weight: 600;
        color: #15803d;
      }

      .voice-dialog__simulation-actions {
        justify-self: end;
      }

      .voice-dialog__footer {
        justify-content: flex-end;
      }

      @keyframes voicePulse {
        0% {
          box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.35);
        }
        70% {
          box-shadow: 0 0 0 16px rgba(37, 99, 235, 0);
        }
        100% {
          box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);
        }
      }

      @media (max-width: 520px) {
        .voice-dialog__simulation {
          grid-template-columns: 1fr;
          justify-items: center;
          text-align: center;
        }

        .voice-dialog__simulation-actions {
          justify-self: stretch;
        }

        .voice-dialog__simulation-actions button {
          width: 100%;
        }

        .voice-dialog__pulse {
          margin-bottom: 0.5rem;
        }
      }
    `,
  ],
})
export class ContactVoiceDialogComponent implements OnDestroy {
  protected readonly displayName: string;
  protected readonly phoneNumber: string;
  protected readonly avatarColor: string;
  protected readonly contactInitials: string;
  protected readonly avatarUrl: string | null;
  protected simulationStep: 'idle' | 'dialing' | 'connected' = 'idle';
  protected simulationChannel: 'phone' | 'whatsapp' | null = null;
  protected simulationTimer = '00:00';
  private simulationTimeout: ReturnType<typeof setTimeout> | null = null;
  private simulationInterval: ReturnType<typeof setInterval> | null = null;
  private connectedStartTimestamp: number | null = null;

  constructor(
    private readonly dialogRef: MatDialogRef<ContactVoiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: VoiceCallDialogData,
  ) {
    const conversation = data.conversation;
    this.displayName = conversation.profile?.displayName ?? conversation.contactName;
    this.phoneNumber = conversation.profile?.phoneNumber ?? conversation.contactNumber ?? '';
    this.avatarColor = conversation.avatarColor ?? '#3f51b5';
    this.avatarUrl = conversation.avatarUrl ?? null;
    this.contactInitials = this.buildInitials(this.displayName);
  }

  protected close(): void {
    this.resetSimulation();
    this.dialogRef.close();
  }

  protected startSimulation(channel: 'phone' | 'whatsapp'): void {
    this.clearSimulationTimers();
    this.simulationChannel = channel;
    this.simulationStep = 'dialing';
    this.simulationTimer = '00:00';
    this.simulationTimeout = setTimeout(() => {
      this.simulationStep = 'connected';
      this.connectedStartTimestamp = Date.now();
      this.simulationTimer = '00:00';
      this.simulationInterval = setInterval(() => this.updateSimulationTimer(), 1000);
    }, 2200);
  }

  protected resetSimulation(): void {
    this.clearSimulationTimers();
    this.simulationStep = 'idle';
    this.simulationChannel = null;
    this.simulationTimer = '00:00';
  }

  protected get simulationChannelLabel(): string {
    if (this.simulationChannel === 'phone') {
      return 'Ligação tradicional';
    }
    if (this.simulationChannel === 'whatsapp') {
      return 'Chamada pelo WhatsApp';
    }
    return '';
  }

  protected get simulationStatusMessage(): string {
    if (this.simulationStep === 'dialing') {
      return 'Chamando...';
    }
    if (this.simulationStep === 'connected') {
      return 'Cliente atendeu';
    }
    return '';
  }

  protected get simulationDescription(): string {
    if (this.simulationStep === 'dialing') {
      return 'Aguardando atendimento do cliente.';
    }
    if (this.simulationStep === 'connected') {
      return 'Chamada em andamento dentro do aplicativo.';
    }
    return '';
  }

  protected get simulationIcon(): string {
    if (this.simulationStep === 'connected') {
      return 'call';
    }
    return this.simulationChannel === 'whatsapp' ? 'phone_in_talk' : 'ring_volume';
  }

  ngOnDestroy(): void {
    this.resetSimulation();
  }

  private buildInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  }

  private clearSimulationTimers(): void {
    if (this.simulationTimeout) {
      clearTimeout(this.simulationTimeout);
      this.simulationTimeout = null;
    }
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = null;
    }
    this.connectedStartTimestamp = null;
  }

  private updateSimulationTimer(): void {
    if (this.connectedStartTimestamp === null) {
      return;
    }
    const elapsedSeconds = Math.floor((Date.now() - this.connectedStartTimestamp) / 1000);
    const minutes = Math.floor(elapsedSeconds / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
    this.simulationTimer = `${minutes}:${seconds}`;
  }
}

