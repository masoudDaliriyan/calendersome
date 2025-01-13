import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../services/event.service';
import { elementSelectors } from '@angular/cdk/schematics';
import { EventUiService } from '../../services/event-ui.service';

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
      date:this.calendar.selectedDate
    })
  }

  onEventClicked(event:any){
    if(this.isDragging) return
    this.calendar.openEventModal(event)
  }


  onDaySlotDrop(event: any): void {
    this.isDragging = true; // Set the flag to indicate dragging
    setTimeout(() => (this.isDragging = false), 0); // Reset the flag after the operation


    const { offsetFromTop, elapsedTimeInHour } = this.eventUI.calculateEventPosition(event, this.dayViewContainer.nativeElement);

    if(elapsedTimeInHour<0) return

    const updatedEvent = this.event.calculateNewEventTimes(event, elapsedTimeInHour);
    this.event.updateEvent(event.source.data.id,updatedEvent)
  }


}
