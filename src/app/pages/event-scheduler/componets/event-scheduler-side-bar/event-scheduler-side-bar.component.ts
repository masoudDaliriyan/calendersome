import { AfterViewInit, Component, Renderer2, ViewChild } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { CalendarService } from '../../services/calendar.service';
import { MatCalendar } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-event-scheduler-side-bar',
  imports: [SharedModule],
  templateUrl: './event-scheduler-side-bar.component.html',
  styleUrl: './event-scheduler-side-bar.component.scss'
})
export class EventSchedulerSideBarComponent implements AfterViewInit{
  @ViewChild('matCalendar') public matCalendar!: MatCalendar<Date>;

  constructor(public calendar:CalendarService,public renderer:Renderer2,public router:Router)
  {
  }
  onAddEventButtonClicked(){
    this.calendar.openEventModal(null)
  }

  onSelectionChange(value:any){
    this.router.navigate([`/event-scheduler/${value}`])
  }
  setHandlerForMatCalendarPrevAndNextButton(){
    const prevButton = document.querySelector('.mat-calendar-previous-button');

    const nextButton = document.querySelector('.mat-calendar-next-button');

    [prevButton, nextButton].forEach((button) =>{
      this.renderer.listen(button, 'click', () => {
        this.calendar.selectedDate = this.matCalendar.activeDate
        this.calendar.updateMonthDays()
      })
    })
  }

  ngAfterViewInit() {
    this.setHandlerForMatCalendarPrevAndNextButton()
  }

}
