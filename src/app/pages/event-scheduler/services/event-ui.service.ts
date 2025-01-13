import { Injectable } from '@angular/core';
import { DateTimeService } from '../../../shared/services/date-time.service';
import { elementSelectors } from '@angular/cdk/schematics';

@Injectable({
  providedIn: 'root'
})
export class EventUiService {
  public everyHourTimeSlotHeightInPixel=48
  public everyDividerHeightInPixel = .5
  public eventElementPaddingY = 4
  public eventElementMargin = 10

  constructor(public dateTime:DateTimeService) { }

  calculateDividersHeight(elapsedTimeInHour:number){
    return (elapsedTimeInHour + 1) * this.everyDividerHeightInPixel
  }
  getEventHeight(event: any): number {
    const durationInHours = this.dateTime.calculateDurationInHours(event.start,event.end)
    const height = durationInHours  * this.everyHourTimeSlotHeightInPixel
    return height - this.eventElementPaddingY
  }

  getEventTop(event: any, day: any): number {

    // Get the start of the day (midnight)
    const startOfDay = this.dateTime.getStartOfDay(event.start);

    // Calculate the elapsed time from midnight to the event start in minutes
    const elapsedTimeInMinutes = (event.start.getTime() - startOfDay.getTime()) / (1000 * 60);

    // Calculate the top position of the event in pixels based on the elapsed time
    const topInPixels = (elapsedTimeInMinutes / 60) * this.everyHourTimeSlotHeightInPixel - this.eventElementMargin;

    // Adjust the position with a small additional offset for event appearance
    return topInPixels + ((elapsedTimeInMinutes / 60 + 1) * this.everyDividerHeightInPixel);
  }

  calculateEventPosition(event: any, dayViewContainer: HTMLElement) {
    const parentRect = dayViewContainer.getBoundingClientRect();
    const draggableRect = event.source.element.nativeElement.getBoundingClientRect();

    // Calculate offset from the top of the parent container
    const offsetFromTop = draggableRect.top - parentRect.top;

    // Calculate elapsed time in hours based on the offset
    let elapsedTimeInHour = offsetFromTop / this.everyHourTimeSlotHeightInPixel;
    elapsedTimeInHour = elapsedTimeInHour - (this.calculateDividersHeight(elapsedTimeInHour)) / 60;

    return { offsetFromTop, elapsedTimeInHour };
  }
  getTimeSlots(): { hour: string }[] {
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      timeSlots.push({ hour });
    }
    return timeSlots;
  }
}
