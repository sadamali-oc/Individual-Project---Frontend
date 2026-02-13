import { Component, OnInit } from '@angular/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { CommonModule } from '@angular/common';
import { NormalUserService } from '../../pages/dashboards/normal-user-dashboard/normaluser.service';

dayjs.extend(utc);

interface Event {
  isParticipating: boolean;
  description: string;
  event_name: string;
  event_date: string;
  location?: string;
  status: string;
  event_category: string;
  flyer_image?: string;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  dayjs = dayjs;

  // Days in the month
  daysInMonth: { date: string; events: Event[] }[] = [];

  // Current month
  currentMonth: dayjs.Dayjs = dayjs();

  // Today
  today: string = dayjs().format('YYYY-MM-DD');

  // Weekday headers
  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Hovered day for popup
  hoverDay: { date: string; events: Event[] } | null = null;

  constructor(private userService: NormalUserService) {}

  ngOnInit(): void {
    this.generateDays();
    this.loadEvents();
  }

  // Generate the days for the current month and align weekdays
  generateDays() {
    const year = this.currentMonth.year();
    const month = this.currentMonth.month();
    const numDays = this.currentMonth.daysInMonth();

    this.daysInMonth = [];

    // Add empty cells to align the first day of the month
    const firstDayWeekday = dayjs(new Date(year, month, 1)).day(); // 0 = Sunday
    for (let i = 0; i < firstDayWeekday; i++) {
      this.daysInMonth.push({ date: '', events: [] });
    }

    // Add all days of the month
    for (let d = 1; d <= numDays; d++) {
      this.daysInMonth.push({
        date: dayjs(new Date(year, month, d)).format('YYYY-MM-DD'),
        events: [],
      });
    }
  }

  // Load events for the current month from the API
  loadEvents() {
    this.userService.getCurrentMonthEvents().subscribe({
      next: (events: Event[]) => {
        events.forEach((ev: Event) => {
          const eventDate = dayjs(ev.event_date).local().format('YYYY-MM-DD');
          const day = this.daysInMonth.find((d) => d.date === eventDate);
          if (day) day.events.push(ev);
        });
      },
      error: (err) => {
        console.error('Error fetching events:', err);
      },
    });
  }

  // Click handler for event pills
  viewEvent(event: Event) {
    console.log('Clicked event:', event);
    // You can implement a modal or navigate to event details page here
  }
}
