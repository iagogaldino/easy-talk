import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent {
  email = '';
  password = '';
  showPassword = false;
  isLoading = false;
  error = '';

  constructor(private readonly router: Router) {}

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.error = '';

    try {
      // Simulação de login - substituir por chamada real à API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock: aceita qualquer email e senha
      if (this.email && this.password) {
        // Salvar token de autenticação (mock)
        localStorage.setItem('authToken', 'mock-token');
        localStorage.setItem('userEmail', this.email);

        // Verificar se é login de admin
        if (this.email.toLowerCase() === 'admin' && this.password === 'admin') {
          // Redirecionar para a página de admin
          await this.router.navigate(['/admin']);
        } else {
          // Redirecionar para a página de conversas
          await this.router.navigate(['/conversations']);
        }
      }
    } catch (err) {
      this.error = 'Erro ao fazer login. Tente novamente.';
    } finally {
      this.isLoading = false;
    }
  }
}

