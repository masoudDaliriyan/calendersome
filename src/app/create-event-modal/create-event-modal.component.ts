import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { EventService } from '../event.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-create-event-modal',
  templateUrl: './create-event-modal.component.html',
  styleUrls: ['./create-event-modal.component.scss'],
  imports:[
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatTimepickerModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MatIconModule
  ],
  providers: [],
})
export class CreateEventModalComponent implements OnInit{
  eventForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateEventModalComponent>,
    private eventService: EventService,
  @Inject(MAT_DIALOG_DATA) public data: any // Inject the passed data
) {
    console.log(this.data)
    this.eventForm = this.fb.group({
      title: [data?.title || '', [Validators.required]],
      date: [data?.start || '', [Validators.required]],
      startTime: [data?.start || '', [Validators.required]],
      endTime: [data?.end || '', [Validators.required]],
    });
  }
  get isInEditMode(){
    return this.data?.id && true
  }

  onDelete(){
    this.eventService.deleteEvent(this.data.id)
    this.dialogRef.close(); // Close the dialog after deletion
  }

  onUpdate() {
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
  ngOnInit() {
    console.log(this.data?.id)
  }
}
