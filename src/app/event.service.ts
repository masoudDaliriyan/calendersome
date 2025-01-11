import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // Sample events array to store events
  private events: any[] = [
    { id: 1, title: 'Meeting', start: new Date('2025-01-11T09:00:00'), end: new Date('2025-01-11T12:30:00') },
    { id: 2, title: 'Lunch', start: new Date('2025-01-11T12:40:00'), end: new Date('2025-01-11T13:00:00') },
  ];

  constructor() { }

  // Helper function to get start of day
  private getStartOfDay(date: Date): Date {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }
  moveEventToAnotherDay(eventId: number, newDate: any): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    const eventDuration = event.end.getTime() - event.start.getTime();
    const newStart = new Date(newDate);
    newStart.setHours(event.start.getHours(), event.start.getMinutes(), event.start.getSeconds());

    // Update the event using the service method to update the event
    return this.updateEvent(eventId, { start: newStart, end: new Date(newStart.getTime() + eventDuration) });
  }



  updateEvent(eventId: number, updatedEvent: any): boolean {
    const event = this.events.find(event => event.id === eventId);
    if (!event) {
      console.error(`Event with ID ${eventId} not found.`);
      return false;
    }
    Object.assign(event, updatedEvent);
    console.log(`Event with ID ${eventId} updated successfully.`);
    return true;
  }

  deleteEvent(eventId: number): boolean {
    const initialLength = this.events.length;
    this.events = this.events.filter(event => event.id !== eventId);
    if (this.events.length === initialLength) {
      console.error(`Event with ID ${eventId} not found.`);
      return false;
    }
    console.log(`Event with ID ${eventId} deleted successfully.`);
    return true;
  }

  // Helper function to get end of day
  private getEndOfDay(date: Date): Date {
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return endOfDay;
  }

  // Method to get events for a specific day
  getEventsForDay(date: Date): any[] {
    const startOfDay = this.getStartOfDay(date);
    const endOfDay = this.getEndOfDay(date);
    return this.filterEventsByDate(startOfDay, endOfDay);
  }
  changeEventHour(eventId: number, newHour: number): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

    const duration = event.end.getTime() - event.start.getTime();
    const newStart = new Date(event.start);
    newStart.setHours(newHour, 0, 0, 0);

    return this.updateEvent(eventId, { start: newStart, end: new Date(newStart.getTime() + duration) });
  }

  getEventsForHour(date: Date, hour: number): any[] {
    const startOfHour = new Date(date);
    startOfHour.setHours(hour, 0, 0, 0);

    const endOfHour = new Date(startOfHour);
    endOfHour.setHours(hour, 59, 59, 999);

    return this.filterEventsByDate(startOfHour, endOfHour);
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
    const eventWithId = this.assignEventId(newEvent, eventId);
    this.events.push(eventWithId);
    console.log('Event added:', eventWithId);
  }

  // Helper function to assign an event ID
  private assignEventId(newEvent: any, eventId: number): any {
    return { ...newEvent, id: eventId };
  }

  // Method to update an event by its ID


  // Helper function to find an event index by its ID
  private findEventIndexById(eventId: number): number {
    return this.events.findIndex(event => event.id === eventId);
  }

  // Helper function to update event properties
  private updateEventProperties(eventId: number, updatedEvent: any): any {
    const existingEvent = this.events.find(event => event.id === eventId);
    return { ...existingEvent, ...updatedEvent };
  }

  // Method to delete an event by its ID


  // Helper function to remove an event by index
  private removeEventByIndex(eventIndex: number): void {
    this.events.splice(eventIndex, 1);
  }
  // Method to get a single event by its ID
  // Helper function to find an event by its ID
  private getEventById(eventId: number): any | undefined {
    return this.events.find(event => event.id === eventId);
  }
}
