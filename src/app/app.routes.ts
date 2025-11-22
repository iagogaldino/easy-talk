import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./auth/pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'conversations',
    loadComponent: () =>
      import('./messaging/pages/conversations-page/conversations-page.component').then(
        (m) => m.ConversationsPageComponent,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-page.component').then(
        (m) => m.AdminPageComponent,
      ),
    canActivate: [AdminGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
