import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./messaging/pages/conversations-page/conversations-page.component').then(
        (m) => m.ConversationsPageComponent,
      ),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
