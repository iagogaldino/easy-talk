import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ChatMessage, Widget } from './models/widget.model';
import { WidgetInterpreterService } from './services/widget-interpreter.service';
import { WidgetRendererComponent } from './components/widget-renderer/widget-renderer.component';

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

  constructor(private readonly widgetInterpreter: WidgetInterpreterService) {}

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

  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

