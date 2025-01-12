import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-event-scheduler-header',
  imports: [SharedModule],
  templateUrl: './event-scheduler-header.component.html',
  styleUrl: './event-scheduler-header.component.scss'
})
export class EventSchedulerHeaderComponent {

  constructor(public calendar:CalendarService)
  {
  }
  onNextButtonClicked() {
    if (this.calendar.isMonthView) {
      this.calendar.selectedDate.setMonth(this.calendar.selectedDate.getMonth() +1)
      this.calendar.updateMonthDays()

    } else if (this.calendar.isDayView) {
      this.calendar.selectedDate.setDate(this.calendar.selectedDate.getDate() +1)
      this.calendar.updateMonthDays()
    }
  }

  onPrevButtonClicked(){
    if (this.calendar.isMonthView) {
      this.calendar.selectedDate.setMonth(this.calendar.selectedDate.getMonth() -1)
      this.calendar.updateMonthDays()

    } else if (this.calendar.isDayView) {
      this.calendar.selectedDate.setDate(this.calendar.selectedDate.getDate() -1)
      this.calendar.updateMonthDays()
    }
  }
  onTodayButtonClicked(){
    this.calendar.selectedDate = new Date()
    this.calendar.updateMonthDays()
    // this.initializeTimeSlots(this.currentActiveMonth)
    // this.calendar._goToDateInView(this.currentActiveMonth,'month')
  }
  protected readonly onabort = onabort;
}
