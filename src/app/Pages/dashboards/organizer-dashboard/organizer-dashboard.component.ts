import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { UserService } from './user.service';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { FormsModule } from '@angular/forms';

interface Event {
  name: string;
  date: string;
  location: string;
  event_status: 'upcoming' | 'completed';
  status: 'pending' | 'accepted' | 'rejected';
}

@Component({
  selector: 'app-organizer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatChipsModule,
    MatDividerModule,
    CanvasJSAngularChartsModule,
    FormsModule,
  ],
  templateUrl: './organizer-dashboard.component.html',
  styleUrls: ['./organizer-dashboard.component.css'],
})
export class OrganizerDashboardComponent implements OnInit, AfterViewInit {
  userId: string | null = null;
  name: string = 'Guest';
  userName: string = 'Guest';
  events: Event[] = [];
  participantsCount: number = 0;
  isSidebarOpen: boolean = true;

  // Bar chart options
  chartOptions = {
    animationEnabled: true,
    responsive: true,
    maintainAspectRatio: false,
    data: [
      {
        type: 'column',
        dataPoints: [
          { label: 'All', y: 0 },
          { label: 'Pending', y: 0 },
          { label: 'Accepted', y: 0 },
          { label: 'Rejected', y: 0 },
          { label: 'Upcoming', y: 0 },
          { label: 'Completed', y: 0 },
        ],
      },
    ],
  };

  // Pie chart options
  pieChartOptions = {
    animationEnabled: true,
    responsive: true,
    maintainAspectRatio: false,
    data: [
      {
        type: 'pie',
        showInLegend: true,
        legendText: '{label}',
        indexLabel: '{label}: {y}',
        dataPoints: [
          { label: 'Upcoming', y: 0 },
          { label: 'Completed', y: 0 },
        ],
      },
    ],
  };

  // Chat
  chatMessages: string[] = [];
  newMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  // Event counts
  get allEventsCount(): number {
    return this.events.length;
  }

  get pendingEventsCount(): number {
    return this.events.filter((e) => e.status === 'pending').length;
  }

  get acceptedEventsCount(): number {
    return this.events.filter((e) => e.status === 'accepted').length;
  }

  get rejectedEventsCount(): number {
    return this.events.filter((e) => e.status === 'rejected').length;
  }

  get upcomingEventsCount(): number {
    return this.events.filter((e) => e.event_status === 'upcoming').length;
  }

  get completedEventsCount(): number {
    return this.events.filter((e) => e.event_status === 'completed').length;
  }

  ngOnInit(): void {
    this.userId =
      this.route.snapshot.paramMap.get('userId') ||
      this.route.parent?.snapshot.paramMap.get('userId') ||
      null;

    if (!this.userId) return;

    // Fetch user profile
    this.userService.getUserProfile(this.userId).subscribe({
      next: (userData) => {
        this.name = userData.name || 'Guest';
        this.userName = this.name;
        this.participantsCount = userData.participantsCount || 0;
      },
      error: (err) => console.error('Error fetching user data:', err),
    });

    // Fetch events
    this.userService.getEvent(this.userId).subscribe({
      next: (eventsData) => {
        this.events = eventsData;

        // Update bar chart dynamically
        this.chartOptions.data[0].dataPoints = [
          { label: 'All', y: this.allEventsCount },
          { label: 'Pending', y: this.pendingEventsCount },
          { label: 'Accepted', y: this.acceptedEventsCount },
          { label: 'Rejected', y: this.rejectedEventsCount },
          { label: 'Upcoming', y: this.upcomingEventsCount },
          { label: 'Completed', y: this.completedEventsCount },
        ];

        // Update pie chart dynamically
        this.pieChartOptions.data[0].dataPoints = [
          { label: 'Upcoming', y: this.upcomingEventsCount },
          { label: 'Completed', y: this.completedEventsCount },
        ];
      },
      error: (err) => console.error('Error fetching events:', err),
    });
  }

  ngAfterViewInit() {
    // Force resize so CanvasJS fits cards correctly
    setTimeout(() => window.dispatchEvent(new Event('resize')), 300);
  }

  @HostListener('window:resize')
  onResize() {
    // CanvasJS automatically adjusts when resize event is fired
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  viewProfile() {
    console.log('View profile clicked');
  }

  handleLogout() {
    console.log('Logout clicked');
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.chatMessages.push(this.newMessage.trim());
      this.newMessage = '';
      setTimeout(() => {
        const container = document.querySelector('.chat-messages');
        if (container) container.scrollTop = container.scrollHeight;
      });
    }
  }
}
