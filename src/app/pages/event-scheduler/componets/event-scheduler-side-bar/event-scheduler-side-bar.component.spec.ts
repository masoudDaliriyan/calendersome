import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedulerSideBarComponent } from './event-scheduler-side-bar.component';

describe('EventSchedulerSideBarComponent', () => {
  let component: EventSchedulerSideBarComponent;
  let fixture: ComponentFixture<EventSchedulerSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSchedulerSideBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSchedulerSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
