import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedulerMonthViewComponent } from './event-scheduler-month-view.component';

describe('EventSchedulerMonthViewComponent', () => {
  let component: EventSchedulerMonthViewComponent;
  let fixture: ComponentFixture<EventSchedulerMonthViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSchedulerMonthViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSchedulerMonthViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
