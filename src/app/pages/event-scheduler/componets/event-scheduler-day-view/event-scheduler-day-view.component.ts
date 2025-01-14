import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../services/event.service';
import { EventUiService } from '../../services/event-ui.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Event } from '../../models/models';

@Component({
  selector: 'app-event-scheduler-day-view',
  imports: [SharedModule],
  templateUrl: './event-scheduler-day-view.component.html',
  styleUrl: './event-scheduler-day-view.component.scss'
})
export class EventSchedulerDayViewComponent {
  constructor(public calendar:CalendarService,public event:EventService,public eventUI:EventUiService)
  {
  }
  isDragging =false

  @ViewChild('dayViewContainer') dayViewContainer!: ElementRef;

  onDayContainerClicked(){
    this.calendar.openEventModal({
      start:this.calendar.selectedDate
    })
  }

  onEventClicked(event:Event){
    if(this.isDragging) return
    this.calendar.openEventModal(event)
  }

  getEventStyle(event: Event): object {
    return {
      height: this.eventUI.getEventHeight(event) + 'px',
      top: this.eventUI.getEventTop(event) + 'px',
      position: 'absolute',
      right: '0',
      width: '90%',
      border: 'none',
    };
  }

  onDaySlotDrop(event: CdkDragEnd<Event>): void {

    this.isDragging = true; // Set the flag to indicate dragging
    const data:Event = event.source.data
    setTimeout(() => (this.isDragging = false), 0); // Reset the flag after the operation


    const {  elapsedTimeInHour } = this.eventUI.calculateEventPosition(event, this.dayViewContainer.nativeElement);

    if(elapsedTimeInHour<0) return

    const updatedEvent = this.event.calculateNewEventTimes(event, elapsedTimeInHour);
    this.event.updateEvent(data.id,updatedEvent)
  }


}
