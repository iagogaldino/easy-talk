import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialer-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  template: `
    <div mat-dialog-content class="dialer-dialog">
      <div class="dialer-dialog__header">
        <h2 class="dialer-dialog__title">Fazer Chamada</h2>
        <p class="dialer-dialog__subtitle">Digite o número do cliente para iniciar a ligação</p>
      </div>

      <div class="dialer-dialog__input-section">
        <mat-form-field appearance="outline" class="dialer-dialog__input-field">
          <mat-icon matPrefix class="dialer-dialog__input-icon">phone</mat-icon>
          <input
            matInput
            type="tel"
            [(ngModel)]="phoneNumber"
            placeholder="(11) 99999-9999"
            class="dialer-dialog__input"
            readonly
          />
        </mat-form-field>
      </div>

      <div class="dialer-dialog__keypad">
        <button
          mat-button
          *ngFor="let key of keypadKeys"
          class="dialer-dialog__key"
          (click)="onKeyPress(key)"
        >
          <span class="dialer-dialog__key-number">{{ key }}</span>
          <span *ngIf="key === '1'" class="dialer-dialog__key-letters"></span>
          <span *ngIf="key === '2'" class="dialer-dialog__key-letters">ABC</span>
          <span *ngIf="key === '3'" class="dialer-dialog__key-letters">DEF</span>
          <span *ngIf="key === '4'" class="dialer-dialog__key-letters">GHI</span>
          <span *ngIf="key === '5'" class="dialer-dialog__key-letters">JKL</span>
          <span *ngIf="key === '6'" class="dialer-dialog__key-letters">MNO</span>
          <span *ngIf="key === '7'" class="dialer-dialog__key-letters">PQRS</span>
          <span *ngIf="key === '8'" class="dialer-dialog__key-letters">TUV</span>
          <span *ngIf="key === '9'" class="dialer-dialog__key-letters">WXYZ</span>
        </button>
      </div>

      <div class="dialer-dialog__actions">
        <button mat-icon-button class="dialer-dialog__action-icon" (click)="onDelete()" [disabled]="!phoneNumber">
          <mat-icon>close</mat-icon>
        </button>
        <button mat-flat-button class="dialer-dialog__action-btn dialer-dialog__action-btn--delete" (click)="onDelete()" [disabled]="!phoneNumber">
          <span>Apagar</span>
        </button>
        <button
          mat-flat-button
          class="dialer-dialog__action-btn dialer-dialog__action-btn--call"
          [disabled]="!canCall"
          (click)="onCall()"
        >
          <mat-icon>call</mat-icon>
          <span>Ligar</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .dialer-dialog {
        display: grid;
        gap: 1.25rem;
        padding: 1.5rem;
        min-width: 380px;
        max-width: 420px;
        width: 100%;
        max-height: 85vh;
        overflow-y: auto;
        overflow-x: hidden;
        box-sizing: border-box;
      }

      .dialer-dialog__header {
        display: grid;
        justify-items: center;
        gap: 0.5rem;
        text-align: center;
        width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__title {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--mat-sys-on-surface);
        word-wrap: break-word;
        max-width: 100%;
      }

      .dialer-dialog__subtitle {
        margin: 0;
        font-size: 0.875rem;
        color: var(--mat-sys-on-surface-variant);
        line-height: 1.4;
        word-wrap: break-word;
        max-width: 100%;
      }

      .dialer-dialog__input-section {
        display: grid;
        margin: 0.5rem 0;
        width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__input-field {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__input-field .mat-mdc-form-field-subscript-wrapper {
        display: none;
      }

      .dialer-dialog__input-icon {
        color: var(--mat-sys-on-surface-variant);
        margin-right: 0.5rem;
      }

      .dialer-dialog__input {
        font-size: 1.25rem;
        font-weight: 500;
        text-align: center;
        letter-spacing: 0.05em;
        padding-left: 0;
        padding-right: 0;
      }

      .dialer-dialog__input-field .mat-mdc-text-field-wrapper {
        padding-left: 0;
      }

      .dialer-dialog__input-field .mat-mdc-form-field-input-control {
        display: flex;
        align-items: center;
      }

      .dialer-dialog__input-field .mat-mdc-form-field-prefix {
        position: absolute;
        left: 16px;
        z-index: 1;
      }

      .dialer-dialog__input-field input {
        text-align: center;
        padding-left: 48px;
        padding-right: 48px;
        max-width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__keypad {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        margin: 0.5rem 0;
        width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__key {
        aspect-ratio: 1;
        min-height: 56px;
        display: grid;
        grid-template-rows: 1fr auto;
        align-items: center;
        justify-items: center;
        padding: 0.75rem;
        border-radius: 12px;
        background: var(--mat-sys-surface-container-highest);
        color: var(--mat-sys-on-surface);
        transition: all 0.2s ease;
      }

      .dialer-dialog__key:hover {
        background: var(--mat-sys-surface-container-high);
        transform: scale(1.05);
      }

      .dialer-dialog__key:active {
        transform: scale(0.95);
        background: var(--mat-sys-primary-container);
        color: var(--mat-sys-on-primary-container);
      }

      .dialer-dialog__key-number {
        font-size: 1.5rem;
        font-weight: 600;
        line-height: 1;
      }

      .dialer-dialog__key-letters {
        font-size: 0.7rem;
        font-weight: 500;
        color: var(--mat-sys-on-surface-variant);
        letter-spacing: 0.05em;
        margin-top: 0.2rem;
      }

      .dialer-dialog__actions {
        display: grid;
        grid-template-columns: auto 1fr 1fr;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__action-icon {
        width: 40px;
        height: 40px;
        color: var(--mat-sys-on-surface-variant);
      }

      .dialer-dialog__action-icon:disabled {
        opacity: 0.4;
      }

      .dialer-dialog__action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        min-height: 44px;
        min-width: 0;
        max-width: 100%;
        box-sizing: border-box;
      }

      .dialer-dialog__action-btn--delete {
        background: var(--mat-sys-surface-container-highest);
        color: var(--mat-sys-on-surface);
      }

      .dialer-dialog__action-btn--delete:hover:not(:disabled) {
        background: var(--mat-sys-surface-container-high);
      }

      .dialer-dialog__action-btn--delete:disabled {
        opacity: 0.5;
      }

      .dialer-dialog__action-btn--call {
        background: linear-gradient(135deg, var(--mat-sys-primary), var(--mat-sys-tertiary));
        color: var(--mat-sys-on-primary);
      }

      .dialer-dialog__action-btn--call:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .dialer-dialog__action-btn--call:disabled {
        opacity: 0.5;
      }

      .dialer-dialog__action-btn mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      @media (max-width: 480px) {
        .dialer-dialog {
          min-width: 100%;
          padding: 1.25rem;
          gap: 1rem;
        }

        .dialer-dialog__keypad {
          gap: 0.5rem;
        }

        .dialer-dialog__key {
          min-height: 52px;
          padding: 0.625rem;
        }

        .dialer-dialog__key-number {
          font-size: 1.35rem;
        }
      }
    `,
  ],
})
export class DialerDialogComponent {
  phoneNumber = '';

  readonly keypadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];

  get canCall(): boolean {
    const digits = this.phoneNumber.replace(/\D/g, '');
    return digits.length >= 10;
  }

  constructor(private readonly dialogRef: MatDialogRef<DialerDialogComponent>) {}

  onKeyPress(key: string): void {
    const digits = this.phoneNumber.replace(/\D/g, '');
    if (digits.length < 15) {
      this.phoneNumber = this.formatPhoneNumber(digits + key);
    }
  }

  onDelete(): void {
    const digits = this.phoneNumber.replace(/\D/g, '');
    if (digits.length > 0) {
      const newDigits = digits.slice(0, -1);
      this.phoneNumber = this.formatPhoneNumber(newDigits);
    }
  }

  onCall(): void {
    if (this.phoneNumber && this.phoneNumber.replace(/\D/g, '').length >= 10) {
      // Aqui você pode implementar a lógica de chamada
      console.log('Ligando para:', this.phoneNumber);
      this.dialogRef.close({ phoneNumber: this.phoneNumber });
    }
  }

  private formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) {
      return '';
    }
    if (digits.length <= 2) {
      return `(${digits}`;
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    if (digits.length <= 11) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
}

