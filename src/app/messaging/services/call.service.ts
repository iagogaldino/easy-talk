import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Conversation } from '../models/conversation.model';

export interface ActiveCall {
  conversation: Conversation;
  state: 'dialing' | 'connected' | 'ending';
  startTime: number;
  timer: string;
}

@Injectable({
  providedIn: 'root',
})
export class CallService {
  private readonly activeCallSubject = new BehaviorSubject<ActiveCall | null>(null);
  readonly activeCall$: Observable<ActiveCall | null> = this.activeCallSubject.asObservable();

  private callInterval: ReturnType<typeof setInterval> | null = null;
  private connectedStartTimestamp: number | null = null;

  startCall(conversation: Conversation, onConnected?: () => void): void {
    const activeCall: ActiveCall = {
      conversation,
      state: 'dialing',
      startTime: Date.now(),
      timer: '00:00',
    };
    this.activeCallSubject.next(activeCall);

    // Simula a chamada sendo atendida após 2.2 segundos
    setTimeout(() => {
      const currentCall = this.activeCallSubject.value;
      if (currentCall && currentCall.conversation.id === conversation.id) {
        this.connectedStartTimestamp = Date.now();
        const connectedCall: ActiveCall = {
          ...currentCall,
          state: 'connected',
        };
        this.activeCallSubject.next(connectedCall);
        
        // Inicia o timer
        this.startTimer();
        
        if (onConnected) {
          onConnected();
        }
      }
    }, 2200);
  }

  endCall(): void {
    const currentCall = this.activeCallSubject.value;
    if (!currentCall) {
      return;
    }

    // Para o timer
    this.stopTimer();

    // Muda para estado "ending" com efeito visual vermelho
    const endingCall: ActiveCall = {
      ...currentCall,
      state: 'ending',
    };
    this.activeCallSubject.next(endingCall);

    // Remove o banner após 2 segundos com fadeout
    setTimeout(() => {
      this.activeCallSubject.next(null);
      this.connectedStartTimestamp = null;
    }, 2000);
  }

  private startTimer(): void {
    this.stopTimer();
    this.callInterval = setInterval(() => {
      const activeCall = this.activeCallSubject.value;
      if (activeCall && activeCall.state === 'connected' && this.connectedStartTimestamp) {
        const elapsedSeconds = Math.floor((Date.now() - this.connectedStartTimestamp) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60)
          .toString()
          .padStart(2, '0');
        const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
        const timer = `${minutes}:${seconds}`;
        
        this.activeCallSubject.next({
          ...activeCall,
          timer,
        });
      }
    }, 1000);
  }

  private stopTimer(): void {
    if (this.callInterval) {
      clearInterval(this.callInterval);
      this.callInterval = null;
    }
  }

  closeBanner(): void {
    // Apenas fecha o banner sem encerrar a ligação
    // A ligação continua ativa, apenas o banner é ocultado
    this.activeCallSubject.next(null);
  }

  getActiveCall(): ActiveCall | null {
    return this.activeCallSubject.value;
  }
}

