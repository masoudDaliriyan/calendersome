import { Component} from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../services/event.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Router } from '@angular/router';
import { Event, MonthDay } from '../../models/models';
import { CdkDragDrop} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-event-scheduler-month-view',
  imports: [SharedModule],
  templateUrl: './event-scheduler-month-view.component.html',
  styleUrl: './event-scheduler-month-view.component.scss'
})
export class EventSchedulerMonthViewComponent {
  constructor(public calendar:CalendarService,public event:EventService,public router:Router)
  {
  }

  onEventClicked(event:Event,uiEvent: MouseEvent){
    uiEvent.stopPropagation()
    this.calendar.openEventModal(event)
  }

  onCalenderDayClick(day:MonthDay){
    this.calendar.selectedDate = day.date
    this.calendar.view = 'day'
  }
}
