import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ChatResponse {
  success: boolean;
  response: string;
  threadId?: string;
}

/**
 * Serviço de chat com IA
 * Integra com backend que se comunica com OpenAI Assistants API
 * Fallback para respostas mockadas quando backend não disponível
 */
@Injectable({
  providedIn: 'root',
})
export class AIChatService {
  private http = inject(HttpClient);
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];
  private readonly MAX_HISTORY = 10;
  private threadId: string | null = null;
  private readonly apiUrl = `${environment.apiUrl}/chat`;

  /**
   * Envia uma mensagem e recebe resposta da IA
   */
  sendMessage(message: string): Observable<string> {
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
        return response.response;
      }),
      catchError((error: HttpErrorResponse) => {
        console.warn('Erro ao comunicar com backend:', error);
        
        // Se o erro tem uma mensagem específica do backend, usa ela
        let errorResponse = 'Erro ao processar sua mensagem.';
        
        if (error.error && error.error.message) {
          errorResponse = error.error.message;
        } else if (error.message) {
          errorResponse = error.message;
        }
        
        // Retorna o erro para que o componente possa exibi-lo
        return throwError(() => new Error(errorResponse));
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
      error: (error) => console.warn('Erro ao limpar thread no backend:', error),
    });
  }

  /**
   * Obtém o histórico de conversas
   */
  getHistory(): Array<{ role: 'user' | 'assistant'; content: string }> {
    return [...this.conversationHistory];
  }
}

