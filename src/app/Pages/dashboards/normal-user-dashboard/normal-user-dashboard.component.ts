import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { interval, Subscription } from 'rxjs';
import {
  NotificationService,
  Notification,
} from '../../../services/notification/notification.service';

@Component({
  selector: 'app-normal-user-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule,
    MatCardModule,
  ],
  templateUrl: './normal-user-dashboard.component.html',
  styleUrls: ['./normal-user-dashboard.component.css'],
})
export class NormalUserDashboardComponent implements OnInit, OnDestroy {
  isSidebarOpen: boolean = true;
  userId: string = '';
  userName: string = 'User';

  notifications: Notification[] = [];
  private notificationPolling?: Subscription;

  constructor(
    private router: Router,
    private http: HttpClient,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        this.userId = storedUserId;
        this.fetchUserName(this.userId);
        this.loadNotifications(this.userId);

        // Poll notifications every 10 seconds
        this.notificationPolling = interval(10000).subscribe(() => {
          this.loadNotifications(this.userId);
        });
      } else {
        this.router.navigate(['/auth/login']);
      }
    }
  }

  viewSettings(): void {
    console.log('Navigating to user settings with ID:', this.userId);
    this.router.navigate(['settings']);
  }

  openEventCalendar() {
    // For example, navigate programmatically
    this.router.navigate([`eventCalendar`]);

    // Or open a dialog/calendar component
    // this.dialog.open(EventCalendarComponent, { width: '800px', data: { userId: this.userId } });
  }

  ngOnDestroy(): void {
    this.notificationPolling?.unsubscribe();
  }

  fetchUserName(userId: string): void {
    this.http
      .get<any>(`http://localhost:3000/user/profile/${userId}`)
      .subscribe({
        next: (res) => {
          this.userName = res?.name ?? 'User';
          localStorage.setItem(`user_${userId}`, JSON.stringify(res));
        },
        error: () => (this.userName = 'User'),
      });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  viewProfile(): void {
    if (this.userId) {
      this.router.navigate(['/user/profile', this.userId]);
    }
  }

  navigateToDashboard(): void {
    if (this.userId) {
      this.router.navigate(['/user', this.userId, 'dashboard']);
    }
  }

  navigateToEnrolledEvents(): void {
    if (this.userId) {
      this.router.navigate(['/user', this.userId, 'enrolledEvents']);
    }
  }

  handleLogout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('user_id');
      localStorage.removeItem(`user_${this.userId}`);
    }
    this.router.navigate(['/auth/login']);
  }

  // --- Notifications ---
  loadNotifications(userId: string) {
    this.notificationService.getNotifications(+userId).subscribe({
      next: (res: Notification[]) => (this.notifications = res),
      error: (err: any) => console.error('Failed to load notifications', err),
    });
  }

  markAsRead(notification: Notification) {
    this.notificationService
      .markAsRead(notification.notification_id)
      .subscribe({
        next: () => (notification.is_read = true),
        error: (err) =>
          console.error('Failed to mark notification as read', err),
      });
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.is_read).length;
  }
}
