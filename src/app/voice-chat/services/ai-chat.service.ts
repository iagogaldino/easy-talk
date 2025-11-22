import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ChatResponse {
  success: boolean;
  response: string;
  threadId?: string;
  toolCalls?: Array<{
    id: string;
    name: string;
    arguments: Record<string, any>;
  }>;
}

/**
 * Serviço de chat com IA
 * Integra com backend que se comunica com OpenAI Assistants API
 */
@Injectable({
  providedIn: 'root',
})
export class AIChatService {
  private http = inject(HttpClient);
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private readonly MAX_HISTORY = 10;
  private threadId: string | null = null;
  private readonly apiUrl = `${environment.backendUrl}/api/chat`;

  /**
   * Envia uma mensagem e recebe resposta da IA
   * Agora suporta function calling - retorna tool calls se a IA decidir executar funções
   */
  sendMessage(message: string): Observable<ChatResponse> {
    // Adiciona mensagem do usuário ao histórico
    this.conversationHistory.push({ role: 'user', content: message });
    
    // Limita histórico
    if (this.conversationHistory.length > this.MAX_HISTORY) {
      this.conversationHistory = this.conversationHistory.slice(-this.MAX_HISTORY);
    }

    // Tenta usar backend se disponível
    return this.http.post<ChatResponse>(`${this.apiUrl}/message`, {
      message,
      threadId: this.threadId,
    }).pipe(
      map((response) => {
        // Atualiza threadId se retornado
        if (response.threadId) {
          this.threadId = response.threadId;
        }
        
        // Adiciona resposta ao histórico
        this.conversationHistory.push({ role: 'assistant', content: response.response });
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        // Propaga o erro com a mensagem do backend se disponível
        const errorMessage = error.error?.message || error.message || 'Erro ao processar sua mensagem.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }


  /**
   * Limpa o histórico de conversas e o thread
   */
  clearHistory(): void {
    this.conversationHistory = [];
    this.threadId = null;
    
    // Notifica o backend para limpar o thread
    this.http.post(`${this.apiUrl}/thread/clear`, {}).subscribe({
      error: () => {
        // Erro silencioso ao limpar thread
      },
    });
  }

  /**
   * Limpa todas as mensagens do backend
   */
  clearAllMessages(): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/messages`).pipe(
      map((response) => {
        // Limpa também o histórico local e threadId
        this.conversationHistory = [];
        this.threadId = null;
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message || 'Erro ao limpar mensagens.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Limpa mensagens de um thread específico
   */
  clearThreadMessages(threadId: string): Observable<{ success: boolean; message: string; threadId: string }> {
    return this.http.delete<{ success: boolean; message: string; threadId: string }>(`${this.apiUrl}/messages/${threadId}`).pipe(
      map((response) => {
        // Se for o thread atual, limpa também o histórico local
        if (this.threadId === threadId) {
          this.conversationHistory = [];
          this.threadId = null;
        }
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        const errorMessage = error.error?.message || error.message || 'Erro ao limpar mensagens do thread.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Obtém o histórico de conversas
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}

