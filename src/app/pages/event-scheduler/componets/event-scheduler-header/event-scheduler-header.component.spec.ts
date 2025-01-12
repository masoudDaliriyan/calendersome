import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedulerHeaderComponent } from './event-scheduler-header.component';

describe('EventSchedulerHeaderComponent', () => {
  let component: EventSchedulerHeaderComponent;
  let fixture: ComponentFixture<EventSchedulerHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSchedulerHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSchedulerHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
