import { Component} from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../services/event.service';
import { SharedModule } from '../../../../shared/shared.module';
import { Router } from '@angular/router';

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

  onEventClicked(event:any,uiEvent:any){
    uiEvent.stopPropagation()
    this.calendar.openEventModal(event)
  }

  onCalenderDayClick(day:any){
    this.calendar.selectedDate = day.date
    this.calendar.view = 'day'
  }

  onDrop(event: any) {
    this.event.moveEventToAnotherDay(event.item.data.id,event.container.data)
  }

}
