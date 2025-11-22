import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { Conversation } from '../../models/conversation.model';
import { TransferAttendanceDialogComponent } from '../transfer-attendance-dialog/transfer-attendance-dialog.component';
import { User } from '../../../admin/models/user.model';

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
  ],
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) conversations: Conversation[] = [];
  @Input() selectedConversationId: string | null = null;
  @Output() conversationSelected = new EventEmitter<string>();
  @Output() transferRequested = new EventEmitter<{ conversationId: string; employee: User }>();

  @ViewChild('contextMenuTrigger', { read: MatMenuTrigger }) contextMenuTrigger!: MatMenuTrigger;
  @ViewChild('contextMenuButton') contextMenuButton!: ElementRef<HTMLButtonElement>;

  contextMenuPosition = { x: 0, y: 0 };
  contextMenuConversationId: string | null = null;
  private clickListener?: (event: MouseEvent) => void;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit(): void {
    // Setup menu positioning when menu opens
    if (this.contextMenuTrigger) {
      this.contextMenuTrigger.menuOpened.subscribe(() => {
        setTimeout(() => {
          const menuElement = document.querySelector('.mat-mdc-menu-panel');
          if (menuElement && this.contextMenuPosition) {
            const menu = menuElement as HTMLElement;
            menu.style.position = 'fixed';
            menu.style.left = `${this.contextMenuPosition.x}px`;
            menu.style.top = `${this.contextMenuPosition.y}px`;
            menu.style.transform = 'none';
          }
        }, 0);
      });

      // Close menu when clicking outside
      this.clickListener = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const menuPanel = document.querySelector('.mat-mdc-menu-panel');
        
        // Don't close if clicking inside the menu
        if (menuPanel && menuPanel.contains(target)) {
          return;
        }
        
        if (this.contextMenuTrigger && this.contextMenuTrigger.menuOpen) {
          this.contextMenuTrigger.closeMenu();
        }
      };
      
      document.addEventListener('click', this.clickListener);
    }
  }

  ngOnDestroy(): void {
    if (this.clickListener) {
      document.removeEventListener('click', this.clickListener);
    }
  }

  protected trackByConversationId(_: number, conversation: Conversation): string {
    return conversation.id;
  }

  protected handleSelection(conversationId: string): void {
    this.conversationSelected.emit(conversationId);
  }

  protected onContextMenu(event: MouseEvent, conversationId: string): void {
    event.preventDefault();
    event.stopPropagation();
    
    // Store position and conversation ID
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuConversationId = conversationId;
    
    // Position the hidden button at cursor location
    if (this.contextMenuButton?.nativeElement) {
      const button = this.contextMenuButton.nativeElement;
      button.style.position = 'fixed';
      button.style.left = `${event.clientX}px`;
      button.style.top = `${event.clientY}px`;
      button.style.zIndex = '1000';
    }
    
    // Open menu programmatically after positioning button
    setTimeout(() => {
      if (this.contextMenuTrigger) {
        this.contextMenuTrigger.openMenu();
      }
    }, 10);
  }

  protected openTransferDialog(): void {
    if (!this.contextMenuConversationId) return;
    
    const conversationId = this.contextMenuConversationId;
    const dialogRef = this.dialog.open(TransferAttendanceDialogComponent, {
      width: '500px',
      disableClose: false,
      panelClass: 'transfer-dialog-panel',
    });

    dialogRef.afterClosed().subscribe((selectedEmployee: User | undefined) => {
      if (selectedEmployee) {
        this.transferRequested.emit({
          conversationId,
          employee: selectedEmployee
        });
      }
      this.contextMenuConversationId = null;
    });
  }
}

