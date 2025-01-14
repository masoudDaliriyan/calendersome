import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../../../shared/shared.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { EventService } from '../../services/event.service';
import { timeRangeValidator } from '../../../../shared/validators/time-range.validator';

@Component({
  selector: 'app-event-scheduler-event-modal',
  imports: [SharedModule],
  templateUrl: './event-scheduler-event-modal.component.html',
  styleUrl: './event-scheduler-event-modal.component.scss',
  providers: [ {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
})
export class EventSchedulerEventModalComponent {
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EventSchedulerEventModalComponent>,
    private eventService: EventService,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject the passed data
  ) {
    this.eventForm = this.fb.group(
      {
        title: [data?.title || '', [Validators.required]],
        date: [data?.date || data?.start || '', [Validators.required]],
        startTime: [data?.start || '', [Validators.required]],
        endTime: [data?.end || '', [Validators.required]],
      },
      { validators: timeRangeValidator() } // Apply group-level validator
    );

  }
  get isInEditMode(){
    if (this.data && this.data?.id){
      return true
    }
    return  false
  }

  onDelete(){
    this.eventService.deleteEvent(this.data.id)
    this.dialogRef.close();
  }

  onUpdate() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.valid) {
      const { date, startTime, endTime, title } = this.eventForm.value;

      // Helper function to combine date with time
      const combineDateTime = (date: Date, time: string | Date): Date => {
        const result = new Date(date);
        if (typeof time === 'string') {
          const [hours, minutes] = time.split(':').map(Number);
          result.setHours(hours, minutes, 0, 0);
        } else {
          result.setHours(time.getHours(), time.getMinutes(), 0, 0);
        }
        return result;
      };

      const selectedDate = new Date(date);
      const start = combineDateTime(selectedDate, startTime);
      const end = combineDateTime(selectedDate, endTime);

      // Update the event with the modified data
      this.eventService.updateEvent(this.data.id, {
        title,
        start,
        end,
        ...this.eventForm.value, // Include other form fields, if any
      });

      // Close the dialog
      this.dialogRef.close();
    }
  }

  onAddEvent() {
    this.eventForm.markAllAsTouched();
    if (this.eventForm.valid) {
      const { date, startTime, endTime, title } = this.eventForm.value;

      // Helper function to combine date with time
      const combineDateTime = (date: Date, time: string | Date): Date => {
        const result = new Date(date);
        if (typeof time === 'string') {
          const [hours, minutes] = time.split(':').map(Number);
          result.setHours(hours, minutes, 0, 0);
        } else {
          result.setHours(time.getHours(), time.getMinutes(), 0, 0);
        }
        return result;
      };

      const selectedDate = new Date(date);
      const start = combineDateTime(selectedDate, startTime);
      const end = combineDateTime(selectedDate, endTime);

      // Create the new event and add it
      this.eventService.addEvent({ title, start, end });

      // Close the dialog
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
