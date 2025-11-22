import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

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

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) {
    // Redirect if already authenticated
    if (this.authService.isAuthenticated()) {
      const user = this.authService.getCurrentUser();
      if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/conversations']);
      }
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.error = 'Por favor, preencha todos os campos';
      return;
    }

    this.isLoading = true;
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        if (response.success && response.user) {
          // Get return URL from route parameters or default to a route
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || null;
          
          // Redirect based on user role
          if (response.user.role === 'admin') {
            this.router.navigate([returnUrl || '/admin']);
          } else {
            this.router.navigate([returnUrl || '/conversations']);
          }
        } else {
          this.error = response.error || 'Erro ao fazer login. Tente novamente.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.error = error.error?.error || error.message || 'Erro ao fazer login. Tente novamente.';
        this.isLoading = false;
      }
    });
  }
}

