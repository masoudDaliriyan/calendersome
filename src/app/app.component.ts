import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EventService } from './event.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';

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
  view = 'day'
  constructor(public eventService:EventService,public dialog:MatDialog)
  {
  }

  onAddEventClicked(){
    const newEvent = {
      title: 'Night Work',
      start: new Date('2025-01-11T21:00:00'),
      end: new Date('2025-01-11T23:00:00'),
    };

    this.eventService.addEvent(newEvent);
    // const dialogRef =this.dialog.open(CreateEventModalComponent,{
    //   width:'600px',
    // })
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   if (result !== undefined) {
    //   }
    // });
  }
  ngOnInit(): void {
    this.initializeTimeSlots(this.selectedDate);
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

  getEventHeight(event: any): number {
    const durationInMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);
    const minutesPerPixel = .83; // 2 pixels per minute of duration (adjust as needed)
    return durationInMinutes * minutesPerPixel;
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
      this.eventService.changeEventHour(event.item.data.id,event.container.data)
    }
  }

  onDrop(event: CdkDragDrop<any[]>, targetDay: any) {
    console.log(event.container.data)
    if (event.previousContainer === event.container)
    {
      // If the item is dropped within the same container, reorder the events
      moveItemInArray(targetDay.events, event.previousIndex, event.currentIndex);
    }
    else
    {
      // If the item is dropped into a different container, transfer the event
      this.eventService.moveEventToAnotherDay(event.item.data.id,event.container.data)
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  private initializeTimeSlots(date: Date): void {
    this.timeSlots = []; // Clear existing time slots

    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0') + ':00';
      this.timeSlots.push({ hour});
    }

    console.log(this.timeSlots); // Log the time slots for debugging
  }


  onDateChange(event: any): void {
    this.selectedDate = new Date(event.value);
    this.generateMonthDays(this.selectedDate);
  }
  getEventTop(event: any): number {
    const startOfDay = new Date(event.start);
    startOfDay.setHours(0, 0, 0, 0);  // Set to midnight to get the start of the day
    const totalDayDuration = 24 * 60 * 60 * 1000; // Total duration in milliseconds (24 hours)

    // Calculate the time elapsed from the start of the day
    const elapsedTime = event.start.getTime() - startOfDay.getTime();

    // Convert elapsed time to a percentage of the total day duration
    const topPercentage = (elapsedTime / totalDayDuration) * 99.4;

    return topPercentage;
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
