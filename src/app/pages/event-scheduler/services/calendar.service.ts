import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EventSchedulerEventModalComponent } from '../componets/event-scheduler-event-modal/event-scheduler-event-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private _view: 'day' | 'month' = 'day'; // Default view is 'month'
  private _selectedDate: Date = new Date(); // Default to today
  private _monthDays: { date: Date; events: any[] }[] = [];

  constructor(public dialog: MatDialog) {
    this.updateMonthDays();
  }

  // Getter and Setter for selectedDate
  get selectedDate(): Date {
    return this._selectedDate;
  }

  set selectedDate(date: Date) {
    this._selectedDate = date;
    this.updateMonthDays(); // Automatically update monthDays when selectedDate changes
  }

  // Getter and Setter for view
  get view(): 'day' | 'month' {
    return this._view;
  }

  set view(viewType: 'day' | 'month') {
    this._view = viewType;
  }

  // Check if the current view is day or month
  get isDayView(): boolean {
    return this._view === 'day';
  }

  get isMonthView(): boolean {
    return this._view === 'month';
  }

  // Getter for monthDays (now a simple array)
  get monthDays() {
    return this._monthDays;
  }

  // Update monthDays array
  updateMonthDays(): void {
    console.log('updateMonth');
    this._monthDays = this.generateMonthDays(this._selectedDate);
  }


  getTitle(): string {
    const isDayView = this.view === 'day';

    const dateOptions: Intl.DateTimeFormatOptions = isDayView
      ? { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'long' };

    return new Intl.DateTimeFormat('en-US', dateOptions).format(this.selectedDate);
  }

  private generateMonthDays(date: Date): { date: Date; events: any[] }[] {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // Day of the week (0-6, where 0 is Sunday)

    const monthDays = [];
    let day = 1 - startDayOfWeek; // Start from the first visible day (including previous month)

    for (let i = 0; i < 35; i++) {
      monthDays.push({
        date: new Date(date.getFullYear(), date.getMonth(), day),
        events: [], // Placeholder for events
      });
      day++;
    }

    return monthDays;
  }



  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  openEventModal(data: any) {
    return this.dialog.open(EventSchedulerEventModalComponent, {
      data: data,
    });
  }
}
