import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateTimeService {
  constructor() {}

  /**
   * Get the start of the day for a given date.
   * @param date The input date.
   * @returns A new Date object set to the start of the day.
   */
  getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  /**
   * Get the end of the day for a given date.
   * @param date The input date.
   * @returns A new Date object set to the end of the day.
   */
  getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  /**
   * Calculate the duration between two dates in minutes.
   * @param start The start date.
   * @param end The end date.
   * @returns The duration in minutes.
   */
  getDurationInMinutes(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  /**
   * Add hours to a given date.
   * @param date The original date.
   * @param hours The number of hours to add.
   * @returns A new Date object with the added hours.
   */
  addHours(date: Date, hours: number): Date {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + hours * 60 * 60 * 1000);
    return newDate;
  }

  /**
   * Add minutes to a given date.
   * @param date The original date.
   * @param minutes The number of minutes to add.
   * @returns A new Date object with the added minutes.
   */
  addMinutes(date: Date, minutes: number): Date {
    const newDate = new Date(date);
    newDate.setTime(newDate.getTime() + minutes * 60 * 1000);
    return newDate;
  }

  /**
   * Parse a date string and return a Date object.
   * @param dateString The input date string.
   * @returns A new Date object, or null if invalid.
   */
  parseDate(dateString: string): Date | null {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? null : parsedDate;
  }

  calculateDurationInHours(start: Date, end: Date): number {
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // Duration in hours
  }
}
