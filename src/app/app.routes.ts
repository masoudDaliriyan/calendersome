import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'event-scheduler',
    loadComponent: () =>
      import('./pages/event-scheduler/event-scheduler.component')
        .then(m => m.EventSchedulerComponent)
  }
];
