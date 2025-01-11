import { Component, Inject } from '@angular/core';
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
export class CreateEventModalComponent {
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
      date: [data?.date || '', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    });
  }

  onAddEvent() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      // Extract the selected date
      const selectedDate = new Date(formValue.date);

      // Check and extract start and end times
      const startTime = formValue.startTime instanceof Date ? formValue.startTime : new Date(`1970-01-01T${formValue.startTime}:00`);
      const endTime = formValue.endTime instanceof Date ? formValue.endTime : new Date(`1970-01-01T${formValue.endTime}:00`);

      // Set the hours and minutes for the start and end times based on selected date
      const start = new Date(selectedDate);
      start.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);

      const end = new Date(selectedDate);
      end.setHours(endTime.getHours(), endTime.getMinutes(), 0, 0);

      // Construct the new event
      const newEvent = {
        title: formValue.title,
        start,
        end,
      };

      // Call the event service to add the event
      this.eventService.addEvent(newEvent);

      // Close the dialog
      this.dialogRef.close();
    }
  }



  onCancel() {
    this.dialogRef.close();
  }
}
