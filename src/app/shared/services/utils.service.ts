import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  getLocalStorageItem(key: string): any {
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

  setLocalStorageItem(key: string, value: any): void {
    try {
      const jsonString = JSON.stringify(value);
      localStorage.setItem(key, jsonString);
    } catch (error) {
      console.error(`Error stringifying object for localStorage key "${key}":`, error);
    }
  }
}
