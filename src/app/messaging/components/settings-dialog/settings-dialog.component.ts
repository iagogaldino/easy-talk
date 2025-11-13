import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';

interface SettingsOption {
  icon: string;
  label: string;
  action: () => void;
  danger?: boolean;
}

@Component({
  selector: 'app-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent {
  protected readonly settingsOptions: SettingsOption[] = [
    {
      icon: 'account_circle',
      label: 'Perfil',
      action: () => this.handleProfile(),
    },
    {
      icon: 'notifications',
      label: 'Notificações',
      action: () => this.handleNotifications(),
    },
    {
      icon: 'palette',
      label: 'Aparência',
      action: () => this.handleAppearance(),
    },
    {
      icon: 'language',
      label: 'Idioma',
      action: () => this.handleLanguage(),
    },
    {
      icon: 'help_outline',
      label: 'Ajuda',
      action: () => this.handleHelp(),
    },
    {
      icon: 'info',
      label: 'Sobre',
      action: () => this.handleAbout(),
    },
  ];

  constructor(
    private readonly dialogRef: MatDialogRef<SettingsDialogComponent>,
    private readonly router: Router,
  ) {}

  protected handleOptionClick(option: SettingsOption): void {
    option.action();
  }

  protected handleLogout(): void {
    // Limpar dados de autenticação
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');

    // Fechar o dialog
    this.dialogRef.close();

    // Redirecionar para o login
    this.router.navigate(['/']);
  }

  private handleProfile(): void {
    console.log('Abrir perfil');
    // Implementar abertura do perfil
  }

  private handleNotifications(): void {
    console.log('Abrir configurações de notificações');
    // Implementar configurações de notificações
  }

  private handleAppearance(): void {
    console.log('Abrir configurações de aparência');
    // Implementar configurações de aparência
  }

  private handleLanguage(): void {
    console.log('Abrir configurações de idioma');
    // Implementar configurações de idioma
  }

  private handleHelp(): void {
    console.log('Abrir ajuda');
    // Implementar ajuda
  }

  private handleAbout(): void {
    console.log('Abrir sobre');
    // Implementar sobre
  }
}

