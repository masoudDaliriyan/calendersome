import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
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
  view = 'month'
  @ViewChild('calendar') public calendar!: MatCalendar<Date>;
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
        const activeDate = this.calendar.activeDate;
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
      this.eventService.loadEventsFromLocalStorage()
      this.generateMonthDays(this.selectedDate)
    },1000)
  }
  connectedLists = this.monthDays.map((_, i) => `cdk-drop-list-${i}`);

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
    e.stopPropagation()
    console.log(event)
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
    console.log('eveeeeeeeee',event.container.data)
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
