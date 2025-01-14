import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DateTimeService } from '../../../shared/services/date-time.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Event, SaveInLocalStorageEvent } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new BehaviorSubject<Event[]>([]); // Reactive event storage

  constructor(public dateTime:DateTimeService,public utils:UtilsService) {
    this.loadEventsFromLocalStorage();
  }

  private loadEventsFromLocalStorage(): void {
    const storedEvents = this.utils.getLocalStorageItem('events') || []
    this.initializeEvents(storedEvents)
  }

  initializeEvents(events:SaveInLocalStorageEvent[]){
    if(!events) return

    const parsedEvents: Event[] = events.map((event: SaveInLocalStorageEvent) => ({
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
  private getEventById(eventId: string): Event | undefined {
    const events = this.eventsSubject.getValue();
    return events.find(event => event.id === eventId);
  }

  // Helper function to filter events by start and end date
  private filterEventsByDate(date:Date): Event[] {
    const startOfDay = this.dateTime.getStartOfDay(date);
    const endOfDay = this.dateTime.getEndOfDay(date);
    const events = this.eventsSubject.getValue();
    return events.filter(event =>
      event.end >= startOfDay && event.start <= endOfDay
    );
  }

  // Helper function to generate a new event ID
  private generateNewEventId(): string {
    const timestamp = Date.now().toString(36); // Convert current time to base-36
    const random = Math.random().toString(36).substring(2, 8); // Generate a random string
    return `${timestamp}-${random}`; // Combine timestamp and random string
  }

  // Method to add a new event
  addEvent(title:string,start:Date,end:Date): void {
    const events = this.eventsSubject.getValue();
    const eventId = this.generateNewEventId();
    const eventWithId = {  id: eventId,title,start,end };
    console.log('Adding event:', eventWithId);

    const updatedEvents = [...events, eventWithId];
    this.eventsSubject.next(updatedEvents); // Update the BehaviorSubject
    this.saveEventsToLocalStorage();
  }

  // Method to update an event
  updateEvent(eventId: string, updatedEvent: object): boolean {
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
  moveEventToAnotherDay(eventId: string, newDate: Date): boolean {
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
  getEventsForDay(date: Date): Event[] {
    return this.filterEventsByDate(date);
  }

  // Method to get events for a specific hour of a day

  // Method to delete an event by its ID
  deleteEvent(eventId: string): boolean {
    const events = this.eventsSubject.getValue();
    const eventIndex = events.findIndex(event => event.id === eventId);
    if (eventIndex === -1) return false;

    events.splice(eventIndex, 1);
    this.eventsSubject.next([...events]); // Emit updated events
    this.saveEventsToLocalStorage();
    return true;
  }

  calculateNewEventTimes(event: CdkDragEnd<Event>, elapsedTimeInHour: number) {
    const data:Event = event.source.data
    const startOfDay = this.dateTime.getStartOfDay(data.start);
    const newEventStartTime = new Date(startOfDay.getTime() + elapsedTimeInHour * 60 * 60 * 1000);
    const eventDurationInMinutes = this.dateTime.getDurationInMinutes(data.start,data.end);
    const newEventEndTime = new Date(newEventStartTime.getTime() + eventDurationInMinutes * 60 * 1000);

    return { start: newEventStartTime, end: newEventEndTime };
  }



}
