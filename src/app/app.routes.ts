import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'event-scheduler',
    loadComponent: () =>
      import('./pages/event-scheduler/event-scheduler.component')
        .then(m => m.EventSchedulerComponent),
    children: [
      {
        path: 'day',
        loadComponent: () =>
          import('./pages/event-scheduler/componets/event-scheduler-day-view/event-scheduler-day-view.component')
            .then(m => m.EventSchedulerDayViewComponent)
      },
      {
        path: 'month',
        loadComponent: () =>
          import('./pages/event-scheduler/componets/event-scheduler-month-view/event-scheduler-month-view.component')
            .then(m => m.EventSchedulerMonthViewComponent)
      },
    ]
  },
  {
    path: '**',  // Wildcard route for handling invalid paths
    redirectTo: 'event-scheduler/month' // Redirect invalid paths to 'event-scheduler/month'
  }
];
