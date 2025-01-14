import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {

  getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }


  getDurationInMinutes(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }


  addHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + hours * 60 * 60 * 1000);
    return newDate;
  }



  isToday(date: Date): boolean {
    const startOfToday = this.getStartOfDay(new Date());
    const startOfDate = this.getStartOfDay(date)
    return startOfDate.getTime() === startOfToday.getTime();
  }

  /**
   * Parse a date string and return a Date object.
   * @param dateString The input date string.
   * @returns A new Date object, or null if invalid.
   */
  parseDate(dateString: string): Date  {
    return  new Date(dateString)
  }

  calculateDurationInHours(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours
  }
}
