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
  events = [
    {
      start:new Date(),
      end: new Date(),
      title:''
    }
  ]

  ngOnInit(): void {
    this.generateMonthDays(this.selectedDate);
  }

  generateMonthDays(date: Date): void {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay(); // Day of the week (0-6, where 0 is Sunday)
    const endDayOfWeek = lastDayOfMonth.getDay();   // Day of the week for the last day of the month

    this.monthDays = [];

    // Add days from the previous month
    for (let i = startDayOfWeek; i > 0; i--) {
      const prevDate = new Date(date.getFullYear(), date.getMonth(), 1 - i);
      this.monthDays.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        events: [{ title: `Event for Day ${i}` }]
      });
    }

    // Add days for the current month
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      this.monthDays.push({
        date: new Date(date.getFullYear(), date.getMonth(), i),
        events: [{ title: `Event for Day ${i}` }]
      });
    }

    // Add days from the next month to fill the last week
    for (let i = 1; i < 7 - endDayOfWeek; i++) {
      const nextDate = new Date(date.getFullYear(), date.getMonth() + 1, i);
      this.monthDays.push({ date: nextDate, events: [] });
    }

    console.log(this.monthDays);
  }




  onDrop(event: CdkDragDrop<any[]>, day: any) {
    console.log(event, day);

    // Check if the event is moved within the same container
    if (event.previousContainer === event.container) {
      const containerData = event.container.data;
      const prevIndex = event.previousIndex;
      const currIndex = event.currentIndex;

      // Rearrange events within the same day
      containerData.splice(currIndex, 0, containerData.splice(prevIndex, 1)[0]);

      // Update the specific day's events in the monthDays array
      const targetDay = this.monthDays.find(d => d.date.getTime() === day.date.getTime());
      if (targetDay) {
        targetDay.events = [...containerData]; // Update with a new array reference
      }
    } else {
      // Move events between days
      const prevContainer = event.previousContainer.data;
      const currContainer = event.container.data;

      // Transfer the event between containers
      transferArrayItem(prevContainer, currContainer, event.previousIndex, event.currentIndex);

      // Update the previous and target days in the monthDays array
      const previousDay = this.monthDays.find(d => d.events === prevContainer);
      const targetDay = this.monthDays.find(d => d.date.getTime() === day.date.getTime());

      if (previousDay) {
        previousDay.events = [...prevContainer]; // Ensure immutability
      }
      if (targetDay) {
        targetDay.events = [...currContainer]; // Ensure immutability
      }
    }
    console.log(this.monthDays)
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
