import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChatMessage, Widget } from './models/widget.model';
import { WidgetInterpreterService } from './services/widget-interpreter.service';
import { WidgetService } from './services/widget.service';
import { RecentWidgetsService } from './services/recent-widgets.service';
import { WidgetRendererComponent } from './components/widget-renderer/widget-renderer.component';
import { Assets } from '../core/constants/assets.enum';
import { VoiceChatService } from '../voice-chat/services/voice-chat.service';
import { AIChatService } from '../voice-chat/services/ai-chat.service';
import { VoiceControlComponent } from '../voice-chat/components/voice-control/voice-control.component';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MarkdownPipe } from './pipes/markdown.pipe';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextFieldModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    WidgetRendererComponent,
    VoiceControlComponent,
    MarkdownPipe,
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent implements AfterViewChecked {
  @ViewChild('messagesContainer', { static: false }) private messagesContainer!: ElementRef<HTMLDivElement>;
  
  protected message = '';
  protected messages: ChatMessage[] = [];
  protected widgets: Widget[] = [];
  protected activeWidgetId: string | null = null;
  protected logoLoaded = true; // Tenta carregar a logo primeiro, se falhar mostra o fallback
  protected readonly logoPath = Assets.LOGO_EMPRESA;
  protected isVoiceMode = false;
  protected isProcessingAI = false;
  private shouldScrollToBottom = false;
  private previousMessagesLength = 0;
  
  // Resize da coluna do chat
  protected chatColumnWidth = 35; // Porcentagem padrão
  protected isResizing = false;
  private readonly STORAGE_KEY = 'admin_chat_column_width';

  protected onLogoError(): void {
    this.logoLoaded = false;
    this.cdr.detectChanges();
  }

  constructor(
    private readonly widgetInterpreter: WidgetInterpreterService,
    private readonly widgetService: WidgetService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly recentWidgetsService: RecentWidgetsService,
    private readonly voiceChatService: VoiceChatService,
    private readonly aiChatService: AIChatService,
    private readonly http: HttpClient,
  ) {
    // Carrega largura salva do localStorage
    this.loadChatColumnWidth();
    
    // Inicializa com o widget de menu de widgets
    this.initializeDefaultWidget();
    
    // Carrega mensagens salvas do backend
    this.loadMessages();
    
    // Carrega vozes disponíveis (necessário para alguns navegadores)
    if (this.voiceChatService.isSupported()) {
      // Chrome precisa que as vozes sejam carregadas após um evento do usuário
      setTimeout(() => {
        this.voiceChatService.getAvailableVoices();
      }, 1000);
    }
  }

  private loadChatColumnWidth(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) {
      const width = parseFloat(saved);
      if (width >= 20 && width <= 60) {
        this.chatColumnWidth = width;
      }
    }
  }

  private saveChatColumnWidth(): void {
    localStorage.setItem(this.STORAGE_KEY, this.chatColumnWidth.toString());
  }

  protected onResizeStart(event: MouseEvent): void {
    event.preventDefault();
    this.isResizing = true;
    document.addEventListener('mousemove', this.onResizeMove);
    document.addEventListener('mouseup', this.onResizeEnd);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  private onResizeMove = (event: MouseEvent): void => {
    if (!this.isResizing) return;
    
    // Desabilita resize em telas pequenas
    if (window.innerWidth <= 768) {
      return;
    }
    
    const container = document.querySelector('.admin-page') as HTMLElement;
    if (!container) return;
    
    const sidebar = document.querySelector('.admin-page__sidebar') as HTMLElement;
    const sidebarWidth = sidebar ? sidebar.offsetWidth : 64;
    const resizerWidth = 8; // Largura do resizer
    
    const containerRect = container.getBoundingClientRect();
    const mouseX = event.clientX - containerRect.left - sidebarWidth;
    const availableWidth = containerRect.width - sidebarWidth - resizerWidth;
    const percentage = (mouseX / availableWidth) * 100;
    
    // Limita entre 20% e 60%
    const clampedWidth = Math.max(20, Math.min(60, percentage));
    this.chatColumnWidth = clampedWidth;
    this.cdr.detectChanges();
  };

  private onResizeEnd = (): void => {
    this.isResizing = false;
    document.removeEventListener('mousemove', this.onResizeMove);
    document.removeEventListener('mouseup', this.onResizeEnd);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    this.saveChatColumnWidth();
  };

  private loadMessages(): void {
    const apiUrl = `${environment.apiUrl}/chat/messages`;
    this.http.get<{ success: boolean; messages: ChatMessage[] }>(apiUrl).subscribe({
      next: (response) => {
        if (response.success && response.messages) {
          // Converte timestamps de string para Date
          this.messages = response.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
          this.previousMessagesLength = this.messages.length;
          this.cdr.detectChanges();
        }
      },
      error: (error) => {
        console.warn('Erro ao carregar mensagens do backend:', error);
        // Continua sem carregar mensagens se houver erro
      },
    });
  }

  private initializeDefaultWidget(): void {
    const widgetsMenuWidget = this.widgetService.createWidgetsMenuWidget();
    this.widgets.push(widgetsMenuWidget);
    this.activeWidgetId = widgetsMenuWidget.id;
  }

  protected get hasMessage(): boolean {
    return this.message.trim().length > 0;
  }

  protected sendMessage(): void {
    if (!this.hasMessage) {
      return;
    }

    const messageText = this.message.trim();
    
    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    // Tenta interpretar e criar widget
    const widget = this.widgetInterpreter.interpretMessage(messageText);
    
    if (widget) {
      // Adiciona widget à área de widgets
      this.widgets.push(widget);
      // Define como aba ativa
      this.activeWidgetId = widget.id;
      
      // Adiciona aos widgets recentes
      const command = this.getCommandForWidget(widget.type);
      const icon = this.getIconForWidget(widget.type);
      this.recentWidgetsService.addRecentWidget(widget, command, icon);
      
      // Adiciona mensagem da IA confirmando criação
      const confirmationMessage = `Widget ${widget.type} criado com sucesso!`;
      const aiMessage: ChatMessage = {
        id: this.generateId(),
        content: confirmationMessage,
        isUser: false,
        timestamp: new Date(),
      };
      this.messages.push(aiMessage);
      this.shouldScrollToBottom = true;
      
      // Se modo voz ativo, fala a confirmação
      if (this.isVoiceMode) {
        this.voiceChatService.speak(confirmationMessage).catch(() => {
          // Ignora erros de fala
        });
      }
    } else {
      // Se não criou widget, usa IA para conversação
      this.isProcessingAI = true;
      this.aiChatService.sendMessage(messageText).subscribe({
        next: (aiResponse) => {
          const aiMessage: ChatMessage = {
            id: this.generateId(),
            content: aiResponse,
            isUser: false,
            timestamp: new Date(),
          };
          this.messages.push(aiMessage);
          this.isProcessingAI = false;
          this.shouldScrollToBottom = true;
          
          // Se modo voz ativo, fala a resposta
          if (this.isVoiceMode) {
            this.voiceChatService.speak(aiResponse).catch(() => {
              // Ignora erros de fala
            });
          }
          
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          // Usa a mensagem de erro do backend se disponível
          const errorMessage: ChatMessage = {
            id: this.generateId(),
            content: `⚠️ ${error.message || 'Desculpe, ocorreu um erro ao processar sua mensagem.'}`,
            isUser: false,
            timestamp: new Date(),
          };
          this.messages.push(errorMessage);
          this.isProcessingAI = false;
          this.shouldScrollToBottom = true;
          this.cdr.detectChanges();
        },
      });
    }

    this.message = '';
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked(): void {
    // Verifica se novas mensagens foram adicionadas
    if (this.messages.length > this.previousMessagesLength) {
      this.shouldScrollToBottom = true;
      this.previousMessagesLength = this.messages.length;
    }
    
    // Faz scroll se necessário
    if (this.shouldScrollToBottom) {
      // Usa setTimeout para garantir que o DOM foi atualizado
      setTimeout(() => {
        this.scrollToBottom();
        this.shouldScrollToBottom = false;
      }, 0);
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        const element = this.messagesContainer.nativeElement;
        // Faz scroll para o final do container
        element.scrollTop = element.scrollHeight;
      }
    } catch (error) {
      // Ignora erros de scroll
      console.warn('Erro ao fazer scroll:', error);
    }
  }

  protected trackByIndex(_index: number, message: ChatMessage): string {
    return message.id;
  }

  protected trackByWidgetId(_index: number, widget: Widget): string {
    return widget.id;
  }

  protected onSellerClick(seller: { name: string; clientsCount: number; avatar?: string; email?: string; department?: string }): void {
    const sellerProfileWidget = this.widgetService.createSellerProfileWidget(seller.name);
    
    if (sellerProfileWidget) {
      this.widgets.push(sellerProfileWidget);
      this.activeWidgetId = sellerProfileWidget.id;
      
      // Adiciona aos widgets recentes
      const command = 'mostrar perfil do vendedor';
      const icon = '👤';
      this.recentWidgetsService.addRecentWidget(sellerProfileWidget, command, icon);
      
      // Força a detecção de mudanças para atualizar a view imediatamente
      this.cdr.detectChanges();
    }
  }

  protected removeWidget(widgetId: string): void {
    this.widgets = this.widgets.filter(w => w.id !== widgetId);
    
    // Se a aba fechada era a ativa, ativa a última aba ou null
    if (this.activeWidgetId === widgetId) {
      this.activeWidgetId = this.widgets.length > 0 ? this.widgets[this.widgets.length - 1].id : null;
    }
  }

  protected handleWidgetRequest(command: string): void {
    // Simula o envio de uma mensagem com o comando do widget
    const widget = this.widgetInterpreter.interpretMessage(command);
    
    if (widget) {
      this.widgets.push(widget);
      this.activeWidgetId = widget.id;
      
      // Adiciona aos widgets recentes
      const icon = this.getIconForWidget(widget.type);
      this.recentWidgetsService.addRecentWidget(widget, command, icon);
      
      this.cdr.detectChanges();
    }
  }

  private getCommandForWidget(widgetType: string): string {
    // Busca o comando no menu de widgets
    const menuWidget = this.widgetService.createWidgetsMenuWidget();
    for (const category of menuWidget.categories) {
      for (const w of category.widgets) {
        if (w.id === widgetType) {
          return w.command;
        }
      }
    }
    // Fallback: retorna um comando genérico baseado no tipo
    return `mostrar ${widgetType.replace(/-/g, ' ')}`;
  }

  private getIconForWidget(widgetType: string): string {
    // Busca o ícone no menu de widgets
    const menuWidget = this.widgetService.createWidgetsMenuWidget();
    for (const category of menuWidget.categories) {
      for (const w of category.widgets) {
        if (w.id === widgetType) {
          return w.icon || '📊';
        }
      }
    }
    return '📊';
  }

  protected handleVoiceTranscription(text: string): void {
    this.message = text;
    this.sendMessage();
  }

  protected handleVoiceError(error: string): void {
    // Não adiciona mensagem de erro muito genérica ou de "no-speech"
    // apenas erros críticos devem aparecer no chat
    if (error.includes('conexão') || error.includes('internet') || 
        error.includes('permissão') || error.includes('microfone não encontrado')) {
      const errorMessage: ChatMessage = {
        id: this.generateId(),
        content: `⚠️ ${error}`,
        isUser: false,
        timestamp: new Date(),
      };
      this.messages.push(errorMessage);
      this.shouldScrollToBottom = true;
      this.cdr.detectChanges();
    }
    // Erros como "no-speech" não precisam aparecer no chat, apenas no tooltip/estado
  }

  protected toggleVoiceMode(): void {
    this.isVoiceMode = !this.isVoiceMode;
    if (!this.isVoiceMode) {
      // Para qualquer fala em andamento
      this.voiceChatService.stopSpeaking();
    }
  }

  protected setActiveWidget(widgetId: string): void {
    this.activeWidgetId = widgetId;
  }

  protected getWidgetTitle(widget: Widget): string {
    return widget.title || `Widget ${widget.type}`;
  }

  protected navigateToConversations(): void {
    // Marca no localStorage que está vindo do admin
    sessionStorage.setItem('fromAdmin', 'true');
    this.router.navigate(['/conversations']);
  }

  protected handleLogout(): void {
    // Limpar dados de autenticação
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');

    // Redirecionar para o login
    this.router.navigate(['/']);
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

