import { CommonModule } from '@angular/common';
import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatMessage, Widget } from './models/widget.model';
import { WidgetInterpreterService } from './services/widget-interpreter.service';
import { WidgetService } from './services/widget.service';
import { WidgetRendererComponent } from './components/widget-renderer/widget-renderer.component';
import { Assets } from '../core/constants/assets.enum';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TextFieldModule,
    MatIconModule,
    MatButtonModule,
    WidgetRendererComponent,
  ],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
  protected message = '';
  protected messages: ChatMessage[] = [];
  protected widgets: Widget[] = [];
  protected activeWidgetId: string | null = null;
  protected logoLoaded = true; // Tenta carregar a logo primeiro, se falhar mostra o fallback
  protected readonly logoPath = Assets.LOGO_EMPRESA;

  protected onLogoError(): void {
    this.logoLoaded = false;
    this.cdr.detectChanges();
  }

  constructor(
    private readonly widgetInterpreter: WidgetInterpreterService,
    private readonly widgetService: WidgetService,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
  ) {
    // Inicializa com o widget de menu de widgets
    this.initializeDefaultWidget();
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

    // Tenta interpretar e criar widget
    const widget = this.widgetInterpreter.interpretMessage(messageText);
    
    if (widget) {
      // Adiciona widget à área de widgets
      this.widgets.push(widget);
      // Define como aba ativa
      this.activeWidgetId = widget.id;
      
      // Adiciona mensagem da IA confirmando criação
      const aiMessage: ChatMessage = {
        id: this.generateId(),
        content: `Criei um widget do tipo ${widget.type}!`,
        isUser: false,
        timestamp: new Date(),
      };
      this.messages.push(aiMessage);
    } else {
      // Resposta padrão da IA
      const aiMessage: ChatMessage = {
        id: this.generateId(),
        content: 'Não entendi o comando. Tente usar comandos como "criar card", "gráfico", "tabela", etc.',
        isUser: false,
        timestamp: new Date(),
      };
      this.messages.push(aiMessage);
    }

    this.message = '';
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
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
      this.cdr.detectChanges();
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

