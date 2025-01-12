import { Component, ElementRef, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CalendarService } from '../../services/calendar.service';
import { EventService } from '../../../../event.service';

@Component({
  selector: 'app-event-scheduler-day-view',
  imports: [SharedModule],
  templateUrl: './event-scheduler-day-view.component.html',
  styleUrl: './event-scheduler-day-view.component.scss'
})
export class EventSchedulerDayViewComponent {
  constructor(public calendar:CalendarService,public event:EventService)
  {
  }

  @ViewChild('dayViewContainer') dayViewContainer!: ElementRef;
  getEventHeight(event: any): number {
    const durationInMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    const minutesPerPixel = .83; // 2 pixels per minute of duration (adjust as needed)
    return durationInMinutes * minutesPerPixel;
  }

  onDayContainerClicked(){
    this.calendar.openEventModal({
      date:this.calendar.selectedDate
    })
  }

  onEventClicked(event:any){
    this.calendar.openEventModal(event)
  }
  getEventTop(event: any): number {
    const startOfDay = new Date(event.start);
    startOfDay.setHours(0, 0, 0, 0);  // Set to midnight to get the start of the day
    const totalDayDuration = 24 * 60 * 60 * 1000; // Total duration in milliseconds (24 hours)

    // Calculate the time elapsed from the start of the day
    const elapsedTime = event.start.getTime() - startOfDay.getTime();

    // Convert elapsed time to a percentage of the total day duration
    const topPercentage = (elapsedTime / totalDayDuration) * 99.7;

    return topPercentage;
  }
  onDaySlotDrop(event: any): void {
    // this.isDragging = true; // Set the flag to indicate dragging
    // setTimeout(() => (this.isDragging = false), 0); // Reset the flag after the operation

    // Get the parent and draggable element bounding rects
    const parentRect = this.dayViewContainer.nativeElement.getBoundingClientRect();
    const draggableRect = event.source.element.nativeElement.getBoundingClientRect();

    // Calculate offset from the top of the parent container
    const offsetFromTop = draggableRect.top - parentRect.top;

    // Calculate the percentage of the day based on the offset
    const topPercentage = (offsetFromTop / parentRect.height) * 100;

    // Use the event's existing start date for `startOfDay`
    const startOfDay = new Date(event.source.data.start);
    startOfDay.setHours(0, 0, 0, 0); // Reset to midnight of the same date

    // Total day duration in milliseconds (24 hours)
    const totalDayDuration = 24 * 60 * 60 * 1000;
    const elapsedTime = (topPercentage / 100) * totalDayDuration;

    // Calculate the new event start time based on the offset
    const newEventStartTime = new Date(startOfDay.getTime() + elapsedTime);

    // Get the event duration (difference between the current start and end times)
    const eventDuration = event.source.data.end.getTime() - event.source.data.start.getTime();

    // Calculate the new event end time
    const newEventEndTime = new Date(newEventStartTime.getTime() + eventDuration);

    // Update the event using the EventService
    const eventId = event.source.data.id; // Assuming the event item contains an ID
    const updatedEvent = {
      start: newEventStartTime,
      end: newEventEndTime,
    };

    // Call the event service to update the event's start and end times
    const success = this.event.updateEvent(eventId, updatedEvent);

    if (success) {
      console.log("Updated event start time:", newEventStartTime);
      console.log("Updated event end time:", newEventEndTime);
    } else {
      console.log("Failed to update event.");
    }
  }
}
