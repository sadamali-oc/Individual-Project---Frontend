import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';

interface Event {
  event_id: string;
  event_name: string;
  event_date: string;
  location: string;
  status: 'active' | 'pending' | 'inactive';
}

interface User {
  user_id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  role?: string;
  gender?: string;
}

interface Organizer {
  user_id: number;
  name: string;
  email: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  role?: string;
  gender?: string;
}

@Component({
  selector: 'app-report',
  standalone: true,
  imports: [CommonModule, HttpClientModule, CanvasJSAngularChartsModule],
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
})
export class ReportComponent implements OnInit {
  events: Event[] = [];
  users: User[] = [];
  organizers: Organizer[] = [];

  eventStatusCounts: { [key: string]: number } = {};
  eventLocationCounts: { [key: string]: number } = {};
  eventMonthCounts: { [key: string]: number } = {};

  userStatusCounts: { [key: string]: number } = {};
  organizerStatusCounts: { [key: string]: number } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadUsers();
    this.loadOrganizers();
  }

  // -------------------- EVENTS --------------------
  loadEvents() {
    this.http.get<Event[]>('http://localhost:3000/organizer-events').subscribe({
      next: (data) => {
        this.events = data;
        this.calculateEventCounts();
      },
      error: (err) => console.error('Failed to load events', err),
    });
  }

  calculateEventCounts() {
    // Status counts
    this.eventStatusCounts = { active: 0, pending: 0, inactive: 0 };
    this.eventLocationCounts = {};
    this.eventMonthCounts = {};

    this.events.forEach((e) => {
      // status
      this.eventStatusCounts[e.status] =
        (this.eventStatusCounts[e.status] || 0) + 1;

      // location
      this.eventLocationCounts[e.location] =
        (this.eventLocationCounts[e.location] || 0) + 1;

      // month
      const month = new Date(e.event_date).toLocaleString('default', {
        month: 'short',
      });
      this.eventMonthCounts[month] = (this.eventMonthCounts[month] || 0) + 1;
    });
  }

  getEventsByStatus() {
    return this.eventStatusCounts;
  }

  getEventsByLocation() {
    return this.eventLocationCounts;
  }

  getEventsByMonth() {
    return this.eventMonthCounts;
  }

  // -------------------- USERS --------------------
  loadUsers() {
    this.http.get<User[]>('http://localhost:3000/all/users').subscribe({
      next: (data) => {
        this.users = data;
        this.calculateUserCounts();
      },
      error: (err) => console.error('Failed to load users', err),
    });
  }

  calculateUserCounts() {
    this.userStatusCounts = {};
    this.users.forEach((u) => {
      this.userStatusCounts[u.status] =
        (this.userStatusCounts[u.status] || 0) + 1;
    });
  }

  getUserCounts() {
    return this.userStatusCounts;
  }

  // -------------------- ORGANIZERS --------------------
  loadOrganizers() {
    this.http
      .get<Organizer[]>('http://localhost:3000/all/organizers')
      .subscribe({
        next: (data) => {
          this.organizers = data;
          this.calculateOrganizerCounts();
        },
        error: (err) => console.error('Failed to load organizers', err),
      });
  }

  calculateOrganizerCounts() {
    this.organizerStatusCounts = {};
    this.organizers.forEach((o) => {
      this.organizerStatusCounts[o.status] =
        (this.organizerStatusCounts[o.status] || 0) + 1;
    });
  }

  getOrganizerCounts() {
    return this.organizerStatusCounts;
  }

  // -------------------- CHART DATA --------------------
  getEventStatusChartData() {
    return Object.entries(this.eventStatusCounts).map(([status, count]) => ({
      label: status,
      y: count,
    }));
  }

  getEventLocationChartData() {
    return Object.entries(this.eventLocationCounts).map(([loc, count]) => ({
      label: loc,
      y: count,
    }));
  }

  getEventMonthChartData() {
    return Object.entries(this.eventMonthCounts).map(([month, count]) => ({
      label: month,
      y: count,
    }));
  }

  getUserStatusChartData() {
    return Object.entries(this.userStatusCounts).map(([status, count]) => ({
      label: status,
      y: count,
    }));
  }

  getOrganizerStatusChartData() {
    return Object.entries(this.organizerStatusCounts).map(
      ([status, count]) => ({ label: status, y: count })
    );
  }
}
