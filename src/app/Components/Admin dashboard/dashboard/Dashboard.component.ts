import { Component, OnInit, inject, ViewChild } from '@angular/core';
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
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule, DatePipe } from '@angular/common';

import { EventService, Event } from '../../../services/event/event.service';

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
    MatToolbarModule,
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
  displayedUpcomingEventColumns: string[] = [
    'name',
    'date',
    'time',
    'location',
    'registrations',
    'actions',
  ];

  // Filters
  eventNameFilter: string = '';
  dateRangeStart: Date | null = null;
  dateRangeEnd: Date | null = null;

  private router = inject(Router);
  private eventService = inject(EventService);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.loadDashboardData();
    this.upcomingEventsDataSource.filterPredicate =
      this.createUpcomingEventsFilterPredicate();
  }

  // --- Load Dashboard Data from API ---
  private loadDashboardData(): void {
    const now = new Date();

    this.eventService.getAllEvents().subscribe({
      next: (events: Event[]) => {
        // Convert string to Date object
        events.forEach((event) => (event.date = new Date(event.date)));

        this.allUpcomingEvents = events
          .filter((event) => event.date >= now)
          .sort((a, b) => a.date.getTime() - b.date.getTime());

        this.upcomingEventsDataSource.data = this.allUpcomingEvents;

        this.totalEvents = events.length;
        this.upcomingEventsCount = this.allUpcomingEvents.length;
        this.totalRegistrations = events.reduce(
          (sum, e) => sum + e.registrations,
          0
        );
        this.totalOrganizers = 25;
        this.totalVolunteers = 90;
        this.totalTicketsIssued = 720;
      },
      error: (error) => {
        console.error('Failed to fetch events:', error);
        // Optionally show an error message to the user
      },
    });
  }

  // --- Table Filters ---
  applyEventNameFilter(event: KeyboardEvent): void {
    this.eventNameFilter = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.applyAllUpcomingEventsFilters();
  }

  applyDateRangeFilter(event: any, type: 'start' | 'end'): void {
    if (type === 'start') {
      this.dateRangeStart = event.value
        ? new Date(event.value.setHours(0, 0, 0, 0))
        : null;
    } else {
      this.dateRangeEnd = event.value
        ? new Date(event.value.setHours(23, 59, 59, 999))
        : null;
    }
    this.applyAllUpcomingEventsFilters();
  }

  applyAllUpcomingEventsFilters(): void {
    const filterValues = {
      name: this.eventNameFilter,
      startDate: this.dateRangeStart,
      endDate: this.dateRangeEnd,
    };
    this.upcomingEventsDataSource.filter = JSON.stringify(filterValues);
  }

  private createUpcomingEventsFilterPredicate() {
    return (data: Event, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);

      const nameMatch = searchTerms.name
        ? data.name.toLowerCase().includes(searchTerms.name)
        : true;

      const eventDate = new Date(data.date);
      const startDateMatch = searchTerms.startDate
        ? eventDate >= searchTerms.startDate
        : true;
      const endDateMatch = searchTerms.endDate
        ? eventDate <= searchTerms.endDate
        : true;

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
