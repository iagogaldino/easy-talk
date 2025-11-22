import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChatMessage, Widget } from './models/widget.model';
import { WidgetService } from './services/widget.service';
import { RecentWidgetsService } from './services/recent-widgets.service';
import { WidgetToolsService } from './services/widget-tools.service';
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
    MatTooltipModule,
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
  private typewriterSpeed = 20; // Milissegundos entre cada caractere
  
  // Resize da coluna do chat
  protected chatColumnWidth = 35; // Porcentagem padrão
  protected isResizing = false;
  private readonly STORAGE_KEY = 'admin_chat_column_width';

  protected onLogoError(): void {
    this.logoLoaded = false;
    this.cdr.detectChanges();
  }

  constructor(
    private readonly widgetService: WidgetService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
    private readonly recentWidgetsService: RecentWidgetsService,
    private readonly voiceChatService: VoiceChatService,
    private readonly aiChatService: AIChatService,
    private readonly http: HttpClient,
    private readonly widgetToolsService: WidgetToolsService,
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
    const apiUrl = `${environment.backendUrl}/api/chat/messages`;
    this.http.get<{ success: boolean; messages: ChatMessage[] }>(apiUrl).subscribe({
      next: (response) => {
        if (response.success && response.messages) {
          // Converte timestamps de string para Date
          // Mensagens carregadas não devem ter efeito de digitação
          this.messages = response.messages.map(msg => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
            displayedContent: msg.isUser ? undefined : msg.content, // Mensagens antigas já exibem conteúdo completo
            isTyping: false,
          }));
          
          // Extrai o threadId da última mensagem que tiver threadId
          const lastMessageWithThread = [...this.messages]
            .reverse()
            .find(msg => (msg as any).threadId);
          if (lastMessageWithThread && (lastMessageWithThread as any).threadId) {
            // Atualiza o threadId no serviço de chat
            (this.aiChatService as any).threadId = (lastMessageWithThread as any).threadId;
          }
          
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
    
    // Obtém o threadId atual do serviço de chat
    const currentThreadId = (this.aiChatService as any).threadId || undefined;
    
    // Adiciona mensagem do usuário
    const userMessage: ChatMessage = {
      id: this.generateId(),
      content: messageText,
      isUser: true,
      timestamp: new Date(),
      threadId: currentThreadId,
    };
    this.messages.push(userMessage);
    this.shouldScrollToBottom = true;

    // Envia mensagem para a IA - o backend/agente decide se deve executar tools
    this.isProcessingAI = true;
    
    this.aiChatService.sendMessage(messageText).subscribe({
      next: (response) => {
        // Obtém o threadId atualizado do serviço após a resposta
        const updatedThreadId = (this.aiChatService as any).threadId || currentThreadId;
        
        // Processa tool calls se a IA decidiu executar funções
        if (response.toolCalls && response.toolCalls.length > 0) {
          this.processToolCalls(response.toolCalls, response.response, updatedThreadId);
        } else {
          // Se não há tool calls, apenas exibe a resposta da IA
          const aiMessage: ChatMessage = {
            id: this.generateId(),
            content: response.response,
            isUser: false,
            timestamp: new Date(),
            displayedContent: '',
            isTyping: true,
            threadId: updatedThreadId,
          };
          this.messages.push(aiMessage);
          this.isProcessingAI = false;
          
          // Aplica efeito de digitação
          this.typewriterEffect(aiMessage);
          
          // Se modo voz ativo, fala a resposta
          if (this.isVoiceMode) {
            this.voiceChatService.speak(response.response).catch(() => {
              // Ignora erros de fala
            });
          }
          
          this.cdr.detectChanges();
        }
      },
      error: (error: Error) => {
        // Usa a mensagem de erro do backend se disponível
        const errorContent = `⚠️ ${error.message || 'Desculpe, ocorreu um erro ao processar sua mensagem.'}`;
        const errorMessage: ChatMessage = {
          id: this.generateId(),
          content: errorContent,
          isUser: false,
          timestamp: new Date(),
          displayedContent: '',
          isTyping: true,
        };
        this.messages.push(errorMessage);
        this.isProcessingAI = false;
        
        // Aplica efeito de digitação para mensagens de erro também
        this.typewriterEffect(errorMessage);
        
        this.cdr.detectChanges();
      },
    });

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

  /**
   * Aplica efeito de digitação (typewriter) a uma mensagem da IA
   */
  private typewriterEffect(message: ChatMessage): void {
    if (!message || message.isUser) {
      return;
    }

    const fullText = message.content;
    let currentIndex = 0;
    
    // Inicializa o conteúdo exibido como vazio
    message.displayedContent = '';
    message.isTyping = true;
    this.cdr.detectChanges();

    const typeInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        // Adiciona o próximo caractere
        message.displayedContent = fullText.substring(0, currentIndex + 1);
        currentIndex++;
        
        // Faz scroll durante a digitação
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      } else {
        // Terminou a digitação
        clearInterval(typeInterval);
        message.isTyping = false;
        message.displayedContent = fullText; // Garante que todo o texto está exibido
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      }
    }, this.typewriterSpeed);
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
    // Encontra o widget pelo comando no menu de widgets
    const menuWidget = this.widgetService.createWidgetsMenuWidget();
    let widgetItem: { id: string; name: string; icon?: string; command: string } | null = null;
    
    for (const category of menuWidget.categories) {
      widgetItem = category.widgets.find(w => w.command === command) || null;
      if (widgetItem) break;
    }
    
    if (!widgetItem) {
      // Se não encontrou o widget, envia para o chat como antes
      this.message = command;
      this.sendMessage();
      return;
    }
    
    // Mapeia o id do widget para o nome da tool
    const toolName = this.getToolNameFromWidgetId(widgetItem.id);
    
    if (!toolName) {
      // Se não encontrou a tool, envia para o chat como antes
      this.message = command;
      this.sendMessage();
      return;
    }
    
    // Executa a tool diretamente sem passar pelo chat
    const result = this.widgetToolsService.executeTool(toolName, {});
    
    if (result.success && result.widget) {
      // Adiciona widget à área de widgets
      this.widgets.push(result.widget);
      // Define como aba ativa
      this.activeWidgetId = result.widget.id;
      
      // Adiciona aos widgets recentes
      this.recentWidgetsService.addRecentWidget(result.widget, command, widgetItem.icon || '📊');
      
      this.cdr.detectChanges();
    } else {
      // Se falhou, envia para o chat como fallback
      this.message = command;
      this.sendMessage();
    }
  }

  /**
   * Mapeia o id do widget para o nome da tool correspondente
   */
  private getToolNameFromWidgetId(widgetId: string): string | null {
    const toolMap: Record<string, string> = {
      'kpi-metrics': 'create_kpi_metrics_widget',
      'seller-chart': 'create_seller_chart_widget',
      'sales-chart': 'create_sales_chart_widget',
      'product-chart': 'create_product_chart_widget',
      'region-chart': 'create_region_chart_widget',
      'funnel-chart': 'create_funnel_chart_widget',
      'segment-chart': 'create_segment_chart_widget',
      'sales-table': 'create_sales_table_widget',
      'products-table': 'create_products_table_widget',
      'clients-table': 'create_clients_table_widget',
      'employees-table': 'create_employees_table_widget',
      'tasks-list': 'create_tasks_list_widget',
      'alerts-list': 'create_alerts_list_widget',
      'events-list': 'create_events_list_widget',
      'system-status': 'create_system_status_widget',
      'operations-status': 'create_operations_status_widget',
      'alerts-dashboard': 'create_alerts_dashboard_widget',
      'sales-comparison': 'create_sales_comparison_widget',
      'sellers-comparison': 'create_sellers_comparison_widget',
      'products-comparison': 'create_products_comparison_widget',
      'regions-comparison': 'create_regions_comparison_widget',
      'deliveries': 'create_deliveries_widget',
      'documents': 'create_documents_widget',
      'inactive-clients': 'create_inactive_clients_widget',
      'service-funnel': 'create_service_funnel_widget',
      'widgets-menu': 'create_widgets_menu_widget',
    };
    
    return toolMap[widgetId] || null;
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
      const errorContent = `⚠️ ${error}`;
      const errorMessage: ChatMessage = {
        id: this.generateId(),
        content: errorContent,
        isUser: false,
        timestamp: new Date(),
        displayedContent: '',
        isTyping: true,
      };
      this.messages.push(errorMessage);
      
      // Aplica efeito de digitação
      this.typewriterEffect(errorMessage);
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

  protected handleClearMessages(): void {
    // Confirmação antes de limpar
    if (confirm('Tem certeza que deseja limpar todas as mensagens? Esta ação não pode ser desfeita.')) {
      this.aiChatService.clearAllMessages().subscribe({
        next: () => {
          // Limpa as mensagens localmente
          this.messages = [];
          this.previousMessagesLength = 0;
          
          // Limpa o histórico do serviço de chat
          this.aiChatService.clearHistory();
          
          // Recarrega o widget padrão
          this.widgets = [];
          this.activeWidgetId = null;
          this.initializeDefaultWidget();
          
          this.cdr.detectChanges();
        },
        error: (error: Error) => {
          // Exibe mensagem de erro
          const errorMessage: ChatMessage = {
            id: this.generateId(),
            content: `⚠️ ${error.message || 'Erro ao limpar mensagens.'}`,
            isUser: false,
            timestamp: new Date(),
            displayedContent: '',
            isTyping: true,
          };
          this.messages.push(errorMessage);
          this.typewriterEffect(errorMessage);
          this.cdr.detectChanges();
        },
      });
    }
  }

  /**
   * Processa tool calls retornados pela IA e executa as funções correspondentes
   */
  private processToolCalls(
    toolCalls: Array<{ id: string; name: string; arguments: Record<string, any> }>,
    aiResponse: string,
    threadId?: string
  ): void {
    let widgetsCreated = 0;
    const errors: string[] = [];

    // Executa cada tool call
    for (const toolCall of toolCalls) {
      try {
        const result = this.widgetToolsService.executeTool(toolCall.name, toolCall.arguments);
        
        if (result.success && result.widget) {
          // Adiciona widget à área de widgets
          this.widgets.push(result.widget);
          // Define como aba ativa se for o primeiro widget criado
          if (widgetsCreated === 0) {
            this.activeWidgetId = result.widget.id;
          }
          
          // Adiciona aos widgets recentes
          const command = this.getCommandForWidget(result.widget.type);
          const icon = this.getIconForWidget(result.widget.type);
          this.recentWidgetsService.addRecentWidget(result.widget, command, icon);
          
          widgetsCreated++;
        } else {
          errors.push(result.error || `Erro ao executar ${toolCall.name}`);
        }
      } catch (error: any) {
        errors.push(`Erro ao executar ${toolCall.name}: ${error.message}`);
      }
    }

    // Adiciona mensagem da IA com resultado
    let responseMessage = aiResponse;
    if (widgetsCreated > 0) {
      responseMessage += `\n\n✅ ${widgetsCreated} widget${widgetsCreated > 1 ? 's' : ''} criado${widgetsCreated > 1 ? 's' : ''} com sucesso!`;
    }
    if (errors.length > 0) {
      responseMessage += `\n\n⚠️ Erros: ${errors.join(', ')}`;
    }

    const aiMessage: ChatMessage = {
      id: this.generateId(),
      content: responseMessage,
      isUser: false,
      timestamp: new Date(),
      displayedContent: '',
      isTyping: true,
      threadId,
    };
    this.messages.push(aiMessage);
    this.isProcessingAI = false;
    
    // Aplica efeito de digitação
    this.typewriterEffect(aiMessage);
    
    // Se modo voz ativo, fala a resposta
    if (this.isVoiceMode) {
      this.voiceChatService.speak(responseMessage).catch(() => {
        // Ignora erros de fala
      });
    }
    
    this.cdr.detectChanges();
  }

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

