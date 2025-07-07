import {
  Component,
  OnInit,
  inject,
  ViewChild
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- Add this import

import { CommonModule, DatePipe } from '@angular/common';

interface Event { // This is your data interface
  id: string;
  name: string;
  date: Date;
  time: string;
  location: string;
  registrations: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatTableModule,
    CommonModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatToolbarModule
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  // Summary Card Data
  totalEvents: number = 0;
  upcomingEventsCount: number = 0;
  totalRegistrations: number = 0;
  totalOrganizers: number = 0;
  totalVolunteers: number = 0;
  totalTicketsIssued: number = 0;

  // Upcoming Events Table Data
  private allUpcomingEvents: Event[] = [];
  upcomingEventsDataSource = new MatTableDataSource<Event>([]);
  displayedUpcomingEventColumns: string[] = ['name', 'date', 'time', 'location', 'registrations', 'actions'];

  // Filters for Upcoming Events
  eventNameFilter: string = '';
  dateRangeStart: Date | null = null;
  dateRangeEnd: Date | null = null;

  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  ngOnInit(): void {
    this.loadDashboardData();
    this.upcomingEventsDataSource.filterPredicate = this.createUpcomingEventsFilterPredicate();
  }

  // --- Dashboard Data Loading ---
  private loadDashboardData(): void {
    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Annual Tech Conference',
        date: new Date('2025-07-15T10:00:00'),
        time: '10:00 AM',
        location: 'Convention Center',
        registrations: 50,
      },
      {
        id: '2',
        name: 'Web Development Workshop',
        date: new Date('2025-07-30T14:00:00'),
        time: '2:00 PM',
        location: 'Online',
        registrations: 20,
      },
      {
        id: '3',
        name: 'Cybersecurity Summit',
        date: new Date('2025-08-05T09:00:00'),
        time: '09:00 AM',
        location: 'City Auditorium',
        registrations: 120,
      },
      {
        id: '4',
        name: 'AI & ML Masterclass',
        date: new Date('2025-08-22T13:00:00'),
        time: '01:00 PM',
        location: 'University Hall',
        registrations: 85,
      },
      {
        id: '5',
        name: 'Networking Mixer',
        date: new Date('2025-09-10T18:00:00'),
        time: '06:00 PM',
        location: 'Grand Hotel Lounge',
        registrations: 45,
      },
      {
        id: '6',
        name: 'Blockchain Expo 2025',
        date: new Date('2025-09-25T09:30:00'),
        time: '09:30 AM',
        location: 'Exhibition Grounds',
        registrations: 200,
      },
    ];

    const now = new Date();
    this.allUpcomingEvents = mockEvents
      .filter((event) => event.date >= now)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    this.upcomingEventsDataSource.data = this.allUpcomingEvents;

    this.totalEvents = mockEvents.length;
    this.upcomingEventsCount = this.allUpcomingEvents.length;
    this.totalRegistrations = mockEvents.reduce((sum, event) => sum + event.registrations, 0);
    this.totalOrganizers = 25;
    this.totalVolunteers = 90;
    this.totalTicketsIssued = 720;
  }

  // --- Upcoming Events Table Filtering ---

  // Corrected: Type 'KeyboardEvent' for the DOM event
  applyEventNameFilter(event: KeyboardEvent): void {
    this.eventNameFilter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyAllUpcomingEventsFilters();
  }

  applyDateRangeFilter(event: any, type: 'start' | 'end'): void {
    if (type === 'start') {
      this.dateRangeStart = event.value ? new Date(event.value.setHours(0, 0, 0, 0)) : null;
    } else {
      this.dateRangeEnd = event.value ? new Date(event.value.setHours(23, 59, 59, 999)) : null;
    }
    this.applyAllUpcomingEventsFilters();
  }

  applyAllUpcomingEventsFilters(): void {
    const filterValues = {
      name: this.eventNameFilter,
      startDate: this.dateRangeStart,
      endDate: this.dateRangeEnd
    };
    this.upcomingEventsDataSource.filter = JSON.stringify(filterValues);
  }

  private createUpcomingEventsFilterPredicate() {
    return (data: Event, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      const nameMatch = searchTerms.name ? data.name.toLowerCase().includes(searchTerms.name) : true;

      const eventDate = new Date(data.date);
      const startDateMatch = searchTerms.startDate ? eventDate >= searchTerms.startDate : true;
      const endDateMatch = searchTerms.endDate ? eventDate <= searchTerms.endDate : true;

      return nameMatch && startDateMatch && endDateMatch;
    };
  }

  // --- Navigation & Actions ---
  viewProfile(): void {
    this.router.navigate(['/profile']);
  }

  handleLogout(): void {
    this.router.navigate(['/login']);
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  viewAllUpcomingEvents(): void {
    this.router.navigate(['/events/upcoming']);
  }
}