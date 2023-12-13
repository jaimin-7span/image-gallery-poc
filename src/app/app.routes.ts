import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
    import('../app/layout/layout.routes'),
  },
];
