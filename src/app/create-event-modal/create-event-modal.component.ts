import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
    private eventService: EventService
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    });
  }

  onAddEvent() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      // Combine date and time fields into proper Date objects
      const start = new Date(formValue.date);
      const end = new Date(formValue.date);
      const [startHours, startMinutes] = formValue.startTime.split(':').map(Number);
      const [endHours, endMinutes] = formValue.endTime.split(':').map(Number);

      start.setHours(startHours, startMinutes, 0, 0);
      end.setHours(endHours, endMinutes, 0, 0);

      const newEvent = {
        title: formValue.title,
        start,
        end,
      };

      this.eventService.addEvent(newEvent);
      this.dialogRef.close();
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
