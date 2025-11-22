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
    <h2 mat-dialog-title class="voice-dialog__title">
      <span>Chamada de voz</span>
    </h2>
    <div mat-dialog-content class="voice-dialog">
      <div class="voice-dialog__contact voice-dialog__section">
        <ng-container *ngIf="avatarUrl; else fallbackAvatar">
          <div class="voice-dialog__avatar-ring">
            <img class="voice-dialog__avatar-image" [src]="avatarUrl" [alt]="displayName" />
          </div>
        </ng-container>
        <ng-template #fallbackAvatar>
          <div class="voice-dialog__avatar-ring">
            <div class="voice-dialog__avatar" [style.background-color]="avatarColor">
              {{ contactInitials }}
            </div>
          </div>
        </ng-template>
        <div class="voice-dialog__identity">
          <h3>{{ displayName }}</h3>
          <p>{{ phoneNumber }}</p>
        </div>
      </div>

      <div class="voice-dialog__simulation voice-dialog__section">
        <div
          class="voice-dialog__pulse"
          [ngClass]="{
            'voice-dialog__pulse--connected': simulationStep === 'connected'
          }"
        >
          <mat-icon>{{ simulationIcon }}</mat-icon>
        </div>

        <div class="voice-dialog__status">
          <span class="voice-dialog__status-title">{{ simulationStatusMessage }}</span>
          <p>{{ simulationDescription }}</p>
          <div *ngIf="simulationStep === 'connected'" class="voice-dialog__timer">
            {{ simulationTimer }}
          </div>
        </div>

        <div class="voice-dialog__simulation-actions">
          <button mat-stroked-button color="warn" (click)="close()">Encerrar chamada</button>
        </div>
      </div>
    </div>

    <div mat-dialog-actions class="voice-dialog__footer">
      <button mat-button (click)="close()">Fechar</button>
    </div>
  `,
  styles: [
    `
      .voice-dialog__title {
        display: grid;
        gap: 0.25rem;
        margin: 0;
        color: rgba(15, 23, 42, 0.92);
      }

      .voice-dialog__title span {
        font-weight: 700;
        font-size: 1.5rem;
      }

      .voice-dialog__title small {
        font-size: 0.95rem;
        color: rgba(15, 23, 42, 0.64);
      }

      .voice-dialog {
        display: grid;
        gap: 1.75rem;
        padding-bottom: 0.5rem;
      }

      .voice-dialog__section {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(243, 246, 255, 0.9));
        border-radius: 24px;
        padding: 1.5rem;
        box-shadow: 0 16px 30px rgba(15, 23, 42, 0.06);
        border: 1px solid rgba(148, 163, 184, 0.14);
      }

      .voice-dialog__contact {
        position: relative;
        display: grid;
        justify-items: center;
        gap: 0.75rem;
        text-align: center;
        padding: 1.5rem 1.25rem 1.25rem;
        overflow: hidden;
        background: linear-gradient(180deg, rgba(59, 130, 246, 0.08), rgba(59, 130, 246, 0));
      }

      .voice-dialog__contact::before {
        content: '';
        position: absolute;
        inset: -40%;
        background: radial-gradient(circle at top, rgba(148, 197, 255, 0.35), transparent 65%);
        opacity: 0.75;
        pointer-events: none;
      }

      .voice-dialog__avatar-ring {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.5), rgba(14, 116, 144, 0.1));
        box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
      }

      .voice-dialog__avatar {
        display: grid;
        place-items: center;
        color: #ffffff;
        font-size: 1.5rem;
        font-weight: 600;
        width: 74px;
        height: 74px;
        border-radius: 50%;
      }

      .voice-dialog__avatar-image {
        width: 74px;
        height: 74px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 10px 20px rgba(15, 23, 42, 0.18);
      }

      .voice-dialog__identity {
        display: grid;
        gap: 0.25rem;
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

      .voice-dialog__simulation {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        align-items: center;
        justify-items: center;
        text-align: center;
      }

      .voice-dialog__pulse {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.22), rgba(59, 130, 246, 0.08));
        color: #1d4ed8;
        border: 1px solid rgba(59, 130, 246, 0.2);
        display: grid;
        place-items: center;
        font-size: 2rem;
        animation: voicePulse 1.6s ease-out infinite;
        box-shadow: 0 14px 26px rgba(59, 130, 246, 0.18);
      }

      .voice-dialog__pulse--connected {
        background: #22c55e;
        color: #fff;
        animation: none;
        box-shadow: 0 0 0 10px rgba(34, 197, 94, 0.18), 0 18px 32px rgba(34, 197, 94, 0.25);
        border-color: transparent;
      }

      .voice-dialog__status {
        display: grid;
        gap: 0.4rem;
        text-align: center;
      }

      .voice-dialog__status-title {
        font-size: 1.35rem;
        font-weight: 600;
        color: rgba(15, 23, 42, 0.92);
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
        color: #166534;
        background: rgba(22, 101, 52, 0.08);
        padding: 0.35rem 0.75rem;
        border-radius: 10px;
        width: max-content;
      }

      .voice-dialog__simulation-actions {
        justify-self: center;
        width: 100%;
      }

      .voice-dialog__simulation-actions button {
        width: 100%;
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
        .voice-dialog__section {
          padding: 1.25rem;
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
  protected simulationStep: 'idle' | 'dialing' | 'connected' = 'dialing';
  protected simulationChannel: 'phone' | 'whatsapp' | null = 'phone';
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
    
    // Inicia automaticamente a simulação quando o modal é aberto
    this.startSimulation('phone');
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
    this.simulationStep = 'dialing';
    this.simulationChannel = 'phone';
    this.simulationTimer = '00:00';
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
    return 'ring_volume';
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

