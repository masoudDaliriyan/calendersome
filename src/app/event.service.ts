import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private events: any[] = [];

  constructor() {
    this.loadEventsFromLocalStorage();
  }

  // Load events from localStorage on initialization
  public loadEventsFromLocalStorage(): void {
    const storedEvents = localStorage.getItem('events');
    console.log('stored',storedEvents)
    if (storedEvents) {
      this.events = JSON.parse(storedEvents);
      console.log(this.events)
      console.log('Events loaded from localStorage:', this.events);  // Debugging
    }
  }

  // Save events to localStorage after any update
  private saveEventsToLocalStorage(): void {
    console.log('Saving events to localStorage:', this.events);  // Debugging
    localStorage.setItem('events', JSON.stringify(this.events));
  }

  // Helper function to get start of day
  private getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  // Helper function to get end of day
  private getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  // Helper function to get event by its ID
  private getEventById(eventId: number): any | undefined {
    return this.events.find(event => event.id === eventId);
  }

  // Helper function to filter events by start and end date
  private filterEventsByDate(startOfDay: Date, endOfDay: Date): any[] {
    return this.events.filter(event =>
      event.end >= startOfDay && event.start <= endOfDay
    );
  }

  // Helper function to generate a new event ID
  private generateNewEventId(): number {
    return this.events.length > 0 ? Math.max(...this.events.map(e => e.id)) + 1 : 1;
  }

  // Method to add a new event
  addEvent(newEvent: any): void {
    const eventId = this.generateNewEventId();
    const eventWithId = { ...newEvent, id: eventId };
    console.log('Adding event:', eventWithId);  // Debugging
    this.events.push(eventWithId);
    this.saveEventsToLocalStorage();
  }

  // Method to update an event
  updateEvent(eventId: number, updatedEvent: any): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    Object.assign(event, updatedEvent);
    this.saveEventsToLocalStorage();
    return true;
  }

  // Method to change an event's start time (hour change)
  changeEventHour(eventId: number, newHour: number): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    const duration = event.end.getTime() - event.start.getTime();
    const newStart = new Date(event.start);
    newStart.setHours(newHour, 0, 0, 0);

    return this.updateEvent(eventId, { start: newStart, end: new Date(newStart.getTime() + duration) });
  }

  // Method to move an event to another day
  moveEventToAnotherDay(eventId: number, newDate: any): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    // Ensure newDate is a valid Date
    const validNewDate = new Date(newDate);
    if (isNaN(validNewDate.getTime())) {
      console.error("Invalid date:", newDate);
      return false;
    }

    const eventDuration = event.end.getTime() - event.start.getTime();
    const newStart = new Date(validNewDate);
    newStart.setHours(event.start.getHours(), event.start.getMinutes(), event.start.getSeconds());

    return this.updateEvent(eventId, { start: newStart, end: new Date(newStart.getTime() + eventDuration) });
  }

  // Method to get events for a specific day
  getEventsForDay(date: Date): any[] {
    const startOfDay = this.getStartOfDay(date);
    const endOfDay = this.getEndOfDay(date);
    return this.filterEventsByDate(startOfDay, endOfDay);
  }

  // Method to get events for a specific hour of a day
  getEventsForHour(date: Date, hour: number): any[] {
    const startOfHour = new Date(date);
    startOfHour.setHours(hour, 0, 0, 0);

    const endOfHour = new Date(startOfHour);
    endOfHour.setHours(hour, 59, 59, 999);

    return this.filterEventsByDate(startOfHour, endOfHour);
  }

  // Method to delete an event by its ID
  deleteEvent(eventId: number): boolean {
    const eventIndex = this.events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) return false;

    this.events.splice(eventIndex, 1);
    this.saveEventsToLocalStorage();
    return true;
  }
}
