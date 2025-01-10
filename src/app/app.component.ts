import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{
  title = 'masoud-daliriyan-angular-test';
  selectedDate: Date = new Date(); // Default to today's date
  monthDays: (any)[] = []; // Allow null values in the array
  timeSlots:any = [];
  viewOptions=['day','month']
  view = 'month'
  events=[
    {
      title: 'Event 1',
      start: new Date(new Date().setHours(9, 0, 0, 0)), // Today at 9:00 AM
      end: new Date(new Date().setHours(10, 0, 0, 0)) // Today at 10:00 AM
    },
    {
      title: 'Event 2',
      start: new Date(new Date().setHours(11, 0, 0, 0)), // Today at 11:00 AM
      end: new Date(new Date().setHours(12, 0, 0, 0)) // Today at 12:00 PM
    }
  ]


  ngOnInit(): void {
    this.initializeTimeSlots();
    this.generateMonthDays(this.selectedDate);
  }
  connectedLists = this.monthDays.map((_, i) => `cdk-drop-list-${i}`);


  onCdkDropListEntered(event:any){
    console.log('enter',event)
  }
  generateMonthDays(date: Date): void {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const startDayOfWeek = firstDayOfMonth.getDay(); // Day of the week (0-6, where 0 is Sunday)

    this.monthDays = [];
    let day = 1 - startDayOfWeek; // Start from the first visible day (including previous month)

    for (let i = 0; i < 35; i++) { // 4 weeks × 7 days
      this.monthDays.push({
        date: new Date(date.getFullYear(), date.getMonth(), day),
        events: [] // Create a new array for events for each day
      });
      day++;
    }

    this.monthDays[3].events = [
      {title:'A good event'}
    ]
    console.log(this.monthDays);
  }



  onDaySlotDrop(event:any,timeSlot:any){
    if (event.previousContainer === event.container)
    {
      // If the item is dropped within the same container, reorder the events
      moveItemInArray(timeSlot.events, event.previousIndex, event.currentIndex);
    }
    else
    {
      // If the item is dropped into a different container, transfer the event
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  onDrop(event: CdkDragDrop<any[]>, targetDay: any) {
    console.log(event)
    if (event.previousContainer === event.container)
    {
      // If the item is dropped within the same container, reorder the events
      moveItemInArray(targetDay.events, event.previousIndex, event.currentIndex);
    }
    else
    {
      // If the item is dropped into a different container, transfer the event
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private initializeTimeSlots(): void {
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      this.timeSlots.push({ hour, events: [] });
    }
    this.timeSlots[3].events = [
      {
        title:'hello',
      }
    ]
    console.log(this.timeSlots)
  }

  onDateChange(event: any): void {
    this.selectedDate = new Date(event.value);
    this.generateMonthDays(this.selectedDate);
  }

  isToday(day: any): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day.date.getDate() === today.getDate() &&
      day.date.getMonth() === today.getMonth() &&
      day.date.getFullYear() === today.getFullYear()
    );
  }
}
