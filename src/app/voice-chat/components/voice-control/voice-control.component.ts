import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil } from 'rxjs';
import { VoiceChatService } from '../../services/voice-chat.service';
import { VoiceState } from '../../models/voice-chat.model';

@Component({
  selector: 'app-voice-control',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './voice-control.component.html',
  styleUrls: ['./voice-control.component.scss'],
})
export class VoiceControlComponent implements OnInit, OnDestroy {
  @Input() enabled = true;
  @Output() transcription = new EventEmitter<string>();
  @Output() error = new EventEmitter<string>();

  voiceState: VoiceState = {
    isListening: false,
    isSpeaking: false,
    isSupported: false,
    hasPermission: false,
  };

  private destroy$ = new Subject<void>();

  constructor(private voiceChatService: VoiceChatService) {}

  ngOnInit(): void {
    this.voiceChatService
      .getVoiceState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        this.voiceState = state;
      });
  }

  ngOnDestroy(): void {
    this.stopListening();
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleListening(): void {
    if (this.voiceState.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  startListening(): void {
    if (!this.enabled || this.voiceState.isListening) {
      return;
    }

    this.voiceChatService.startListening().subscribe({
      next: (text) => {
        if (text) {
          this.transcription.emit(text);
        }
      },
      error: (errorMessage) => {
        this.error.emit(errorMessage);
      },
    });
  }

  stopListening(): void {
    this.voiceChatService.stopListening();
  }

  cancelListening(): void {
    this.voiceChatService.abortListening();
  }

  getButtonIcon(): string {
    if (this.voiceState.isListening) {
      return 'mic';
    }
    if (this.voiceState.isSpeaking) {
      return 'volume_up';
    }
    return 'mic_none';
  }

  getButtonColor(): string {
    if (this.voiceState.isListening) {
      return 'warn';
    }
    return 'primary';
  }

  getTooltipText(): string {
    if (!this.voiceState.isSupported) {
      return 'Reconhecimento de voz não suportado';
    }
    if (!this.voiceState.hasPermission && !this.voiceState.isListening) {
      return 'Clique para permitir acesso ao microfone';
    }
    if (this.voiceState.isListening) {
      return 'Gravando... Clique para parar';
    }
    if (this.voiceState.isSpeaking) {
      return 'Reproduzindo áudio...';
    }
    return 'Clique para falar';
  }
}

