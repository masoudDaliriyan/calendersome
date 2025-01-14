import { Injectable } from '@angular/core';
import { Event, SaveInLocalStorageEvent } from '../../pages/event-scheduler/models/models';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  getLocalStorageItem(key: string): SaveInLocalStorageEvent[]|null {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        return JSON.parse(item)
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
      }
    }
    return null;
  }

  setLocalStorageItem(key: string, value: string | Event[]): void {
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
    } catch (error) {
      console.error(`Error stringifying object for localStorage key "${key}":`, error);
    }
  }
}
