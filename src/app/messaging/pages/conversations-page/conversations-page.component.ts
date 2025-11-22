import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable, filter, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { AssistantContextMessage, Conversation } from '../../models/conversation.model';
import { ConversationsService } from '../../services/conversations.service';
import { CallService } from '../../services/call.service';
import { ChatListComponent } from '../../components/chat-list/chat-list.component';
import { ChatWindowComponent } from '../../components/chat-window/chat-window.component';
import { ContactProfileComponent } from '../../components/contact-profile/contact-profile.component';
import { AssistantPanelComponent } from '../../components/assistant-panel/assistant-panel.component';
import { DialerDialogComponent } from '../../components/dialer/dialer-dialog.component';
import { SettingsDialogComponent } from '../../components/settings-dialog/settings-dialog.component';
import { ActiveCallBannerComponent } from '../../components/active-call-banner/active-call-banner.component';

interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  action?: 'assistant' | 'dialer';
}

@Component({
  selector: 'app-conversations-page',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ChatListComponent,
    ChatWindowComponent,
    ContactProfileComponent,
    AssistantPanelComponent,
    ActiveCallBannerComponent,
  ],
  templateUrl: './conversations-page.component.html',
  styleUrls: ['./conversations-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationsPageComponent implements OnInit {
  protected conversations$!: Observable<Conversation[]>;
  protected selectedConversationId$!: Observable<string>;
  protected selectedConversation$!: Observable<Conversation | null>;
  protected isProfilePanelOpen = false;
  protected isAssistantPanelOpen = false;
  protected showBackToAdmin = false;
  protected hasActiveCall = false;
  protected readonly assistantMessages: AssistantContextMessage[] = [
    {
      id: 'ai-1',
      author: 'assistant',
      type: 'text',
      content: 'Olá! Posso ajudar você a responder ou resumir esta conversa.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'ai-2',
      author: 'agent',
      type: 'text',
      content: 'Me sugira uma resposta educada para agradecer o cliente.',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'ai-3',
      author: 'assistant',
      type: 'text',
      content: 'Você pode responder: "Obrigado pelo retorno! Assim que tiver novidades, aviso por aqui."',
      timestamp: new Date().toISOString(),
    },
  ];

  protected readonly navItems: NavItem[] = [
    { icon: 'forum', label: 'Conversas', active: true },
    { icon: 'smart_toy', label: 'Assistente IA', action: 'assistant' },
    { icon: 'call', label: 'Chamadas', action: 'dialer' },
    { icon: 'delete', label: 'Arquivados' },
  ];

  constructor(
    private readonly conversationsService: ConversationsService,
    private readonly dialog: MatDialog,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
    private readonly callService: CallService,
  ) {}

  ngOnInit(): void {
    this.conversations$ = this.conversationsService.conversations$;
    this.selectedConversationId$ = this.conversationsService.selectedConversationId$;
    this.selectedConversation$ = this.conversationsService.selectedConversation$;
    
    // Observa ligações ativas E conversa selecionada para ajustar o layout
    // Só aplica margin-top se houver ligação E a conversa selecionada for diferente da ligação
    combineLatest([
      this.callService.activeCall$,
      this.conversationsService.selectedConversationId$
    ]).pipe(
      map(([call, selectedConversationId]) => {
        // Se não há ligação, não precisa de margin-top
        if (!call) {
          return false;
        }
        // Se a conversa selecionada é a mesma da ligação, não precisa de margin-top
        return call.conversation.id !== selectedConversationId;
      })
    ).subscribe((shouldShowBanner) => {
      this.hasActiveCall = shouldShowBanner;
      this.cdr.detectChanges();
    });
    
    // Verifica se veio da página admin através do sessionStorage
    this.checkIfFromAdmin();
    
    // Também verifica quando a navegação termina
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfFromAdmin();
      });
  }

  private checkIfFromAdmin(): void {
    const fromAdmin = sessionStorage.getItem('fromAdmin');
    this.showBackToAdmin = fromAdmin === 'true';
    this.cdr.detectChanges();
  }

  protected handleConversationSelection(conversationId: string): void {
    this.conversationsService.selectConversation(conversationId);
    this.isProfilePanelOpen = false;
    this.isAssistantPanelOpen = false;
  }

  protected handleSendMessage(_: string): void {
    // Implementação real será integrada com backend posteriormente.
  }

  protected handleProfileRequested(): void {
    this.isAssistantPanelOpen = false;
    this.isProfilePanelOpen = true;
  }

  protected handleProfileClosed(): void {
    this.isProfilePanelOpen = false;
  }

  protected handleAssistantToggle(): void {
    this.isProfilePanelOpen = false;
    this.isAssistantPanelOpen = !this.isAssistantPanelOpen;
  }

  protected handleAssistantClosed(): void {
    this.isAssistantPanelOpen = false;
  }

  protected handleNavItemClick(item: NavItem): void {
    if (item.action === 'assistant') {
      this.handleAssistantToggle();
    } else if (item.action === 'dialer') {
      this.openDialerDialog();
    }
  }

  protected openSettingsDialog(): void {
    this.dialog.open(SettingsDialogComponent, {
      width: '400px',
      maxWidth: '90vw',
      panelClass: 'settings-dialog-panel',
      disableClose: false,
    });
  }

  protected navigateToAdmin(): void {
    // Remove a flag ao voltar para admin
    sessionStorage.removeItem('fromAdmin');
    this.router.navigate(['/admin']);
  }

  private openDialerDialog(): void {
    const dialogRef = this.dialog.open(DialerDialogComponent, {
      width: '420px',
      maxWidth: '90vw',
      panelClass: 'dialer-dialog-panel',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.phoneNumber) {
        // Aqui você pode implementar a lógica de iniciar a chamada
        console.log('Número discado:', result.phoneNumber);
      }
    });
  }
}

