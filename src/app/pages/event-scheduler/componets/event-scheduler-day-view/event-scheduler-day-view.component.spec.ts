import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedulerDayViewComponent } from './event-scheduler-day-view.component';

describe('EventSchedulerDayViewComponent', () => {
  let component: EventSchedulerDayViewComponent;
  let fixture: ComponentFixture<EventSchedulerDayViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSchedulerDayViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSchedulerDayViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
