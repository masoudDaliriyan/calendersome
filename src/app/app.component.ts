import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { EventService } from './event.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventModalComponent } from './create-event-modal/create-event-modal.component';
import { MatCalendar } from '@angular/material/datepicker';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit,AfterViewInit{
  title = 'masoud-daliriyan-angular-test';
  selectedDate: Date = new Date(); // Default to today's date
  monthDays: (any)[] = []; // Allow null values in the array
  timeSlots:any = [];
  viewOptions=['day','month']
  view = 'day'
  @ViewChild('calendar') public calendar!: MatCalendar<Date>;
  @ViewChild('dayViewContainer') dayViewContainer!: ElementRef;
  isDragging = false;



  public currentActiveMonth:any= null


  constructor(public eventService:EventService,public dialog:MatDialog,private renderer: Renderer2)
  {
  }

  ngAfterViewInit() {
    // Select the previous and next buttons
    console.log('calendar',this.calendar);

    this.currentActiveMonth = this.calendar.activeDate;
    this.generateMonthDays(this.currentActiveMonth);

    const prevButton = document.querySelector('.mat-calendar-previous-button');
    const nextButton = document.querySelector('.mat-calendar-next-button');

    // Attach click event listeners
    if (prevButton) {
      this.renderer.listen(prevButton, 'click', () => {
        // this.onPrevButtonClick();
        this.currentActiveMonth = this.calendar.activeDate;
        this.generateMonthDays(this.currentActiveMonth);
      });
    }

    if (nextButton) {
      this.renderer.listen(nextButton, 'click', () => {
        this.currentActiveMonth = this.calendar.activeDate;
        this.generateMonthDays(this.currentActiveMonth);
      });
    }
  }
  onAddEventClicked(){
    const dialogRef =this.dialog.open(CreateEventModalComponent,{
      width:'600px',
    })
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }
  ngOnInit(): void {
    this.initializeTimeSlots(this.selectedDate);
    setTimeout(()=>{
      this.generateMonthDays(this.selectedDate)
    },1000)
  }
  connectedLists = this.monthDays.map((_, i) => `cdk-drop-list-${i}`);

  onTodayClicked(){
    this.currentActiveMonth = new Date()
    this.selectedDate = new Date()
    this.generateMonthDays(this.currentActiveMonth)
    this.initializeTimeSlots(this.currentActiveMonth)
    this.calendar._goToDateInView(this.currentActiveMonth,'month')
  }
  onNextButtonClicked() {
    if (this.view === 'day') {
      // Increment the selected date by 1 day
      this.selectedDate = new Date(this.selectedDate);
      this.selectedDate.setDate(this.selectedDate.getDate() + 1);
    } else if (this.view === 'month') {
      // Increment the selected date by 1 month
      this.currentActiveMonth.setMonth(this.currentActiveMonth.getMonth() + 1);
      this.generateMonthDays(this.currentActiveMonth)
    }
  }

  onPrevButtonClicked(){
    if (this.view === 'day') {
      // Increment the selected date by 1 day
      this.selectedDate = new Date(this.selectedDate);
      this.selectedDate.setDate(this.selectedDate.getDate() - 1);
    } else if (this.view === 'month') {
      // Increment the selected date by 1 month
      this.currentActiveMonth.setMonth(this.currentActiveMonth.getMonth() - 1);
      this.generateMonthDays(this.currentActiveMonth)
    }
  }
  getTitle(): string {
    const date = new Date(this.view === 'day' ? this.selectedDate : this.currentActiveMonth);

    if (this.view === 'day') {
      const dayNumber = date.getDate(); // Get the numeric day of the month
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long' };
      const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date); // Format without the day
      return `${dayNumber} ${formattedDate}`; // Combine day number and formatted date
    }

    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  }



  onEventClicked(event:any,e:any){
    if (this.isDragging) {
      return; // Ignore clicks triggered by drag end
    }
    // Handle the actual click
    console.log('Event clicked:', event);
    const dialogRef = this.dialog.open(CreateEventModalComponent, {
      data: {
        ... event, // Example: pass today's date
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event created:', result);
      }
    });
  }

  onDayContainerClick(day:any){
    if(this.isDragging){
      return
    }
    const dialogRef = this.dialog.open(CreateEventModalComponent, {
      data: {
        date: day.date, // Example: pass today's date
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Event created:', result);
      }
    });
  }

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


  onDaySlotDrop(event: any): void {
    this.isDragging = true; // Set the flag to indicate dragging
    setTimeout(() => (this.isDragging = false), 0); // Reset the flag after the operation

    // Get the parent and draggable element bounding rects
    const parentRect = this.dayViewContainer.nativeElement.getBoundingClientRect();
    const draggableRect = event.source.element.nativeElement.getBoundingClientRect();

    // Calculate offset from the top of the parent container
    const offsetFromTop = draggableRect.top - parentRect.top;

    // Calculate the percentage of the day based on the offset
    const topPercentage = (offsetFromTop / parentRect.height) * 100;

    // Use the event's existing start date for `startOfDay`
    const startOfDay = new Date(event.source.data.start);
    startOfDay.setHours(0, 0, 0, 0); // Reset to midnight of the same date

    // Total day duration in milliseconds (24 hours)
    const totalDayDuration = 24 * 60 * 60 * 1000;
    const elapsedTime = (topPercentage / 100) * totalDayDuration;

    // Calculate the new event start time based on the offset
    const newEventStartTime = new Date(startOfDay.getTime() + elapsedTime);

    // Get the event duration (difference between the current start and end times)
    const eventDuration = event.source.data.end.getTime() - event.source.data.start.getTime();

    // Calculate the new event end time
    const newEventEndTime = new Date(newEventStartTime.getTime() + eventDuration);

    // Update the event using the EventService
    const eventId = event.source.data.id; // Assuming the event item contains an ID
    const updatedEvent = {
      start: newEventStartTime,
      end: newEventEndTime,
    };

    // Call the event service to update the event's start and end times
    const success = this.eventService.updateEvent(eventId, updatedEvent);

    if (success) {
      console.log("Updated event start time:", newEventStartTime);
      console.log("Updated event end time:", newEventEndTime);
    } else {
      console.log("Failed to update event.");
    }
  }





  onDrop(event: CdkDragDrop<any[]>, targetDay: any) {
    if (event.previousContainer === event.container)
    {
      // If the item is dropped within the same container, reorder the events
      moveItemInArray(targetDay.events, event.previousIndex, event.currentIndex);
    }
    else
    {
      // If the item is dropped into a different container, transfer the event
      console.log('event',event.container.data)
      this.eventService.moveEventToAnotherDay(event.item.data.id,event.container.data)
      // transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
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



  getEventTop(event: any): number {
    const startOfDay = new Date(event.start);
    startOfDay.setHours(0, 0, 0, 0);  // Set to midnight to get the start of the day
    const totalDayDuration = 24 * 60 * 60 * 1000; // Total duration in milliseconds (24 hours)

    // Calculate the time elapsed from the start of the day
    const elapsedTime = event.start.getTime() - startOfDay.getTime();

    // Convert elapsed time to a percentage of the total day duration
    const topPercentage = (elapsedTime / totalDayDuration) * 99.7;

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
