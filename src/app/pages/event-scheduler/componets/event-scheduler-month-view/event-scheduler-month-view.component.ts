import { Component, ElementRef, ViewChild } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../services/event.service';
import { SharedModule } from '../../../../shared/shared.module';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-event-scheduler-month-view',
  imports: [SharedModule],
  templateUrl: './event-scheduler-month-view.component.html',
  styleUrl: './event-scheduler-month-view.component.scss'
})
export class EventSchedulerMonthViewComponent {
  constructor(public calendar:CalendarService,public event:EventService)
  {
  }

  onEventClicked(event:any){
    this.calendar.openEventModal(event)
  }

  onCalenderDayClick(day:any){
    console.log(day)
      this.calendar.openEventModal({
        date: day.date
      })
  }

  onDrop(event: any, targetDay: any) {
    if (event.previousContainer === event.container)
    {
      // If the item is dropped within the same container, reorder the events
      moveItemInArray(targetDay.events, event.previousIndex, event.currentIndex);
    }
    else
    {
      // If the item is dropped into a different container, transfer the event
      console.log('event',event.container.data)
      this.event.moveEventToAnotherDay(event.item.data.id,event.container.data)
      // transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

}
