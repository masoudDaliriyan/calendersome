import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventModalComponent } from '../../../create-event-modal/create-event-modal.component';
import { EventSchedulerEventModalComponent } from '../componets/event-scheduler-event-modal/event-scheduler-event-modal.component';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private _view: 'day' | 'month' = 'month'; // Default view is 'month'
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
    const date = this.selectedDate

    if (this.view === 'day') {
      const dayNumber = date.getDate(); // Get the numeric day of the month
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date); // Format without the day
      return `${dayNumber} ${formattedDate}`; // Combine day number and formatted date
    }

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
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

  getTimeSlots(): { hour: string }[] {
    const timeSlots = [];
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      timeSlots.push({ hour });
    }
    return timeSlots;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }

  calculateEventPosition(event: any): { top: number; height: number } {
    const startOfDay = new Date(event.start);
    startOfDay.setHours(0, 0, 0, 0); // Reset to midnight of the same date

    const totalDayDuration = 24 * 60 * 60 * 1000; // Total day duration in milliseconds (24 hours)
    const elapsedTime = event.start.getTime() - startOfDay.getTime(); // Time elapsed since midnight

    const topPercentage = (elapsedTime / totalDayDuration) * 100;

    const durationInMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    const minutesPerPixel = 0.83; // Adjust as needed
    const height = durationInMinutes * minutesPerPixel;

    return { top: topPercentage, height };
  }

  openEventModal(data: any) {
    return this.dialog.open(EventSchedulerEventModalComponent, {
      data: data,
    });
  }
}
