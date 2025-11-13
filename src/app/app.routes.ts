import { Routes } from '@angular/router';

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
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin-page.component').then(
        (m) => m.AdminPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
