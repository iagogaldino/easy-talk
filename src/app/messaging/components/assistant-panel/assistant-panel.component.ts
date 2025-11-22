import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnInit, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AssistantContextMessage } from '../../models/conversation.model';

@Component({
  selector: 'app-assistant-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, TextFieldModule, MatIconModule, MatButtonModule],
  templateUrl: './assistant-panel.component.html',
  styleUrls: ['./assistant-panel.component.scss'],
})
export class AssistantPanelComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input() open = false;
  @Input() messages: AssistantContextMessage[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() promptSubmitted = new EventEmitter<string>();
  @Output() fileSubmitted = new EventEmitter<{ type: 'image' | 'file'; url: string; fileName?: string; fileSize?: string; content?: string }>();

  protected prompt = '';
  protected isDragOver = false;
  protected localMessages: AssistantContextMessage[] = [];
  
  @ViewChild('messagesContainer', { static: false }) messagesContainer!: ElementRef<HTMLElement>;
  private previousMessagesLength = 0;
  private shouldScrollToBottom = false;

  protected close(): void {
    this.closed.emit();
  }

  protected get canSubmit(): boolean {
    return this.prompt.trim().length > 0;
  }

  protected submit(): void {
    if (!this.canSubmit) {
      return;
    }

    // Adiciona mensagem do usuário à lista local
    const userMessage: AssistantContextMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: 'agent',
      type: 'text',
      content: this.prompt.trim(),
      timestamp: new Date().toISOString(),
    };
    
    this.localMessages = [...this.localMessages, userMessage];
    this.shouldScrollToBottom = true;
    this.promptSubmitted.emit(this.prompt.trim());
    this.prompt = '';
  }

  protected getMessageMediaUrl(message: AssistantContextMessage): string {
    // Para mensagens mock, retorna o mediaUrl armazenado
    const msgWithMedia = message as AssistantContextMessage & { mediaUrl?: string };
    return msgWithMedia.mediaUrl || '';
  }

  protected onImageError(event: Event): void {
    console.error('Erro ao carregar imagem:', event);
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }

  ngOnInit(): void {
    this.localMessages = [...this.messages];
    this.previousMessagesLength = this.localMessages.length;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['messages']) {
      this.localMessages = [...this.messages];
      this.shouldScrollToBottom = true;
    }
  }

  ngAfterViewChecked(): void {
    const currentMessagesLength = this.localMessages.length;
    if (currentMessagesLength !== this.previousMessagesLength) {
      this.previousMessagesLength = currentMessagesLength;
      this.shouldScrollToBottom = true;
    }

    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      setTimeout(() => {
        element.scrollTop = element.scrollHeight;
      }, 0);
    }
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    if (event.dataTransfer) {
      // Verifica se há arquivos sendo arrastados
      if (event.dataTransfer.types.includes('Files')) {
        event.dataTransfer.dropEffect = 'copy';
      } else {
        event.dataTransfer.dropEffect = 'move';
      }
    }
    
    this.isDragOver = true;
  }

  protected onDragLeave(event: DragEvent): void {
    // Só remove o estado se realmente saiu do elemento (não apenas de um filho)
    const currentTarget = event.currentTarget as HTMLElement;
    const relatedTarget = event.relatedTarget as HTMLElement | null;
    
    if (!relatedTarget || !currentTarget.contains(relatedTarget)) {
      this.isDragOver = false;
    }
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    
    this.isDragOver = false;
    
    if (!event.dataTransfer) return;
    
    // Verifica se há arquivos sendo soltos
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      this.handleFiles(files);
      return;
    }
    
    try {
      // Tenta obter dados JSON primeiro (mensagem do chat)
      const jsonData = event.dataTransfer.getData('application/json');
      if (jsonData) {
        const messageData = JSON.parse(jsonData);
        if (messageData.content) {
          this.prompt = messageData.content;
          // Auto-submit após um pequeno delay para melhor UX
          setTimeout(() => {
            if (this.canSubmit) {
              this.submit();
            }
          }, 100);
          return;
        }
      }
      
      // Fallback para texto simples
      const textData = event.dataTransfer.getData('text/plain');
      if (textData) {
        this.prompt = textData;
        setTimeout(() => {
          if (this.canSubmit) {
            this.submit();
          }
        }, 100);
      }
    } catch (error) {
      console.error('Erro ao processar drop:', error);
    }
  }

  private handleFiles(files: FileList): void {
    Array.from(files).forEach((file) => {
      const fileType = this.getFileType(file);
      
      if (fileType === 'image') {
        this.handleImageFile(file);
      } else {
        this.handleFile(file);
      }
    });
  }

  private getFileType(file: File): 'image' | 'file' {
    return file.type.startsWith('image/') ? 'image' : 'file';
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  private handleImageFile(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const imageUrl = e.target?.result as string;
      
      // Cria mensagem mock com mediaUrl
      const mockMessage: AssistantContextMessage & { mediaUrl?: string } = {
        id: `mock-image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        author: 'agent',
        type: 'image',
        content: file.name,
        timestamp: new Date().toISOString(),
        mediaUrl: imageUrl,
      };
      
      // Adiciona à lista local de mensagens
      this.localMessages = [...this.localMessages, mockMessage];
      this.shouldScrollToBottom = true;
      
      // Emite evento com dados do arquivo
      this.fileSubmitted.emit({
        type: 'image',
        url: imageUrl,
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        content: file.name,
      });
    };
    
    reader.readAsDataURL(file);
  }

  private handleFile(file: File): void {
    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const fileUrl = e.target?.result as string;
      
      // Cria mensagem mock com mediaUrl
      const mockMessage: AssistantContextMessage & { mediaUrl?: string } = {
        id: `mock-file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        author: 'agent',
        type: 'file',
        content: file.name,
        timestamp: new Date().toISOString(),
        mediaUrl: fileUrl,
      };
      
      // Adiciona à lista local de mensagens
      this.localMessages = [...this.localMessages, mockMessage];
      this.shouldScrollToBottom = true;
      
      // Emite evento com dados do arquivo
      this.fileSubmitted.emit({
        type: 'file',
        url: fileUrl,
        fileName: file.name,
        fileSize: this.formatFileSize(file.size),
        content: file.name,
      });
    };
    
    reader.readAsDataURL(file);
  }
}
