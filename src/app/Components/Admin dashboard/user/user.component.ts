import {
  Component,
  ViewChild,
  OnInit,
  AfterViewInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { interval, Subscription } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';

import { UserDetailsDialogComponent } from '../../user-details-dialog/user-details-dialog.component';
import {
  NotificationService,
  Notification,
} from '../../../services/notification/notification.service';

export type UserStatus = 'Pending' | 'Accepted' | 'Rejected';

export interface PeriodicElement {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  phone_number?: string;
  gender?: string;
  role?: string;
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDialogModule,
    MatMenuModule,
    MatBadgeModule,
    MatToolbarModule,
    MatSidenavModule,
  ],
})
export class UserComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'email', 'status', 'actions'];
  dataSource = new MatTableDataSource<PeriodicElement>([]);
  isLoading = true;

  statusOptions: UserStatus[] = ['Pending', 'Accepted', 'Rejected'];
  statusFilter: string = '';

  // Notifications
  notifications: Notification[] = [];
  private notificationPolling?: Subscription;

  userId: string = '';
  userName: string = 'User';
  isSidebarOpen: boolean = true;

  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private notificationService: NotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const storedUserId = localStorage.getItem('user_id');
      if (storedUserId) {
        this.userId = storedUserId;
        this.fetchUserName(this.userId);
        this.loadUsers();
        this.loadNotifications(this.userId);

        // Poll notifications every 10 seconds
        this.notificationPolling = interval(10000).subscribe(() => {
          this.loadNotifications(this.userId);
        });
      }
    }

    // Table filter
    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string
    ) => {
      const filterLower = filter.trim().toLowerCase();
      return (
        data.id.toString().includes(filterLower) ||
        data.name.toLowerCase().includes(filterLower) ||
        data.email.toLowerCase().includes(filterLower)
      );
    };
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.notificationPolling?.unsubscribe();
  }

  // --- Users ---
  loadUsers(): void {
    this.isLoading = true;
    this.http.get<any[]>('http://localhost:3000/all/users').subscribe({
      next: (users) => {
        const mappedUsers: PeriodicElement[] = users.map((user) => {
          let status: UserStatus = 'Pending';
          switch (user.status?.toLowerCase()) {
            case 'active':
              status = 'Accepted';
              break;
            case 'inactive':
              status = 'Rejected';
              break;
            case 'pending':
              status = 'Pending';
              break;
          }
          return {
            id: user.user_id,
            name: user.name,
            email: user.email,
            status,
            phone_number: user.phone_number,
            gender: user.gender,
            role: user.role,
          };
        });
        this.dataSource.data = mappedUsers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading users:', err);
        this.isLoading = false;
      },
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  applyStatusFilter(status: string): void {
    this.statusFilter = status;
    this.dataSource.filter =
      (document.querySelector('.search-input input') as HTMLInputElement)?.value
        .trim()
        .toLowerCase() || '';
    if (this.dataSource.paginator) this.dataSource.paginator.firstPage();
  }

  changeStatus(user: PeriodicElement, newStatus: UserStatus): void {
    let backendStatus = '';
    switch (newStatus) {
      case 'Accepted':
        backendStatus = 'active';
        break;
      case 'Rejected':
        backendStatus = 'inactive';
        break;
      case 'Pending':
        backendStatus = 'pending';
        break;
    }

    this.http
      .patch(`http://localhost:3000/user/status/${user.id}`, {
        status: backendStatus,
      })
      .subscribe({
        next: () => {
          user.status = newStatus;

          // Reload notifications if status affects logged-in user
          if (user.id === +this.userId) this.loadNotifications(this.userId);
        },
        error: (err) => console.error('Error updating status:', err),
      });
  }

  viewUser(user: PeriodicElement): void {
    const dialogRef = this.dialog.open(UserDetailsDialogComponent, {
      width: '700px',
      data: { ...user },
    });

    dialogRef.afterClosed().subscribe((updatedUser: PeriodicElement) => {
      if (updatedUser) {
        const index = this.dataSource.data.findIndex(
          (u) => u.id === updatedUser.id
        );
        if (index !== -1) {
          this.dataSource.data[index] = updatedUser;
          this.dataSource._updateChangeSubscription();
        }
      }
    });
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

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
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

  handleLogout(): void {
    localStorage.removeItem('user_id');
    localStorage.removeItem(`user_${this.userId}`);
    window.location.href = '/auth/login';
  }

  viewProfile(): void {
    window.location.href = `/user/profile/${this.userId}`;
  }
}
