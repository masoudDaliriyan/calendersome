import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'masoud-daliriyan-angular-test';
  selectedDate: Date = new Date(); // Default to today's date
  monthDays: (Date | null)[] = []; // Allow null values in the array


  ngOnInit(): void {
    this.generateMonthDays(this.selectedDate);
  }

  generateMonthDays(date: Date): void {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1); // First day of the month
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month

    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // Day of the week (0-6, where 0 is Sunday)

    const totalDays = 28; // 4 weeks of 7 days
    this.monthDays = [];

    // Add trailing days from the previous month
    const prevMonthDays = startDayOfWeek;
    const prevMonthLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
    for (let i = prevMonthDays; i > 0; i--) {
      this.monthDays.push(new Date(date.getFullYear(), date.getMonth() - 1, prevMonthLastDay - i + 1));
    }

    // Add current month's days
    const daysToAddFromCurrentMonth = Math.min(daysInMonth, totalDays - this.monthDays.length);
    for (let i = 1; i <= daysToAddFromCurrentMonth; i++) {
      this.monthDays.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    // Add leading days from the next month
    const nextMonthDays = totalDays - this.monthDays.length;
    for (let i = 1; i <= nextMonthDays; i++) {
      this.monthDays.push(new Date(date.getFullYear(), date.getMonth() + 1, i));
    }
  }



  onDateChange(event: any): void {
    this.selectedDate = new Date(event.value);
    this.generateMonthDays(this.selectedDate);
  }

  isToday(day: Date | null): boolean {
    if (!day) return false;
    const today = new Date();
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    );
  }
}
