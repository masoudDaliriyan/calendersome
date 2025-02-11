import { Component } from '@angular/core';
import { EventSchedulerSideBarComponent } from './componets/event-scheduler-side-bar/event-scheduler-side-bar.component';
import { EventSchedulerHeaderComponent } from './componets/event-scheduler-header/event-scheduler-header.component';
import { CalendarService } from './services/calendar.service';
import { SharedModule } from '../../shared/shared.module';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-event-scheduler',
  imports: [
    EventSchedulerSideBarComponent,
    EventSchedulerHeaderComponent,
    RouterOutlet,
    SharedModule
  ],
  templateUrl: './event-scheduler.component.html',
  styleUrl: './event-scheduler.component.scss'
})

export class EventSchedulerComponent {

  constructor()
  {
  }
}
