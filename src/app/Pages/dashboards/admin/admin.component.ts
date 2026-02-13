import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { interval, Subscription } from 'rxjs';
import {
  NotificationService,
  Notification,
} from '../../../services/notification/notification.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatBadgeModule
  ]
})
export class AdminComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSidebarOpen: boolean = true;
  userId: string | null = null;
  notifications: Notification[] = [];
  private notificationPolling?: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private cdr: ChangeDetectorRef,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId');
    console.log('User ID:', this.userId);

    if (isPlatformBrowser(this.platformId) && this.userId) {
      this.loadNotifications(this.userId);

      // Poll notifications every 10 seconds
      this.notificationPolling = interval(10000).subscribe(() => {
        this.loadNotifications(this.userId!);
      });
    }

    this.cdr.detectChanges(); // 🔁 Fixes ExpressionChangedAfterItHasBeenCheckedError
  }

  ngAfterViewInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      if (result.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.sidenav.toggle();
  }

  viewProfile(): void {
    console.log('Navigating to user profile with ID:', this.userId);
    this.router.navigate(['/user/profile/:userid']);
  }

  viewSettings(): void {
    console.log('Navigating to user settings with ID:', this.userId);
    this.router.navigate(['settings']);
  }

  handleLogout(): void {
    this.router.navigate(['/auth/login']);
  }

  viewEventDetails(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  ngOnDestroy(): void {
    this.notificationPolling?.unsubscribe();
  }

  // --- Notifications ---
  loadNotifications(userId: string): void {
    this.notificationService.getNotifications(+userId).subscribe({
      next: (res: Notification[]) => (this.notifications = res),
      error: (err) => console.error('Failed to load notifications', err),
    });
  }

  markAsRead(notification: Notification): void {
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
