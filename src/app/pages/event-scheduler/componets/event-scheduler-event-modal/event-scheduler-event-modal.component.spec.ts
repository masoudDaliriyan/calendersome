import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedulerEventModalComponent } from './event-scheduler-event-modal.component';

describe('EventSchedulerEventModalComponent', () => {
  let component: EventSchedulerEventModalComponent;
  let fixture: ComponentFixture<EventSchedulerEventModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSchedulerEventModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSchedulerEventModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
