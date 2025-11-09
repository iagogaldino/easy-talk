import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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
export class AssistantPanelComponent {
  @Input() open = false;
  @Input() messages: AssistantContextMessage[] = [];
  @Output() closed = new EventEmitter<void>();
  @Output() promptSubmitted = new EventEmitter<string>();

  protected prompt = '';

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

    this.promptSubmitted.emit(this.prompt.trim());
    this.prompt = '';
  }

  protected handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.submit();
    }
  }
}
