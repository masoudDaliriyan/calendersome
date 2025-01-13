import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateTimeService } from '../../../shared/services/date-time.service';
import { UtilsService } from '../../../shared/services/utils.service';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new BehaviorSubject<any[]>([]); // Reactive event storage

  constructor(public dateTime:DateTimeService,public utils:UtilsService) {
    this.loadEventsFromLocalStorage();
  }

  private loadEventsFromLocalStorage(): void {
    const storedEvents = this.utils.getLocalStorageItem('events')
    this.initializeEvents(storedEvents)
  }

  initializeEvents(events:any){
    if(!events) return

    const parsedEvents = events.map((event: any) => ({
      ...event,
      start: this.dateTime.parseDate(event.start),
      end: this.dateTime.parseDate(event.end),
    }));

    this.eventsSubject.next(parsedEvents);
  }


  // Save events to localStorage after any update
  private saveEventsToLocalStorage(): void {
    const events = this.eventsSubject.getValue();
    this.utils.setLocalStorageItem('events', events);
  }

  // Helper function to get start of day
  private getEventById(eventId: number): any | undefined {
    const events = this.eventsSubject.getValue();
    return events.find(event => event.id === eventId);
  }

  // Helper function to filter events by start and end date
  private filterEventsByDate(date:any): any[] {
    const startOfDay = this.dateTime.getStartOfDay(date);
    const endOfDay = this.dateTime.getEndOfDay(date);
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
    return this.filterEventsByDate(date);
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

  calculateNewEventTimes(event: any, elapsedTimeInHour: number) {
    const startOfDay = this.dateTime.getStartOfDay(event.source.data.start);
    const newEventStartTime = new Date(startOfDay.getTime() + elapsedTimeInHour * 60 * 60 * 1000);
    const eventDurationInMinutes = this.dateTime.getDurationInMinutes(event.source.data.start,event.source.data.end);
    const newEventEndTime = new Date(newEventStartTime.getTime() + eventDurationInMinutes * 60 * 1000);

    return { start: newEventStartTime, end: newEventEndTime };
  }



}
