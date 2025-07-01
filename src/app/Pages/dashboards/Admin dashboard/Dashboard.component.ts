import {
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';

interface Event {
  id: string;
  name: string;
  date: Date;
  time: string;
  location: string;
  registrations: number;
}

interface Registration {
  id: string;
  eventName: string;
  registrantName: string;
  email: string;
  date: Date;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface Activity {
  description: string;
  by: string;
  date: Date;
  status: 'Completed' | 'Pending';
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    RouterModule
  ],
  providers: [DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  totalEvents: number = 0;
  upcomingEventsCount: number = 0;
  totalRegistrations: number = 0;
  totalOrganizers: number = 0;
  totalVolunteers: number = 0;
  totalTicketsIssued: number = 0;
  upcomingEvents: Event[] = [];
  recentActivities: Activity[] = [];

  private router = inject(Router);

  ngOnInit(): void {
    this.loadDashboardData();
  }

  viewProfile(): void {
    this.router.navigate(['/profile']);
  }

  handleLogout(): void {
    this.router.navigate(['/login']);
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  logRoute(routeName: string): void {
    console.log(`Navigated to: ${routeName}`);
  }

  private loadDashboardData(): void {
    const mockEvents: Event[] = [
      {
        id: '1',
        name: 'Tech Conference',
        date: new Date('2025-07-15'),
        time: '10:00 AM',
        location: 'Convention Center',
        registrations: 50,
      },
      {
        id: '2',
        name: 'Workshop',
        date: new Date('2025-06-30'),
        time: '2:00 PM',
        location: 'Online',
        registrations: 20,
      },
    ];

    this.totalEvents = mockEvents.length;
    this.upcomingEventsCount = mockEvents.filter(
      (event) => event.date >= new Date()
    ).length;
    this.totalRegistrations = 70;  // example static number
    this.totalOrganizers = 25;
    this.totalVolunteers = 90;
    this.totalTicketsIssued = 720;
    this.upcomingEvents = mockEvents
      .filter((event) => event.date >= new Date())
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    this.recentActivities = [
      {
        description: 'Event "Freshers Night" approved',
        by: 'Prof. Jayasinghe',
        date: new Date('2025-06-29T10:00:00'),
        status: 'Completed',
      },
      {
        description: 'New Event "Hackathon 2025" created',
        by: 'IT Society',
        date: new Date('2025-06-28T15:20:00'),
        status: 'Completed',
      },
      {
        description: '"Art Festival" attendee list updated',
        by: 'Admin',
        date: new Date('2025-06-28T12:45:00'),
        status: 'Completed',
      },
      {
        description: 'Venue for "Career Fair" changed',
        by: 'Career Center',
        date: new Date('2025-06-27T17:00:00'),
        status: 'Pending',
      },
      {
        description: 'Feedback added for "Leadership Workshop"',
        by: 'Student Council',
        date: new Date('2025-06-27T09:30:00'),
        status: 'Completed',
      },
    ];
  }
}
