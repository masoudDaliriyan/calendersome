import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new BehaviorSubject<any[]>([]); // Reactive event storage

  constructor() {
    this.loadEventsFromLocalStorage();
  }

  // Load events from localStorage on initialization
  private loadEventsFromLocalStorage(): void {
    const storedEvents = localStorage.getItem('events');
    console.log('Stored events:', storedEvents);
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start), // Ensure start is Date object
        end: new Date(event.end), // Ensure end is Date object
      }));
      this.eventsSubject.next(parsedEvents);
      console.log('Events loaded from localStorage:', parsedEvents);
    }
  }

  // Save events to localStorage after any update
  private saveEventsToLocalStorage(): void {
    const events = this.eventsSubject.getValue();
    console.log('Saving events to localStorage:', events);
    localStorage.setItem('events', JSON.stringify(events));
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
    const events = this.eventsSubject.getValue();
    return events.find(event => event.id === eventId);
  }

  // Helper function to filter events by start and end date
  private filterEventsByDate(startOfDay: Date, endOfDay: Date): any[] {
    const events = this.eventsSubject.getValue();
    return events.filter(event =>
      event.end >= startOfDay && event.start <= endOfDay
    );
  }

  // Helper function to generate a new event ID
  private generateNewEventId(): number {
    const events = this.eventsSubject.getValue();
    return events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1;
  }

  // Method to add a new event
  addEvent(newEvent: any): void {
    const events = this.eventsSubject.getValue();
    const eventId = this.generateNewEventId();
    const eventWithId = { ...newEvent, id: eventId };
    console.log('Adding event:', eventWithId);

    const updatedEvents = [...events, eventWithId];
    this.eventsSubject.next(updatedEvents); // Update the BehaviorSubject
    this.saveEventsToLocalStorage();
  }

  // Method to update an event
  updateEvent(eventId: number, updatedEvent: any): boolean {
    const events = this.eventsSubject.getValue();
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) return false;

    events[eventIndex] = { ...events[eventIndex], ...updatedEvent };
    this.eventsSubject.next([...events]); // Emit updated events
    this.saveEventsToLocalStorage();
    return true;
  }

  // Method to change an event's start time (hour change)

  // Method to move an event to another day
  moveEventToAnotherDay(eventId: number, newDate: any): boolean {
    const event = this.getEventById(eventId);
    if (!event) return false;

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

  // Method to delete an event by its ID
  deleteEvent(eventId: number): boolean {
    const events = this.eventsSubject.getValue();
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) return false;

    events.splice(eventIndex, 1);
    this.eventsSubject.next([...events]); // Emit updated events
    this.saveEventsToLocalStorage();
    return true;
  }
}
