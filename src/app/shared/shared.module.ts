import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGridListModule } from '@angular/material/grid-list'; // Add MatGridListModule
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop'; // Add MatInputModule

@NgModule({
  declarations: [],
  imports: [
    CommonModule, // Add CommonModule here
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,  // Include MatGridListModule
    MatInputModule,
    DragDropModule// Include MatInputModule
  ],
  exports: [
    CommonModule, // Export CommonModule
    MatCardModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatGridListModule,  // Export MatGridListModule
    MatInputModule,
    DragDropModule// Export MatInputModule
  ]
})
export class SharedModule { }
